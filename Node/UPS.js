const puppeteer = require('puppeteer');
const path = require('path');
const upsPath = path.resolve('\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\UPS');
const testPath = path.resolve('C:\\shipBillTest\\Input Files\\UPS')

let upsAccounts = ['073Y9W', '1Y7550', '533008', '9E7196'];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  //Navigate to login page and fill out credentials
  await page.goto('https://www.ups.com/one-to-one/login?returnto=https%3a//www.apps.ups.com/ebilling/sso.do%3fappid%3dEBILL%26loc%3den_US&reasonCode=-1&appid=EBILL');
  await page.click('.close_btn_thick')
  await page.type('#email','Richman13')
  await page.type('#pwd','Kimber-1965')
  await Promise.all([
    page.waitForNavigation(),
    await page.click('#submitBtn')
   ])

   //Once logged in to Archive History Page
   await Promise.all([
    page.waitForNavigation(),
    page.goto('https://www.apps.ups.com/ebilling/invoice/archiveHistorySearch.action?reportId=upsArchiveHistory&status=initial')
   ])

  //Clear pre-populated dates and insert user specified dates
  await page.evaluate( () => document.getElementsByName("fromStatementDate")[0].value = '') 
  await page.evaluate( () => document.getElementsByName("toStatementDate")[0].value = '')
  await page.type('input[name="fromStatementDate"]', '08/02/2021')
  await page.type('input[name="toStatementDate"]', '08/08/2021')

  //Select CSV for file format
  await page.select('#ez > form > div > div.mf > table:nth-child(5) > tbody > tr > td:nth-child(2) > select', 'csv')

  //35
   for (let i = 0; i < upsAccounts.length; i++) {
    
  //Select account number from dropdown
  await page.select('#acctNumber', upsAccounts[i])

  //Pause for 1 second for the button to load
  await page.waitForTimeout(1000)

  //Click search button
  await Promise.all([
   page.waitForNavigation(),
   await page.click('#archive')
  ])

   
  await page.click('input[name = "checkAll_0"]')

  //Specify Download Path
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: upsPath 
  });

  //Click Download
  await page.waitForSelector('#viewAndDownloadBtn')
  await page.click('#viewAndDownloadBtn')

  //Output Progress
  await console.log( 'UPS File ' + (i + 1) + ' Download complete.')
  }
  await page.waitForTimeout(5000)
  await browser.close();
})();

