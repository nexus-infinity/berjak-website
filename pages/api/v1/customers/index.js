// Berjak FRE API - Customer Management (FR-1)
// GET /api/v1/customers - List customers (paginated, filterable)
// POST /api/v1/customers - Create new customer

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await listCustomers(req, res);
      case 'POST':
        return await createCustomer(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}

// GET /api/v1/customers
async function listCustomers(req, res) {
  const {
    page = 1,
    limit = 20,
    customerType,
    status = 'ACTIVE',
    search,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};
  
  if (customerType) {
    where.customerType = customerType;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where.OR = [
      { tradingName: { contains: search, mode: 'insensitive' } },
      { legalName: { contains: search, mode: 'insensitive' } },
      { abn: { contains: search } },
    ];
  }

  // Execute query
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take,
      include: {
        addresses: {
          where: { isPrimary: true },
        },
        contacts: {
          where: { isPrimary: true },
        },
        _count: {
          select: {
            buyerLeads: true,
            sellerLeads: true,
            buyerContracts: true,
            sellerContracts: true,
          },
        },
      },
      orderBy: { tradingName: 'asc' },
    }),
    prisma.customer.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    data: customers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / take),
    },
  });
}

// POST /api/v1/customers
async function createCustomer(req, res) {
  const {
    tradingName,
    legalName,
    abn,
    customerType,
    creditLimit,
    creditInsurer,
    addresses = [],
    contacts = [],
    bankDetails = [],
  } = req.body;

  // Validation
  if (!tradingName || !customerType) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'tradingName and customerType are required',
    });
  }

  // Check for duplicate ABN
  if (abn) {
    const existing = await prisma.customer.findUnique({
      where: { abn },
    });
    
    if (existing) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Customer with this ABN already exists',
      });
    }
  }

  // Create customer with related data
  const customer = await prisma.customer.create({
    data: {
      tradingName,
      legalName,
      abn,
      customerType,
      creditLimit: creditLimit ? parseFloat(creditLimit) : null,
      creditInsurer,
      status: 'ACTIVE',
      addresses: {
        create: addresses,
      },
      contacts: {
        create: contacts,
      },
      bankDetails: {
        create: bankDetails,
      },
    },
    include: {
      addresses: true,
      contacts: true,
      bankDetails: true,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'CREATE',
      entityType: 'Customer',
      entityId: customer.id,
      newValues: customer,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(201).json({
    success: true,
    data: customer,
  });
}
