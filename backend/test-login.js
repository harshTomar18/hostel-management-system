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

async function testLoginFlow() {
    const user = {
        name: 'Login Test User',
        email: 'login_test_' + Date.now() + '@example.com',
        password: 'password123'
    };

    console.log('1. Registering user:', user.email);
    const regRes = await request('/api/register', 'POST', user);
    console.log('Registration Status:', regRes.statusCode);

    if (regRes.statusCode !== 201) {
        console.log('❌ Registration failed, aborting login test');
        return;
    }

    console.log('2. Logging in user:', user.email);
    const loginRes = await request('/api/login', 'POST', { email: user.email, password: user.password });
    console.log('Login Status:', loginRes.statusCode);
    console.log('Login Body:', loginRes.body);

    if (loginRes.statusCode === 200 && loginRes.body.status === 'success' && loginRes.body.token) {
        console.log('✅ Login successful, token received');
    } else {
        console.log('❌ Login failed');
    }
}

testLoginFlow();
