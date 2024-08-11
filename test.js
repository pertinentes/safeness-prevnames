const Safeness = require('./src/index');

async function testWithApi() {
    const prev = new Safeness.Client({ url: "", key: "", api: true });
    try {
        console.log('Testing with API...');
        const count = await prev.count();
        console.log('Total number of prevnames via API:', count);
        const prevname = await prev.prevnames("953916177275555862");
        console.log("Prevnames:", prevname);
    } catch (error) {
        console.error('Error (API):', error.message);
    }
}

async function testWithoutApi() {
    const prev = new Safeness.Client({ api: false });
    try {
        console.log('Testing without API...');
        await prev.save({ user_id: '1', username: 'User1', name: 'TestName1', changedAt: new Date().toISOString() });
        await prev.save({ user_id: '1', username: 'User1', name: 'TestName2', changedAt: new Date().toISOString() });

        const count = await prev.count();
        console.log('Total number of prevnames (without API):', count);

        const prevNames = await prev.prevnames('1');
        console.log('Previous names for user 1:', prevNames);

        await prev.clear('1');
        console.log('Previous names cleared for user 1.');

        const countAfterClear = await prev.count();
        console.log('Total number of prevnames after clearing (without API):', countAfterClear);

    } catch (error) {
        console.error('Error (without API):', error.message);
    }
}

async function main() {
    await testWithApi();
    await testWithoutApi();
}

main();