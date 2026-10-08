const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const DEFAULT_PROPERTIES = [
  {id:'PT-SALE-000125',title:'Modern 4-Bedroom Villa',type:'Villa',listing:'Sale',price:350000,location:'Sen Sok, Phnom Penh',beds:4,baths:5,size:'250 m²',land:'320 m²',status:'Available',agent:'Dara',views:523,leads:12,featured:true,desc:'Modern family villa with private parking, garden, security and a spacious living area.'},
  {id:'PT-RENT-000126',title:'Premium Condo in BKK1',type:'Condo',listing:'Rent',price:1200,location:'BKK1, Phnom Penh',beds:2,baths:2,size:'95 m²',land:'—',status:'Available',agent:'Lina',views:321,leads:8,featured:true,desc:'Fully furnished city-center condominium close to restaurants, offices and major amenities.'},
  {id:'PT-SALE-000127',title:'Commercial Land',type:'Land',listing:'Sale',price:500000,location:'Chbar Ampov, Phnom Penh',beds:0,baths:0,size:'600 m²',land:'600 m²',status:'Reserved',agent:'Dara',views:201,leads:4,featured:false,desc:'High-potential commercial land with convenient road access.'},
  {id:'PT-SALE-000128',title:'Family Villa in Toul Kork',type:'Villa',listing:'Sale',price:285000,location:'Toul Kork, Phnom Penh',beds:4,baths:4,size:'210 m²',land:'280 m²',status:'Available',agent:'Sokha',views:184,leads:6,featured:true,desc:'Comfortable family home in a popular residential district.'},
  {id:'PT-RENT-000129',title:'City Center Office',type:'Office',listing:'Rent',price:2800,location:'Daun Penh, Phnom Penh',beds:0,baths:2,size:'180 m²',land:'—',status:'Available',agent:'Lina',views:142,leads:3,featured:false,desc:'Flexible office floor suitable for a growing business.'},
  {id:'PT-SALE-000130',title:'New Borey House',type:'House',listing:'Sale',price:145000,location:'Meanchey, Phnom Penh',beds:3,baths:3,size:'130 m²',land:'150 m²',status:'Sold',agent:'Sokha',views:487,leads:9,featured:false,desc:'Newly built home in a secure residential development.'},
  {id:'PT-RENT-000131',title:'Retail Shopfront',type:'Shop',listing:'Rent',price:950,location:'Sen Sok, Phnom Penh',beds:0,baths:1,size:'80 m²',land:'—',status:'Available',agent:'Dara',views:98,leads:2,featured:false,desc:'Street-facing retail space with strong visibility.'},
  {id:'PT-SALE-000132',title:'Development Land',type:'Land',listing:'Sale',price:780000,location:'Chroy Changvar, Phnom Penh',beds:0,baths:0,size:'1,200 m²',land:'1,200 m²',status:'Pending',agent:'Lina',views:76,leads:1,featured:false,desc:'Large parcel suitable for residential or commercial development.'}
];

let propertiesStore = null;

function getProperties() {
  if (!propertiesStore) {
    propertiesStore = [...DEFAULT_PROPERTIES];
  }
  return propertiesStore;
}

async function handleGetProperties() {
  return new Response(JSON.stringify(getProperties()), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function handlePostProperty(request) {
  try {
    const body = await request.json();
    const properties = getProperties();

    const newProperty = {
      id: body.id || 'PT-' + Date.now(),
      title: body.title || 'Untitled Property',
      type: body.type || 'House',
      listing: body.listing || 'Sale',
      price: Number(body.price) || 0,
      location: body.location || '',
      beds: Number(body.beds) || 0,
      baths: Number(body.baths) || 0,
      size: body.size || '',
      land: body.land || '',
      status: body.status || 'Pending',
      agent: body.agent || 'Unassigned',
      views: 0,
      leads: 0,
      featured: false,
      desc: body.desc || '',
      created_at: new Date().toISOString(),
    };

    properties.push(newProperty);
    propertiesStore = properties;

    return new Response(JSON.stringify({ success: true, property: newProperty }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

async function handleOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return handleOptions();

    if (path === '/api/properties' && request.method === 'GET') {
      return handleGetProperties();
    }

    if (path === '/api/properties' && request.method === 'POST') {
      return handlePostProperty(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
