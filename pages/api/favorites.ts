import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      if (typeof userId !== "string") throw new Error("Invalid User");

      const data = (await clientPromise).db().collection("users");

      const response = await data.findOne(
        { _id: new ObjectId(userId) },
        { projection: { favorites: 1 } }
      );

      console.log(userId);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (req.method === "POST") {
    const { place_id, userId } = req.body;

    try {
      const data = (await clientPromise).db().collection("users");

      const response = await data.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $addToSet: { favorites: place_id } },
        { returnDocument: "after", projection: { favorites: 1 } }
      );

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (req.method === "DELETE") {
    const { place_id, userId } = req.body;

    try {
      const data = (await clientPromise).db().collection("users");

      const response = await data.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $pull: { favorites: place_id } },
        { returnDocument: "after", projection: { favorites: 1 } }
      );

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
