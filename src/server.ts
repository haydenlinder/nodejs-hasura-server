import express from "express"
import parser from 'body-parser'
import { accessControlHeaders, cookieParser, headers, logger } from './utils/middlewares'

const { PORT } = process.env

const api = express()

api.use(parser.json(), headers, cookieParser, accessControlHeaders)

api.post('/:route', logger, async (req, res) => {
    try {
        const handler = require(`./routes/${req.params.route}`).default
        return await handler(req, res);
    } catch (errors) {
        console.error({errors})
        return res.json({errors});
    }
});

api.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
