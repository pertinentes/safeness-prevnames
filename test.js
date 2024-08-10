const Safeness = require('./index');

const prev = new Safeness.Client({ url: "", key: "devKey" });

async function main() {
    try {
        const count = await prev.count();
        console.log('Nombre total de prevnames:', count);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

main();
