"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN_USER_MUTATION = exports.GET_USER_BY_ID = exports.GET_USER_BY_REFRESH_TOKEN_QUERY = exports.VERIFY_USER_MUTATION = exports.GET_USER_BY_EMAIL_QUERY = exports.CREATE_USER_MUTATION = void 0;
exports.CREATE_USER_MUTATION = `
    mutation (
        $email: String = "", 
        $first_name: String = "", 
        $last_name: String = "", 
        $password: String = ""
    ) {
        insert_users_one(
            object: {
                email: $email, 
                first_name: $first_name,
                last_name: $last_name,
                password: $password
            }
        ) { 
            id,
            email 
        }
    }
`;
exports.GET_USER_BY_EMAIL_QUERY = `
    query ($email: String = "") {
        users(limit: 1, where: {email: {_eq: $email}}) {
            id,
            password,
            verified
        }
    }
`;
exports.VERIFY_USER_MUTATION = `
    mutation ($id: bigint! = "") {
        update_users_by_pk(pk_columns: {id: $id}, _set: {verified: true}) {
            id,
            verified
        }
    }
`;
exports.GET_USER_BY_REFRESH_TOKEN_QUERY = `
    query ($session_token: String = "") {
        users(limit: 1, where: {session_token: {_eq: $session_token}}) {
            id,
            email
        }
    }
`;
exports.GET_USER_BY_ID = `
    query ($id: bigint! = "") {
        users_by_pk(id: $id) {
            email
            id
        }
    }
`;
// We're using jwt, so we shouldn't need this
exports.LOGIN_USER_MUTATION = `
    mutation ($email: String = "", $session_token: String = "") {
        update_users(
            where: {email: {_eq: $email}}, 
            _set: {session_token: $session_token}
        ) {
            returning { 
                id,
                first_name,
                last_name,
                email
            }
        }
    }
`;
