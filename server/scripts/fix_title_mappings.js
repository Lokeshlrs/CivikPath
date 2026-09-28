import connectDB from '../config/db.js';
import { Procedure } from '../models/Procedure.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixMappings() {
  await connectDB();
  const procs = await Procedure.find({}).lean();
  const sources = await GovernmentSource.find({}).lean();

  const sourceByDomain = new Map();
  sources.forEach((s) => {
    const domain = s.officialDomain || s.domain;
    if (domain) sourceByDomain.set(domain, s);
  });

  console.log(`Checking title matches for all ${procs.length} procedures...`);

  const unmapped = [];
  procs.forEach((p) => {
    if (p.sourceStatus !== 'verified' || !p.officialSourceId) {
      unmapped.push(p);
    }
  });

  console.log(`Unmapped / Non-verified count: ${unmapped.length}`);
  unmapped.forEach((u) => {
    console.log(`- "${u.title}" | dept: "${u.department}" | domain: "${u.domain}" | officialSourceId: ${u.officialSourceId}`);
  });

  process.exit(0);
}

fixMappings();
