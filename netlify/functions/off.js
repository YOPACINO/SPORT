/* Proxy Open Food Facts pour la recherche par nom (l'endpoint /cgi/search.pl
   n'autorise pas les appels directs depuis le navigateur — CORS). Le scan par
   code-barres (api/v2/product) fonctionne en direct et ne passe pas par ici. */

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  const term = (event.queryStringParameters || {}).q;
  if (!term) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'paramètre q requis' }) };
  try {
    const url = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + encodeURIComponent(term) +
      '&json=1&page_size=20&fields=product_name,product_name_fr,brands,nutriments,serving_quantity,code';
    const r = await fetch(url, { headers: { 'User-Agent': 'MonSport - PWA perso - contact yohanlamant@gmail.com' } });
    const d = await r.json();
    return { statusCode: 200, headers: cors, body: JSON.stringify({ products: d.products || [] }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
