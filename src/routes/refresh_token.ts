import { Request, Response } from "express"

const { SERVER_SECRET } = process.env

export default async function handler (req: Request, res: Response) {
    // Refresh token from cookies
    const { refresh_token } = req.cookies
    // If no token, throw
    if (!refresh_token) return res.status(401).json({ errors: 'No token.' });
    // Otherwise, verify the token
    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(refresh_token, SERVER_SECRET)
    if (!payload) return res.status(401).json({ errors: 'Invalid token.' });
    // Get the user id
    const { user_id } = payload
    // Create a new refresh_token
    const new_refresh_token = jwt.sign(
        { user_id },
        SERVER_SECRET,
        { expiresIn: '7d' }
    )
    // And access_token
    const access_token = jwt.sign(
        { user_id },
        SERVER_SECRET,
        { expiresIn: '15m' }
    )
    // Set the refresh_token in a cookie and
    // return the access_token to be stored in memory on the client
    return res.cookie(
        'refresh_token',
        new_refresh_token,
        {
            // https or localhost only 
            secure: true,
        }
    ).json({
        data: {
            user_id,
            access_token
        }
    });

}
