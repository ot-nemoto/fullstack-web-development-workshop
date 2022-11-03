/*
【執筆メモStart】
yarn create next-appで自動生成されたままの状態です。
APIレスポンスのサンプルとなります。
【執筆メモEnd】
*/
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
