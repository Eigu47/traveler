import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const data = (await clientPromise).db().collection("users");

      const response = await data.aggregate(PIPELINE).toArray();

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

const PIPELINE = [
  {
    $project: {
      favorites: 1,
    },
  },
  {
    $unwind: {
      path: "$favorites",
    },
  },
  {
    $group: {
      _id: "$favorites.place_id",
      place: {
        $first: "$favorites",
      },
      favs: {
        $count: {},
      },
    },
  },
  {
    $sort: {
      favs: -1,
    },
  },
  {
    $limit: 10,
  },
];
