// Kiro hook: lifecycle simulation test.
// Runs after every state-machine edit. Simulates 30 days of activity plus
// sickness, death, and edge cases against core.js. Exit 0 = pass.
'use strict';

const Core = require('../../core.js');

let failures = 0;
function check(name, cond, got) {
  if (cond) {
    console.log('PASS  ' + name);
  } else {
    failures++;
    console.log('FAIL  ' + name + '  (got: ' + JSON.stringify(got) + ')');
  }
}

function daysEnding(today, n) {
  // Set of n consecutive days ending on `today` (a Date).
  const set = new Set();
  const d = new Date(today);
  for (let i = 0; i < n; i++) {
    set.add(Core.dayStr(d));
    d.setDate(d.getDate() - 1);
  }
  return set;
}
function daysAgo(today, n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return Core.dayStr(d);
}

const T = new Date('2026-11-24T12:00:00Z'); // fixed "today" for determinism

// 1. Fresh user: no activity at all.
let r = Core.streakFromDays(new Set(), T);
check('fresh: streak 0', r.streak === 0, r);
check('fresh: idleDays null', r.idleDays === null, r);
check('fresh: health fresh', Core.healthFor(r.idleDays) === 'fresh', Core.healthFor(r.idleDays));
check('fresh: stage Egg', Core.stageFor(0) === 'Egg', Core.stageFor(0));

// 2. 30-day streak ending today -> Golden.
r = Core.streakFromDays(daysEnding(T, 30), T);
check('30d: streak 30', r.streak === 30, r);
check('30d: idleDays 0', r.idleDays === 0, r);
check('30d: stage Golden', Core.stageFor(r.streak) === 'Golden', Core.stageFor(r.streak));
check('30d: health ok', Core.healthFor(r.idleDays) === 'ok', r);

// 3. Stage thresholds.
check('stage 1 = Baby', Core.stageFor(1) === 'Baby', Core.stageFor(1));
check('stage 3 = Child', Core.stageFor(3) === 'Child', Core.stageFor(3));
check('stage 7 = Teen', Core.stageFor(7) === 'Teen', Core.stageFor(7));
check('stage 14 = Adult', Core.stageFor(14) === 'Adult', Core.stageFor(14));
check('stage 29 = Adult', Core.stageFor(29) === 'Adult', Core.stageFor(29));

// 4. One idle day: streak preserved (last push yesterday + 6 prior days).
{
  const days = daysEnding(new Date('2026-11-23T12:00:00Z'), 7);
  r = Core.streakFromDays(days, T);
  check('1 idle day: streak 7 kept', r.streak === 7, r);
  check('1 idle day: idleDays 1', r.idleDays === 1, r);
  check('1 idle day: health ok', Core.healthFor(1) === 'ok', r);
}

// 5. Two idle days: streak 0, sick, hunger 2.
{
  const days = daysEnding(new Date('2026-11-22T12:00:00Z'), 14);
  r = Core.streakFromDays(days, T);
  check('2 idle days: streak 0', r.streak === 0, r);
  check('2 idle days: idleDays 2', r.idleDays === 2, r);
  check('2 idle days: health sick', Core.healthFor(2) === 'sick', r);
  const pet = Core.computePet({ streak: r.streak, longestStreak: 14, idleDays: 2, fedToday: false, happiness: 4 });
  check('2 idle days: hunger 2', pet.hunger === 2, pet);
  check('2 idle days: stage stays Adult (sick, not devolved)', pet.stage === 'Adult', pet);
}

// 6. Three idle days: dead.
{
  const days = daysEnding(new Date('2026-11-21T12:00:00Z'), 14);
  r = Core.streakFromDays(days, T);
  check('3 idle days: idleDays 3', r.idleDays === 3, r);
  check('3 idle days: health dead', Core.healthFor(3) === 'dead', r);
  const pet = Core.computePet({ streak: 0, idleDays: 3, fedToday: false, happiness: 4 });
  check('3 idle days: stage Dead', pet.stage === 'Dead', pet);
  check('3 idle days: hunger 1', pet.hunger === 1, pet);
}

// 7. Gap in the middle: streak counts only the trailing run.
{
  const days = new Set([daysAgo(T, 0), daysAgo(T, 1), daysAgo(T, 2), daysAgo(T, 5), daysAgo(T, 6)]);
  r = Core.streakFromDays(days, T);
  check('gap: streak 3 (trailing run only)', r.streak === 3, r);
}

// 8. Feeding today refills hunger.
{
  const pet = Core.computePet({ streak: 5, idleDays: 1, fedToday: true, happiness: 2 });
  check('fed today: hunger 4', pet.hunger === 4, pet);
  check('fed today: happiness decays by idle', pet.happiness === 1, pet);
}

// 9. 100-day streak still Golden, never crashes.
{
  r = Core.streakFromDays(daysEnding(T, 100), T);
  check('100d: streak 100', r.streak === 100, r);
  check('100d: stage Golden', Core.stageFor(100) === 'Golden', r);
}

console.log(failures === 0 ? '\nALL PASS' : '\n' + failures + ' FAILURES');
process.exit(failures === 0 ? 0 : 1);
