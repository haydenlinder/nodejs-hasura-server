"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headers = exports.logger = exports.cookieParser = void 0;
function cookieParser(req, _, next) {
    // This function adds a 'cookies' object to the incoming Request.
    // Initialize cookies object on req
    req.cookies = {};
    // if no cookie, pass to next middleware
    if (!req.headers.cookie)
        return next();
    // Create an array of strings 'mycookie=mycookievalue'
    const ar = req.headers.cookie.split(';');
    // Fill the cookies object
    ar.forEach(cookie => {
        const tup = cookie.split('='); // [mycookie, mycookievalue]
        req.cookies[tup[0].trim()] = tup[1].trim(); // mycookie: 'myvalue'
    });
    // Next middleware
    next();
}
exports.cookieParser = cookieParser;
// For testing only!
function logger(req, res, next) {
    console.log(`
        PROCESSING ${req.method} to /${req.params.route}\n
        params: ${JSON.stringify(req.params)}\n
        query: ${JSON.stringify(req.query)}\n
        body: ${JSON.stringify(req.body)}\n
        request headers: ${JSON.stringify(req.headers)}\n
        response headers: ${JSON.stringify(res.getHeaders())}\n
    `);
    next();
}
exports.logger = logger;
function headers(req, res, next) {
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Accept, Authorization, Origin");
    res.setHeader("Access-Control-Allow-Origin", req.headers.host || '');
    req.headers['Access-Control-Allow-Origin'] = req.headers.host;
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", 'true');
    next();
}
exports.headers = headers;
