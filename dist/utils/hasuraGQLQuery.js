"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const { HASURA_GQL_URL, HASURA_GQL_SECRET } = process.env;
async function hasuraGQLQuery(query, variables, oldHeaders) {
    // Force { [key: string]: string } to play nice with fetch
    const headers = JSON.parse(JSON.stringify(oldHeaders));
    // Set admin secret to access gql server
    headers['x-hasura-admin-secret'] = HASURA_GQL_SECRET;
    // Fetch response
    const response = await node_fetch_1.default(HASURA_GQL_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables
        })
    });
    // GQL server json response
    const { data, errors } = await response.json();
    if (errors)
        throw errors;
    return data;
}
exports.default = hasuraGQLQuery;
