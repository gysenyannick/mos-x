import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Joppe/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  const el = document.querySelector('#diensten');
  if (el) el.scrollIntoView({ block: 'end' });
});
await new Promise(r => setTimeout(r, 800));
// full viewport screenshot of the scrolled view
await page.screenshot({
  path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/chevron-diensten.png',
});
await browser.close();
console.log('done');
