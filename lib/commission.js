// Berjak FRE - Commission Calculation Service
// Handles automatic commission calculations for trade leads and contracts

/**
 * Calculate commission for a trade lead or contract
 * @param {Object} params - Calculation parameters
 * @param {Object} params.agent - Agent customer with commissions array
 * @param {string} params.productCategory - Product category
 * @param {number} params.quantity - Quantity in units
 * @param {number} params.unitPrice - Price per unit
 * @param {string} params.currency - Currency code
 * @returns {Object|null} Calculated commission or null if no applicable rate
 */
export function calculateCommission({
  agent,
  productCategory,
  quantity,
  unitPrice,
  currency,
}) {
  if (!agent || !agent.commissions || agent.commissions.length === 0) {
    return null;
  }

  if (!unitPrice || !quantity) {
    return null;
  }

  const now = new Date();
  
  // Find applicable commission rate
  const applicableCommission = agent.commissions.find((comm) => {
    // Check if commission is for this product category or is general
    if (comm.productCategory && comm.productCategory !== productCategory) {
      return false;
    }

    // Check effective date range
    if (comm.effectiveFrom > now) {
      return false;
    }

    if (comm.effectiveTo && comm.effectiveTo < now) {
      return false;
    }

    // Check volume range if specified
    if (comm.minVolume && quantity < parseFloat(comm.minVolume)) {
      return false;
    }

    if (comm.maxVolume && quantity > parseFloat(comm.maxVolume)) {
      return false;
    }

    return true;
  });

  if (!applicableCommission) {
    return null;
  }

  const totalValue = parseFloat(quantity) * parseFloat(unitPrice);
  const rate = parseFloat(applicableCommission.commissionRate);

  let commissionAmount;
  let commissionCurrency;

  if (applicableCommission.commissionType === 'PERCENTAGE') {
    commissionAmount = (totalValue * rate) / 100;
    commissionCurrency = currency;
  } else if (applicableCommission.commissionType === 'FIXED_PER_UNIT') {
    commissionAmount = parseFloat(quantity) * rate;
    commissionCurrency = applicableCommission.currency;
  } else {
    return null;
  }

  return {
    type: applicableCommission.commissionType,
    rate,
    amount: commissionAmount,
    currency: commissionCurrency,
    commissionId: applicableCommission.id,
    agentId: agent.id,
    agentName: agent.tradingName,
    calculatedAt: new Date(),
  };
}

/**
 * Calculate commissions for multiple agents (for agent splitting scenarios)
 * @param {Array} agents - Array of agent objects with commissions
 * @param {Object} params - Trade parameters
 * @returns {Array} Array of calculated commissions
 */
export function calculateMultiAgentCommissions(agents, params) {
  if (!agents || agents.length === 0) {
    return [];
  }

  return agents
    .map((agent) => calculateCommission({ agent, ...params }))
    .filter((comm) => comm !== null);
}

/**
 * Validate commission calculation against business rules
 * @param {Object} commission - Calculated commission
 * @param {number} contractValue - Total contract value
 * @returns {Object} Validation result
 */
export function validateCommission(commission, contractValue) {
  const warnings = [];
  const errors = [];

  if (!commission) {
    return { valid: true, warnings, errors };
  }

  const commissionPercentage = (commission.amount / contractValue) * 100;

  // Business rule: Commission should not exceed 10% of contract value
  if (commissionPercentage > 10) {
    errors.push({
      code: 'COMMISSION_TOO_HIGH',
      message: `Commission is ${commissionPercentage.toFixed(2)}% of contract value, exceeds 10% limit`,
    });
  }

  // Warning: Commission is unusually high (over 5%)
  if (commissionPercentage > 5 && commissionPercentage <= 10) {
    warnings.push({
      code: 'COMMISSION_HIGH',
      message: `Commission is ${commissionPercentage.toFixed(2)}% of contract value`,
    });
  }

  // Warning: Commission is unusually low (under 0.5%)
  if (commissionPercentage < 0.5) {
    warnings.push({
      code: 'COMMISSION_LOW',
      message: `Commission is ${commissionPercentage.toFixed(2)}% of contract value`,
    });
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
    percentage: commissionPercentage,
  };
}

/**
 * Preview commission before contract creation
 * @param {Object} tradeLead - Trade lead with agent and pricing
 * @returns {Object} Commission preview with validation
 */
export function previewCommission(tradeLead) {
  if (!tradeLead.agent || !tradeLead.unitPrice) {
    return {
      hasCommission: false,
      reason: 'No agent or pricing information',
    };
  }

  const commission = calculateCommission({
    agent: tradeLead.agent,
    productCategory: tradeLead.product?.category,
    quantity: parseFloat(tradeLead.quantity),
    unitPrice: parseFloat(tradeLead.unitPrice),
    currency: tradeLead.currency,
  });

  if (!commission) {
    return {
      hasCommission: false,
      reason: 'No applicable commission rate found',
    };
  }

  const contractValue = parseFloat(tradeLead.quantity) * parseFloat(tradeLead.unitPrice);
  const validation = validateCommission(commission, contractValue);

  return {
    hasCommission: true,
    commission,
    validation,
    contractValue,
  };
}
