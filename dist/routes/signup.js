"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_queries_1 = require("../utils/user_queries");
const hasuraGQLQuery_1 = __importDefault(require("../utils/hasuraGQLQuery"));
async function default_1(req, res) {
    // These better be available
    const { email, password } = req.body;
    //  Check if there is already a user with that email
    const { users } = await (0, hasuraGQLQuery_1.default)(user_queries_1.GET_USER_BY_EMAIL_QUERY, { email: email }, req.headers);
    // If so, throw an error depending on the verified property
    if (users[0]) {
        throw {
            errors: users[0]?.is_verified ?
                'User with that email already exists.'
                : 'Please verify your email.'
        };
    }
    // Otherwise, create a password hash
    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash(password, 10);
    // And save the user
    const { insert_users_one } = await (0, hasuraGQLQuery_1.default)(user_queries_1.CREATE_USER_MUTATION, {
        email: email,
        password_hash,
    }, req.headers);
    // Extract the id
    const { id } = insert_users_one;
    // And send a confirmation email
    const { sendConfirmationEmail } = require('../utils/email_functions');
    await sendConfirmationEmail({ to: email, userId: id });
    // Return a confirmation message with instructions to check email
    return res.json({
        data: {
            message: `Verification link sent to ${email}. Please verify your email.`
        }
    });
}
exports.default = default_1;
