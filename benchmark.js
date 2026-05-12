const fs = require('fs');
const data = JSON.parse(fs.readFileSync('links.json', 'utf8'));

// Multiply data to make the benchmark meaningful
let allData = [];
for (let i = 0; i < 100; i++) {
    allData = allData.concat(data.map(item => ({...item, title: item.title + '-' + i})));
}

const CITY_COORDINATES = {
    'TUAS': [1.2944, 103.6358],
    'Angra': [-23.0067, -44.3189],
    'Aracruz': [-19.8203, -40.2733],
    'Batam': [1.1283, 104.0531],
    'Nantong': [31.9802, 120.8943],
    'Haiyang': [36.7767, 121.1594],
    'Yantai': [37.5333, 121.4000]
};

function originalMethod() {
    const cityGroups = {};
    allData.forEach(item => {
        if (!item.projects) return;
        ['P84', 'P85'].forEach(projKey => {
            const city = item.projects[projKey]?.city;
            const country = item.projects[projKey]?.country;
            if (city && CITY_COORDINATES[city]) {
                if (!cityGroups[city]) cityGroups[city] = { name: city, country: country, modules: [] };
                // THE O(N^2) PART
                if (!cityGroups[city].modules.find(m => m.title === item.title && m.project === projKey)) {
                    cityGroups[city].modules.push({ ...item, project: projKey });
                }
            }
        });
    });
    return cityGroups;
}

function optimizedMethod() {
    const cityGroups = {};
    const seen = new Set();

    allData.forEach(item => {
        if (!item.projects) return;
        ['P84', 'P85'].forEach(projKey => {
            const city = item.projects[projKey]?.city;
            const country = item.projects[projKey]?.country;
            if (city && CITY_COORDINATES[city]) {
                if (!cityGroups[city]) cityGroups[city] = { name: city, country: country, modules: [] };

                const uniqueKey = `${city}|${item.title}|${projKey}`;
                if (!seen.has(uniqueKey)) {
                    seen.add(uniqueKey);
                    cityGroups[city].modules.push({ ...item, project: projKey });
                }
            }
        });
    });
    return cityGroups;
}

const startOriginal = performance.now();
for(let i = 0; i < 10; i++) originalMethod();
const endOriginal = performance.now();
const originalTime = endOriginal - startOriginal;

const startOptimized = performance.now();
for(let i = 0; i < 10; i++) optimizedMethod();
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Original Time: ${originalTime.toFixed(2)} ms`);
console.log(`Optimized Time: ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${((originalTime - optimizedTime) / originalTime * 100).toFixed(2)}%`);
