// Berjak FRE API - Product Management
// GET /api/v1/products/:id - Get product by ID
// PATCH /api/v1/products/:id - Update product
// DELETE /api/v1/products/:id - Delete product

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    switch (method) {
      case 'GET':
        return await getProduct(req, res, id);
      case 'PATCH':
        return await updateProduct(req, res, id);
      case 'DELETE':
        return await deleteProduct(req, res, id);
      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
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

// GET /api/v1/products/:id
async function getProduct(req, res, id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      tradeLeads: {
        select: {
          id: true,
          tradeLeadNumber: true,
          status: true,
          quantity: true,
          unitPrice: true,
          currency: true,
          buyer: {
            select: {
              tradingName: true,
            },
          },
          seller: {
            select: {
              tradingName: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: {
        select: {
          tradeLeads: true,
        },
      },
    },
  });

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
}

// PATCH /api/v1/products/:id
async function updateProduct(req, res, id) {
  const {
    productCode,
    isriCode,
    name,
    description,
    category,
    specifications,
    images,
  } = req.body;

  // Check if product exists
  const existing = await prisma.product.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  // If updating product code, check it's not taken
  if (productCode && productCode !== existing.productCode) {
    const duplicate = await prisma.product.findUnique({
      where: { productCode },
    });

    if (duplicate) {
      return res.status(409).json({
        error: 'Conflict',
        message: `Product with code ${productCode} already exists`,
      });
    }
  }

  // Valid categories
  const validCategories = [
    'SCRAP_METAL',
    'NON_FERROUS',
    'FERROUS',
    'PRECIOUS_METALS',
    'INDUSTRIAL_MINERALS',
  ];

  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
    });
  }

  // Update product
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(productCode && { productCode }),
      ...(isriCode !== undefined && { isriCode }),
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(specifications !== undefined && { specifications }),
      ...(images !== undefined && { images }),
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'UPDATE',
      entityType: 'Product',
      entityId: product.id,
      oldValues: existing,
      newValues: product,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(200).json({
    success: true,
    data: product,
  });
}

// DELETE /api/v1/products/:id
async function deleteProduct(req, res, id) {
  // Check if product exists
  const existing = await prisma.product.findUnique({
    where: { id },
    include: {
      tradeLeads: true,
    },
  });

  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Product not found',
    });
  }

  // Check if has trade leads
  if (existing.tradeLeads.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Cannot delete product with existing trade leads',
    });
  }

  // Delete product
  await prisma.product.delete({
    where: { id },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'DELETE',
      entityType: 'Product',
      entityId: id,
      oldValues: existing,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
}
