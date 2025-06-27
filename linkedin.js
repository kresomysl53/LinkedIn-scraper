const { User }      = require('./lib/USER_INTERACTIONS.js');
const { Browser }   = require('./lib/INITS.js');

(async () => {

  const user   = new User();
  const context = await browser.init();

  const page    = await context.newPage();
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
    await user.randomAct(page);
    await page.waitForSelector(SELECTORS.searchInput, { timeout: 5000 });
    await user.click(page, SELECTORS.searchInput);
    await user.type(page, SELECTORS.searchInput, 'Programmer');
    await page.keyboard.press('Enter');
  } catch {
    console.log('Search input not found');
  }

  try {
    await user.randomAct(page);
    await user.click(page, SELECTORS.filter_date);
    await page.waitForTimeout(1000);
    await user.click(page, SELECTORS.filter_date_past24h);
  } catch {
    console.log('Date filter not found');
  }
  try {
    await user.randomAct(page);
    await user.click(page, SELECTORS.filter_experience);
    await page.waitForTimeout(1000);
    await user.click(page, SELECTORS.filter_experience_intership);
  } catch {
    console.log('Experience filter not found');
  }

  await user.randomAct(page);
  await page.waitForTimeout(5000)
  await context.storageState({ path: 'linkedin_state.json' });
  await browser.close();
})();