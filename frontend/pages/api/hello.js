/*
【執筆メモStart】
yarn create next-appで自動生成されたままの状態です。
APIレスポンスのサンプルとなります。
【執筆メモEnd】
*/
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
