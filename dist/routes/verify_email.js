"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_queries_1 = require("../utils/user_queries");
const hasuraGQLQuery_1 = __importDefault(require("../utils/hasuraGQLQuery"));
const { SERVER_SECRET } = process.env;
async function default_1(req, res) {
    // Extract the token
    const { token } = req.body;
    // If no token, throw
    if (!token)
        throw { errors: 'No token.' };
    // Otherwise, verify the token
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, SERVER_SECRET);
    // If token is invalid, throw
    if (!payload)
        throw { errors: 'Invalid token.' };
    // Otherwise, Extract the user's id
    const { user_id } = payload;
    // And set their verified property to true
    const { update_users_by_pk } = await (0, hasuraGQLQuery_1.default)(user_queries_1.VERIFY_USER_MUTATION, {
        id: user_id,
    }, req.headers);
    // Return a success message
    return res.json({
        data: {
            message: 'Successfully verified email.'
        }
    });
}
exports.default = default_1;
