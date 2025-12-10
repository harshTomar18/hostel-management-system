const http = require('http');

const endpoints = [
    { path: '/api/students', method: 'GET' },
    { path: '/api/complaints', method: 'GET' },
    { path: '/api/notices', method: 'GET' },
    { path: '/api/dashboard/stats', method: 'GET' },
    { path: '/api/rooms', method: 'GET' }
];

let passed = 0;
let failed = 0;

function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: endpoint.path,
            method: endpoint.method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ ${endpoint.method} ${endpoint.path} - Success (${res.statusCode})`);
                    passed++;
                } else {
                    console.error(`❌ ${endpoint.method} ${endpoint.path} - Failed (${res.statusCode})`);
                    failed++;
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`❌ ${endpoint.method} ${endpoint.path} - Error: ${e.message}`);
            failed++;
            resolve();
        });

        req.end();
    });
}

async function runTests() {
    console.log('Starting API verification...');
    for (const endpoint of endpoints) {
        await testEndpoint(endpoint);
    }
    console.log(`\nVerification complete: ${passed} passed, ${failed} failed.`);
}

runTests();
