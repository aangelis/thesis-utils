import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    // Handle any other HTTP methods
    res.status(400).json({ message: "Bad HTTP method." });
    return;
  }
  const ip = req.socket.remoteAddress;

  const depositsToUpload = await prisma.deposit.findMany(
    {
      where: { 
        confirmed: true,
        date_uploaded: null,
      }
    }
  )

  console.log(`${ip} - [${new Date()}] - deposits uploader - ${depositsToUpload.length} ${depositsToUpload.length>1? 'deposits' : 'deposit'} to upload.`)

  const localProtocolHostname = process.env.LOCAL_PROTO_HOST_PORT || "http://locahost:3000";

  try {
    // https://stackoverflow.com/questions/53377774/fetch-multiple-links-inside-foreach-loop
    Promise.all(depositsToUpload.map(x =>
      fetch(
        localProtocolHostname + '/api/deposit_uploader',
        {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({deposit_id: x.id}),
        }
      )
      .then(() => {
        console.log(`${ip} - [${new Date()}] - deposits uploader - deposit with id ${x.id} uploaded.`)
        prisma.deposit.update(
          {
            where: {
              id: x.id,
            },
            data: {
              date_uploaded: new Date(),
            },
          }
        )
      })
    ))
    .then(() => {
      console.log(`${ip} - [${new Date()}] - deposits uploader - ${depositsToUpload.length} ${depositsToUpload.length>1? 'deposits' : 'deposit'} uploaded successfully.`)
      res.json({message: `${depositsToUpload.length} ${depositsToUpload.length>1? 'deposits' : 'deposit'} uploaded successfully.`})
      return;
    })

  }
  catch(error) {
    console.log(`${ip} - [${new Date()}] - deposits uploader - Error: ${(error as Error).message}.`)
    res.status(500).json({ message: (error as Error).message });
    return;
  }

}