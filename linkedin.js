const { chromium } = require('playwright');
async function humanType(page, selector, text, options = {}) {
  const {
    minDelay = 50,
    maxDelay = 200,
    pauseProbability = 0.1,
    pauseMinDelay = 300,
    pauseMaxDelay = 800,
    typoRate = 0.02
  } = options;
  await page.focus(selector);
  await page.waitForTimeout(100 + Math.random() * 200);
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (Math.random() < typoRate) {
      await simulateTypo(page, char);
      continue;
    }
    await page.keyboard.type(char);
    let delay = minDelay + Math.random() * (maxDelay - minDelay);
    if (char === ' ') {
      delay += 50 + Math.random() * 100;
    } else if (/[.,!?;:]/.test(char)) {
      delay += 100 + Math.random() * 200;
    }
    await page.waitForTimeout(delay);
    if (Math.random() < pauseProbability) {
      const pauseDelay = pauseMinDelay + Math.random() * (pauseMaxDelay - pauseMinDelay);
      await page.waitForTimeout(pauseDelay);
    }
  }
}

async function advancedHumanType(page, selector, text, typingStyle = 'normal') {
  const styles = {
    fast: { minDelay: 30, maxDelay: 80, pauseProbability: 0.05 },
    normal: { minDelay: 80, maxDelay: 180, pauseProbability: 0.1 },
    slow: { minDelay: 150, maxDelay: 300, pauseProbability: 0.15 },
    careful: { minDelay: 200, maxDelay: 400, pauseProbability: 0.2, typoRate: 0.001 }
  };
  const config = styles[typingStyle] || styles.normal;
  await humanType(page, selector, text, config);
}

async function simulateTypo(page, correctChar) {
  const typoMap = {
    'a': ['s', 'q'], 'b': ['v', 'n'], 'c': ['x', 'v'], 'd': ['s', 'f'],
    'e': ['w', 'r'], 'f': ['d', 'g'], 'g': ['f', 'h'], 'h': ['g', 'j'],
    'i': ['u', 'o'], 'j': ['h', 'k'], 'k': ['j', 'l'], 'l': ['k'],
    'm': ['n'], 'n': ['b', 'm'], 'o': ['i', 'p'], 'p': ['o'],
    'q': ['w'], 'r': ['e', 't'], 's': ['a', 'd'], 't': ['r', 'y'],
    'u': ['y', 'i'], 'v': ['c', 'b'], 'w': ['q', 'e'], 'x': ['z', 'c'],
    'y': ['t', 'u'], 'z': ['x']
  };
  const possibleTypos = typoMap[correctChar.toLowerCase()] || [correctChar];
  const typo = possibleTypos[Math.floor(Math.random() * possibleTypos.length)];
  await page.keyboard.type(typo);
  await page.waitForTimeout(400 + Math.random() * 800);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(100 + Math.random() * 200);
  await page.keyboard.type(correctChar);
}
async function humanClick(page, selector, options = {}) {
  const {
    missClickChance = 0.3,
    doubleClickChance = 0.25,
    moveSteps = 15
  } = options;
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible' });
  const box = await locator.boundingBox();
  if (!box) throw new Error(`Element ${selector} has no bounding box`);
  async function moveAndClick(x, y) {
    await page.mouse.move(
      x + (Math.random() * 10 - 5),
      y + (Math.random() * 10 - 5),
      { steps: moveSteps + Math.floor(Math.random() * 10) }
    );
    await page.waitForTimeout(100 + Math.random() * 200);
    await page.mouse.click(x, y, {
      delay: 50 + Math.random() * 150,
    });
  }
  const mainX = box.x + Math.random() * box.width;
  const mainY = box.y + Math.random() * box.height;
  if (Math.random() < missClickChance) {
    const missDeltaX = (Math.random() - 0.5) * 16;
    const missDeltaY = (Math.random() - 0.5) * 16;
    const missX = mainX + missDeltaX;
    const missY = mainY + missDeltaY;
    await moveAndClick(missX, missY);
    await page.waitForTimeout(300 + Math.random() * 700);
    await moveAndClick(mainX, mainY);
  } else {
    await moveAndClick(mainX, mainY);
    if (Math.random() < doubleClickChance) {
      await page.waitForTimeout(300 + Math.random() * 600);
      const secondX = box.x + Math.random() * box.width;
      const secondY = box.y + Math.random() * box.height;
      await moveAndClick(secondX, secondY);
    }
  }
}

async function humanScroll(page) {
  const scrollStep = 200 + Math.random() * 300;
  let position = 0;
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  while (position < scrollHeight) {
    position += scrollStep;
    await page.evaluate((pos) => window.scrollTo(0, pos), position);
    await page.waitForTimeout(300 + Math.random() * 500);
  }
}

async function randomHumanAct(page) {
  const viewport = page.viewportSize() || { width: 1280, height: 800 };
  const steps = 3 + Math.floor(Math.random() * 5);
  let lastX = Math.random() * viewport.width;
  let lastY = Math.random() * viewport.height;
  for (let i = 0; i < steps; i++) {
    let nextX = Math.min(viewport.width, Math.max(0, lastX + (Math.random() - 0.5) * 400));
    let nextY = Math.min(viewport.height, Math.max(0, lastY + (Math.random() - 0.5) * 400));
    const duration = 50 + Math.random() * 70;
    const smallSteps = 8 + Math.floor(Math.random() * 5);
    for (let step = 1; step <= smallSteps; step++) {
      const intermediateX = lastX + ((nextX - lastX) * step) / smallSteps;
      const intermediateY = lastY + ((nextY - lastY) * step) / smallSteps;
      await page.mouse.move(intermediateX, intermediateY);
      await page.waitForTimeout(duration / smallSteps + (Math.random() - 0.5) * 8);
    }
    lastX = nextX;
    lastY = nextY;
    if (Math.random() < 0.25) {
      const pause = 80 + Math.random() * 120;
      await page.waitForTimeout(pause);
    }
  }
}

async function saveCookies(context) {
  const cookies = await context.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
  console.log('Cookies saved to cookies.json');
}

(async () => {
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  const fs = require('fs');
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