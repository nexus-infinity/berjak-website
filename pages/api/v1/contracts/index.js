// Berjak FRE API - Contract Management (FR-5)
// GET /api/v1/contracts - List contracts (paginated, filterable)
// POST /api/v1/contracts - Create new contract

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await listContracts(req, res);
      case 'POST':
        return await createContract(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}

// GET /api/v1/contracts
async function listContracts(req, res) {
  const {
    page = 1,
    limit = 20,
    status,
    buyerId,
    sellerId,
    dateFrom,
    dateTo,
    search,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};

  if (status) {
    where.status = status;
  }

  if (buyerId) {
    where.buyerId = buyerId;
  }

  if (sellerId) {
    where.sellerId = sellerId;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  if (search) {
    where.OR = [
      { contractNumber: { contains: search, mode: 'insensitive' } },
      { buyer: { tradingName: { contains: search, mode: 'insensitive' } } },
      { seller: { tradingName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Execute query
  const [contracts, total] = await Promise.all([
    prisma.contract.findMany({
      where,
      skip,
      take,
      include: {
        buyer: {
          select: {
            id: true,
            tradingName: true,
            customerType: true,
          },
        },
        seller: {
          select: {
            id: true,
            tradingName: true,
            customerType: true,
          },
        },
        tradeLead: {
          select: {
            id: true,
            tradeLeadNumber: true,
            agent: {
              select: {
                id: true,
                tradingName: true,
              },
            },
          },
        },
        _count: {
          select: {
            documents: true,
            invoices: true,
            movements: true,
            claims: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contract.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    data: contracts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / take),
    },
  });
}

// POST /api/v1/contracts
async function createContract(req, res) {
  const {
    tradeLeadId,
    buyerId,
    sellerId,
    productDetails,
    quantity,
    unit = 'MT',
    unitPrice,
    currency = 'USD',
    depositValue,
    paymentTerms,
    deliveryDate,
  } = req.body;

  // Validation
  if (!buyerId || !sellerId || !productDetails || !quantity || !unitPrice) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'buyerId, sellerId, productDetails, quantity, and unitPrice are required',
    });
  }

  // Verify customers exist
  const [buyer, seller] = await Promise.all([
    prisma.customer.findUnique({ where: { id: buyerId } }),
    prisma.customer.findUnique({ where: { id: sellerId } }),
  ]);

  if (!buyer) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Buyer not found',
    });
  }

  if (!seller) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Seller not found',
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
  const totalValue = parseFloat(quantity) * parseFloat(unitPrice);

  // Create contract
  const contract = await prisma.contract.create({
    data: {
      contractNumber,
      tradeLeadId,
      buyerId,
      sellerId,
      productDetails,
      quantity: parseFloat(quantity),
      unit,
      unitPrice: parseFloat(unitPrice),
      totalValue,
      currency,
      depositValue: depositValue ? parseFloat(depositValue) : null,
      paymentTerms: paymentTerms || 'To be agreed',
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
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

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'CREATE',
      entityType: 'Contract',
      entityId: contract.id,
      newValues: contract,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(201).json({
    success: true,
    data: contract,
  });
}
