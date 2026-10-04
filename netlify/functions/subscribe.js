exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, firstname } = JSON.parse(event.body);

  if (!email) {
    return { statusCode: 400, body: 'Email required' };
  }

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      attributes: { PRENOM: firstname || '' },
      listIds: [5],
      updateEnabled: true
    })
  });

  return {
    statusCode: res.ok || res.status === 204 ? 200 : res.status,
    body: JSON.stringify({ ok: res.ok })
  };
};
