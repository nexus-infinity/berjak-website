// Berjak FRE API - Product Management
// GET /api/v1/products - List products (paginated, filterable)
// POST /api/v1/products - Create new product

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await listProducts(req, res);
      case 'POST':
        return await createProduct(req, res);
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

// GET /api/v1/products
async function listProducts(req, res) {
  const {
    page = 1,
    limit = 50,
    category,
    search,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { productCode: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { isriCode: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Execute query
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        productCode: true,
        isriCode: true,
        name: true,
        description: true,
        category: true,
        specifications: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tradeLeads: true,
          },
        },
      },
      orderBy: { productCode: 'asc' },
    }),
    prisma.product.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / take),
    },
  });
}

// POST /api/v1/products
async function createProduct(req, res) {
  const {
    productCode,
    isriCode,
    name,
    description,
    category,
    specifications,
    images = [],
  } = req.body;

  // Validation
  if (!productCode || !name || !category) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'productCode, name, and category are required',
    });
  }

  // Valid categories
  const validCategories = [
    'SCRAP_METAL',
    'NON_FERROUS',
    'FERROUS',
    'PRECIOUS_METALS',
    'INDUSTRIAL_MINERALS',
  ];

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
    });
  }

  // Check if product code already exists
  const existing = await prisma.product.findUnique({
    where: { productCode },
  });

  if (existing) {
    return res.status(409).json({
      error: 'Conflict',
      message: `Product with code ${productCode} already exists`,
    });
  }

  // Create product
  const product = await prisma.product.create({
    data: {
      productCode,
      isriCode,
      name,
      description,
      category,
      specifications: specifications || {},
      images,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'CREATE',
      entityType: 'Product',
      entityId: product.id,
      newValues: product,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(201).json({
    success: true,
    data: product,
  });
}
