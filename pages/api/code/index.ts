import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'POST':
      const execute = req.query['execute']
      if (execute) {
        if (execute === 'true') {
          const data = {
            language: 'python3',
            version: '3.10.0',
            files: [
              {
                content: req.body.code,
              },
            ],
          }
          const options = {
            method: 'POST',
            headers: {
              Authentication: process.env.PISTON_TOKEN,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }

          const response = await fetch(process.env.PISTON_API, options)
          const content = await response.json()

          if (content.run.code != 0) {
            res.status(200).json({
              success: true,
              payload: {
                output: {
                  error: true,
                  message: content.run.output,
                },
              },
            })
            break
          } else {
            res.status(200).json({
              success: true,
              payload: {
                output: {
                  error: false,
                  message: content.run.output,
                },
              },
            })
            break
          }
        } else if (execute === 'false') {
          const response = await fetch(process.env.LINTER_API_URL, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: req.body.code }),
          })

          const content = await response.json()

          if (content.success === 'true') {
            res.status(200).json({
              success: true,
              payload: {
                messages: content.payload.result,
              },
            })
            break
          } else {
            res.status(400).json({
              success: false,
              payload: {
                error: {
                  code: 400,
                  message: 'Error running linter.',
                },
              },
              error: {
                code: 400,
                message: 'Error running linter.',
              },
            })
            break
          }
        }
      }
      res.status(405).json({
        success: false,
        payload: {
          error: {
            code: 405,
            message: 'Execute query param not provided.',
          },
        },
        error: {
          code: 405,
          message: 'Execute query param not provided.',
        },
      })
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
