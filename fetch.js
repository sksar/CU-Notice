const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const download = require('download');
const crypto = require('crypto');
const hash = (str) => crypto.createHash('sha256').update(str).digest('hex');

const NOTICES = [];
const LOCAL_NOTICES = [];

fs.readdirSync('./notices/').forEach(file => {
    if (file.substr(0, 1) != '.') {
        let path = './notices/' + file;
        if (fs.lstatSync(path).isFile()) {
            LOCAL_NOTICES[hash(file)] = true;
        }
    }
});

async function MAIN() {

    // FETCH FROM URL
    let result = await fetch('https://cuexam.net/exam-notice.php');

    // LOAD IN PARSER
    const $ = cheerio.load(await result.text());

    // GET
    $('table.embeddedTable table tr').each((index, element) => {
        if (index) {
            // Extract information about each notice from tr (element)
            let TITLE = $(element).find('a').text();
            let URL = encodeURI(`https://cuexam.net/` + $(element).find('a').attr('href')); // TODO: improve for robustness
            let DATE = $(element).find('td:nth-child(3) span').text();
            let HASH = hash(URL.split('/').pop()); // Extract file name from URL and Hash only the file name

            if (index > 3) return false;
            NOTICES.push({ TITLE, URL, DATE, HASH });
        }
    });

    // Check if exists in local, else  download file
    NOTICES.map(async (notice) => {
        if (!LOCAL_NOTICES[notice.HASH]) {
            await download(notice.URL, __dirname + '/notices');
            console.log('Downloaded ', notice.TITLE);
        }
    });

}

MAIN();



