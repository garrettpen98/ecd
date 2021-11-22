const puppeteer = require('puppeteer');
const path = require('path');
const fedexPath = path.resolve('\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\FedEx');

(async () => {
  const browser = await puppeteer.launch({ headless: true, slowMo: 250 });
  const page = await browser.newPage();
  await page.goto('https://www.ec.fedex.com/fedexnet/Login.jsp');

  await page.type('input[name = "UserID"]','MYNDSHFT')
  await page.type('input[name = "Password"]','n30JPWgCWL')

  await page.click('input[name = "Submit"]')

  await page.goto('https://www.ec.fedex.com/fedexnet/RcvDocFilterFrameSet.jsp?My_Function=null&ScreenCode=LB000',
  {
  timeout: 15000,
  waitUntil: 'domcontentloaded'
  })

      await page.waitForTimeout(1000)

      /*const topFrameHandle = await page.$('frame[name = "topFrame"]');
      const topFrame = await topFrameHandle.contentFrame();
      await topFrame.select('select[name="lstDOC_STATE"]', 'EXTRACTED')*/

      //await page.waitForTimeout(1000)

      const BottomframeHandle = await page.$('frame[name = "bottomFrame"]');
      const BottomFrame = await BottomframeHandle.contentFrame();
      await BottomFrame.click('input[name = "btnOK"]')

      await page.waitForTimeout(1000)

      const topFrameHandle2 = await page.$('frame[name = "topFrame"]');
      const topFrame2 = await topFrameHandle2.contentFrame();

      const BottomframeHandle2 = await page.$('frame[name = "bottomFrame"]');
      const BottomFrame2 = await BottomframeHandle2.contentFrame();
      
      
      await page.waitForTimeout(1000)

      const nbrOfButtons = (await topFrame2.$$('[name="rdoSelection"]')).length

      await page.waitForTimeout(3000)

      for (let i = 0; i < nbrOfButtons; i++) 
      {
        await page._client.send('Page.setDownloadBehavior', {
          behavior: 'allow',
          downloadPath: fedexPath 
        });

        await topFrame2.click('[name="rdoSelection"][value="' + i +'"]')
        await BottomFrame2.click('input[name = "btnDOWNLOAD"]')
        await page.waitForTimeout(3000)
      }
      await browser.close();
})();




