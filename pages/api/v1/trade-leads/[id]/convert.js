// Berjak FRE API - Trade Lead to Contract Conversion
// POST /api/v1/trade-leads/:id/convert - Convert trade lead to contract

import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  const {
    depositValue,
    paymentTerms,
    deliveryDate,
    productDetails,
  } = req.body;

  try {
    // Get trade lead with all details
    const tradeLead = await prisma.tradeLead.findUnique({
      where: { id },
      include: {
        buyer: true,
        seller: true,
        agent: {
          include: {
            commissions: {
              where: {
                effectiveFrom: { lte: new Date() },
                OR: [
                  { effectiveTo: null },
                  { effectiveTo: { gte: new Date() } },
                ],
              },
            },
          },
        },
        product: true,
        contracts: true,
      },
    });

    if (!tradeLead) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trade lead not found',
      });
    }

    // Validation
    if (!tradeLead.buyerId || !tradeLead.sellerId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Trade lead must have both buyer and seller',
      });
    }

    if (!tradeLead.unitPrice) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Trade lead must have a unit price',
      });
    }

    if (tradeLead.contracts.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Trade lead has already been converted to contract',
      });
    }

    // Generate contract number
    const year = new Date().getFullYear();
    const lastContract = await prisma.contract.findFirst({
      where: {
        contractNumber: {
          startsWith: `CN-${year}-`,
        },
      },
      orderBy: { contractNumber: 'desc' },
    });

    let sequenceNumber = 1;
    if (lastContract) {
      const lastNumber = parseInt(lastContract.contractNumber.split('-')[2]);
      sequenceNumber = lastNumber + 1;
    }

    const contractNumber = `CN-${year}-${sequenceNumber.toString().padStart(4, '0')}`;

    // Calculate total value
    const totalValue = parseFloat(tradeLead.quantity) * parseFloat(tradeLead.unitPrice);

    // Prepare product details
    const contractProductDetails = productDetails || {
      productId: tradeLead.product.id,
      productCode: tradeLead.product.productCode,
      productName: tradeLead.product.name,
      category: tradeLead.product.category,
      specifications: tradeLead.product.specifications,
      isriCode: tradeLead.product.isriCode,
    };

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        tradeLeadId: tradeLead.id,
        buyerId: tradeLead.buyerId,
        sellerId: tradeLead.sellerId,
        productDetails: contractProductDetails,
        quantity: tradeLead.quantity,
        unit: tradeLead.unit,
        unitPrice: tradeLead.unitPrice,
        totalValue,
        currency: tradeLead.currency,
        depositValue: depositValue ? parseFloat(depositValue) : null,
        paymentTerms: paymentTerms || tradeLead.paymentTerms || 'To be agreed',
        deliveryDate: deliveryDate ? new Date(deliveryDate) : tradeLead.shipmentDate,
        status: 'DRAFT',
        createdBy: req.user?.id || null,
      },
      include: {
        buyer: true,
        seller: true,
        tradeLead: {
          include: {
            agent: {
              include: {
                commissions: true,
              },
            },
          },
        },
      },
    });

    // Update trade lead status to WON
    await prisma.tradeLead.update({
      where: { id },
      data: {
        status: 'WON',
        notes: {
          create: {
            note: `Converted to contract ${contractNumber}`,
            createdBy: req.user?.id || 'system',
          },
        },
      },
    });

    // Audit logs
    await prisma.auditLog.createMany({
      data: [
        {
          userId: req.user?.id || null,
          action: 'CREATE',
          entityType: 'Contract',
          entityId: contract.id,
          newValues: contract,
          ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        },
        {
          userId: req.user?.id || null,
          action: 'UPDATE',
          entityType: 'TradeLead',
          entityId: tradeLead.id,
          oldValues: { status: tradeLead.status },
          newValues: { status: 'WON', convertedToContractId: contract.id },
          ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      data: contract,
      message: `Trade lead ${tradeLead.tradeLeadNumber} successfully converted to contract ${contractNumber}`,
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
