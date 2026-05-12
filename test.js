const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let hasError = false;
    page.on('pageerror', error => {
        console.error('Page Error:', error);
        hasError = true;
    });
    page.on('console', msg => {
        if (msg.type() === 'error') {
            // Ignore error about leaflet since we aren't allowing cross-origin requests right now
            if (!msg.text().includes('Leaflet')) {
                console.error('Console Error:', msg.text());
                hasError = true;
            }
        }
    });

    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

    // Switch to map tab
    await page.click('#tab-sites');

    // Wait for maps and markers
    await page.waitForTimeout(2000);

    if (hasError) {
        console.error('Test failed: Errors found.');
        process.exit(1);
    } else {
        console.log('Test passed: No errors found.');
    }

    await browser.close();
})();
