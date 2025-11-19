// Berjak FRE API - Customer Management (FR-1)
// GET /api/v1/customers/:id - Get customer by ID
// PATCH /api/v1/customers/:id - Update customer
// DELETE /api/v1/customers/:id - Delete customer

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (!id) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    switch (method) {
      case 'GET':
        return await getCustomer(req, res, id);
      case 'PATCH':
        return await updateCustomer(req, res, id);
      case 'DELETE':
        return await deleteCustomer(req, res, id);
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

// GET /api/v1/customers/:id
async function getCustomer(req, res, id) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: true,
      contacts: true,
      bankDetails: true,
      commissions: true,
      buyerLeads: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      sellerLeads: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      buyerContracts: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      sellerContracts: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!customer) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Customer not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: customer,
  });
}

// PATCH /api/v1/customers/:id
async function updateCustomer(req, res, id) {
  const {
    tradingName,
    legalName,
    abn,
    customerType,
    creditLimit,
    creditInsurer,
    status,
  } = req.body;

  // Check if customer exists
  const existing = await prisma.customer.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Customer not found',
    });
  }

  // Check for duplicate ABN if changing
  if (abn && abn !== existing.abn) {
    const duplicate = await prisma.customer.findUnique({
      where: { abn },
    });
    
    if (duplicate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Customer with this ABN already exists',
      });
    }
  }

  // Update customer
  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...(tradingName && { tradingName }),
      ...(legalName && { legalName }),
      ...(abn && { abn }),
      ...(customerType && { customerType }),
      ...(creditLimit !== undefined && { creditLimit: parseFloat(creditLimit) }),
      ...(creditInsurer && { creditInsurer }),
      ...(status && { status }),
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
      action: 'UPDATE',
      entityType: 'Customer',
      entityId: customer.id,
      oldValues: existing,
      newValues: customer,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(200).json({
    success: true,
    data: customer,
  });
}

// DELETE /api/v1/customers/:id
async function deleteCustomer(req, res, id) {
  // Check if customer exists
  const existing = await prisma.customer.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          buyerContracts: true,
          sellerContracts: true,
        },
      },
    },
  });

  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Customer not found',
    });
  }

  // Check if customer has contracts
  if (existing._count.buyerContracts > 0 || existing._count.sellerContracts > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Cannot delete customer with existing contracts. Set status to INACTIVE instead.',
    });
  }

  // Soft delete (set status to INACTIVE)
  const customer = await prisma.customer.update({
    where: { id },
    data: { status: 'INACTIVE' },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'DELETE',
      entityType: 'Customer',
      entityId: customer.id,
      oldValues: existing,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Customer deactivated successfully',
    data: customer,
  });
}
