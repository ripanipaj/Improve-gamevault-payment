const {test}=require('node:test'), assert=require('node:assert/strict');
const {score,rubricKeys,server}=require('../server/app');
test('accessibility score unknown until all ten criteria assessed',()=>{assert.equal(score(null),null);assert.equal(score({visual:10}),null)});
test('accessibility score bounds and summation',()=>{assert.equal(score(Object.fromEntries(rubricKeys.map(x=>[x,10]))),100);assert.equal(score(Object.fromEntries(rubricKeys.map(x=>[x,0]))),0);assert.equal(score(Object.fromEntries(rubricKeys.map(x=>[x,6]))),60);assert.equal(score(Object.fromEntries(rubricKeys.map(x=>[x,11]))),null)});
test('admin endpoints reject unauthenticated requests',async()=>{await new Promise(r=>server.listen(0,r));try{const url=`http://127.0.0.1:${server.address().port}`;const [admin,games]=await Promise.all([fetch(url+'/api/admin/games'),fetch(url+'/api/games')]);assert.equal(admin.status,401);assert.equal(games.status,200)}finally{await new Promise(r=>server.close(r))}});
