const { User }      = require('./lib/USER_INTERACTIONS.js');
const { Browser }   = require('./lib/INITS.js');
const inquirer      = require('inquirer');

async function start(){
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proxy_rotation',
      message: 'Do you want to use proxy rotation?',
      default: false
    },
    {
      type: 'input',
      name: 'config_file',
      message: 'Enter the path to your configuration file (press enter for default: config.json):',
      default: 'config.json',
    },
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: [
        { name: 'Search for jobs',      value: 'jobs' },
        { name: 'Search for people',    value: 'people' },
        { name: 'Search for companies', value: 'companies' },
        { name: 'Search for groups',    value: 'groups' },
        { name: 'Search for posts',     value: 'posts' },
        { name: 'Search for events',    value: 'events' },
        { name: 'Search for courses',   value: 'courses' },
        { name: 'Exit',                 value: 'exit' }
      ],
      default: 'jobs'
    }
  ]);
  return answers;
}

(async () => {

  const answers = await start();
  console.log('Selected options:', answers);
  const browser = new Browser(answers.proxy_rotation, 'config.json');


  switch (answers.action) {
    case 'jobs':
      console.log('Starting job search...');
      break;
    case 'people':
      console.log('Starting people search...');
      break;
    case 'companies':
      console.log('Starting company search...');
      break;
    case 'groups':
      console.log('Starting group search...');
      break;
    case 'posts':
      console.log('Starting post search...');
      break;
    case 'events':
      console.log('Starting event search...');
      break;
    case 'courses':
      console.log('Starting course search...');
      break;
    case 'exit':
      console.log('Exiting...');
      return;
    default:
      console.log('Invalid action selected.');
      return;
  }

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

  // example of how to use the selectors
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
  await browser.close();
})();