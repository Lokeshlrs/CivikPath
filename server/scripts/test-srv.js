import mongoose from 'mongoose';

const testSrv = async () => {
  const srvUri = 'mongodb+srv://sitlanilokesh123_db_user:bcnWByDcS6Jx88av@cluster0.sz3tvt2.mongodb.net/civicpath?retryWrites=true&w=majority';
  console.log('[Atlas SRV Test] Connecting via mongodb+srv protocol...');
  try {
    const conn = await mongoose.connect(srvUri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[Atlas SRV Test] ✅ SUCCESS! Connected to Atlas via mongodb+srv protocol!`);
    console.log(`[Atlas SRV Test] Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`[Atlas SRV Test Failed] ${err.message}`);
    process.exit(1);
  }
};

testSrv();
