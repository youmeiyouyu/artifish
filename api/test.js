/**
 * Simple test API
 */
async function handler(req, res) {
  console.log('Test API called, method:', req.method)
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(204).send(null)
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { agent_name } = req.body || {}
    console.log('Body parsed:', req.body)
    
    return res.status(200).json({ 
      success: true, 
      message: 'API is working!',
      received: agent_name 
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: error.message })
  }
}

module.exports = handler
