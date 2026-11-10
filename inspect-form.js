const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://keralaproperty.in/member/register/', { 
    waitUntil: 'domcontentloaded', 
    timeout: 45000 
  });

  // Get all form elements
  const formInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, select, textarea, button'));
    return inputs.map(el => ({
      tag: el.tagName,
      type: el.type || '',
      name: el.name || '',
      id: el.id || '',
      placeholder: el.placeholder || '',
      visible: el.offsetParent !== null,
      options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text })) : []
    }));
  });
  
  console.log('=== FORM ELEMENTS BEFORE DROPDOWN SELECTION ===');
  console.log(JSON.stringify(formInfo, null, 2));
  
  // Try to find and interact with the dropdown
  const selects = await page.$$('select');
  console.log(`\nFound ${selects.length} select elements`);
  
  if (selects.length > 0) {
    // Select 'Builder' option if exists, else just pick first option that isn't empty
    const selectInfo = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      return selects.map(s => ({
        name: s.name,
        id: s.id,
        options: Array.from(s.options).map(o => ({ value: o.value, text: o.text }))
      }));
    });
    console.log('\n=== SELECT DETAILS ===');
    console.log(JSON.stringify(selectInfo, null, 2));
    
    // Find and select Builder option
    for (const sel of selectInfo) {
      const builderOpt = sel.options.find(o => o.text.toLowerCase().includes('builder'));
      if (builderOpt) {
        const selector = sel.name ? `select[name="${sel.name}"]` : `select#${sel.id}`;
        await page.selectOption(selector, { label: builderOpt.text.trim() });
        console.log(`\nSelected option: ${builderOpt.text} from ${selector}`);
        break;
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Get form elements AFTER dropdown selection
    const formInfoAfter = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea, button'));
      return inputs.map(el => ({
        tag: el.tagName,
        type: el.type || '',
        name: el.name || '',
        id: el.id || '',
        placeholder: el.placeholder || '',
        visible: el.offsetParent !== null,
        options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text })) : []
      }));
    });
    
    console.log('\n=== FORM ELEMENTS AFTER DROPDOWN SELECTION ===');
    console.log(JSON.stringify(formInfoAfter, null, 2));
  }
  
  await browser.close();
})();

