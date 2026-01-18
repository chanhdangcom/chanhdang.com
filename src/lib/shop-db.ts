import type { MongoClient } from "mongodb";

/**
 * Get shop database
 * Uses SHOP_DB_NAME env if set, otherwise uses default DB from MONGODB_URI
 * Example: if URI is mongodb://...net/test, default DB is "test"
 */
export function getShopDb(client: MongoClient) {
  const dbName = process.env.SHOP_DB_NAME;
  return dbName ? client.db(dbName) : client.db();
}
