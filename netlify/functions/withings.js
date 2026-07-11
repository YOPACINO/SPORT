/* Fonction serveur sécurisée Withings — échange/rafraîchit les tokens et relaie les mesures.
   Le Client Secret n'est JAMAIS exposé au navigateur : il reste dans les variables
   d'environnement Netlify (WITHINGS_CLIENT_SECRET). */

const CLIENT_ID = '6de22a52f28130a0e0cb11be1f1b007cd7cec4573b1b96d4fa9704b9fcad379a';
const REDIRECT_URI = 'https://graceful-capybara-5c8190.netlify.app/withings-callback.html';

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'POST requis' }) };

  const secret = process.env.WITHINGS_CLIENT_SECRET;
  if (!secret) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'WITHINGS_CLIENT_SECRET manquant dans Netlify' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'JSON invalide' }) }; }

  try {
    // OAuth2 : échange du code ou rafraîchissement du token
    if (body.action === 'exchange' || body.action === 'refresh') {
      const params = new URLSearchParams({
        action: 'requesttoken', client_id: CLIENT_ID, client_secret: secret
      });
      if (body.action === 'exchange') {
        params.set('grant_type', 'authorization_code');
        params.set('code', body.code);
        params.set('redirect_uri', body.redirect_uri || REDIRECT_URI);
      } else {
        params.set('grant_type', 'refresh_token');
        params.set('refresh_token', body.refresh_token);
      }
      const r = await fetch('https://wbsapi.withings.net/v2/oauth2', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params
      });
      const data = await r.json();
      return { statusCode: 200, headers: cors, body: JSON.stringify(data) };
    }

    // Récupération des mesures (poids, masse grasse, muscle, os, eau…)
    if (body.action === 'measures') {
      const params = new URLSearchParams({
        action: 'getmeas',
        meastypes: '1,5,6,8,76,77,88',   // poids, masse maigre, %gras, masse grasse, muscle, eau, os
        category: '1'
      });
      if (body.startdate) params.set('startdate', String(body.startdate));
      const r = await fetch('https://wbsapi.withings.net/measure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + body.access_token
        },
        body: params
      });
      const data = await r.json();
      return { statusCode: 200, headers: cors, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Action inconnue' }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
