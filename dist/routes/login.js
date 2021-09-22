"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_queries_1 = require("../utils/user_queries");
const hasuraGQLQuery_1 = __importDefault(require("../utils/hasuraGQLQuery"));
const { SERVER_SECRET } = process.env;
async function handler(req, res) {
    // These better be available
    const { email, password } = req.body;
    // Look for user with the email above
    const { users } = await (0, hasuraGQLQuery_1.default)(user_queries_1.GET_USER_BY_EMAIL_QUERY, { email: email }, req.headers);
    // Throw if no user or if they are not verified
    if (!users[0])
        throw { errors: 'No user with that email.' };
    if (!users[0]?.is_verified)
        throw { errors: 'Please verify your email. We sent you an email with a link to verify.' };
    // Since the user is valid, make it easy to access
    const user = users[0];
    // Check if password is correct
    const bcrypt = await Promise.resolve().then(() => __importStar(require('bcrypt')));
    const valid = await bcrypt.compareSync(password, user.password_hash);
    // If not, throw
    if (!valid)
        throw { errors: 'Wrong password.' };
    // Generate a refresh token
    const jwt = await Promise.resolve().then(() => __importStar(require('jsonwebtoken')));
    const refresh_token = jwt.sign({ user_id: user.id }, SERVER_SECRET);
    // This shouldn't be needed
    // const { update_users } = await hasuraGQLQuery(
    //     LOGIN_USER_MUTATION,
    //     {
    //         email: email,
    //         session_token: refresh_token
    //     },
    //     req.headers
    // )
    // const user = update_users.returning[0]
    // Generate access token
    const access_token = jwt.sign({ user_id: user.id }, SERVER_SECRET, { expiresIn: '15m' });
    // Add refresh token to cookies
    res.cookie('refresh_token', refresh_token, {
        // signed: true,
        httpOnly: true,
        // https only v
        // secure: true,
    });
    // Return access_token to be stored in memory
    return res.json({
        data: {
            user_id: user.id,
            access_token
        }
    });
}
exports.default = handler;
