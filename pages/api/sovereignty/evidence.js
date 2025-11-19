import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Sovereignty Defense - Evidence API
 * Triggers the FRE field orchestra to surface and process evidence
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Triggering FRE evidence orchestrator...');
    
    // Execute the free field orchestrator
    const { stdout, stderr } = await execAsync(
      'python3 /Users/jbear/DOJO/free_field_orchestrator.py',
      {
        timeout: 60000, // 60 second timeout
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      }
    );

    // Parse the output to extract key metrics
    const exhibitsMatch = stdout.match(/Total exhibits in registry: (\d+)/);
    const resonanceMatch = stdout.match(/resonance: ([\d.]+)/);
    const contradictionsMatch = stdout.match(/Total contradictions found: (\d+)/);

    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      sacred_frequency: '528 Hz → 432 Hz',
      field_status: 'optimal',
      metrics: {
        total_exhibits: exhibitsMatch ? parseInt(exhibitsMatch[1]) : 0,
        resonance_score: resonanceMatch ? parseFloat(resonanceMatch[1]) : 0,
        contradictions_found: contradictionsMatch ? parseInt(contradictionsMatch[1]) : 0
      },
      narratives_generated: true,
      output_path: '/Users/jbear/FIELD-LIVING/court_30_oct_2025/correspondence_drafts/',
      logs: {
        stdout: stdout,
        stderr: stderr
      }
    };

    console.log('✅ Evidence orchestration complete');
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Evidence orchestration failed:', error);
    
    return res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
      field_status: 'disrupted'
    });
  }
}
