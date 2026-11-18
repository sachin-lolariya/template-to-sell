// In-memory real messages cache for Netlify serverless deployment
let inMemoryMessages = [];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        online: 1,
        messages: inMemoryMessages
      })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body || '{}');
      const user = String(data.user || '').trim().slice(0, 30).replace(/[<>'"]/g, '') || 'Anonymous Fan';
      const text = String(data.text || '').trim().slice(0, 500);

      if (!text) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Message cannot be empty.' })
        };
      }

      const newMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        user,
        text,
        timestamp: new Date().toISOString()
      };

      inMemoryMessages.push(newMessage);
      if (inMemoryMessages.length > 150) inMemoryMessages = inMemoryMessages.slice(-150);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, message: newMessage })
      };
    } catch (err) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid payload.' })
      };
    }
  }

  return { statusCode: 405, headers, body: 'Method Not Allowed' };
};
