const fetch = require('node-fetch')
const { HASURA_GQL_URL, HASURA_GQL_SECRET } = process.env

const hasuraGQLQuery = async (query, variables, headers) => {

    headers['x-hasura-admin-secret'] = HASURA_GQL_SECRET

    const response = await fetch(
        HASURA_GQL_URL,
        {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        }
    )
    
    const { data, errors } = await response.json()
    if (errors) throw errors
    return data
}

module.exports = hasuraGQLQuery