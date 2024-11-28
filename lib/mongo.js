import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db("nextauth");  // You can name your database here

// The connection will be cached in a global variable to avoid repeated connections on every request
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If not cached, establish a new connection
  await client.connect();

  cachedClient = client;
  cachedDb = client.db();

  return { client, db: cachedDb };
}
