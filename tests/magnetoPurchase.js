const assert = require('assert');
const puppeteer = require('puppeteer');
let browser;
let page;

before(async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 })
})

describe('Check Hoodies & Sweatshirts Products', () => {

  it('Navigate to "Hoodies & Sweatshirts"', async () => {
    await page.goto('https://magento.softwaretestingboard.com/');
    const title = await page.title();
    assert.equal(title, 'Home Page');

    await page.waitForSelector('button.fc-button.fc-cta-consent.fc-primary-button')
    await page.click('button.fc-button.fc-cta-consent.fc-primary-button');

    await page.waitForSelector('#ui-id-5')
    await page.hover('#ui-id-5');
    await page.hover('#ui-id-17');
    await page.click('#ui-id-20');

    await new Promise(resolve => setTimeout(resolve, 2000));
    const pageTitle = await page.$eval('.page-title > .base[data-ui-id="page-title-wrapper"]', span => span.textContent.trim());

    assert.strictEqual(pageTitle, "Hoodies & Sweatshirts", "Page title doesn't match expected");
  }).timeout(15000)

  it('Sort products alphabetically by name and Select the “Oslo Trek Hoodie” product', async () => {
    await page.waitForSelector('select.sorter-options');
    await page.select('select.sorter-options', 'name');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.click("xpath///img[@alt='Oslo Trek Hoodie']")
  }).timeout(10000)

  it('Check material and Add the “Oslo Trek Hoodie” to my cart with specific options', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const moreInformationTab = await page.$("xpath///a[@id='tab-label-additional-title']");
    if (moreInformationTab) {
      await moreInformationTab.scrollIntoView();

      await page.click("xpath///a[@id='tab-label-additional-title']");
    } else {
      console.error('More Information Tab not displayed');
    }

    const materialText = await page.$eval("xpath///td[normalize-space()='Nylon, Polyester, Organic Cotton']", element => element.textContent.trim());
    console.log("Product Material is " + materialText);
    assert(materialText.includes('Organic Cotton'), 'Material does not contain Organic Cotton');

  }).timeout(10000)


  it('Add the “Oslo Trek Hoodie” to my cart with specific options', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const sizeOption = await page.$("#option-label-size-143-item-168");
    if (sizeOption) {
      await sizeOption.scrollIntoView();

      await page.click("#option-label-size-143-item-168");
    } else {
      console.error('Size Options not displayed');
    }

    await page.click("#option-label-color-93-item-58");
    await page.click("#product-addtocart-button");

    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.click("xpath///a[@class='action showcart']");
  }).timeout(10000)


  it('Proceeding to checkout form', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.waitForSelector('#top-cart-btn-checkout');
    await page.click("xpath///span[@role='tab']");

    const colorOption = await page.$eval("xpath///span[normalize-space()='Red']", element => element.textContent.trim());
    console.log("Color: " + colorOption);
    assert(colorOption.includes('Red'), 'Color is not Red');

    const sizeOption = await page.$eval("xpath///span[normalize-space()='M']", element => element.textContent.trim());
    console.log("Size: " + sizeOption);
    assert(sizeOption.includes('M'), 'Size is not M');

    await page.click("xpath///button[@id='top-cart-btn-checkout']");

  }).timeout(10000)


  it('Fill out the checkout Forms', async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await page.waitForSelector("xpath///input[@name='username']");
    await page.focus("xpath///input[@name='username']");
    await page.type("xpath///input[@name='username']", 'test@test.com');
    await page.type("xpath///input[@name='firstname']", 'Amir');
    await page.type("xpath///input[@name='lastname']", 'Mahgoub');
    await page.type("xpath///input[@name='street[0]']", 'rue des rancy');
    await page.type("xpath///input[@name='city']", 'Lyon');
    await page.type("xpath///input[@name='postcode']", '69003');

    await new Promise(resolve => setTimeout(resolve, 3000));
    const nextButton = await page.$("xpath///button[@class='button action continue primary']");
    if (nextButton) {
      await nextButton.scrollIntoView();
      await new Promise(resolve => setTimeout(resolve, 3000));
      await page.select("select[name='country_id']", "FR");
      await page.type("xpath///input[@name='telephone']", '0758123843');
      await page.select("select[name='region_id']", "251");
    } else {
      console.error('Next Button not displayed');
    }
  }).timeout(10000)


  it('Fill out the Payment Forms and apply a discount coupon', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.click("xpath///button[@class='button action continue primary']");

    await page.waitForSelector('#customer-email-error');
    const errorMessageVisible = await page.evaluate(() => {
      const errorMessage = document.querySelector('#customer-email-error');
      const style = window.getComputedStyle(errorMessage);
      return style && style.display !== 'none';
    });
    const emailErrorMessage = await page.$eval('#customer-email-error', element => element.textContent.trim());
    console.log('Email is required and this is the error message:', emailErrorMessage)
    assert.strictEqual(emailErrorMessage, "This is a required field.", "Email Error message is incorrect");
    console.log('Is email error message displayed:', errorMessageVisible);


    await page.type("xpath///input[@name='username']", 'test@test.com');
    // await new Promise(resolve => setTimeout(resolve, 5000));
    const nextButton = await page.$("xpath///button[@class='button action continue primary']");
    if (nextButton) {
      await nextButton.scrollIntoView();
      // await new Promise(resolve => setTimeout(resolve, 2000));
      await page.click("xpath///button[@class='button action continue primary']");
    } else {
      console.error('Next Button not displayed');
    }

    await new Promise(resolve => setTimeout(resolve, 4000));

    await page.waitForSelector("xpath///span[contains(text(),'Apply Discount Code')]", { visible: true, timeout: 5000 });
    const applyDiscountButton = await page.$("xpath///span[contains(text(),'Apply Discount Code')]");
    if (applyDiscountButton) {
      await applyDiscountButton.scrollIntoView();
      // await new Promise(resolve => setTimeout(resolve, 2000));
      await page.click("xpath///span[contains(text(),'Apply Discount Code')]");
    } else {
      console.error('Apply Discount Button not displayed');
    }

    // await new Promise(resolve => setTimeout(resolve, 5000));
    await page.type("xpath///input[@id='discount-code']", "123");
    await page.click("xpath///button[@value='Apply Discount']");

    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('.message-error');
    // Check if the error message is displayed
    const discountErrorMessageVisible = await page.evaluate(() => {
      const errorMessage = document.querySelector('.message-error');
      const style = window.getComputedStyle(errorMessage);
      return style && style.display !== 'none';
    });
    const errorMessage = await page.$eval('.message-error', element => element.textContent.trim());
    console.log("Invalid Coupon alert error message:", errorMessage);
    assert.strictEqual(errorMessage, "The coupon code isn't valid. Verify the code and try again.", "Invalid Coupon alert message is incorrect");
    console.log('Is apply discount error message displayed:', discountErrorMessageVisible);

  }).timeout(10000)


  it('Successfully place the order and receive confirmation of the purchase', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.waitForSelector("xpath///button[@title='Place Order']");
    await page.click("xpath///button[@title='Place Order']")

    await new Promise(resolve => setTimeout(resolve, 4000));
    await page.waitForSelector('.page-title');
    const comfirmationMessage = await page.$eval('.page-title', element => element.textContent.trim());
    assert.strictEqual(comfirmationMessage, "Thank you for your purchase!", "Confirmation message is incorrect");
    console.log("Confirmation message of the purchase is:", comfirmationMessage);

  }).timeout(10000)


  it('Save a screenshot of the order confirmation page', async () => {
    await page.setViewport({ width: 1280, height: 800 })
    const timestamp = Date.now();
    // Define the file name with the timestamp 
    const screenshotPath = `confirmationScreenshots/purchaseConfirmed_${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

  }).timeout(10000)


  it('Continue shopping after completing my purchase', async () => {
    await page.waitForSelector('a.action.primary.continue');
    await page.click('a.action.primary.continue');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const title = await page.title();
    assert.equal(title, 'Home Page');

  }).timeout(10000)

})

after(async () => {
  await browser.close()
})
