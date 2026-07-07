/* Fonction serveur sécurisée Strava — échange/rafraîchit les tokens et relaie les activités.
   Le Client Secret n'est JAMAIS exposé au navigateur : il reste dans les variables
   d'environnement Netlify (STRAVA_CLIENT_SECRET). */

const CLIENT_ID = '259892';

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'POST requis' }) };

  const secret = process.env.STRAVA_CLIENT_SECRET;
  if (!secret) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'STRAVA_CLIENT_SECRET manquant dans Netlify' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'JSON invalide' }) }; }

  try {
    if (body.action === 'exchange' || body.action === 'refresh') {
      const params = new URLSearchParams({ client_id: CLIENT_ID, client_secret: secret });
      if (body.action === 'exchange') { params.set('code', body.code); params.set('grant_type', 'authorization_code'); }
      else { params.set('refresh_token', body.refresh_token); params.set('grant_type', 'refresh_token'); }
      const r = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params
      });
      const data = await r.json();
      return { statusCode: r.status, headers: cors, body: JSON.stringify(data) };
    }

    if (body.action === 'activities') {
      const per = Math.min(parseInt(body.per_page) || 30, 100);
      const r = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=' + per, {
        headers: { Authorization: 'Bearer ' + body.access_token }
      });
      const data = await r.json();
      return { statusCode: r.status, headers: cors, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Action inconnue' }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
