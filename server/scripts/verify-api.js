const testApiEndpoints = async () => {
  try {
    console.log('📡 Testing HTTP APIs on http://localhost:5000...');

    // Test 1: GET /api/tasks?catalog=true
    const catalogRes = await fetch('http://localhost:5000/api/tasks?catalog=true');
    const catalogData = await catalogRes.json();
    console.log(`\n1. GET /api/tasks?catalog=true -> Success: ${catalogData.success}, Items Count: ${catalogData.data?.length}`);

    const waterProc = catalogData.data?.find((p) => p.title.includes('Water Connection Application'));
    console.log('   Water Connection Catalog Item:', {
      title: waterProc?.title,
      groundingStatus: waterProc?.groundingStatus,
      sourcesCount: waterProc?.sourcesCount,
    });

    // Test 2: POST /api/ai/guide
    const guideRes = await fetch('http://localhost:5000/api/ai/guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'I want to apply for a water connection application in Amravati' }),
    });
    const guideData = await guideRes.json();

    console.log('\n2. POST /api/ai/guide response:', {
      matched: guideData.matched,
      grounded: guideData.grounded,
      grounding: guideData.grounding,
      taskTitle: guideData.task?.title,
      roadmapStepsCount: guideData.roadmap?.length,
    });

    if (
      guideData.matched === true &&
      guideData.grounding?.databaseGrounded === true &&
      guideData.grounding?.officialSourceVerified === false &&
      guideData.grounded === false &&
      guideData.grounding?.status === 'database_only'
    ) {
      console.log('\n✅ HTTP API VERIFICATION PASSED PERFECTLY!');
    } else {
      console.error('\n❌ HTTP API VERIFICATION FAILED:', guideData);
    }
  } catch (err) {
    console.error('❌ HTTP API Test Error:', err);
  }
};

testApiEndpoints();
