const { chromium } = require('playwright');
const { humanType, advancedHumanType, simulateTypo, humanClick, humanScroll, randomHumanAct } = require('./USER_INTERACTIONS.js');


(async () => {
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  
  const path = require('path');
  const proxyFile = path.join(__dirname, 'Proxy-17-06-2025.txt');
  const proxies = fs.readFileSync(proxyFile, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent,
    locale: 'en-US',
    viewport: { width: 1280, height: 800 },
    storageState: 'linkedin_state.json'
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.navigator.chrome = { runtime: {} };
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  });

  const page = await context.newPage();
  await page.goto('https://www.linkedin.com/jobs');

  const SELECTORS = {
    acceptCookies:      'div.artdeco-global-alert__action-wrapper button.artdeco-button--primary',
    searchInput:        'input[id^="jobs-search-box-keyword-id-ember"]',

    filter_date:            'button.search-reusables__filter-pill-button:has-text("Date posted")',
    filter_date_anytime:    'input[id="timePostedRange-"]',
    filter_date_past24h:    'input[id="timePostedRange-r86400"]',
    filter_date_pastWeek:   'input[id="timePostedRange-r604800"]',
    filter_date_pastMonth:  'input[id="timePostedRange-r2592000"]',


    filter_experience:            'button.search-reusables__filter-pill-button:has-text("Experience level")',
    filter_experience_intership:  'input[id="experience-1"]',
    filter_experience_entry:      'input[id="experience-2"]',
    filter_experience_associate:  'input[id="experience-3"]',
    filter_experience_senior:     'input[id="experience-4"]',
    filter_experience_director:   'input[id="experience-5"]',
    filter_experience_executive:  'input[id="experience-6"]',
    }

  try {
    await randomHumanAct(page);
    await page.waitForSelector(SELECTORS.searchInput, { timeout: 5000 });
    await humanClick(page, SELECTORS.searchInput);
    await advancedHumanType(page, SELECTORS.searchInput, 'Programmer', 'normal');
    await page.keyboard.press('Enter');
  } catch {
    console.log('Search input not found');
  }

  try {
    await randomHumanAct(page);
    await humanClick(page, SELECTORS.filter_date);
    await page.waitForTimeout(1000);
    await humanClick(page, SELECTORS.filter_date_past24h);
  } catch {
    console.log('Date filter not found');
  }
  try {
    await randomHumanAct(page);
    await humanClick(page, SELECTORS.filter_experience);
    await page.waitForTimeout(1000);
    await humanClick(page, SELECTORS.filter_experience_intership);
  } catch {
    console.log('Experience filter not found');
  }

  await randomHumanAct(page);
  await page.waitForTimeout(5000)
  await context.storageState({ path: 'linkedin_state.json' });
  await browser.close();
})();