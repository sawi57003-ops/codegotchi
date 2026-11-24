// Codegotchi app: wires GitHub data, the state machine, sprites, and UI.
(function () {
  'use strict';

  var Core = window.CodegotchiCore;
  var Sprites = window.CodegotchiSprites;
  var Lines = window.CodegotchiLines;
  var Github = window.CodegotchiGithub;
  var BugSquash = window.CodegotchiBugSquash;

  var STATE_KEY = 'codegotchi-v1';
  var PET_NAME = 'Byte';
  var CELL = 10; // canvas pixel size (14x12 bitmap -> 140x120 canvas)

  var $ = function (id) { return document.getElementById(id); };

  function loadState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { user: 'sawi57003-ops', happiness: 2, checkins: {}, graveyard: [], lastStage: 'Egg' };
  }

  function saveState(s) {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }

  var state = loadState();
  var pet = null; // latest computePet result
  var lastLine = '';

  function todayStr() { return Core.dayStr(new Date()); }

  function setLine(text) {
    lastLine = text;
    $('status-line').textContent = text;
  }

  function renderMeters() {
    var h = pet ? pet.hunger : 0;
    var hp = pet ? pet.happiness : 0;
    $('hunger-meter').textContent = 'Hunger ' + '■'.repeat(h) + '□'.repeat(4 - h);
    $('happy-meter').textContent = 'Happy  ' + '■'.repeat(hp) + '□'.repeat(4 - hp);
  }

  function renderGraveyard() {
    var g = $('graveyard-list');
    if (!state.graveyard.length) {
      g.innerHTML = '<li>No pets lost yet. Keep the streak alive!</li>';
      return;
    }
    g.innerHTML = '';
    state.graveyard.slice(-5).reverse().forEach(function (entry) {
      var li = document.createElement('li');
      li.textContent = 'Here lies ' + entry.name + ' — ' + entry.streak + '-day streak, ' + entry.died;
      g.appendChild(li);
    });
  }

  function render() {
    var canvas = $('pet-canvas');
    var ctx = canvas.getContext('2d');
    var stage = pet ? pet.stage : 'Egg';
    var sick = pet && pet.health === 'sick';
    Sprites.drawSprite(ctx, stage, CELL, sick);

    $('stage-label').textContent = 'Stage: ' + stage;
    $('streak-label').textContent = 'Streak: ' + (pet ? pet.streak : 0) + ' day' + ((pet && pet.streak === 1) ? '' : 's');
    $('pet-name').textContent = PET_NAME + ' the ' + stage;
    renderMeters();
    renderGraveyard();

    var dead = pet && pet.health === 'dead';
    $('btn-feed').disabled = dead;
    $('btn-play').disabled = dead;
    $('btn-medicine').disabled = dead;
    $('btn-medicine').style.display = (pet && pet.health === 'sick') ? '' : 'none';
    $('btn-new-egg').style.display = dead ? '' : 'none';
    $('user-input').value = state.user;
  }

  // Compute the pet from GitHub activity + manual check-ins.
  async function refresh() {
    setLine('Checking GitHub...');
    var res = await Github.fetchPushDays(state.user);
    var days = new Set(res.days);
    var info = Core.streakFromDays(days, new Date());

    // Manual check-ins count as activity for survival (not for the streak).
    var today = todayStr();
    var fedToday = !!state.checkins[today];
    var lastManual = null;
    Object.keys(state.checkins).forEach(function (d) { if (!lastManual || d > lastManual) lastManual = d; });
    var idleDays = info.idleDays;
    if (lastManual) {
      var manualIdle = Math.floor((Date.parse(today + 'T00:00:00Z') - Date.parse(lastManual + 'T00:00:00Z')) / 86400000);
      if (idleDays === null || manualIdle < idleDays) idleDays = manualIdle;
    }
    if (fedToday) idleDays = 0;

    // Stage follows the longest streak of this life (death resets it).
    state.longestStreak = Math.max(state.longestStreak || 0, info.streak);
    pet = Core.computePet({ streak: info.streak, longestStreak: state.longestStreak, idleDays: idleDays, fedToday: fedToday, happiness: state.happiness });

    if (res.error === 'nouser') {
      setLine('GitHub user "' + state.user + '" not found. Check the name, or use manual check-in.');
    } else if (res.error) {
      setLine('GitHub is unreachable right now — manual check-in mode. ' + Lines.pick(Lines.LINES.idle));
    } else if (pet.health === 'dead') {
      setLine(Lines.pick(Lines.LINES.dead));
    } else if (pet.health === 'sick') {
      setLine(Lines.pick(Lines.LINES.sick));
    } else if (pet.stage === 'Golden') {
      setLine(Lines.pick(Lines.LINES.golden));
    } else if (info.idleDays === null) {
      setLine(Lines.pick(Lines.LINES.fresh));
    } else {
      setLine(Lines.pick(Lines.LINES.greet));
    }

    // Evolution announcement.
    if (pet.stage !== state.lastStage && pet.health !== 'dead' && state.lastStage) {
      setLine(Lines.pick(Lines.LINES.evolved) + ' ' + PET_NAME + ' is now ' + pet.stage + '!');
    }
    state.lastStage = pet.stage;
    saveState(state);
    render();
  }

  function feed() {
    if (!pet || pet.health === 'dead') return;
    var today = todayStr();
    if (state.checkins[today]) {
      setLine(Lines.pick(Lines.LINES.alreadyFed));
      return;
    }
    state.checkins[today] = true;
    state.happiness = Math.min(4, state.happiness + 1);
    saveState(state);
    setLine(Lines.pick(Lines.LINES.fed));
    refresh();
  }

  function play() {
    if (!pet || pet.health === 'dead') return;
    $('bug-overlay').style.display = 'flex';
    BugSquash.startGame($('bug-arena'), function (score) {
      $('bug-overlay').style.display = 'none';
      var bonus = Math.min(2, Math.floor(score / 5));
      state.happiness = Math.min(4, state.happiness + bonus);
      saveState(state);
      setLine(Lines.pick(Lines.LINES.played) + ' Squashed ' + score + ' bugs! +' + bonus + ' happy.');
      refresh();
    });
  }

  function medicine() {
    if (!pet || pet.health !== 'sick') return;
    state.checkins[todayStr()] = true;
    state.happiness = Math.min(4, state.happiness + 1);
    saveState(state);
    setLine(PET_NAME + ' took the medicine and feels better!');
    refresh();
  }

  function newEgg() {
    if (!pet || pet.health !== 'dead') return;
    state.graveyard.push({ name: PET_NAME, streak: state.longestStreak || pet.streak, died: todayStr() });
    state.checkins = {};
    state.happiness = 2;
    state.longestStreak = 0;
    state.lastStage = 'Egg';
    saveState(state);
    setLine('A new egg! Hatch ' + PET_NAME + ' with your first commit.');
    refresh();
  }

  function adopt() {
    var u = $('user-input').value.trim();
    if (!u) return;
    state.user = u;
    saveState(state);
    refresh();
  }

  function share() {
    var text = 'My Codegotchi ' + PET_NAME + ' is ' + (pet ? pet.stage : 'Egg') + ' — ' +
      (pet ? pet.streak : 0) + '-day GitHub streak! #KiroweenHackathon26';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        setLine('Copied! Share your pet: ' + text);
      }, function () { setLine(text); });
    } else {
      setLine(text);
    }
  }

  $('btn-feed').addEventListener('click', feed);
  $('btn-play').addEventListener('click', play);
  $('btn-medicine').addEventListener('click', medicine);
  $('btn-new-egg').addEventListener('click', newEgg);
  $('btn-adopt').addEventListener('click', adopt);
  $('btn-share').addEventListener('click', share);
  $('user-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') adopt(); });
  $('bug-close').addEventListener('click', function () { $('bug-overlay').style.display = 'none'; });

  render();
  refresh();
})();
