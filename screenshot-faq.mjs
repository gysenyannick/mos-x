import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Joppe/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await new Promise(r => setTimeout(r, 2000));
await page.goto('http://localhost:3001/diensten/dakontmossing', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await page.evaluate(() => window.scrollBy(0, 4400));
await new Promise(r => setTimeout(r, 500));
// Klik op "Is een dakcoating nodig na het reinigen?" via tekst
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const target = btns.find(b => b.textContent.includes('Wat kost'));
  if (target) target.click();
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'g:/Claude code - Projects/Mos-X Website - Claude code VS/temporary screenshots/faq-check.png' });
await browser.close();
console.log('done');
