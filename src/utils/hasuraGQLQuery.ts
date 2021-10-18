import fetch, { RequestInit } from 'node-fetch'
import { IncomingHttpHeaders } from 'node:http'
const { HASURA_GQL_URL, HASURA_GQL_SECRET } = process.env

export default async function hasuraGQLQuery (query: string, variables: object, oldHeaders: IncomingHttpHeaders) {
    // Force { [key: string]: string } to play nice with fetch
    // const headers = JSON.parse(JSON.stringify(oldHeaders))
    // Set admin secret to access gql server
    const headers: RequestInit["headers"] = {};
    headers['x-hasura-admin-secret'] = HASURA_GQL_SECRET!
    // Fetch response
    const response = await fetch(
        HASURA_GQL_URL!,
        {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables
            })
        }
    )
    // GQL server json response
    const { data, errors } = await response.json()
    if (errors) throw errors
    return data

}
