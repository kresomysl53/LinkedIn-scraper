// INITS.js

const fs    = require('fs');

class Browser {
  constructor(proxy_rotation = false, config_file = 'config.json') {
    this.proxy_rotation = proxy_rotation;
    const path          = require('path');
    const configPath    = path.join(__dirname, config_file);
    this.config         = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    this.chromium       = require('playwright').chromium;
  }
    
  async init() {
    if (!this.config.sessions || this.config.sessions.length === 0) {
      throw new Error('No proxy sessions configured');
    }
    await this._init();
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

    let selectedSession;
    if (sameValueSessions.length > 0) {
      const randomIndex = Math.floor(Math.random() * sameValueSessions.length);
      selectedSession = sameValueSessions[randomIndex];
    } else {
      selectedSession = lowestSession;
    }

    if (selectedSession.proxy.used) {
      selectedSession.proxy.used += 1;
    }
  
    return selectedSession;
  }

  async _init() {
    if (this.proxy_rotation) {
      const proxy = (await this._getRandomLowestSession(this.config.sessions)).proxy;
    }
    else {
      const proxy = this.config.sessions[0].proxy;
    }

    if (!proxy) {
      throw new Error('No valid proxy session found');
    }
     
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
  }

  async _loadStorageState(page, filename) {
    if (fs.existsSync(filename)) {
      const storageState = JSON.parse(fs.readFileSync(filename, 'utf-8'));
      await page.context.addCookies(storageState.cookies || []);
    }
  }
}


module.exports = Browser;
