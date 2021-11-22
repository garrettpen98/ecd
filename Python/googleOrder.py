#! python3
#Opens several Google search results.
import requests, sys, webbrowser, bs4 as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
import time

#Initialize Browser Driver
options = Options()
options.headless = True
options.binary_location = 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
service = Service('C:\\Users\\garrettp\Downloads\\geckodriver-v0.30.0-win64\\geckodriver.exe')
driver = webdriver.Firefox(options=options, service = service)

test = driver.get("https://store.google.com/orderdetails/GS.5110-1699-6311?pli=1&hl=en-US")

    
    # wait for the page to load
time.sleep(5)

    # get the page source
page_source = driver.page_source

driver.close()

    # parse the HTML
soup = bs.BeautifulSoup(page_source, "html.parser")

theDate = soup.select('.lWU4oe > div:nth-child(2)')

print(soup.select('.lWU4oe > div:nth-child(2)'))

print(theDate)

