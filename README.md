# Job server Scraper

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
## Disclaimer & Ethical Use Notice

> This tool is provided **for educational and research purposes only**.  
> It is not intended for use in violation of any platform’s Terms of Service, including (but not limited to) automated data collection from websites like LinkedIn.

By using this tool, you acknowledge that:

- You are solely responsible for how you use it.  
- The author **does not condone scraping private or protected data**.  
- Any misuse, such as evading access controls, breaching terms, or violating data privacy laws, is entirely at the discretion and risk of the user.  
- **The author assumes no liability** for damages or legal issues resulting from improper or unauthorized use.

Always respect platforms, people, and data boundaries. If you're unsure, **don’t run it**.
