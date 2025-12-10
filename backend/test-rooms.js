const http = require('http');

function request(path, method, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(responseBody) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: responseBody });
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function testRoomsFlow() {
    const room = {
        type: 'Single',
        capacity: 1,
        occupied: 0,
        status: 'Available',
        floor: 1
    };

    console.log('Testing adding room:', room);
    const res = await request('/api/rooms', 'POST', room);
    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', res.body);

    if (res.statusCode === 201 && res.body.status === 'success') {
        console.log('✅ Room added successfully');
    } else {
        console.log('❌ Failed to add room');
    }
}

testRoomsFlow();
