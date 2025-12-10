const http = require('http');

async function testUpdate(endpoint, id, data) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `${endpoint}/${id}`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ PUT ${endpoint}/${id} - Success (${res.statusCode})`);
                } else {
                    console.error(`❌ PUT ${endpoint}/${id} - Failed (${res.statusCode})`);
                    console.error('Response:', responseData);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`❌ PUT ${endpoint}/${id} - Error: ${e.message}`);
            resolve();
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('Starting Update API verification...');

    // Note: These IDs must exist in the database for the test to truly succeed in updating something.
    // Since we don't know exact IDs, we might get a "success" response from the server even if 0 rows were affected,
    // depending on how the backend handles "ID not found" (usually UPDATE returns success with 0 changed rows).
    // However, the main goal is to check if the endpoint exists and accepts the request.

    await testUpdate('/api/students', 1, {
        name: 'Updated Student',
        room: '101',
        course: 'CS',
        year: '2nd',
        contact: '1234567890',
        status: 'Active',
        email: 'updated@test.com'
    });

    await testUpdate('/api/rooms', 1, {
        type: 'Double',
        capacity: 2,
        occupied: 2,
        status: 'Available',
        floor: 1
    });

    await testUpdate('/api/notices', 1, {
        title: 'Updated Notice',
        content: 'This notice has been updated.',
        type: 'Important',
        author: 'Admin'
    });

    console.log('\nVerification complete.');
}

runTests();
