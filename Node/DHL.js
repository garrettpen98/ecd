const puppeteer = require('puppeteer');
const path = require('path');
const dhlPath = path.resolve('\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\DHL');

(async () => {
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage();
  await page.goto('https://mybill.dhl.com/login/');

  await page.type('#id_email','DSMCDAWMSDLxOnCall@MYNDSHFT.COM')
  await page.type('#id_password','Fall2016')
  await page.click('.button-proceed')
  await page.goto('https://mybill.dhl.com/search/');
  await page.type('#dateFrom-ui','08 Nov 2021')   
  await page.type('#dateTo-ui','14 Nov 2021') 

  await Promise.all([
    page.click('#submitbutton') ,
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);


   await page.waitForTimeout(1000)

   await page.evaluate(() => {
    document.querySelector('#select_all').click();
  });

  await page.click('#download_button_id') 

  await page.waitForSelector('#Express_csv2')
  await page.click('#Express_csv2') 
  await page.click('#Express_csv2concat') 

  await page.waitForTimeout(1000)
  await page.click('#submitbutton')

  await page.waitForTimeout(8000)

    //Specify Download Path
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: dhlPath 
    });

  await page.evaluate(() => {
    document.querySelector("body > div.main > div.clearfix.stdpad.wide_table_scroll.rtl-flex > div.grid2of3.stdpad > div.hasResults.borderTop.borderBottom > div.data-body > table > tbody > tr > td:nth-child(5) > span > a").click()
  });

  //await page.waitForSelector('a[href^="/downloads/download"]')
  //await page.click('a[href^="/downloads/download"]')

  await page.waitForTimeout(10000)

  page.goto('https://mybill.dhl.com/logout/')

  await page.waitForTimeout(4000)

  await browser.close();
})();

