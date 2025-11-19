import { Client } from '@notionhq/client';

/**
 * Notion - Financial API
 * Queries Financial Investigation Tracker for accounts/MYOB data
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN || process.env.NOTION_API_KEY
    });

    // Financial Investigation Tracker database ID
    const databaseId = '23604c15-e4f1-8003-84f8-000b1a013499';

    console.log('💰 Querying Financial Investigation Tracker from Notion...');

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ],
      page_size: 100
    });

    // Parse and structure financial data
    const financial_records = response.results.map(page => {
      const properties = page.properties;
      
      return {
        id: page.id,
        transaction_id: properties['Transaction ID']?.title?.[0]?.plain_text || '',
        date: properties['Date']?.date?.start || '',
        amount: properties['Amount']?.number || 0,
        category: properties['Category']?.select?.name || 'uncategorized',
        account: properties['Account']?.select?.name || 'unknown',
        status: properties['Status']?.status?.name || 'unknown',
        description: properties['Description']?.rich_text?.[0]?.plain_text || '',
        url: page.url,
        created: page.created_time,
        updated: page.last_edited_time
      };
    });

    // Calculate summary statistics
    const total_amount = financial_records.reduce((sum, record) => sum + record.amount, 0);
    const categories = [...new Set(financial_records.map(r => r.category))];
    const accounts = [...new Set(financial_records.map(r => r.account))];

    return res.status(200).json({
      status: 'success',
      database: 'Financial Investigation Tracker',
      database_id: databaseId,
      count: financial_records.length,
      summary: {
        total_amount: total_amount,
        categories: categories,
        accounts: accounts
      },
      records: financial_records,
      sacred_frequency: '432 Hz'
    });

  } catch (error) {
    console.error('❌ Notion financial query failed:', error);
    
    return res.status(500).json({
      status: 'error',
      error: error.message,
      message: 'Failed to query Notion Financial Investigation Tracker',
      timestamp: new Date().toISOString()
    });
  }
}
