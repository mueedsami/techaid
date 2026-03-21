const fs = require('fs');

async function testUpload() {
  const url = 'https://techaid.madestic.com/api/admin/upload';
  const apiKey = '1234567890987654321';
  let results = {};

  async function tryFetch(name, headers) {
    // Recreate FormData for each fetch to avoid stream exhaustion
    const formData = new FormData();
    const blob = new Blob(['DUMMY_IMAGE_DATA_12345\n'.repeat(100)], { type: 'image/jpeg' });
    formData.append('image', blob, 'test.jpg');

    try {
      const res = await fetch(url, { method: 'POST', headers, body: formData });
      results[name] = { status: res.status, statusText: res.statusText };
    } catch(e) {
      results[name] = { error: e.message };
    }
  }

  // 1. Accept: */*
  await tryFetch('accept_star', {
    'Accept': '*/*',
    'X-Admin-Key': apiKey,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  });

  // 2. Accept: application/json, text/plain, */*
  await tryFetch('accept_multiple', {
    'Accept': 'application/json, text/plain, */*',
    'X-Admin-Key': apiKey,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  });

  // 3. Fake fully like a browser
  await tryFetch('fake_browser', {
    'Accept': 'application/json',
    'X-Admin-Key': apiKey,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    'Origin': 'https://techaid1.vercel.app',
    'Referer': 'https://techaid1.vercel.app/'
  });

  fs.writeFileSync('result2.json', JSON.stringify(results, null, 2));
}

testUpload();
