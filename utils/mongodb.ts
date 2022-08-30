import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI)
  throw new Error('Invalid environment variable: "MONGODB_URI"');

const uri = process.env.MONGODB_URI;
const options = {};

type GlobalWithMongoClient = typeof globalThis & {
  _mongoClientPromise: Promise<MongoClient>;
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).

  if (!(global as GlobalWithMongoClient)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as GlobalWithMongoClient)._mongoClientPromise = client.connect();
  }

  clientPromise = (global as GlobalWithMongoClient)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
// export default clientPromise;

export async function getMongoDb() {
  return (await clientPromise).db("traveler");
}