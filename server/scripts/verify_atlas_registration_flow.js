import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ATLAS_URI = process.env.MONGODB_URI;

async function runEndToEndAtlasVerification() {
  console.log('\n==================================================');
  console.log('🧪 VERIFYING USER REGISTRATION & CIVICTASK IN ATLAS');
  console.log('==================================================\n');

  const testEmail = `atlas_verify_${Date.now()}@example.com`;
  const testName = 'Verified Atlas Citizen';
  const testPassword = 'Password123!';

  // Step 1: Register User via Running Backend API (http://localhost:5000/api/auth/register)
  console.log(`1. Registering new citizen "${testEmail}" via Backend API...`);
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
  });

  const regData = await regRes.json();
  console.log('Registration HTTP Status:', regRes.status);
  console.log('Registration Response:', JSON.stringify(regData));

  if (regRes.status !== 201 || !regData.success) {
    console.error('❌ Registration failed!');
    process.exit(1);
  }

  const userToken = regData.data.token;
  const userId = regData.data._id;
  console.log(`✅ Registration Success! User ID: ${userId}`);

  // Step 2: Login User via Backend API
  console.log('\n2. Logging in with new citizen credentials...');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  const loginData = await loginRes.json();
  console.log('Login HTTP Status:', loginRes.status);
  console.log('Login Response:', JSON.stringify(loginData));

  if (loginRes.status !== 200 || !loginData.success) {
    console.error('❌ Login failed!');
    process.exit(1);
  }
  console.log('✅ Login Success!');

  // Step 3: Direct Inspection of MongoDB Atlas `users` Collection
  console.log('\n3. Inspecting MongoDB Atlas "users" collection directly...');
  const conn = await mongoose.createConnection(ATLAS_URI, { dbName: 'civicpath' }).asPromise();
  console.log(`Connected directly to Atlas Host: ${conn.host}, DB Name: ${conn.name}`);

  const dbUser = await conn.db.collection('users').findOne({ email: testEmail });
  if (!dbUser) {
    console.error(`❌ CRITICAL FAILURE: Newly registered user "${testEmail}" NOT FOUND in Atlas!`);
    await conn.close();
    process.exit(1);
  }
  console.log('✅ ATLAS CONFIRMATION: Newly registered user IS VISIBLE in MongoDB Atlas!');
  console.log('User Record in Atlas:', { _id: dbUser._id, name: dbUser.name, email: dbUser.email, role: dbUser.role });

  // Step 4: Create CivicTask & Guided Roadmap via Backend API
  console.log('\n4. Creating a new CivicTask via Backend API...');
  const guideRes = await fetch('http://localhost:5000/api/ai/guide', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({ question: 'Passport Application and Re-issue' }),
  });
  const guideData = await guideRes.json();
  console.log('Guide API HTTP Status:', guideRes.status);
  console.log('Guide API Response Matched:', guideData.matched, '| Task ID:', guideData.task?.taskId);

  if (guideRes.status !== 200 || !guideData.matched || !guideData.task?.taskId) {
    console.error('❌ CivicTask creation failed!');
    await conn.close();
    process.exit(1);
  }

  const taskId = guideData.task.taskId;
  const firstStepId = guideData.roadmap[0].stepId;

  // Step 5: Update Progress on Step
  console.log('\n5. Completing step 1 progress via Backend API...');
  const progRes = await fetch(`http://localhost:5000/api/progress/${taskId}/step`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({ stepId: firstStepId, status: 'completed' }),
  });
  const progData = await progRes.json();
  console.log('Progress Update HTTP Status:', progRes.status, '| Percentage:', progData.data?.percentage);

  // Step 6: Verify CivicTask & Progress in MongoDB Atlas
  console.log('\n6. Verifying CivicTask & UserProgress directly in MongoDB Atlas...');
  const dbTask = await conn.db.collection('civictasks').findOne({ _id: new mongoose.Types.ObjectId(taskId) });
  const dbProgress = await conn.db.collection('userprogresses').findOne({ userId: new mongoose.Types.ObjectId(userId) });

  console.log('Atlas Task Record:', dbTask ? { _id: dbTask._id, title: dbTask.title, procedureId: dbTask.procedureId } : 'NOT FOUND');
  console.log('Atlas UserProgress Record:', dbProgress ? { _id: dbProgress._id, userId: dbProgress.userId, percentage: dbProgress.percentage } : 'NOT FOUND');

  await conn.close();

  if (!dbTask || !dbProgress) {
    console.error('❌ CivicTask or UserProgress not found in Atlas!');
    process.exit(1);
  }

  console.log('\n==================================================');
  console.log('🎉 ALL ATLAS END-TO-END VERIFICATION CHECKS PASSED!');
  console.log('==================================================\n');
  process.exit(0);
}

runEndToEndAtlasVerification();
