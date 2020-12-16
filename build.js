const fetch = require('node-fetch');
const cheerio = require('cheerio');

const NOTICES = [];

async function MAIN() {
    
    // FETCH FROM URL
    let result = await fetch('https://cuexam.net/exam-notice.php');

    // LOAD IN PARSER (MINI-WEB_BROWSER)
    const $ = cheerio.load(await result.text());

    // GET
    $('table.embeddedTable table tr').each((index, element) => {
        let TITLE = $(element).find('a').text();
        let URL = $(element).find('a').attr('href');
        let DATE = $(element).find('td:nth-child(3) span').text();

        // TODO: Modify to get latest date wise, not first 10
        if (index > 10) return false;
        if (index) NOTICES.push({ TITLE, URL, DATE });
    });

}


// TODO: Fetch Files & Generate HTML

