// Berjak FRE API - Trade Lead Processing (FR-2)
// GET /api/v1/trade-leads - List trade leads (paginated, filterable)
// POST /api/v1/trade-leads - Create new trade lead

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await listTradeLeads(req, res);
      case 'POST':
        return await createTradeLead(req, res);
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

// GET /api/v1/trade-leads
async function listTradeLeads(req, res) {
  const {
    page = 1,
    limit = 20,
    status,
    assignedTo,
    priority,
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

  if (assignedTo) {
    where.assignedTo = assignedTo;
  }

  if (priority) {
    where.priority = priority;
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(dateTo);
  }

  if (search) {
    where.OR = [
      { tradeLeadNumber: { contains: search, mode: 'insensitive' } },
      { buyer: { tradingName: { contains: search, mode: 'insensitive' } } },
      { seller: { tradingName: { contains: search, mode: 'insensitive' } } },
      { product: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Execute query
  const [tradeLeads, total] = await Promise.all([
    prisma.tradeLead.findMany({
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
        agent: {
          select: {
            id: true,
            tradingName: true,
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
        product: {
          select: {
            id: true,
            productCode: true,
            name: true,
            category: true,
          },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            contracts: true,
            notes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.tradeLead.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    data: tradeLeads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / take),
    },
  });
}

// POST /api/v1/trade-leads
async function createTradeLead(req, res) {
  const {
    buyerId,
    sellerId,
    agentId,
    productId,
    quantity,
    unit = 'MT',
    unitPrice,
    currency = 'USD',
    paymentTerms,
    shipmentDate,
    deliveryCountry,
    shippingTerms,
    priority = 'MEDIUM',
    assignedTo,
    note,
  } = req.body;

  // Validation
  if (!productId || !quantity) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'productId and quantity are required',
    });
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  // Verify customers exist
  if (buyerId) {
    const buyer = await prisma.customer.findUnique({ where: { id: buyerId } });
    if (!buyer) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Buyer not found',
      });
    }
  }

  if (sellerId) {
    const seller = await prisma.customer.findUnique({ where: { id: sellerId } });
    if (!seller) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Seller not found',
      });
    }
  }

  // Generate trade lead number
  const year = new Date().getFullYear();
  const lastTradeLead = await prisma.tradeLead.findFirst({
    where: {
      tradeLeadNumber: {
        startsWith: `TL-${year}-`,
      },
    },
    orderBy: { tradeLeadNumber: 'desc' },
  });

  let sequenceNumber = 1;
  if (lastTradeLead) {
    const lastNumber = parseInt(lastTradeLead.tradeLeadNumber.split('-')[2]);
    sequenceNumber = lastNumber + 1;
  }

  const tradeLeadNumber = `TL-${year}-${sequenceNumber.toString().padStart(4, '0')}`;

  // Create trade lead
  const tradeLead = await prisma.tradeLead.create({
    data: {
      tradeLeadNumber,
      buyerId,
      sellerId,
      agentId,
      productId,
      quantity: parseFloat(quantity),
      unit,
      unitPrice: unitPrice ? parseFloat(unitPrice) : null,
      currency,
      paymentTerms,
      shipmentDate: shipmentDate ? new Date(shipmentDate) : null,
      deliveryCountry,
      shippingTerms,
      status: 'NEW',
      priority,
      assignedTo,
      createdBy: req.user?.id || null,
      notes: note
        ? {
            create: {
              note,
              createdBy: req.user?.id || 'system',
            },
          }
        : undefined,
    },
    include: {
      buyer: true,
      seller: true,
      agent: {
        include: {
          commissions: true,
        },
      },
      product: true,
      notes: true,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'CREATE',
      entityType: 'TradeLead',
      entityId: tradeLead.id,
      newValues: tradeLead,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(201).json({
    success: true,
    data: tradeLead,
  });
}
