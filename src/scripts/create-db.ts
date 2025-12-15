import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function createDatabase() {
  const url = new URL(process.env.DATABASE_URI!);
  const dbName = url.pathname.slice(1); // remove leading /
  const baseUrl = process.env.DATABASE_URI!.replace(`/${dbName}`, "/postgres");

  const client = new Client({ connectionString: baseUrl });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database ${dbName} created`);
  } catch (error: any) {
    if (error.code === "42P04") {
      console.log(`Database ${dbName} already exists`);
    } else {
      throw error;
    }
  } finally {
    await client.end();
  }
}

createDatabase().catch(console.error);
