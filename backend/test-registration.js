const http = require('http');

function testRegistration() {
    const user = {
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
    };

    const data = JSON.stringify(user);

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log('Testing registration with:', user);

    const req = http.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            console.log('Response Status:', res.statusCode);
            console.log('Response Body:', responseBody);

            try {
                const parsed = JSON.parse(responseBody);
                if (res.statusCode === 201 && parsed.status === 'success') {
                    console.log('✅ Registration successful');
                } else {
                    console.log('❌ Registration failed');
                }
            } catch (e) {
                console.log('❌ Failed to parse response');
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request error:', error);
    });

    req.write(data);
    req.end();
}

testRegistration();
