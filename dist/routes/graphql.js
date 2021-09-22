"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hasuraGQLQuery_1 = __importDefault(require("../utils/hasuraGQLQuery"));
async function handler(req, res) {
    const { query, variables } = req.body;
    const data = await (0, hasuraGQLQuery_1.default)(query, variables, req.headers);
    return res.json({ data });
}
exports.default = handler;
module.exports = handler;
