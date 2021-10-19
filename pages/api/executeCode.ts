import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    res.status(200).json({ error: content.run.output })
  } else {
    res.status(200).json({ output: content.run.output })
  }
}
