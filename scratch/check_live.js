async function checkLive() {
  try {
    const res = await fetch('https://fimfortehospital.ng/');
    const html = await res.text();
    console.log('--- LIVE HTML INSPECTION ---');
    console.log('Status:', res.status);
    
    // Find all link rel tags
    const links = html.match(/<link[^>]+>/gi) || [];
    const iconLinks = links.filter(l => l.includes('rel="icon"') || l.includes('rel="apple-touch-icon"') || l.includes('rel="shortcut icon"'));
    console.log('Icon tags on live site:', iconLinks);

    // Check specific files on live server
    const urlsToCheck = [
      'https://fimfortehospital.ng/favicon.ico',
      'https://fimfortehospital.ng/assets/icons/fimforte-favicon.svg',
      'https://fimfortehospital.ng/assets/icons/favicon-48x48.png',
      'https://fimfortehospital.ng/assets/icons/favicon-96x96.png',
      'https://fimfortehospital.ng/assets/icons/favicon-192x192.png',
      'https://fimfortehospital.ng/assets/icons/fimforte-emblem-512.png'
    ];

    console.log('\n--- LIVE ASSET AVAILABILITY ---');
    for (const url of urlsToCheck) {
      const r = await fetch(url);
      console.log(`${url} -> Status: ${r.status}, Content-Type: ${r.headers.get('content-type')}, Size: ${r.headers.get('content-length')} bytes`);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

checkLive();
