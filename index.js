const express = require('express')
const geoip = require('geoip-lite')
const request = require('request-promise')
const hosts = require('./country.json')
const app = express()

app.use(express.json())
app.set('trust proxy', true)

app.all('/*', async (req, res, next) => {
    const { ip } = req
    const geo = geoip.lookup(ip)
    const hostURL = hosts[geo.country]
    const { url, method, body } = req
    const jwt = req.header('Authorization')
    const options = {
            method,
            uri: `${hostURL}${url}`,
            body,
            headers: {
                'Authorization': jwt
            },
            json: true
            
    }
    const response = await request(options)
    res.send(response)
})

app.listen(3000, () => console.log('proxy started'))