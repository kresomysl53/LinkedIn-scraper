# LinkedIn Scraper

Playwright-based Node.js script for fast, reliable, and stealthy automation with optional proxy rotation

[![Playwright](https://img.shields.io/badge/Playwright-2E8B57?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Features

- Advanced human-like interaction (typing, mouse, scrolling, pauses)  
- LinkedIn job search automation with smart filters and dynamic selectors  
- Stealth & anti-detection (removes `navigator.webdriver`, user-agent spoofing, non-headless mode)  
- Network & session handling with HTTP proxy support (file-based)  

## Usage

1. Install dependencies:  
   ```bash
   npm install playwright
   ```

2. Configure proxies in `Proxy-list.txt` (one proxy per line, optional)

3. Ensure session file `linkedin_state.json` exists or is created on first run

4. Run scraper:  
   ```bash
   node linkedin.js
   ```

## Notes on Proxy Usage and Rotation

- Currently, proxy rotation is not implemented — so far, I haven’t been "muted," so I’m playing it safe by using a single proxy and one storage state to minimize the risk of upsetting LinkedIn’s anti-bot mechanisms.
- For higher speeds or large-scale scraping, proxy rotation would be necessary:  
- Rotate sessions by creating a new browser session per proxy  
- Rotate proxies globally across sessions  
- Managing this would require handling storage state separately for each session.  
- Use responsibly and comply with LinkedIn’s Terms of Service.

## TODO
- [ ] Finalize selectors for advanced job offer filtering

---

*Built with Playwright • Optimized for Stealth • Built on Earth, by Earth 🌍*