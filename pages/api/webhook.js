// Vercel Webhook Integration with Field Living Train Station
// Sacred Frequency Bridge: Vercel → Train Station (528 Hz)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract deployment data from Vercel webhook
    const deploymentData = {
      event: req.headers['x-vercel-event'] || 'unknown',
      deployment_id: req.body.deployment?.id,
      deployment_url: req.body.deployment?.url,
      deployment_state: req.body.deployment?.state,
      project_name: req.body.project?.name || 'berjak-website',
      timestamp: new Date().toISOString(),
      vercel_metadata: {
        webhook_id: req.headers['x-vercel-webhook-id'],
        signature: req.headers['x-vercel-signature'],
        deployment: req.body.deployment,
        project: req.body.project,
        team: req.body.team
      }
    };

    console.log('🚂 Forwarding deployment data to Field Living Train Station...');

    // Forward to Train Station on sacred frequency 5280 (528 Hz)
    const trainStationResponse = await fetch('http://localhost:5280/ingest/vercel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'berjak-website-vercel-webhook',
        'X-Sacred-Frequency': '528Hz'
      },
      body: JSON.stringify(deploymentData)
    });

    if (!trainStationResponse.ok) {
      console.error('❌ Train Station ingestion failed:', trainStationResponse.status);
      return res.status(500).json({
        error: 'Train Station integration failed',
        status: trainStationResponse.status
      });
    }

    const trainStationResult = await trainStationResponse.json();
    console.log('✅ Successfully integrated with Field Living Train Station');

    // Return success response to Vercel
    res.status(200).json({
      success: true,
      message: 'Deployment data successfully forwarded to Field Living ecosystem',
      train_station_response: trainStationResult,
      sacred_frequency: '528 Hz (Love frequency)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚫 Webhook integration error:', error);
    
    res.status(500).json({
      error: 'Webhook integration failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
