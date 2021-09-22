"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SERVER_SECRET } = process.env;
async function handler(req, res) {
    // Refresh token from cookies
    const { refresh_token } = req.cookies;
    // If no token, throw
    if (!refresh_token)
        throw { errors: 'No token.' };
    // Otherwise, verify the token
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(refresh_token, SERVER_SECRET);
    if (!payload)
        throw { errors: 'Invalid token.' };
    // Get the user id
    const { user_id } = payload;
    // Create a new refresh_token
    const new_refresh_token = jwt.sign({ user_id }, SERVER_SECRET, { expiresIn: '7d' });
    // And access_token
    const access_token = jwt.sign({ user_id }, SERVER_SECRET, { expiresIn: '15m' });
    // Set the refresh_token in a cookie
    res.cookie('refresh_token', new_refresh_token, {
        // signed: true,
        httpOnly: true,
        // https only 
        // secure: true,
    });
    // Return the access_token to be stored in memory on the client
    return res.json({
        data: {
            user_id,
            access_token
        }
    });
}
exports.default = handler;
