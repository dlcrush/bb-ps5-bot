const jsdom = require("jsdom");
const {JSDOM } = jsdom;
const axios = require('axios');
const open = require('open');

//const url = 'https://www.bestbuy.com/site/searchpage.jsp?st=ps5+console&_dyncharset=UTF-8&_dynSessConf=&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys';
const url = 'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149';

async function run() {
    // const { data } = await axios({
    //     method: 'GET',
    //     url: url
    // });

    while(true) {

        let data = await getProductPage();

        while (! data) {
            await sleep(1000);
            data = await getProductPage();
        }

        const dom = new JSDOM(data, { includeNodeLocations: true, querySelector: true});

        const document = dom.window.document;
        //console.log('document', document);
        const button = await document.querySelector('.add-to-cart-button');
        //onsole.log('button', button.textContent);

        if (button && button.textContent !== 'Coming Soon') {
            console.log('its live!!!!');
            open(url);
            break;
        } else if (button && button.textContent === 'Coming Soon') {
            console.log('still coming soon...');
        }

        await sleep(1000);


    }

}

function sleep(ms) {
    return new Promise((resolve) => {
        console.log('sleep for 1 second');
      setTimeout(resolve, ms);
    });
}   

async function getProductPage() {

    console.log('checking product page...');

    try {
        const { data } = await axios({
            method: 'GET',
            url: url
        });

        return data;
    } catch(e) {
        console.log('page load error');
        return;
    }
}

run();