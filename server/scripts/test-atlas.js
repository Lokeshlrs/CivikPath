import mongoose from 'mongoose';

const testConnection = async () => {
  const baseUri = 'mongodb://[USER]:bcnWByDcS6Jx88av@ac-kbjjxuy-shard-00-00.sz3tvt2.mongodb.net:27017,ac-kbjjxuy-shard-00-01.sz3tvt2.mongodb.net:27017,ac-kbjjxuy-shard-00-02.sz3tvt2.mongodb.net:27017/civicpath?ssl=true&replicaSet=atlas-ruoxui-shard-0&authSource=admin&appName=Cluster0';
  
  const possibleUsernames = ['admin', 'civicpath', 'user', 'root'];

  for (const username of possibleUsernames) {
    const uri = baseUri.replace('[USER]', username);
    console.log(`[Atlas Test] Attempting connection with username "${username}"...`);
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[Atlas Test] ✅ SUCCESS! Connected to Atlas cluster with username "${username}"!`);
      console.log(`[Atlas Test] Connected Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
      await mongoose.disconnect();
      return uri;
    } catch (err) {
      console.log(`[Atlas Test] Failed with username "${username}": ${err.message}`);
    }
  }

  console.error('[Atlas Test] ❌ Could not connect with auto usernames.');
  process.exit(1);
};

testConnection();
