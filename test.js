/**
 * Simple test suite for the Pig Latin Email Server
 * Run with: node test.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log('\n🐷 Pig Latin Email Server Tests\n');

  // Test 1: Health check
  try {
    const res = await fetch(BASE_URL + '/health');
    const data = await res.json();
    console.log('✅ Health check:', data.status === 'ok' ? 'PASS' : 'FAIL');
  } catch (e) {
    console.log('❌ Health check: FAIL -', e.message);
  }

  // Test 2: Convert email
  try {
    const res = await fetch(BASE_URL + '/incoming-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'test@example.com',
        to: 'server@piglatin.com',
        subject: 'Hello World',
        body: 'This is a simple test message. Please respond quickly!'
      })
    });
    const data = await res.json();
    console.log('✅ Email conversion:', data.pigLatinBody ? 'PASS' : 'FAIL');
    console.log('   Original: "This is a simple test message."');
    console.log('   Pig Latin:', data.pigLatinBody);
  } catch (e) {
    console.log('❌ Email conversion: FAIL -', e.message);
  }

  // Test 3: Missing body
  try {
    const res = await fetch(BASE_URL + '/incoming-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    console.log('✅ Error handling:', res.status === 400 ? 'PASS' : 'FAIL');
  } catch (e) {
    console.log('❌ Error handling: FAIL -', e.message);
  }

  console.log('\n🎉 Tests complete!\n');
}

runTests();
