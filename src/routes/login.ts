import { Request, Response } from "express"

import { GET_USER_BY_EMAIL_QUERY, LOGIN_USER_MUTATION } from '../utils/user_queries'
import hasuraGQLQuery from '../utils/hasuraGQLQuery'
const { SERVER_SECRET } = process.env

export default async function handler (req: Request, res: Response) {
    // These better be available
    const { email, password } = req.body
    // Look for user with the email above
    const { users } = await hasuraGQLQuery(
        GET_USER_BY_EMAIL_QUERY,
        { email: email },
        req.headers
    )
    // Throw if no user or if they are not verified
    if (!users[0]) throw { errors: 'No user with that email.' }
    if (!users[0]?.is_verified) throw { errors: 'Please verify your email. We sent you an email with a link to verify.' }
    // Since the user is valid, make it easy to access
    const user: { id: number, password_hash: string, is_verified: boolean } = users[0]
    // Check if password is correct
    const bcrypt = await import('bcrypt')
    const valid = await bcrypt.compareSync(password, user.password_hash)
    // If not, throw
    if (!valid) throw { errors: 'Wrong password.' }
    // Generate a refresh token
    const jwt = await import('jsonwebtoken')
    const refresh_token = jwt.sign({ user_id: user.id }, SERVER_SECRET!)
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
    const access_token = jwt.sign(
        { user_id: user.id },
        SERVER_SECRET!,
        { expiresIn: '15m' }
    )
    // Add refresh token to cookies
    res.cookie(
        'refresh_token', 
        refresh_token,
        {
            // signed: true,
            httpOnly: true,
            // https only v
            // secure: true,
        }
    )
    // Return access_token to be stored in memory
    return res.json({
        data: {
            user_id: user.id,
            access_token
        }
    })

}