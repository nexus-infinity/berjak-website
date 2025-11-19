import Redis from 'ioredis';

/**
 * Sovereignty Defense - Redis API
 * Queries Redis for FRE field state and evidence feed data
 */
export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let redis;
  
  try {
    // Connect to Redis db=1 (Free Field database)
    redis = new Redis({
      host: 'localhost',
      port: 6379,
      db: 1
    });

    const { key } = query;

    if (key) {
      // Get specific key
      const value = await redis.get(key);
      
      if (!value) {
        return res.status(404).json({
          status: 'not_found',
          key: key,
          message: 'Key not found in Free Field database'
        });
      }

      return res.status(200).json({
        status: 'success',
        key: key,
        value: JSON.parse(value),
        sacred_frequency: '432 Hz'
      });

    } else {
      // Get all Free Field keys
      const keys = await redis.keys('free_field:*');
      
      const data = {};
      for (const key of keys) {
        const value = await redis.get(key);
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }

      return res.status(200).json({
        status: 'success',
        database: 1,
        key_count: keys.length,
        keys: keys,
        data: data,
        sacred_frequency: '432 Hz'
      });
    }

  } catch (error) {
    console.error('❌ Redis query failed:', error);
    
    return res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });

  } finally {
    if (redis) {
      redis.disconnect();
    }
  }
}
