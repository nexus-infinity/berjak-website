import { Client } from '@notionhq/client';

/**
 * Notion - Modules API
 * Queries Lens Modules database for FRE module registry
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN || process.env.NOTION_API_KEY
    });

    // Lens Modules database ID
    const databaseId = '1fb04c15-e4f1-804a-90a9-de0ec43ba235';

    console.log('📚 Querying Lens Modules from Notion...');

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    });

    // Parse and structure module data
    const modules = response.results.map(page => {
      const properties = page.properties;
      
      return {
        id: page.id,
        name: properties.Name?.title?.[0]?.plain_text || 'Unnamed Module',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        status: properties.Status?.status?.name || 'unknown',
        category: properties.Category?.select?.name || 'general',
        url: page.url,
        created: page.created_time,
        updated: page.last_edited_time
      };
    });

    return res.status(200).json({
      status: 'success',
      database: 'Lens Modules',
      database_id: databaseId,
      count: modules.length,
      modules: modules,
      sacred_frequency: '432 Hz'
    });

  } catch (error) {
    console.error('❌ Notion modules query failed:', error);
    
    return res.status(500).json({
      status: 'error',
      error: error.message,
      message: 'Failed to query Notion Lens Modules database',
      timestamp: new Date().toISOString()
    });
  }
}
