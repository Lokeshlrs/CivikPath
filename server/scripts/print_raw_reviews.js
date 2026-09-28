import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ATLAS_URI = process.env.MONGODB_URI;

async function printRawReviews() {
  const conn = await mongoose.createConnection(ATLAS_URI, { dbName: 'civicpath' }).asPromise();
  const db = conn.db;

  const reviews = await db.collection('verificationreviews').find({}).toArray();
  console.log(`Total reviews: ${reviews.length}`);

  reviews.forEach((r, idx) => {
    console.log(`\nReview #${idx + 1}: ID=${r._id}`);
    console.log(`- sourceId: ${r.sourceId}`);
    console.log(`- action: ${r.action}`);
    console.log(`- comment: ${r.reviewerComment}`);
    console.log(`- title: ${r.extractedData?.title}`);
    console.log(`- cleanText snippet: "${r.extractedData?.cleanText?.slice(0, 100)}"`);
  });

  await conn.close();
  process.exit(0);
}

printRawReviews();
