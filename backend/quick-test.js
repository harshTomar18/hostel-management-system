// Quick test to verify backend is working
const testBackend = async () => {
    console.log('🧪 Testing backend endpoints...\n');

    // Test 1: Health check
    try {
        const healthRes = await fetch('http://localhost:5000/');
        const healthData = await healthRes.json();
        console.log('✅ Health check:', healthData);
    } catch (err) {
        console.error('❌ Health check failed:', err.message);
    }

    // Test 2: Register a test user
    try {
        const registerRes = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            })
        });
        const registerData = await registerRes.json();
        console.log('✅ Register:', registerData);
    } catch (err) {
        console.error('❌ Register failed:', err.message);
    }

    // Test 3: Login with test user
    try {
        const loginRes = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('✅ Login:', loginData);
    } catch (err) {
        console.error('❌ Login failed:', err.message);
    }

    console.log('\n🎉 Backend test complete!');
};

testBackend();
