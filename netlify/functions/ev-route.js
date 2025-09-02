exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' } };
  }

  try {
    const apiKey = process.env.HERE_API_KEY;
    if (!apiKey) return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'HERE_API_KEY not configured' }) };

    const isGet = event.httpMethod === 'GET';
    const params = isGet ? event.queryStringParameters : JSON.parse(event.body || '{}');

    const origin = (params.origin || '').trim();
    const destination = (params.destination || '').trim();
    if (!origin || !destination) {
      return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'origin and destination are required as "lat,lng"' }) };
    }

    const consumption = params.consumption || '15.0';
    const initialCharge = params.initialCharge || '60';
    const maxCharge = params.maxCharge || '80';

    const url = new URL('https://router.hereapi.com/v8/routes');
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('transportMode', 'car');
    url.searchParams.set('origin', origin);
    url.searchParams.set('destination', destination);
    url.searchParams.set('routingMode', 'fast');
    url.searchParams.set('return', 'polyline,summary,actions,instructions,travelSummary');

    url.searchParams.set('ev[initialCharge]', initialCharge);
    url.searchParams.set('ev[maxCharge]', maxCharge);
    url.searchParams.set('ev[connectorTypes]', params.connectorTypes || 'iec62196Type2Combo,iec62196Type2_AC');
    url.searchParams.set('ev[chargingCurve]', params.chargingCurve || '0,60,50;60,80,40;80,100,25');
    url.searchParams.set('ev[maxChargeAfterChargingStation]', params.maxChargeAfterChargingStation || '80');
    url.searchParams.set('ev[trafficEnabled]', 'true');

    if (params.evConsumption) {
      url.searchParams.set('ev[consumption]', params.evConsumption);
    } else {
      url.searchParams.set('ev[consumption]', `${consumption}`);
    }

    const resp = await fetch(url.toString());
    const data = await resp.json();
    if (!resp.ok) {
      return { statusCode: resp.status, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'HERE routing error', details: data }) };
    }

    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Unexpected server error', details: String(err) }) };
  }
};
