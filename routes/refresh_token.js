const { SERVER_SECRET } = process.env

const handler = async (req, res) => {
    const { refresh_token } = req.cookies

    if (!refresh_token) throw { errors: 'no token' }

    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(refresh_token, SERVER_SECRET)
    if (!payload) throw { errors: 'invalid token' }

    const { user_id } = payload

    const new_refresh_token = jwt.sign(
        { user_id },
        SERVER_SECRET,
        { expiresIn: '7d' }
    )

    const access_token = jwt.sign(
        { user_id },
        SERVER_SECRET,
        { expiresIn: '15m' }
    )

    res.cookie(
        'refresh_token',
        new_refresh_token,
        {
            // signed: true,
            httpOnly: true,
            // https only 
            // secure: true,
        }
    )

    return res.json({
        data: {
            user_id,
            access_token
        }
    })
}

module.exports = handler