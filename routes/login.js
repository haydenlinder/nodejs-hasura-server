const { GET_USER_BY_EMAIL_QUERY, LOGIN_USER_MUTATION } = require('../utils/user_queries')
const hasuraGQLQuery = require('../utils/hasuraGQLQuery')
const { SERVER_SECRET } = process.env

const handler = async (req, res) => {
    const { email, password } = req.body

    const { users } = await hasuraGQLQuery(
        GET_USER_BY_EMAIL_QUERY,
        { email: email },
        req.headers
    )

    if (!users[0]) throw { errors: 'No user with that email.' }
    if (!users[0]?.verified) throw { errors: 'Please verify your email.' }

    const bcrypt = require('bcrypt');
    const valid = await bcrypt.compareSync(password, users[0].password)

    if (!valid) throw { errors: 'Wrong password.' }

    const jwt = require('jsonwebtoken')
    const refresh_token = jwt.sign({ user_id: users[0].id }, SERVER_SECRET)

    const { update_users } = await hasuraGQLQuery(
        LOGIN_USER_MUTATION,
        {
            email: email,
            session_token: refresh_token
        },
        req.headers
    )

    const user = update_users.returning[0]
    
    const access_token = jwt.sign(
        { user_id: user.id },
        SERVER_SECRET,
        { expiresIn: '15m' }
    )
        
    res.cookie(
        'refresh_token', 
        refresh_token,
        {
            // signed: true,
            httpOnly: true,
            // https only 
            // secure: true,
        }
    )

    return res.json({
        data: {
            user_id: user.id,
            access_token
        }
    })
}

module.exports = handler