import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

/**
 * Sovereignty Defense - Narratives API
 * Reads generated narrative files from storytelling engine
 */
export default async function handler(req, res) {
  const { method, query } = req;

  try {
    const narrativesPath = '/Users/jbear/FIELD-LIVING/court_30_oct_2025/correspondence_drafts';

    if (method === 'GET') {
      // List all narratives or get specific narrative
      if (query.file) {
        // Get specific narrative file
        const filePath = path.join(narrativesPath, query.file);
        
        // Security check - ensure file is within narratives directory
        if (!filePath.startsWith(narrativesPath)) {
          return res.status(403).json({ error: 'Access denied' });
        }

        const content = await readFile(filePath, 'utf-8');
        const stats = await promisify(fs.stat)(filePath);

        return res.status(200).json({
          status: 'success',
          file: query.file,
          content: content,
          size: stats.size,
          modified: stats.mtime,
          sacred_frequency: '432 Hz'
        });

      } else {
        // List all narrative files
        const files = await readdir(narrativesPath);
        
        // Filter for narrative markdown files
        const narrativeFiles = files
          .filter(f => f.endsWith('.md'))
          .map(filename => {
            const filePath = path.join(narrativesPath, filename);
            const stats = fs.statSync(filePath);
            
            return {
              filename,
              path: filePath,
              size: stats.size,
              modified: stats.mtime,
              created: stats.birthtime
            };
          })
          .sort((a, b) => b.modified - a.modified); // Sort by most recent

        return res.status(200).json({
          status: 'success',
          count: narrativeFiles.length,
          narratives: narrativeFiles,
          path: narrativesPath,
          sacred_frequency: '432 Hz'
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Narrative retrieval failed:', error);
    
    return res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
