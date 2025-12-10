const http = require('http');

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body); // Return raw body if not JSON
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTest() {
    console.log('🧪 Testing Room Logic...');

    try {
        // 1. Create a Room (Capacity 2)
        console.log('\n1. Creating Test Room (Capacity 2)...');
        const roomRes = await request('POST', '/api/rooms', {
            type: 'Test Double',
            capacity: 2,
            occupied: 0,
            status: 'Available',
            floor: 1
        });
        const roomId = roomRes.id;
        console.log('   Room Created:', roomId);

        // 2. Add Student 1
        console.log('\n2. Adding Student 1...');
        const student1Res = await request('POST', '/api/students', {
            name: 'Test Student 1',
            room: roomId,
            course: 'Test',
            year: '1st',
            contact: '123',
            status: 'Active',
            email: 'test1@test.com'
        });
        console.log('   Student 1 Added:', student1Res.status);

        // Verify Occupancy = 1
        const rooms1 = await request('GET', '/api/rooms');
        const room1 = rooms1.find(r => r.id === roomId);
        console.log(`   Room Occupancy: ${room1.occupied}/2 (Expected: 1)`);

        // 3. Add Student 2
        console.log('\n3. Adding Student 2...');
        await request('POST', '/api/students', {
            name: 'Test Student 2',
            room: roomId,
            course: 'Test',
            year: '1st',
            contact: '123',
            status: 'Active',
            email: 'test2@test.com'
        });

        // Verify Occupancy = 2
        const rooms2 = await request('GET', '/api/rooms');
        const room2 = rooms2.find(r => r.id === roomId);
        console.log(`   Room Occupancy: ${room2.occupied}/2 (Expected: 2)`);

        // 4. Try Adding Student 3 (Should Fail)
        console.log('\n4. Adding Student 3 (Should Fail)...');
        const student3Res = await request('POST', '/api/students', {
            name: 'Test Student 3',
            room: roomId,
            course: 'Test',
            year: '1st',
            contact: '123',
            status: 'Active',
            email: 'test3@test.com'
        });
        console.log('   Response:', student3Res);

        // 5. Set Room to Maintenance
        console.log('\n5. Setting Room to Maintenance...');
        await request('PUT', `/api/rooms/${roomId}`, {
            type: 'Test Double',
            capacity: 2,
            occupied: 2,
            status: 'Maintenance',
            floor: 1
        });

        // 6. Try Adding Student to Maintenance Room (Should Fail)
        console.log('\n6. Adding Student to Maintenance Room (Should Fail)...');
        const student4Res = await request('POST', '/api/students', {
            name: 'Test Student 4',
            room: roomId,
            course: 'Test',
            year: '1st',
            contact: '123',
            status: 'Active',
            email: 'test4@test.com'
        });
        console.log('   Response:', student4Res);

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

runTest();
