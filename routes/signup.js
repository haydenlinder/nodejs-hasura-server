const { CREATE_USER_MUTATION, GET_USER_BY_EMAIL_QUERY } = require('../utils/user_queries')
const hasuraGQLQuery = require('../utils/hasuraGQLQuery')

const handler = async (req, res) => {

    const { email, password } = req.body

    const { users } = await hasuraGQLQuery(
        GET_USER_BY_EMAIL_QUERY, 
        { email: email }, 
        req.headers
    )
    
    if (users[0]) {
        throw { 
            errors: users[0]?.verified ? 
            'User with that email already exists.' 
            : 'Please verify your email.' 
        }
    }

    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash(password, 10)
    
    const { insert_users_one } = await hasuraGQLQuery(
        CREATE_USER_MUTATION,
        {
            email: email,
            password: password_hash,
        },
        req.headers
    )

    console.log(insert_users_one)

    const { sendConfirmationEmail } = require('../utils/email_functions')
    await sendConfirmationEmail({ to: email, userId: 1 })

    return res.json({
        data: {
            message: 'Please verify your email.'
        }
    })

}

module.exports = handler