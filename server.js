const express = require('express')
const parser = require('body-parser')

const { PORT } = process.env

const api = express()

api.use(parser.json())
api.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Accept, Authorization, Origin")
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000", "http://host.docker.internal:3000")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Credentials", true)
    next()
})

const cookieParser = (req, _, next) => {
    req.cookies = {}
    console.log(req.headers)
    if (!req.headers.cookie) return next()
    const ar = req.headers.cookie.split(';')
    ar.forEach(cookie => {
        const tup = cookie.split('=')
        req.cookies[tup[0].trim()] = tup[1].trim()
    })
    console.log(req.cookies)
    next()
}

const logger = (req, _, next) => {
    console.log(`
        PROCESSING ${req.method} to /${req.params.route}\n
        params: ${JSON.stringify(req.params)}\n
        query: ${JSON.stringify(req.query)}\n
        body: ${JSON.stringify(req.body)}\n
    `)
    next()
}

api.post('/:route', logger, cookieParser, async (req, res) => {
    try {
        const handler = require(`./routes/${req.params.route}`)
        return await handler(req, res);
    } catch (errors) {
        console.error({errors})
        return res.json({errors});
    }
});

api.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})