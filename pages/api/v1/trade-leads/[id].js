// Berjak FRE API - Trade Lead Processing (FR-2)
// GET /api/v1/trade-leads/:id - Get trade lead by ID
// PATCH /api/v1/trade-leads/:id - Update trade lead
// DELETE /api/v1/trade-leads/:id - Delete trade lead

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (!id) {
    return res.status(400).json({ error: 'Trade Lead ID is required' });
  }

  try {
    switch (method) {
      case 'GET':
        return await getTradeLead(req, res, id);
      case 'PATCH':
        return await updateTradeLead(req, res, id);
      case 'DELETE':
        return await deleteTradeLead(req, res, id);
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

// GET /api/v1/trade-leads/:id
async function getTradeLead(req, res, id) {
  const tradeLead = await prisma.tradeLead.findUnique({
    where: { id },
    include: {
      buyer: {
        include: {
          addresses: { where: { isPrimary: true } },
          contacts: { where: { isPrimary: true } },
        },
      },
      seller: {
        include: {
          addresses: { where: { isPrimary: true } },
          contacts: { where: { isPrimary: true } },
        },
      },
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
      notes: {
        orderBy: { createdAt: 'desc' },
      },
      contracts: {
        select: {
          id: true,
          contractNumber: true,
          status: true,
          totalValue: true,
          createdAt: true,
        },
      },
    },
  });

  if (!tradeLead) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Trade lead not found',
    });
  }

  // Calculate commission if agent exists
  let calculatedCommission = null;
  if (tradeLead.agent && tradeLead.unitPrice) {
    const commission = tradeLead.agent.commissions.find(
      (c) => c.productCategory === tradeLead.product.category
    );

    if (commission) {
      const totalValue = parseFloat(tradeLead.quantity) * parseFloat(tradeLead.unitPrice);
      
      if (commission.commissionType === 'PERCENTAGE') {
        calculatedCommission = {
          type: 'PERCENTAGE',
          rate: parseFloat(commission.commissionRate),
          amount: (totalValue * parseFloat(commission.commissionRate)) / 100,
          currency: tradeLead.currency,
        };
      } else if (commission.commissionType === 'FIXED_PER_UNIT') {
        calculatedCommission = {
          type: 'FIXED_PER_UNIT',
          rate: parseFloat(commission.commissionRate),
          amount: parseFloat(tradeLead.quantity) * parseFloat(commission.commissionRate),
          currency: commission.currency,
        };
      }
    }
  }

  return res.status(200).json({
    success: true,
    data: {
      ...tradeLead,
      calculatedCommission,
    },
  });
}

// PATCH /api/v1/trade-leads/:id
async function updateTradeLead(req, res, id) {
  const {
    buyerId,
    sellerId,
    agentId,
    quantity,
    unit,
    unitPrice,
    currency,
    paymentTerms,
    shipmentDate,
    deliveryCountry,
    shippingTerms,
    status,
    priority,
    assignedTo,
  } = req.body;

  // Check if trade lead exists
  const existing = await prisma.tradeLead.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Trade lead not found',
    });
  }

  // Check if already converted to contract
  if (existing.status === 'WON') {
    const hasContract = await prisma.contract.findFirst({
      where: { tradeLeadId: id },
    });

    if (hasContract) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Cannot update trade lead that has been converted to contract',
      });
    }
  }

  // Update trade lead
  const tradeLead = await prisma.tradeLead.update({
    where: { id },
    data: {
      ...(buyerId !== undefined && { buyerId }),
      ...(sellerId !== undefined && { sellerId }),
      ...(agentId !== undefined && { agentId }),
      ...(quantity && { quantity: parseFloat(quantity) }),
      ...(unit && { unit }),
      ...(unitPrice !== undefined && { unitPrice: unitPrice ? parseFloat(unitPrice) : null }),
      ...(currency && { currency }),
      ...(paymentTerms && { paymentTerms }),
      ...(shipmentDate !== undefined && { 
        shipmentDate: shipmentDate ? new Date(shipmentDate) : null 
      }),
      ...(deliveryCountry && { deliveryCountry }),
      ...(shippingTerms && { shippingTerms }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assignedTo !== undefined && { assignedTo }),
    },
    include: {
      buyer: true,
      seller: true,
      agent: true,
      product: true,
      notes: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'UPDATE',
      entityType: 'TradeLead',
      entityId: tradeLead.id,
      oldValues: existing,
      newValues: tradeLead,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(200).json({
    success: true,
    data: tradeLead,
  });
}

// DELETE /api/v1/trade-leads/:id
async function deleteTradeLead(req, res, id) {
  // Check if trade lead exists
  const existing = await prisma.tradeLead.findUnique({
    where: { id },
    include: {
      contracts: true,
    },
  });

  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Trade lead not found',
    });
  }

  // Check if has contracts
  if (existing.contracts.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Cannot delete trade lead with existing contracts',
    });
  }

  // Delete trade lead (cascade will delete notes)
  await prisma.tradeLead.delete({
    where: { id },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id || null,
      action: 'DELETE',
      entityType: 'TradeLead',
      entityId: id,
      oldValues: existing,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Trade lead deleted successfully',
  });
}
