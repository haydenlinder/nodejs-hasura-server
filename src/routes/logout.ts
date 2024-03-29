import { Request, Response } from "express"

export default async function handler (req: Request, res: Response) {
    // Set the refresh_token to an empty string, 
    // preventing generation of a new access_token
    res.cookie(
        'refresh_token',
        '',
        {
            // signed: true,
            httpOnly: true,
            // https only 
            secure: true,
            sameSite: 'none'
        }
    )
    // Return an empty object. On the client, 
    // the access_token should be removed from memory
    return res.json({
        data: {}
    })
}
