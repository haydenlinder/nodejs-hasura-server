import { VERIFY_USER_MUTATION } from '../utils/user_queries'
import { Request, Response } from 'express'
import hasuraGQLQuery from '../utils/hasuraGQLQuery'

const { SERVER_SECRET } = process.env

export default async function (req: Request, res: Response) {
    // Extract the token
    const { token } = req.body
    // If no token, throw
    if (!token) throw { errors: 'No token.' }
    // Otherwise, verify the token
    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(token, SERVER_SECRET)
    // If token is invalid, throw
    if (!payload) throw { errors: 'Invalid token.' }
    // Otherwise, Extract the user's id
    const { user_id } = payload
    // And set their verified property to true
    const { update_users_by_pk } = await hasuraGQLQuery(
        VERIFY_USER_MUTATION,
        {
            id: user_id,
        },
        req.headers
    )    
    // Return a success message
    return res.json({
        data: {
            message: 'Successfully verified email.'
        }
    })
}
