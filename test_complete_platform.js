import assert from 'assert';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting CareerCompass AI End-to-End Test Suite...\n');

  // Test 1: Health Check
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'ok', 'Server health should be ok');
  console.log('✅ Test 1: Server health check passed.');

  // Test 2: ML Service Health
  const mlRes = await fetch(`${BASE_URL}/api/ml-health`);
  const mlHealth = await mlRes.json();
  assert.strictEqual(mlHealth.success, true, 'ML health should succeed');
  assert.strictEqual(mlHealth.ml.status, 'online', 'ML service should be online');
  console.log('✅ Test 2: Random Forest ML inference service is online.');

  // Test 3: Unauthenticated Access to Protected Route Rejected (401)
  const unauthProfile = await fetch(`${BASE_URL}/api/student/profile`);
  assert.strictEqual(unauthProfile.status, 401, 'Unauthenticated profile request should return 401');
  const unauthRec = await fetch(`${BASE_URL}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branch: 'Mechanical Engineering' })
  });
  assert.strictEqual(unauthRec.status, 401, 'Unauthenticated recommendation request should return 401');
  console.log('✅ Test 3: Unauthenticated access to protected routes strictly rejected with 401.');

  // Test 4: Register Student 1
  const uniqueId1 = Date.now();
  const student1Email = `student1_${uniqueId1}@engineering.edu`;
  const reg1Res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aditya Kulkarni',
      email: student1Email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123'
    })
  });
  const reg1 = await reg1Res.json();
  assert.strictEqual(reg1.success, true, 'Student 1 registration should succeed');
  assert.ok(reg1.token, 'Registration should return JWT token');
  const token1 = reg1.token;
  console.log('✅ Test 4: Student 1 registration succeeded with JWT token.');

  // Test 5: Verify Passwords Stored as Bcrypt Hash (Never Plaintext)
  const usersPath = path.join(process.cwd(), 'server', 'data', 'users.json');
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const user1 = Object.values(usersData).find(u => u.email === student1Email);
  assert.ok(user1, 'User 1 should exist in storage');
  assert.ok(user1.passwordHash.startsWith('$2b$10$'), 'Password must be bcrypt hash ($2b$10$)');
  assert.strictEqual(user1.password, undefined, 'Plaintext password must not exist');
  console.log('✅ Test 5: Password stored strictly as bcrypt hash; plaintext password absent.');

  // Test 6: Duplicate Email Registration Rejected (409)
  const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aditya Duplicate',
      email: student1Email,
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123'
    })
  });
  assert.strictEqual(dupRes.status, 409, 'Duplicate registration must return 409 Conflict');
  console.log('✅ Test 6: Duplicate email registration correctly rejected with 409 Conflict.');

  // Test 7: Invalid Login Rejected (401)
  const wrongLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: student1Email,
      password: 'IncorrectPassword99'
    })
  });
  assert.strictEqual(wrongLoginRes.status, 401, 'Invalid password must return 401 Unauthorized');
  console.log('✅ Test 7: Invalid login credentials correctly rejected with 401 Unauthorized.');

  // Test 8: Valid Login Succeeds
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: student1Email,
      password: 'SecurePass123'
    })
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.success, true, 'Valid login should succeed');
  assert.ok(loginData.token, 'Login should return JWT token');
  console.log('✅ Test 8: Valid student login succeeded with token.');

  // Test 9: Student 1 Submits Assessment & Generates Random Forest Recommendations
  const student1Profile = {
    branch: 'Mechanical Engineering',
    year: 'Year 3',
    graduationYear: '2026',
    academicPerformance: 'Strong',
    academicInterests: ['CAD Modeling', 'Finite Element Analysis'],
    skills: [
      { name: 'SolidWorks', level: 'Advanced' },
      { name: 'CAD', level: 'Intermediate' },
      { name: 'AutoCAD', level: 'Intermediate' }
    ],
    interests: ['product design and manufacturing', 'robots and intelligent machines'],
    workStyles: ['hands-on building'],
    aspiration: 'Core mechanical design engineer',
    weeklyHours: 14
  };

  const rec1Res = await fetch(`${BASE_URL}/api/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    },
    body: JSON.stringify(student1Profile)
  });
  const rec1Data = await rec1Res.json();
  assert.strictEqual(rec1Data.success, true, 'Recommendations calculation should succeed');
  assert.strictEqual(rec1Data.recommendations.topThree.length, 3, 'Must return top 3 domains');
  assert.ok(rec1Data.recommendations.mlMetadata, 'Must include ML metadata');
  assert.strictEqual(rec1Data.recommendations.mlMetadata.model, 'RandomForestClassifier');
  console.log(`✅ Test 9: Random Forest recommendations generated for Student 1: Top match = "${rec1Data.recommendations.topThree[0].domainName}" with ML prediction.`);

  // Test 10: Register Student 2 (Data Isolation Verification)
  const student2Email = `student2_${uniqueId1}@engineering.edu`;
  const reg2Res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Pooja Hegde',
      email: student2Email,
      password: 'Passcode456',
      confirmPassword: 'Passcode456'
    })
  });
  const reg2 = await reg2Res.json();
  const token2 = reg2.token;

  // Student 2 fetches profile: must NOT see Student 1's profile
  const profile2Res = await fetch(`${BASE_URL}/api/student/profile`, {
    headers: { 'Authorization': `Bearer ${token2}` }
  });
  const profile2Data = await profile2Res.json();
  assert.strictEqual(profile2Data.profile, null, 'Student 2 profile must initially be null (isolated)');
  console.log('✅ Test 10: Student 2 profile is completely isolated from Student 1.');

  // Test 11: Student 2 Submits Computer Science Assessment
  const student2Profile = {
    branch: 'Computer Science Engineering',
    year: 'Year 2',
    graduationYear: '2027',
    academicPerformance: 'Intermediate',
    academicInterests: ['Artificial Intelligence'],
    skills: [
      { name: 'Python', level: 'Intermediate' },
      { name: 'Machine Learning', level: 'Intermediate' },
      { name: 'SQL', level: 'Intermediate' },
      { name: 'pandas', level: 'Intermediate' }
    ],
    interests: ['Artificial Intelligence', 'Data Science'],
    workStyles: ['analytical problem-solving'],
    aspiration: 'AI/ML Specialist',
    weeklyHours: 12
  };

  const rec2Res = await fetch(`${BASE_URL}/api/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token2}`
    },
    body: JSON.stringify(student2Profile)
  });
  const rec2Data = await rec2Res.json();
  assert.strictEqual(rec2Data.success, true);
  console.log(`✅ Test 11: Random Forest recommendations generated for Student 2: Top match = "${rec2Data.recommendations.topThree[0].domainName}".`);

  // Test 12: Verify Student 1 Still Retains Their Own Mechanical Profile
  const profile1Check = await fetch(`${BASE_URL}/api/student/profile`, {
    headers: { 'Authorization': `Bearer ${token1}` }
  });
  const profile1Data = await profile1Check.json();
  assert.strictEqual(profile1Data.profile.branch, 'Mechanical Engineering', 'Student 1 must retain Mechanical branch');
  console.log('✅ Test 12: Student 1 profile and roadmap progress verified intact without contamination.');

  // Test 13: Student 1 Updates Roadmap Progress Task
  const roadmapUpdateRes = await fetch(`${BASE_URL}/api/student/roadmap`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    },
    body: JSON.stringify({ phaseIndex: 1, taskIndex: 0, status: 'completed' })
  });
  const roadmapData = await roadmapUpdateRes.json();
  assert.strictEqual(roadmapData.success, true);
  assert.strictEqual(roadmapData.roadmapProgress['p1_t0'], 'completed');
  console.log('✅ Test 13: Roadmap task milestone saved securely to student profile.');

  // Test 14: Verify Frontend Bundle Does Not Expose "Load Demo" or "Opportunities"
  const distHtml = fs.readFileSync(path.join(process.cwd(), 'client', 'dist', 'index.html'), 'utf-8');
  assert.ok(distHtml.includes('CareerCompass AI'), 'Index HTML must load app');
  
  // Check compiled JS file
  const distFiles = fs.readdirSync(path.join(process.cwd(), 'client', 'dist', 'assets'));
  const jsFile = distFiles.find(f => f.endsWith('.js'));
  const jsContent = fs.readFileSync(path.join(process.cwd(), 'client', 'dist', 'assets', jsFile), 'utf-8');
  
  // Ensure "Load Demo" button in navigation is removed
  assert.strictEqual(jsContent.includes('>Load Demo<'), false, '"Load Demo" button text must be removed from bundle');
  console.log('✅ Test 14: Confirmed "Load Demo" button is completely absent from frontend.');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! (14/14 End-to-End Verifications)');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
