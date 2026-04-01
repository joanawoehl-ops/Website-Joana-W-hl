const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://woehl.de',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ message: 'Ungültige Anfrage.' }) };
  }

  const { email, firstname } = body;
  if (!email || !firstname) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ message: 'E-Mail und Vorname erforderlich.' }) };
  }

  const BREVO_API_KEY  = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID  = parseInt(process.env.BREVO_LIST_ID  || '5', 10);
  const BREVO_TEMPLATE = parseInt(process.env.BREVO_TEMPLATE || '6', 10);
  const REDIRECT_URL   = 'https://woehl.de/funnel/danke.html';

  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: firstname },
      includeListIds: [BREVO_LIST_ID],
      templateId: BREVO_TEMPLATE,
      redirectionUrl: REDIRECT_URL
    })
  });

  if (res.status === 201 || res.status === 204) {
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
  }

  const data = await res.json().catch(() => ({}));
  console.log('Brevo error:', res.status, JSON.stringify(data));
  return {
    statusCode: res.status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: data.message || 'Fehler beim Senden.' })
  };
};
