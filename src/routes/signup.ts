import { Request, Response } from "express"

import { 
    CREATE_USER_MUTATION, 
    GET_USER_BY_EMAIL_QUERY 
} from '../utils/user_queries'
import hasuraGQLQuery from '../utils/hasuraGQLQuery'

export default async function (req: Request, res: Response) {
    // These better be available
    const { email, password } = req.body
    //  Check if there is already a user with that email
    const { users } = await hasuraGQLQuery(
        GET_USER_BY_EMAIL_QUERY, 
        { email: email }, 
        req.headers
    )
    // If so, throw an error depending on the verified property
    if (users[0]) {
        throw { 
            errors: users[0]?.is_verified ? 
            'User with that email already exists.' 
            : 'Please verify your email.' 
        }
    }
    // Otherwise, create a password hash
    const bcrypt = require('bcrypt')
    const password_hash = await bcrypt.hash(password, 10)
    // And save the user
    const { insert_users_one } = await hasuraGQLQuery(
        CREATE_USER_MUTATION,
        {
            email: email,
            password_hash,
        },
        req.headers
    )
    // Extract the id
    const { id } = insert_users_one
    // And send a confirmation email
    const { sendConfirmationEmail } = require('../utils/email_functions')
    await sendConfirmationEmail({ to: email, userId: id })
    // Return a confirmation message with instructions to check email
    return res.json({
        data: {
            message: `Verification link sent to ${email}. Please verify your email.`
        }
    })

}
