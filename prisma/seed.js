// Berjak FRE - Database Seed Script
// Initial test data for development

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Berjak FRE database...');
  
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@berjak.com.au' },
    update: {},
    create: {
      email: 'admin@berjak.com.au',
      name: 'System Administrator',
      password: '$2a$10$YourHashedPasswordHere', // TODO: Use proper hashing
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create test products
  const copperScrap = await prisma.product.create({
    data: {
      productCode: 'CU-SCRAP-001',
      isriCode: 'BIRCH',
      name: 'Copper Wire Scrap (Birch)',
      description: 'No. 2 copper wire, min 96% Cu content',
      category: 'NON_FERROUS',
      specifications: {
        minCopperContent: 96,
        form: 'wire',
        grade: 'No.2',
      },
      images: [],
    },
  });

  const aluminumScrap = await prisma.product.create({
    data: {
      productCode: 'AL-SCRAP-001',
      isriCode: 'TAINT',
      name: 'Aluminum Taint Tabor Scrap',
      description: 'Mixed aluminum scrap',
      category: 'NON_FERROUS',
      specifications: {
        aluminumContent: 95,
        form: 'mixed',
      },
      images: [],
    },
  });

  console.log('✅ Created products:', copperScrap.name, aluminumScrap.name);

  // Create test customers
  const buyer1 = await prisma.customer.create({
    data: {
      tradingName: 'Melbourne Metals Pty Ltd',
      legalName: 'Melbourne Metals Proprietary Limited',
      abn: '12345678901',
      customerType: 'BUYER',
      creditLimit: 500000,
      creditInsurer: 'ATRADIUS',
      status: 'ACTIVE',
      addresses: {
        create: {
          addressType: 'REGISTERED',
          street: '123 Industrial Drive',
          city: 'Melbourne',
          state: 'VIC',
          postcode: '3000',
          country: 'Australia',
          isPrimary: true,
        },
      },
      contacts: {
        create: {
          firstName: 'John',
          lastName: 'Smith',
          title: 'Purchasing Manager',
          email: 'john.smith@melbournemetals.com.au',
          phone: '+61 3 9876 5432',
          mobile: '+61 412 345 678',
          isPrimary: true,
        },
      },
    },
  });

  const seller1 = await prisma.customer.create({
    data: {
      tradingName: 'Sydney Scrap Traders',
      legalName: 'Sydney Scrap Traders Pty Ltd',
      abn: '98765432109',
      customerType: 'SELLER',
      status: 'ACTIVE',
      addresses: {
        create: {
          addressType: 'PHYSICAL',
          street: '456 Port Road',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'Australia',
          isPrimary: true,
        },
      },
      contacts: {
        create: {
          firstName: 'Sarah',
          lastName: 'Chen',
          title: 'Sales Director',
          email: 'sarah@sydneyscrap.com.au',
          phone: '+61 2 1234 5678',
          isPrimary: true,
        },
      },
    },
  });

  const agent1 = await prisma.customer.create({
    data: {
      tradingName: 'Pacific Trade Services',
      customerType: 'AGENT',
      status: 'ACTIVE',
      addresses: {
        create: {
          addressType: 'REGISTERED',
          street: '789 Trade Street',
          city: 'Brisbane',
          state: 'QLD',
          postcode: '4000',
          country: 'Australia',
          isPrimary: true,
        },
      },
      contacts: {
        create: {
          firstName: 'Michael',
          lastName: 'Wong',
          email: 'michael@pacifictrade.com',
          phone: '+61 7 3456 7890',
          isPrimary: true,
        },
      },
      commissions: {
        create: {
          productCategory: 'NON_FERROUS',
          commissionType: 'PERCENTAGE',
          commissionRate: 2.5,
          currency: 'USD',
          effectiveFrom: new Date(),
        },
      },
    },
  });

  console.log('✅ Created customers:', buyer1.tradingName, seller1.tradingName, agent1.tradingName);

  // Create test trade lead
  const tradeLead = await prisma.tradeLead.create({
    data: {
      tradeLeadNumber: 'TL-2025-001',
      buyerId: buyer1.id,
      sellerId: seller1.id,
      agentId: agent1.id,
      productId: copperScrap.id,
      quantity: 100,
      unit: 'MT',
      unitPrice: 9500,
      currency: 'USD',
      paymentTerms: 'LC at sight',
      shipmentDate: new Date('2025-11-15'),
      deliveryCountry: 'China',
      shippingTerms: 'CIF',
      status: 'NEW',
      priority: 'HIGH',
      notes: {
        create: {
          note: 'Initial inquiry from Melbourne Metals for 100MT copper scrap',
          createdBy: admin.id,
        },
      },
    },
  });

  console.log('✅ Created trade lead:', tradeLead.tradeLeadNumber);

  // Create market data samples
  const marketData = await prisma.marketData.createMany({
    data: [
      {
        date: new Date('2025-10-26'),
        commodity: 'COPPER',
        exchange: 'LME',
        closingPrice: 9452.50,
        openingPrice: 9420.00,
        dayHigh: 9480.00,
        dayLow: 9410.00,
        volume: 15234,
        currency: 'USD',
      },
      {
        date: new Date('2025-10-26'),
        commodity: 'ALUMINUM',
        exchange: 'LME',
        closingPrice: 2567.00,
        openingPrice: 2555.00,
        dayHigh: 2575.00,
        dayLow: 2545.00,
        volume: 23456,
        currency: 'USD',
      },
    ],
  });

  console.log('✅ Created market data entries');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
