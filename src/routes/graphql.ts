import { Request, Response } from 'express'
import hasuraGQLQuery from '../utils/hasuraGQLQuery'

export default async function handler (req: Request, res: Response) {

    const { query, variables } = req.body

    const data = await hasuraGQLQuery(
        query,
        variables,
        req.headers
    )

    return res.json({ data })
}

module.exports = handler