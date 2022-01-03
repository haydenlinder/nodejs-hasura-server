import express from "express"
import { json } from 'body-parser'
import { accessControlHeaders, cookieParser, headers, logger } from './utils/middlewares'

const { PORT } = process.env

const api = express()

api.use(json(), headers, cookieParser, accessControlHeaders)

api.post('/:route', logger, async (req, res) => {
    try {
        // Dynamic route
        const handler = require(`./routes/${req.params.route}`).default;
        const response = await handler(req, res);
        console.log({response});
        return response
    } catch (errors) {
        console.error({errors});
        return res.json({errors});
    }
});

api.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
