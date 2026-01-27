import asyncio
from playwright.async_api import async_playwright
import os
import subprocess
import time

async def verify():
    # Start a local server
    server = subprocess.Popen(['python3', '-m', 'http.server', '8000'])
    time.sleep(2)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1280, "height": 800})

        try:
            await page.goto('http://localhost:8000')
            await page.wait_for_load_state('networkidle')

            # 1. Verify Header (v2.1 should be gone)
            await page.screenshot(path='verify_header_v5.png')

            # 2. Open Modal and verify "3D VIEWER READY"
            await page.click('text=M01')
            await asyncio.sleep(1)
            await page.screenshot(path='verify_modal_v5.png')
            await page.click('text=Close')

            # 3. Switch to Sites Tab
            await page.click('#tab-sites')
            await asyncio.sleep(2) # Wait for map animation
            await page.screenshot(path='verify_sites_v5.png')

            # 4. Click a marker (approximate location for Singapore Tuas)
            # Map is 3/4 of 1280 = 960px wide.
            # This is hard to automate without knowing exact pixel coordinates,
            # but we can check if the Tracker sidebar is present.
            tracker = await page.query_selector('text=Construction Tracker')
            if tracker:
                print("Construction Tracker sidebar found.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()
            server.terminate()

if __name__ == "__main__":
    asyncio.run(verify())
