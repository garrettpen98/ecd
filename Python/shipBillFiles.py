import os, shutil
import datetime as dt
from os import walk
from shutil import copy
import subprocess

REPORTS = '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\5-Reporting'
buildNewReports = '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\3-Build_New'
reportsArchive = '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\6-History'
balanceReport = '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\BalanceReports'
today = dt.datetime.now().date()
cmdList = ['C:\\localShipBill\\CommandsAndReports\\R1-Balance_After_New_Markup.cmd', 'C:\\localShipBill\\CommandsAndReports\\R2-ShipBill_Invoice_Summary_Report.cmd', 'C:\\localShipBill\\CommandsAndReports\\R3-Info_For_Dashboard.cmd', 'C:\\localShipBill\\CommandsAndReports\\R4-SmartPost_Invoice_summary.cmd', 'C:\\localShipBill\\CommandsAndReports\\R5-Totals_by_invoice_client_report.cmd', 'C:\\localShipBill\\CommandsAndReports\\R7-Shipbill_MYNDSHFT_Summary_Report.cmd']
inputFilesList = ['\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\UPS', '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\FedEx', '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\DHL']
days = dt.timedelta(3)
#######################################################################################
#Function to move files Param 1 is the current directory, Param 2 is the destination
def archiveMove(home, destination):
    for file in os.listdir(home):
        filetime = dt.datetime.fromtimestamp(os.path.getctime(home + '\\' + file))
        if filetime.date() >= today - days and os.path.isdir(os.path.join(home , file)) == False:
            shutil.move(home + '\\' + file, destination + '\\' + date);

#Function to copy files Param 1 is the current directory, Param 2 is the destination
def archiveCopy(home, destination):
    for file in os.listdir(home):
        filetime = dt.datetime.fromtimestamp(os.path.getctime(home + '\\' + file))
        if filetime.date() >= today - days:
            copy(home + '\\' + file, destination + '\\' + date);

########################################################################################
print('Please enter last Sundays date.')
date = input()

#Make dated folder in history folder
os.makedirs(reportsArchive + '\\' + date)


#Get file names and move to archive directory (INPUT FILES)
for file in inputFilesList:
    os.makedirs(file + '\\PRC\\' + date)

y=0
for file in inputFilesList:
    FileNames = next(walk(inputFilesList[y]), (None, None, []))[2] 
    for x in FileNames:
        shutil.move(file + '\\' + x, file + '\\PRC\\' + date)
    y+=1

#Archive BuildNew Reports
archiveMove(buildNewReports, reportsArchive)

#Archive balance report
archiveCopy(balanceReport, reportsArchive)

#Run .cmd's to ouput reports
for cmd in range(0,len(cmdList)):
    subprocess.call(cmdList[cmd])

#Archive shipbill reports
archiveCopy(REPORTS, reportsArchive)

#Make archive directory for this weeks files
os.makedirs(REPORTS + '\\' + date) 

#Put current week files into folder
archiveMove(REPORTS, REPORTS)


