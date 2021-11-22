const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const readline = require('readline') 
const { resolve } = require('path')
const ups = '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\UPS'
const dhl = '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\DHL'
const fedex = "\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\FedEx"
let i = 1
let j = 1

//Renames FedEx Files
function FedExReName()
{
    //Read in FedEx Directory
    const dirents = fs.readdirSync(fedex, {
        withFileTypes: true
    });

    //Filter out files and folders that are not wanted
    const filesNames = dirents
        .filter(dirent => dirent.isFile() &&
            !dirent.name.startsWith('Thumbs') &&
            !dirent.name.startsWith('PRC'))
        .map(dirent => dirent.name);

    //Start Async function to loop through files
    for (let k = 0; k < filesNames.length; k++) {
        
        //If file contains 'flatFile' it will be freight
        if (filesNames[k].indexOf('flatfile') > -1) {
            
            //Rename to standard name
            fs.rename(fedex + '\\' + filesNames[k], fedex + '\\' + 'FXFE_INPUT_FILE_' + i + '.txt', (err) => {
                if (err)
                    throw err
            })
            
            //Increment file number
            i = i + 1
            
        }
        //If the file is not freight
         else if (filesNames[k] != 'PRC') {
            //Rename to standard name
            fs.rename(fedex + '\\' + filesNames[k], fedex + '\\' + 'FEDEX_INPUT_FILE_' + j + '.txt', (err) => {
                if (err)
                    throw err
            })

            //Increment file number
            j = j + 1
        
        }
    }
}

//Outputs line counts
function FedExCount ()
{
    let extracts = []
    let fedexTotal = 0

    fs.readdirSync(fedex).forEach(file => 
        {
            if(file.startsWith('FEDEX'))
            {
                extracts.push(file)
            }
        })

    for (let i = 0; i < extracts.length; i++) 
    {
        let data = fs.readFileSync(fedex +'\\' + extracts[i]).toString();
        fedexTotal += data.split('\n').length

    }
    let headers = extracts.length
    console.log('Total for FedEx files is ' + (fedexTotal - headers*2));
}

function fxfeCount ()
{
    let extracts = []
    let fxfeTotal = 0

    fs.readdirSync(fedex).forEach(file => 
        {
            if(file.startsWith('FXFE'))
            {
                extracts.push(file)
            }
        })

    for (let i = 0; i < extracts.length; i++) 
    {
        let data = fs.readFileSync(fedex +'\\' + extracts[i]).toString();
        fxfeTotal += data.split('\n').length
    }

    let headers = extracts.length
    console.log('Total for FXFE files is ' + (fxfeTotal - headers*2));
}

//Extracts zip files
function dhlExtract()
{ 
    let extracts = []
        fs.readdirSync(dhl).forEach(file => {
            if(file.endsWith('.zip'))
            {
                extracts.push(file)
            }
        })
            for (let g = 0; g < extracts.length; g++) 
            {
                fs.createReadStream(dhl + '\\' + extracts[g])
                .pipe(unzipper.Extract({ path: dhl}))
                .on('entry', entry => entry.autodrain(resolve()))
            }
}

//Renames extracted file
function DHLRename()
{
        fs.rename(dhl + '\\DHLUS_TD_concatenated.csv', dhl + '\\DHL_INPUT_FILE.txt', (err) => 
        { 
            if (err) 
            { 
                console.log('DHL error!')
            } 
        })
}

//Counts lines in file then outputs to console for balance sheet
function dhlLineCount()
{

let linesCount = 0
let rl = readline.createInterface({
    input: fs.createReadStream(dhl + '\\DHL_INPUT_FILE.txt'),
    output: process.stdout,
    terminal: false
})
//Incrememnt linesCount variable for each line break in file
rl.on('line', function (line) {
    linesCount++ // on each linebreak, add +1 to 'linesCount'
})
//When Completed console.log the file name and the number of lines
rl.on('close', function () {
    console.log('Total for DHL files is ' + (linesCount - 1) )
}) // print the result when the 'close' event is called
}

//Begin UPS

//Extracts zip files
function upsExtract()
{ 
    let extracts = []
        fs.readdirSync(ups).forEach(file => {
            if(file.endsWith('.zip'))
            {
                extracts.push(file)
            }
        })
            for (let g = 0; g < extracts.length; g++) 
            {
                fs.createReadStream(ups + '\\' + extracts[g])
                .pipe(unzipper.Extract({ path: '\\\\usdmccrm102\\shared\\ApplicationDelivery\\ShipBill\\1-Input_Files\\UPS'}))
                .on('entry', entry => entry.autodrain(resolve()))      
            }
}

function UPSRename()
{
    let extracts = []
        fs.readdirSync(ups).forEach(file => 
        {
            if(file.endsWith('.csv'))
            {
                extracts.push(file)
            }
        })
        for (let i = 0; i < extracts.length; i++) 
        {
            fs.rename(ups + '\\' + String(extracts[i]), ups + '\\ups_INPUT_FILE_' + String([i]) + '.txt', (err) => 
            { 
                if (err) 
                { 
                    console.log('ups error!')
                } 
            })
        }
}

function upsCount ()
{
    let extracts = []
    let upsTotal = 0

    fs.readdirSync(ups).forEach(file => 
        {
            if(file.endsWith('.txt'))
            {
                extracts.push(file)
            }
        })

        for (let i = 0; i < extracts.length; i++) 
        {
            let data = fs.readFileSync(ups +'\\' + extracts[i]).toString();
            upsTotal += data.split('\n').length
            }
        let headers = extracts.length
        console.log('Total for UPS files is ' + (upsTotal - headers));

}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const FedExasync = async ()=> 
{ 
    await FedExReName();
    await timeout(1000);
    await FedExCount();
    await fxfeCount ();
}

const DHLasync = async ()=> 
{ 
    await dhlExtract();
    await timeout(1000);
    await DHLRename();
    await timeout(1000);
    await dhlLineCount();
}

const upsasync = async ()=> 
{ 
    await upsExtract();
    await timeout(1000);
    await UPSRename();
    await timeout(1000);
    await upsCount();
}

const runAll = async ()=>
{
    await FedExasync();
    await DHLasync();
    await upsasync(); 
}

runAll();