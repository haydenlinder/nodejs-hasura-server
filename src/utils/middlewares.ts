import { Request, Response, NextFunction } from 'express'

export function cookieParser (req: Request, _: Response, next: NextFunction ) {
    // This function adds a 'cookies' object to the incoming Request.
    // Initialize cookies object on req
    req.cookies = {}
    // if no cookie, pass to next middleware
    if (!req.headers.cookie) return next()
    // Create an array of strings 'mycookie=mycookievalue'
    const ar = req.headers.cookie.split(';')
    // Fill the cookies object
    ar.forEach(cookie => {
        const tup = cookie.split('=') // [mycookie, mycookievalue]
        req.cookies[tup[0].trim()] = tup[1].trim() // mycookie: 'myvalue'
    })
    // Next middleware
    next()
}

// For testing only!
export function logger (req: Request, res: Response, next: NextFunction) {
    console.log(`
        PROCESSING ${req.method} to /${req.params.route}\n
        params: ${JSON.stringify(req.params)}\n
        query: ${JSON.stringify(req.query)}\n
        body: ${JSON.stringify(req.body)}\n
        request headers: ${JSON.stringify(req.headers)}\n
        response headers: ${JSON.stringify(res.getHeaders())}\n
    `)
    next()
}

export function headers (req: Request, res: Response, next: NextFunction) {
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Accept, Authorization, Origin")
    res.setHeader("Access-Control-Allow-Origin", req.headers.host || '')
    req.headers['Access-Control-Allow-Origin'] = req.headers.host
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Credentials", 'true')
    next()
}