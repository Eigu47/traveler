import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "@/utils/mongodb";

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

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (req.method === "POST") {
    const { place, userId } = req.body;

    const placeWithDate = { ...place, favorited_at: new Date() };

    try {
      const data = (await clientPromise).db().collection("users");

      const response = await data.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { favorites: placeWithDate } }
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

      const response = await data.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { favorites: { place_id: place_id } } }
      );

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
