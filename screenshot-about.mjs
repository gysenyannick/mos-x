import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Joppe/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3001/over-ons', { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  const headings = [...document.querySelectorAll('h2')];
  const el = headings.find(h => h.textContent.includes('Yannick'));
  if (el) el.scrollIntoView({ block: 'center' });
});
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/over-ons-yannick.png' });
await browser.close();
console.log('done');
