const hasuraGQLQuery = require('../utils/hasuraGQLQuery')

const handler = async (req, res) => {
    console.log(req.body)
    const { query, variables } = req.body

    const data = await hasuraGQLQuery(
        query,
        variables,
        req.headers
    )

    return res.json({ data })
}

module.exports = handler