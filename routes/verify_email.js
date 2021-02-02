const { VERIFY_USER_MUTATION } = require('../utils/user_queries')
const hasuraGQLQuery = require('../utils/hasuraGQLQuery')

const { SERVER_SECRET } = process.env

const handler = async (req, res) => {

    const { refresh_token } = req.cookies

    if (!refresh_token) throw { errors: 'No token.' }

    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(refresh_token, SERVER_SECRET)
    if (!payload) throw { errors: 'Invalid token.' }

    const { user_id } = payload

    const { update_users_by_pk } = await hasuraGQLQuery(
        VERIFY_USER_MUTATION,
        {
            id: user_id,
        },
        req.headers
    )    

    return res.json({
        data: {
            message: 'Successfully verified email.'
        }
    })

}

module.exports = handler