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
            img.setAttribute('class', 'card-img-top')
            body.appendChild(img)
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
            card.appendChild(body )
            row1.appendChild(card)
        }
        content.appendChild(row1)
    })
}