const axios = require('axios');
const API_URL = 'https://api.star-citizen.wiki/api/'

//const content = document.getElementById('content');

function getCommLinks() {
    axios.get(API_URL + 'comm-links?limit=5&include=german').then(res => {
        const comm = res.data;
        console.log(comm)
        let head = document.createElement('h1')
        head.setAttribute('class', 'display-6')
        head.innerHTML = "Community News"
        content.appendChild(head)
        let row1 = document.createElement('div')
        row1.setAttribute('class', 'row')
        for (let i = 0; i < comm.data.length; i++) {
            let card = document.createElement('div')
            card.setAttribute('class', 'card m-2')
            card.setAttribute('style', 'width: 20rem;')
            let body = document.createElement('div')
            body.setAttribute('class', 'card-body')
            let img = document.createElement('img')
            img.setAttribute('src', comm.data[i].images.data[0].rsi_url)
            img.setAttribute('class', 'card-img-top img-fluid')
            card.appendChild(img)
            let headline = document.createElement('h5')
            headline.setAttribute('class', 'card-title')
            headline.innerHTML = comm.data[i].title
            body.appendChild(headline)
            let text = document.createElement('p')
            text.setAttribute('class', 'card-text')
            text.innerHTML = comm.data[i].series
            body.appendChild(text)
            let link = document.createElement('a')
            link.setAttribute('class', 'btn btn-primary')
            link.setAttribute('href', comm.data[i].rsi_url)
            link.setAttribute('target', '__blank')
            link.innerHTML = 'anzeigen'
            body.appendChild(link)
            card.appendChild(body)
            row1.appendChild(card)
        }
        content.appendChild(row1)
    })
}

function searchShip(term) {
    const body = document.getElementById('ship_search_body')
    body.innerHTML = null
    axios.post(API_URL + 'vehicles/search', {query: term}).then(res => {
        const data = res.data
        body.innerHTML = null

        for (let i = 0; i < data.data.length; i++) {
            let row = document.createElement('tr')
            let cell1 = row.insertCell()
            cell1.innerHTML = data.data[i].name
            let cell2 = row.insertCell()
            cell2.innerHTML = data.data[i].manufacturer.name
            let cell3 = row.insertCell()
            cell3.innerHTML = data.data[i].production_status.de_DE
            let cell4 = row.insertCell()
            cell4.innerHTML = '<button type="button" class="btn btn-sm btn-dark" onclick="getShipDetails(\'' + data.data[i].name + '\');">Details</button>'

            body.appendChild(row)
        }

    });
}

function getShipDetails(name) {
    console.log(name)
    axios.get(API_URL + 'vehicles/' +  name + '?locale=de_DE&include=shops.items').then(res => {
        console.log(res.data.data)
        const data = res.data.data
        const title = document.getElementById('ship_title')
        const ship_prices = document.getElementById('ship_prices')
        title.innerHTML = data.name
        const desc = document.getElementById('ship_desc')
        desc.innerHTML = data.description
        for (let i=0; i < data.shops.data.length; i++ ) {
            const col = document.createElement('div')
            col.setAttribute('class', 'col-xl-3 col-sm-6 mb-xl-0 mb-2')
            const card = document.createElement('div')
            card.setAttribute('class', 'card')
            const body = document.createElement('div')
            body.setAttribute('class', 'card-body')
            const card_title = document.createElement('p')
            card_title.setAttribute('class', 'card-title h5 d-block text-darker')
            card_title.innerHTML = data.shops.data[i].name_raw
            body.appendChild(card_title)
            if (data.shops.data[i].items.data[0].buyable) {
                const price = document.createElement('span')
                price.innerHTML = 'Kaufpreis: ' + data.shops.data[i].items.data[0].base_price
                body.appendChild(price)
            }
            if (data.shops.data[i].items.data[0].rentable) {
                const price = document.createElement('span')
                price.innerHTML = 'Mietpreis ab: ' + data.shops.data[i].items.data[0].rental_price_days[1]
                body.appendChild(price)
            }
            card.appendChild(body)
            col.appendChild(card)
            ship_prices.appendChild(col)
        }
    });
}

function autoload(element) {
    if (element.value.length >= 1) {
        searchShip(element.value)
    }
}
