import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Project X - Historical Reconstruction API
 *
 * Purpose: Historical forensic reconstruction from family company books
 * Goal: Build evidence matrix to prove corruption and GET FARM BACK
 *
 * Data Sources:
 * - NLIS (National Livestock Identification) records
 * - Financial transactions from management accounts
 * - Purchase/sale documentation
 * - Property movement records
 *
 * Corruption Detection:
 * - Cross-reference livestock movements with financial records
 * - Detect timeline violations, location mismatches
 * - Calculate corruption score
 * - Generate legal evidence package
 *
 * Geometric Node: ▼TATA (285 Hz - Validation/Law/Justice)
 */
export default async function handler(req, res) {
  const { method } = req;

  // GET - Retrieve reconstruction status
  if (method === 'GET') {
    try {
      const { stdout } = await execAsync(
        'python3 /Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py --status',
        { timeout: 10000 }
      );

      const status = JSON.parse(stdout);

      return res.status(200).json({
        status: 'success',
        timestamp: new Date().toISOString(),
        geometric_node: '▼TATA',
        frequency: '285 Hz - Validation/Law/Justice',
        reconstruction_status: status,
        purpose: 'GET MY FARM BACK'
      });

    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }

  // POST - Import historical data or run analysis
  if (method === 'POST') {
    const { action, data } = req.body;

    try {
      let result;

      switch (action) {
        case 'import_nlis':
          // Import NLIS record from family company books
          result = await execAsync(
            `python3 -c "
import sys
import json
sys.path.append('/Users/jbear/FIELD-DEV/mcp')
from project_x_historical_reconstruction_mcp_server import ProjectXReconstruction

project_x = ProjectXReconstruction()
record = project_x.import_historical_nlis_record(
    nlis_id='${data.nlis_id}',
    transaction_date='${data.transaction_date}',
    livestock_type='${data.livestock_type}',
    movement_type='${data.movement_type}',
    from_pic='${data.from_pic || ''}',
    to_pic='${data.to_pic || ''}',
    quantity=${data.quantity || 1},
    metadata=${JSON.stringify(data.metadata || {})}
)
print(json.dumps(record))
"`,
            { timeout: 30000, maxBuffer: 5 * 1024 * 1024 }
          );

          return res.status(200).json({
            status: 'success',
            action: 'import_nlis',
            result: JSON.parse(result.stdout),
            message: 'NLIS record imported from family company books'
          });

        case 'import_financial':
          // Import financial transaction
          result = await execAsync(
            `python3 -c "
import sys
import json
sys.path.append('/Users/jbear/FIELD-DEV/mcp')
from project_x_historical_reconstruction_mcp_server import ProjectXReconstruction

project_x = ProjectXReconstruction()
tx = project_x.import_financial_transaction(
    transaction_date='${data.transaction_date}',
    account='${data.account}',
    description='${data.description}',
    debit=${data.debit || 0.0},
    credit=${data.credit || 0.0},
    reference='${data.reference || ''}',
    metadata=${JSON.stringify(data.metadata || {})}
)
print(json.dumps(tx))
"`,
            { timeout: 30000 }
          );

          return res.status(200).json({
            status: 'success',
            action: 'import_financial',
            result: JSON.parse(result.stdout),
            message: 'Financial transaction imported from management accounts'
          });

        case 'analyze_discrepancies':
          // Run cross-reference analysis
          console.log('🔍 Running corruption pattern analysis...');

          result = await execAsync(
            `python3 -c "
import sys
import json
sys.path.append('/Users/jbear/FIELD-DEV/mcp')
from project_x_historical_reconstruction_mcp_server import ProjectXReconstruction

project_x = ProjectXReconstruction()
analysis = project_x.analyze_financial_discrepancies(
    livestock_records=[],  # Load from database
    financial_records=[]   # Load from database
)
print(json.dumps(analysis))
"`,
            { timeout: 60000, maxBuffer: 10 * 1024 * 1024 }
          );

          const analysis = JSON.parse(result.stdout);

          return res.status(200).json({
            status: 'success',
            action: 'analyze_discrepancies',
            geometric_node: '▼TATA - Validation',
            frequency: '285 Hz',
            analysis: analysis,
            corruption_score: analysis.corruption_score,
            evidence_strength: analysis.corruption_score > 30 ? 'STRONG' :
                              analysis.corruption_score > 15 ? 'MODERATE' : 'DEVELOPING',
            message: analysis.corruption_score > 30 ?
              'Strong evidence - ready for legal action' :
              'Continue gathering data'
          });

        case 'detect_patterns':
          // Detect corruption patterns
          console.log('🎯 Detecting corruption patterns...');

          result = await execAsync(
            'python3 /Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py --detect-patterns',
            { timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
          );

          const patterns = JSON.parse(result.stdout);

          return res.status(200).json({
            status: 'success',
            action: 'detect_patterns',
            patterns: patterns,
            high_severity: patterns.filter(p => p.severity === 'HIGH').length,
            medium_severity: patterns.filter(p => p.severity === 'MEDIUM').length,
            message: 'Corruption patterns detected across timeline'
          });

        case 'generate_evidence_package':
          // Generate legal evidence package
          console.log('📋 Generating legal evidence package...');

          result = await execAsync(
            'python3 /Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py --generate-evidence',
            { timeout: 180000, maxBuffer: 20 * 1024 * 1024 }
          );

          const evidence = JSON.parse(result.stdout);

          return res.status(200).json({
            status: 'success',
            action: 'generate_evidence_package',
            geometric_node: '▼TATA - Law/Justice',
            evidence_package: evidence,
            output_path: evidence.output_path,
            blockchain_verified: evidence.blockchain_verified,
            message: 'Legal evidence package ready for justice pursuit',
            next_steps: [
              'Review comprehensive timeline',
              'Validate blockchain integrity',
              'Consult legal counsel',
              'File complaint with authorities'
            ]
          });

        case 'reconstruct_timeline':
          // Reconstruct complete timeline
          result = await execAsync(
            'python3 /Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py --reconstruct-timeline',
            { timeout: 90000, maxBuffer: 10 * 1024 * 1024 }
          );

          const timeline = JSON.parse(result.stdout);

          return res.status(200).json({
            status: 'success',
            action: 'reconstruct_timeline',
            timeline: timeline,
            total_events: timeline.events.length,
            critical_periods: timeline.critical_periods,
            message: 'Complete timeline reconstructed from family company books'
          });

        default:
          return res.status(400).json({
            status: 'error',
            error: `Unknown action: ${action}`,
            valid_actions: [
              'import_nlis',
              'import_financial',
              'analyze_discrepancies',
              'detect_patterns',
              'generate_evidence_package',
              'reconstruct_timeline'
            ]
          });
      }

    } catch (error) {
      console.error('❌ Project X action failed:', error);

      return res.status(500).json({
        status: 'error',
        action: action,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
