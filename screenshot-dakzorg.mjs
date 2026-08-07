import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Joppe/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3001/diensten/mos-x-dakzorg', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

// Hero
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/dakzorg-hero.png' });

// Sectie 1
await page.evaluate(() => window.scrollBy(0, 900));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/dakzorg-s1.png' });

// Sectie 2
await page.evaluate(() => window.scrollBy(0, 900));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/dakzorg-s2.png' });

// Sectie 3
await page.evaluate(() => window.scrollBy(0, 900));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/dakzorg-s3.png' });

// Sectie 4 + 5
await page.evaluate(() => window.scrollBy(0, 900));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/dakzorg-s4.png' });

await page.evaluate(() => window.scrollBy(0, 900));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/dakzorg-s5.png' });

await browser.close();
console.log('done');
