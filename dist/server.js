"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const middlewares_1 = require("./utils/middlewares");
const { PORT } = process.env;
const api = (0, express_1.default)();
api.use(body_parser_1.default.json(), middlewares_1.headers, middlewares_1.cookieParser);
api.post('/:route', middlewares_1.logger, async (req, res) => {
    try {
        const handler = require(`./routes/${req.params.route}`).default;
        return await handler(req, res);
    }
    catch (errors) {
        console.error({ errors });
        return res.json({ errors });
    }
});
api.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
