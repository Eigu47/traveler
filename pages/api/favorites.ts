import { Collection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data: Collection<Document>;

  try {
    const db = (await clientPromise).db();
    data = db.collection("users");
  } catch (err) {
    res.status(500).json({ message: "Cant connect to database" });
  }

  if (req.method === "GET") {
    const user = req.body;

    try {
      console.log(data!, user);
      res.status(200).json({});
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (req.method === "POST") {
    const { session, place } = req.body;

    try {
      const response = await data!.findOne();
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
