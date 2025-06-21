  // USER_INTERACTIONS.js

class Human {
  constructor(options = {}) {
    this.options = options;
  }

  async type(page, selector, text, options = {}) {
    await this._advancedHumanType(page, selector, text, options);
  }

  async click(page, selector, options = {}) {
    await this._humanClick(page, selector, options);
  }

  async scroll(page) {
    await this._humanScroll(page);
  }

  async randomAct(page) {
    await this._randomHumanAct(page);
  }

  // --- Internal methods ---
  async _humanType(page, selector, text, options = {}) {
    const {
      minDelay = 50,
      maxDelay = 200,
      pauseProbability = 0.1,
      pauseMinDelay = 300,
      pauseMaxDelay = 800,
      typoRate = 0.02
    } = { ...this.options, ...options };
    await page.focus(selector);
    await page.waitForTimeout(100 + Math.random() * 200);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (Math.random() < typoRate) {
        await this._simulateTypo(page, char);
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

  async _advancedHumanType(page, selector, text, typingStyle = 'normal') {
    const styles = {
      fast: { minDelay: 30, maxDelay: 80, pauseProbability: 0.05 },
      normal: { minDelay: 80, maxDelay: 180, pauseProbability: 0.1 },
      slow: { minDelay: 150, maxDelay: 300, pauseProbability: 0.15 },
      careful: { minDelay: 200, maxDelay: 400, pauseProbability: 0.2, typoRate: 0.001 }
    };
    const config = styles[typingStyle] || styles.normal;
    await this._humanType(page, selector, text, config);
  }

  async _simulateTypo(page, correctChar) {
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

  async _humanClick(page, selector, options = {}) {
    const {
      missClickChance = 0.3,
      doubleClickChance = 0.25,
      moveSteps = 15
    } = { ...this.options, ...options };
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

  async _humanScroll(page) {
    const scrollStep = 200 + Math.random() * 300;
    let position = 0;
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    while (position < scrollHeight) {
      position += scrollStep;
      await page.evaluate((pos) => window.scrollTo(0, pos), position);
      await page.waitForTimeout(300 + Math.random() * 500);
    }
  }

  async _randomHumanAct(page) {
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
}

module.exports = Human;