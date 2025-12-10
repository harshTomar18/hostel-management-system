const http = require('http');

function request(path) {
    return new Promise((resolve, reject) => {
        http.get({
            hostname: 'localhost',
            port: 5000,
            path: path,
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        }).on('error', reject);
    });
}

async function runTest() {
    console.log('🧪 Testing Dashboard APIs...');

    try {
        console.log('\n1. Testing /api/dashboard/stats...');
        const stats = await request('/api/dashboard/stats');
        console.log('   Stats:', JSON.stringify(stats, null, 2));

        console.log('\n2. Testing /api/dashboard/activity...');
        const activity = await request('/api/dashboard/activity');
        console.log('   Activity Count:', activity.length);
        if (activity.length > 0) console.log('   First Activity:', activity[0]);

        console.log('\n3. Testing /api/dashboard/chart...');
        const chart = await request('/api/dashboard/chart');
        console.log('   Chart Data Points:', chart.length);
        console.log('   Chart Data:', chart);

        console.log('\n4. Testing /api/staff...');
        const staff = await request('/api/staff');
        console.log('   Staff Count:', staff.length);
        if (staff.length > 0) console.log('   First Staff:', staff[0]);

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

runTest();
