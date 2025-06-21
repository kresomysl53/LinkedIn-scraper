// SESSION_DATA.js



class Browser {
  constructor(config) {
    this.config = config;
    this.chromium = require('playwright').chromium;
    const fs            = require('fs');
    const path          = require('path');

    const configPath = path.join(__dirname, '../config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  }

  async init() {
    try {
      this.context = await this._init();
      console.log('Browser context initialized successfully');
    } catch (error) {
      console.error('Error initializing browser context:', error);
      throw error;
    }
  }

  async _getRandomLowestSession(sessions) {
    if (!sessions || sessions.length === 0) {
      throw new Error('No sessions available');
    }
    let lowestSession = sessions[0];
    let sameValueSessions = [];

    for (const session of sessions) {
      if (session.session_count < lowestSession.session_count) {
        lowestSession = session;
      }
      if (session.session_count === lowestSession.session_count) {
        sameValueSessions.push(session);
      }
    }
    //print all sessions in sameValueSessions
    for (const session of sameValueSessions) {
      console.log(`Session with the same count: ${session.session_count}`);
      console.log(`Session proxy: ${session.proxy}`);
      console.log(`Session storage state file: ${session.storage_state_file}`);
    }

    let selectedSession;
    if (sameValueSessions.length > 0) {
      const randomIndex = Math.floor(Math.random() * sameValueSessions.length);
      selectedSession = sameValueSessions[randomIndex];
      console.log(`Randomly selected session with the same count: ${selectedSession.session_count}`);
      console.log(`Randomly selected session: ${selectedSession.proxy}`);
      console.log(`Randomly selected session storage state file: ${selectedSession.storage_state_file}`);
    } else {
      selectedSession = lowestSession;
    }

    // Update the 'used' counter for the selected proxy/session
    if (!selectedSession.proxy.used) {
      selectedSession.proxy.used = 1;
    } else {
      selectedSession.proxy.used += 1;
    }
    console.log(`Proxy ${selectedSession.proxy.server} used ${selectedSession.proxy.used} times`);

    return selectedSession;
  }

  async _init() {
    const proxy = (await this._getRandomLowestSession(this.config.sessions)).proxy;
    console.log(`Using proxy: ${proxy.server}`);
    if (!proxy) {
      throw new Error('No valid proxy session found');}

      const browser = await this.chromium.launch({
      headless: false, 
      proxy:    {
        server:   proxy.server,
        username: proxy.username,
        password: proxy.password
      }
     });

    const context = await browser.newContext({
      userAgent,
      locale:       'en-US',
      viewport:     { width: 1920, height: 1080 },
      storageState: this.config.storageStateFile
    });

    await context.addInitScript(() => {
      window.navigator.chrome = { runtime: {} };
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined        });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en']  });
      Object.defineProperty(navigator, 'plugins',   { get: () => [1, 2, 3, 4, 5]  });
    });
    return context;
  }

  async _saveStorageState(page, filename) {
    const storageState = await page.context.storageState();
    fs.writeFileSync(filename, JSON.stringify(storageState, null, 2));
    console.log(`Storage state saved to ${filename}`);
  }

  async _loadStorageState(page, filename) {
    if (fs.existsSync(filename)) {
      const storageState = JSON.parse(fs.readFileSync(filename, 'utf-8'));
      await page.context.addCookies(storageState.cookies || []);
      //import storageState data - localStorage, sessionStorage, etc.
      console.log(`Storage state loaded from ${filename}`);
    }
  }
}


module.exports = Browser;
