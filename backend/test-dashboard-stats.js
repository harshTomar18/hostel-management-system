const http = require('http');

function getStats() {
    return new Promise((resolve) => {
        http.get('http://localhost:5000/api/dashboard/stats', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const stats = JSON.parse(data);
                    console.log('✅ Dashboard Stats:', stats);

                    if (typeof stats.totalStudents === 'number' &&
                        typeof stats.occupancyRate === 'number' &&
                        typeof stats.totalRevenue === 'number' &&
                        typeof stats.availableRooms === 'number') {
                        console.log('✅ Data types are correct.');
                    } else {
                        console.error('❌ Data types are incorrect.');
                    }
                    resolve();
                } catch (e) {
                    console.error('❌ Error parsing response:', e);
                    resolve();
                }
            });
        }).on('error', (e) => {
            console.error(`❌ Error: ${e.message}`);
            resolve();
        });
    });
}

async function runTest() {
    console.log('Testing Dashboard Stats...');
    await getStats();
    console.log('Test complete.');
}

runTest();
