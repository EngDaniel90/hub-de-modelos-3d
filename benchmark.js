const fs = require('fs');

// Load data
const data = JSON.parse(fs.readFileSync('links.json', 'utf8'));

// Test Array approach (Baseline)
let allDataArray = data;

function openModalArray(title) {
    const item = allDataArray.find(d => d.title === title);
    return item;
}

// Test Map approach
let allDataMap = new Map(data.map(d => [d.title, d]));

function openModalMap(title) {
    const item = allDataMap.get(title);
    return item;
}

const iterations = 1000000;
const testTitles = data.map(d => d.title);
const numTitles = testTitles.length;

console.log("Starting benchmark...");

const startArray = performance.now();
for (let i = 0; i < iterations; i++) {
    const title = testTitles[i % numTitles];
    openModalArray(title);
}
const endArray = performance.now();
const arrayTime = endArray - startArray;
console.log(`Array.find() time: ${arrayTime.toFixed(2)} ms`);

const startMap = performance.now();
for (let i = 0; i < iterations; i++) {
    const title = testTitles[i % numTitles];
    openModalMap(title);
}
const endMap = performance.now();
const mapTime = endMap - startMap;
console.log(`Map.get() time: ${mapTime.toFixed(2)} ms`);

const improvement = ((arrayTime - mapTime) / arrayTime * 100).toFixed(2);
console.log(`Improvement: ${improvement}% faster`);
console.log(`Map is ${(arrayTime / mapTime).toFixed(2)}x faster`);
