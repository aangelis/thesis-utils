import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = await req.body;
  const ip = req.socket.remoteAddress;
  const method = req.method;

  console.log(`${ip} - [${new Date()}] - dummy failed endpoint - method: ${method}, body: '${body}' `)
  res.status(400).json({ message: "API dummy failed endpoint." });
  return;
}