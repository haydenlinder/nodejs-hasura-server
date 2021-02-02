const { GET_USER_BY_REFRESH_TOKEN_QUERY, LOGIN_USER_MUTATION, GET_USER_BY_ID } = require('../utils/user_queries')
const hasuraGQLQuery = require('../utils/hasuraGQLQuery')
const { SERVER_SECRET } = process.env


const handler = async (req, res) => {
    const { refresh_token } = req.cookies

    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(refresh_token, SERVER_SECRET)
    console.log({payload})

    const { users_by_pk } = await hasuraGQLQuery(
        GET_USER_BY_ID,
        { id: payload.user_id },
        req.headers
    )

    if (!users_by_pk) throw { errors: 'an error occurred' }

    const new_refresh_token = jwt.sign({ user_id: 1 }, SERVER_SECRET)

    const { update_users } = await hasuraGQLQuery(
        LOGIN_USER_MUTATION,
        {
            email: users_by_pk.email,
            session_token: new_refresh_token
        },
        req.headers
    )

    res.cookie(
        'refresh_token',
        '',
        {
            // signed: true,
            httpOnly: true,
            // https only 
            // secure: true,
        }
    )

    return res.json({
        data: {}
    })
}

module.exports = handler