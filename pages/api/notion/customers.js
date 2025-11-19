import { Client } from '@notionhq/client';

/**
 * Notion - Customers API
 * Queries Corporate Entities database for customer/trading data
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN || process.env.NOTION_API_KEY
    });

    // Corporate Entities Database ID (most recent)
    const databaseId = '11304c15-e4f1-81b2-a0f7-de1c888f0f10';

    console.log('🏢 Querying Corporate Entities from Notion...');

    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100
    });

    // Parse and structure customer data
    const customers = response.results.map(page => {
      const properties = page.properties;
      
      return {
        id: page.id,
        entity_name: properties['Entity Name']?.title?.[0]?.plain_text || 'Unknown',
        entity_type: properties['Entity Type']?.select?.name || 'unknown',
        jurisdiction: properties['Jurisdiction']?.select?.name || '',
        status: properties['Status']?.status?.name || 'unknown',
        url: page.url,
        created: page.created_time,
        updated: page.last_edited_time
      };
    });

    return res.status(200).json({
      status: 'success',
      database: 'Corporate Entities',
      database_id: databaseId,
      count: customers.length,
      customers: customers,
      sacred_frequency: '432 Hz'
    });

  } catch (error) {
    console.error('❌ Notion customers query failed:', error);
    
    return res.status(500).json({
      status: 'error',
      error: error.message,
      message: 'Failed to query Notion Corporate Entities database',
      timestamp: new Date().toISOString()
    });
  }
}
