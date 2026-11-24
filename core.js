// Codegotchi core: streak computation + pet state machine.
// Pure logic, no DOM. Works in the browser (window.CodegotchiCore)
// and in Node (module.exports) so the Kiro hook can test it.
(function (root) {
  'use strict';

  var STAGES = [
    { name: 'Egg', min: 0 },
    { name: 'Baby', min: 1 },
    { name: 'Child', min: 3 },
    { name: 'Teen', min: 7 },
    { name: 'Adult', min: 14 },
    { name: 'Golden', min: 30 },
  ];

  function dayStr(d) { return d.toISOString().slice(0, 10); }

  function parseDay(s) { return new Date(s + 'T00:00:00Z'); }

  // days: Set of 'YYYY-MM-DD' strings with PushEvent activity.
  // today: Date (defaults to now). Returns { streak, idleDays, lastActive }.
  // idleDays is null when there is no activity at all (fresh pet, not dead).
  function streakFromDays(days, today) {
    var t = today ? new Date(today) : new Date();
    var todayS = dayStr(t);
    var y = new Date(t); y.setDate(y.getDate() - 1);
    var yS = dayStr(y);

    var anchor = null;
    var idleDays = 0;
    if (days.has(todayS)) { anchor = new Date(t); idleDays = 0; }
    else if (days.has(yS)) { anchor = new Date(y); idleDays = 1; }
    else {
      var last = null;
      days.forEach(function (s) { if (!last || s > last) last = s; });
      if (!last) return { streak: 0, idleDays: null, lastActive: null };
      idleDays = Math.floor((Date.parse(todayS + 'T00:00:00Z') - Date.parse(last + 'T00:00:00Z')) / 86400000);
      return { streak: 0, idleDays: idleDays, lastActive: last };
    }

    var streak = 0;
    var cur = new Date(anchor);
    while (days.has(dayStr(cur))) { streak++; cur.setDate(cur.getDate() - 1); }
    return { streak: streak, idleDays: idleDays, lastActive: dayStr(anchor) };
  }

  function stageFor(streak) {
    var s = STAGES[0];
    for (var i = 0; i < STAGES.length; i++) {
      if (streak >= STAGES[i].min) s = STAGES[i];
    }
    return s.name;
  }

  // idleDays: null = fresh (no activity ever), 0-1 = ok, 2 = sick, 3+ = dead.
  function healthFor(idleDays) {
    if (idleDays === null || idleDays === undefined) return 'fresh';
    if (idleDays >= 3) return 'dead';
    if (idleDays === 2) return 'sick';
    return 'ok';
  }

  // Full pet snapshot from activity info.
  // opts: { streak, longestStreak, idleDays, fedToday, happiness (0-4 stored) }
  // The stage follows the LONGEST streak of the current life, not the
  // current streak: a sick pet keeps its evolved form; only death
  // (3+ idle days) reverts it to Egg via a new egg.
  function computePet(opts) {
    var streak = opts.streak || 0;
    var longest = (opts.longestStreak !== undefined && opts.longestStreak !== null) ? opts.longestStreak : streak;
    var idle = (opts.idleDays === null || opts.idleDays === undefined) ? 0 : opts.idleDays;
    var health = healthFor(opts.idleDays);
    var stage = health === 'dead' ? 'Dead' : stageFor(longest);
    var hunger = opts.fedToday ? 4 : Math.max(0, 4 - idle);
    var happiness = Math.max(0, Math.min(4, (opts.happiness || 0) - idle));
    return { stage: stage, health: health, hunger: hunger, happiness: happiness, streak: streak, idleDays: opts.idleDays };
  }

  var api = { STAGES: STAGES, streakFromDays: streakFromDays, stageFor: stageFor, healthFor: healthFor, computePet: computePet, dayStr: dayStr, parseDay: parseDay };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CodegotchiCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
