"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const hasuraGQLQuery_1 = __importDefault(require("../utils/hasuraGQLQuery"));
async function handler(req, res) {
    const { query, variables } = req.body;
    const data = await hasuraGQLQuery_1.default(query, variables, req.headers);
    return res.json({ data });
}
exports.handler = handler;
module.exports = handler;
