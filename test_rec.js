import { getRecommendations } from './server/recommendationEngine.js';

// Profile 1: Computer Engineering Student
const p1 = {
  branch: 'Computer Engineering',
  year: '2nd Year',
  skills: [{ name: 'Python', level: 'Intermediate' }, { name: 'React', level: 'Beginner' }, { name: 'SQL', level: 'Intermediate' }],
  interests: ['building applications'],
  workStyles: ['hands-on building'],
  aspiration: 'internship first'
};
const res1 = getRecommendations(p1);
console.log('--- TEST PROFILE 1 (CSE Web/App) ---');
res1.topThree.forEach(d => console.log(`- ${d.domainName}: ${d.matchScore}%`));

// Profile 2: Electronics Student
const p2 = {
  branch: 'Electronics & Communication',
  year: '3rd Year',
  skills: [{ name: 'Verilog', level: 'Intermediate' }, { name: 'Digital electronics', level: 'Advanced' }, { name: 'C', level: 'Intermediate' }],
  interests: ['hardware, sensors and connected devices'],
  workStyles: ['structured and detail-oriented'],
  aspiration: 'higher studies and research'
};
const res2 = getRecommendations(p2);
console.log('\n--- TEST PROFILE 2 (ECE Hardware/VLSI) ---');
res2.topThree.forEach(d => console.log(`- ${d.domainName}: ${d.matchScore}%`));

// Profile 3: Mechanical Student
const p3 = {
  branch: 'Mechanical Engineering',
  year: '2nd Year',
  skills: [{ name: 'SolidWorks', level: 'Advanced' }, { name: 'CAD', level: 'Intermediate' }, { name: '3D printing', level: 'Beginner' }],
  interests: ['product design and manufacturing'],
  workStyles: ['hands-on building'],
  aspiration: 'industry job after graduation'
};
const res3 = getRecommendations(p3);
console.log('\n--- TEST PROFILE 3 (Mechanical Design) ---');
res3.topThree.forEach(d => console.log(`- ${d.domainName}: ${d.matchScore}%`));
