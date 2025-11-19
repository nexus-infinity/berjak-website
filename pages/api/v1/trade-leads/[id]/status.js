// Berjak FRE API - Trade Lead Status Update
// PATCH /api/v1/trade-leads/:id/status - Update trade lead status

import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  const { status, note } = req.body;

  if (!status) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'status is required',
    });
  }

  // Valid status transitions
  const validStatuses = ['NEW', 'QUOTED', 'NEGOTIATING', 'WON', 'LOST', 'EXPIRED'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
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

    // Check if already has contract
    if (status === 'WON' && existing.contracts.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Cannot set status to WON without converting to contract first',
      });
    }

    // Update status with optional note
    const tradeLead = await prisma.tradeLead.update({
      where: { id },
      data: {
        status,
        ...(note && {
          notes: {
            create: {
              note: `Status changed to ${status}: ${note}`,
              createdBy: req.user?.id || 'system',
            },
          },
        }),
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
        oldValues: { status: existing.status },
        newValues: { status: tradeLead.status },
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      },
    });

    return res.status(200).json({
      success: true,
      data: tradeLead,
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
