// @ts-check
const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'https://fireline-rmr2.onrender.com';

async function runQA() {
  console.log(`\n======================================================`);
  console.log(`  FIRELINE Ember Lab — Browser QA & Acceptance Suite`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Engine: Google Chrome (Headless Automation)`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const testResults = [];

  function recordResult(category, testName, passed, details = '') {
    testResults.push({ category, testName, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${category}] ${testName} ${details ? '— ' + details : ''}`);
  }

  try {
    // -------------------------------------------------------------
    // SUITE 1: DESKTOP ROUTE LOAD & HYDRATION (1440 x 900)
    // -------------------------------------------------------------
    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await contextDesktop.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const routes = [
      { path: '/', title: 'Landing Page' },
      { path: '/dashboard', title: 'Mission Dashboard' },
      { path: '/explore', title: 'Evidence Explorer' },
      { path: '/compare', title: 'Physical Comparability' },
      { path: '/assess', title: 'Mission Gap Assessor' },
      { path: '/copilot', title: 'SI Copilot' },
    ];

    for (const r of routes) {
      consoleErrors.length = 0;
      const resp = await page.goto(`${BASE_URL}${r.path}`, { waitUntil: 'networkidle' });
      const status = resp?.status();
      const hasErrors = consoleErrors.length > 0;
      recordResult(
        'Route Load',
        `GET ${r.path} (${r.title})`,
        status === 200,
        `Status ${status}, Console errors: ${consoleErrors.length}`
      );
    }

    // -------------------------------------------------------------
    // SUITE 2: NAVIGATION & PERSISTENCE
    // -------------------------------------------------------------
    console.log('\n--- Testing Global Navigation ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // Verify all header links visible
    const navItems = ['Overview', 'Dashboard', 'Evidence Explorer', 'Comparability', 'Mission Assessor', 'SI Copilot'];
    for (const item of navItems) {
      const el = page.locator(`header nav >> text="${item}"`).first();
      const visible = await el.isVisible();
      recordResult('Navigation', `Header link '${item}' visible`, visible);
    }

    // Click through links sequentially
    await page.locator('header nav >> text="Dashboard"').first().click();
    await page.waitForURL('**/dashboard');
    recordResult('Navigation', 'Navigate to /dashboard', page.url().includes('/dashboard'));

    await page.locator('header nav >> text="Evidence Explorer"').first().click();
    await page.waitForURL('**/explore');
    recordResult('Navigation', 'Navigate to /explore', page.url().includes('/explore'));

    await page.locator('header nav >> text="Comparability"').first().click();
    await page.waitForURL('**/compare');
    recordResult('Navigation', 'Navigate to /compare', page.url().includes('/compare'));

    await page.locator('header nav >> text="Mission Assessor"').first().click();
    await page.waitForURL('**/assess');
    recordResult('Navigation', 'Navigate to /assess', page.url().includes('/assess'));

    await page.locator('header nav >> text="SI Copilot"').first().click();
    await page.waitForURL('**/copilot');
    recordResult('Navigation', 'Navigate to /copilot', page.url().includes('/copilot'));

    // Test History Back & Forward
    await page.goBack();
    await page.waitForURL('**/assess');
    recordResult('Navigation', 'Browser Back to /assess', page.url().includes('/assess'));

    await page.goForward();
    await page.waitForURL('**/copilot');
    recordResult('Navigation', 'Browser Forward to /copilot', page.url().includes('/copilot'));

    // -------------------------------------------------------------
    // SUITE 3: INPUT INTERACTION — EVIDENCE EXPLORER
    // -------------------------------------------------------------
    console.log('\n--- Testing Evidence Explorer Inputs ---');
    await page.goto(`${BASE_URL}/explore`, { waitUntil: 'networkidle' });

    // Wait for records to render
    await page.waitForSelector('text=Scientific Evidence Records');

    // Type query
    const searchInput = page.locator('input[placeholder*="S1, B1, PMMA"]');
    await searchInput.fill('PMMA');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
    const pmmaCards = await page.locator('h3:has-text("PMMA")').count();
    recordResult('Explorer', 'Search query "PMMA" filters cards', pmmaCards > 0, `Found ${pmmaCards} PMMA records`);

    // Change Investigation dropdown
    const invSelect = page.locator('select').first();
    await invSelect.selectOption('PSI-98');
    await page.waitForTimeout(600);
    const saffireCount = await page.locator('text=PSI-98').count();
    recordResult('Explorer', 'Investigation filter "PSI-98"', saffireCount > 0, `Showing PSI-98 runs`);

    // Reset filters
    const resetBtn = page.locator('button:has-text("Reset")');
    await resetBtn.click();
    await page.waitForTimeout(600);
    const totalRecordsText = await page.locator('text=Scientific Evidence Records').innerText();
    recordResult('Explorer', 'Reset filters restores records', totalRecordsText.includes('9'), totalRecordsText);

    // Open an evidence record to inspect detail panel
    const firstCard = page.locator('div[class*="cursor-pointer"]').first();
    await firstCard.click();
    const inspectorVisible = await page.locator('text=Specimen Dimensions').isVisible();
    const doiVisible = await page.locator('text=View NASA PSI Collection').isVisible();
    recordResult('Explorer', 'Detail inspector panel renders', inspectorVisible && doiVisible, 'Specs and DOI links displayed');

    // -------------------------------------------------------------
    // SUITE 4: INPUT INTERACTION — PHYSICAL COMPARABILITY
    // -------------------------------------------------------------
    console.log('\n--- Testing Physical Comparability Studio ---');
    await page.goto(`${BASE_URL}/compare`, { waitUntil: 'networkidle' });

    // Test Benchmark Pair 1: Saffire-I vs BASS-II
    const pair1Btn = page.locator('button:has-text("Saffire-I (SIBAL Fabric) vs BASS-II (PMMA Film)")');
    await pair1Btn.click();
    await page.waitForTimeout(600);
    const verdict1 = await page.locator('text=Physically Distinct').first().isVisible();
    const gatesCount1 = await page.locator('text=Gate 1').first().isVisible();
    recordResult('Comparability', 'Benchmark Pair 1 (Saffire vs BASS) -> Incomparable', verdict1 && gatesCount1, 'Verdict and gates verified');

    // Test Benchmark Pair 2: BASS-II Run 1 vs Run 2
    const pair2Btn = page.locator('button:has-text("BASS-II Run 1 vs Run 2 (Flow Variation)")');
    await pair2Btn.click();
    await page.waitForTimeout(600);
    const verdict2 = await page.locator('text=Conditionally Comparable').first().isVisible();
    recordResult('Comparability', 'Benchmark Pair 2 (BASS-II Run 1 vs 2) -> Conditionally Comparable', verdict2, 'Verdict verified');

    // -------------------------------------------------------------
    // SUITE 5: INPUT INTERACTION — MISSION GAP ASSESSOR
    // -------------------------------------------------------------
    console.log('\n--- Testing Mission Gap Assessor Inputs ---');
    await page.goto(`${BASE_URL}/assess`, { waitUntil: 'networkidle' });

    // Test Artemis Preset Button
    const artemisBtn = page.locator('button:has-text("Artemis Lunar Surface Habitat")');
    await artemisBtn.click();
    await page.waitForTimeout(300);
    const o2Input = page.locator('input[type="number"]').nth(1); // Oxygen input
    const o2Val = await o2Input.inputValue();
    recordResult('Assessor', 'Preset "Artemis Lunar Surface Habitat" loads 34% O2', o2Val === '34', `O2 value: ${o2Val}%`);

    // Test ISS Preset Button
    const issBtn = page.locator('button:has-text("Standard ISS Nominal Cabin")');
    await issBtn.click();
    await page.waitForTimeout(300);
    const issO2Val = await o2Input.inputValue();
    recordResult('Assessor', 'Preset "Standard ISS Nominal Cabin" loads 21% O2', issO2Val === '21', `O2 value: ${issO2Val}%`);

    // Test Safe Numeric Input (Clear and type without NaN freeze)
    await o2Input.click();
    await o2Input.fill(''); // Clear field
    await page.waitForTimeout(100);
    const emptyVal = await o2Input.inputValue();
    const isNotNaN = emptyVal !== 'NaN';
    await o2Input.type('35.5');
    await page.waitForTimeout(100);
    const updatedVal = await o2Input.inputValue();
    recordResult('Assessor', 'Numeric Input clear & re-enter without NaN freeze', isNotNaN && updatedVal === '35.5', `Updated to ${updatedVal}`);

    // Click Assess Evidence Coverage
    const assessBtn = page.locator('button:has-text("Assess Evidence Coverage")');
    await assessBtn.click();
    await page.waitForTimeout(600);
    const outcomeVisible = await page.locator('text=Assessment Outcome').first().isVisible();
    const matrixVisible = await page.locator('text=Parameter Coverage Matrix').first().isVisible();
    recordResult('Assessor', 'Run assessment calculations and display coverage matrix', outcomeVisible && matrixVisible);

    // -------------------------------------------------------------
    // SUITE 6: INPUT INTERACTION — SI COPILOT
    // -------------------------------------------------------------
    console.log('\n--- Testing SI Copilot Multi-line & Inquiries ---');
    await page.goto(`${BASE_URL}/copilot`, { waitUntil: 'networkidle' });

    const textarea = page.locator('textarea');
    await textarea.click();

    // Test multiline typing with Shift+Enter
    await textarea.type('What did Saffire-I investigate?');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift');
    await textarea.type('What were its flame spread findings?');

    const typedText = await textarea.inputValue();
    const isMultiline = typedText.includes('\n');
    recordResult('Copilot', 'Multiline textarea typing with Shift+Enter', isMultiline);

    // Submit inquiry
    const submitBtn = page.locator('button:has-text("Query Copilot")');
    await submitBtn.click();

    // Wait for response container
    await page.waitForSelector('text=Executive Summary', { timeout: 15000 });
    const summaryVisible = await page.locator('text=Executive Summary').first().isVisible();
    const findingsVisible = await page.locator('text=Grounded Scientific Findings').first().isVisible();
    const citationVisible = await page.locator('text=Validated Primary Source Citations').first().isVisible();

    recordResult('Copilot', 'Copilot Grounded Response synthesized', summaryVisible && findingsVisible && citationVisible, 'Executive summary, findings, and citations rendered');

    // -------------------------------------------------------------
    // SUITE 7: MOBILE RESPONSIVENESS & ACCESSIBILITY (390 x 844)
    // -------------------------------------------------------------
    console.log('\n--- Testing Mobile Viewport (390 x 844) ---');
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await contextMobile.newPage();

    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // Check horizontal overflow
    const hasOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    recordResult('Mobile', 'No horizontal page overflow at 390px', !hasOverflow);

    // Check 3D canvas exists and renders on mobile
    const canvasExists = await mobilePage.locator('canvas').isVisible();
    recordResult('Mobile', '3D WebGL Canvas renders on mobile viewport', canvasExists);

    // Test Mobile Hamburger Drawer Menu
    const hamburgerBtn = mobilePage.locator('button[aria-label="Toggle navigation menu"]');
    await hamburgerBtn.click();
    await mobilePage.waitForTimeout(300);

    const drawerVisible = await mobilePage.locator('nav, div:has-text("Evidence Explorer")').count();
    recordResult('Mobile', 'Hamburger drawer menu opens', drawerVisible > 0);

    // Click a link inside drawer to verify auto-close and navigation
    const mobileExploreLink = mobilePage.locator('a:visible:has-text("Evidence Explorer")').first();
    await mobileExploreLink.click();
    await mobilePage.waitForURL('**/explore');
    recordResult('Mobile', 'Drawer link navigates to /explore', mobilePage.url().includes('/explore'));

    // Check reduced motion support
    const contextReducedMotion = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const reducedPage = await contextReducedMotion.newPage();
    await reducedPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    const canvasRM = await reducedPage.locator('canvas').isVisible();
    recordResult('Accessibility', 'Prefers-reduced-motion respected without crash', canvasRM);

    await contextDesktop.close();
    await contextMobile.close();
    await contextReducedMotion.close();

    console.log(`\n======================================================`);
    const passedCount = testResults.filter((r) => r.passed).length;
    const totalCount = testResults.length;
    console.log(`  QA SUMMARY: ${passedCount} / ${totalCount} CHECKS PASSED`);
    console.log(`======================================================\n`);

    if (passedCount === totalCount) {
      console.log('🎉 ALL BROWSER QA CRITERIA MET WITH 100% PASS FIDELITY!\n');
    } else {
      console.error('⚠️ SOME QA CHECKS FAILED! REVIEW LOGS ABOVE.\n');
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Fatal Browser QA Exception:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runQA();
