STEP 0
	Verify Chrome location: cd C:\Program Files\Google\Chrome\Application\chrome.exe
	install node.js (LTS x64 version) if not installed 
	check install with cmd node --version 

STEP 1 - SCRAPER
	cd C:\Users\Steve\Documents\Claude\Projects\Scrape and Test
	pip install -r requirements.txt
	playwright install chromium
	python ScraperTool.py --url [https://www.demoblaze.com/] --project [MyProject]

	While it's running
	Action				What happens
	Browse normally			Every page navigation auto-captures the live DOM
	Press F9			Manual snapshot — captures the current state (modal open, form errors, etc.)
	Press Ctrl+C in terminal	Stops the scraper gracefully


STEP 2 - TEST DESIGN 
	specify some tests in a notepad doc
        ask Claude to turn these into a tests.md and save these in a folder called Design

STEP 3 - AI BUILD - 
	everything = Build the automation for [myproject]
	one at a time = rebuild Page Object Model; rebuild functions; rebuild framework; rebuild tests

STEP 4 - Execution
	npm install
	npx playwright install
	npx playwright test

STEP 5 - Maintenance
	If something fails, describe failure to Claude and ask for fix.

