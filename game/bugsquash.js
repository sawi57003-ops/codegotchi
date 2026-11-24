// Codegotchi Bug Squash: a 60-second mini-game.
// Bugs pop up in the arena; click them to squash. Score feeds happiness.
(function (root) {
  'use strict';

  var DURATION_MS = 60000;
  var SPAWN_MS = 650;
  var BUG_LIFE_MS = 1200;

  // area: the arena element. onEnd(score) called when time runs out.
  function startGame(area, onEnd) {
    area.innerHTML = '';
    area.classList.add('playing');
    var score = 0;
    var alive = true;
    var scoreEl = document.getElementById('bug-score');
    var timeEl = document.getElementById('bug-time');

    function updateHud(leftMs) {
      if (scoreEl) scoreEl.textContent = 'Squashed: ' + score;
      if (timeEl) timeEl.textContent = 'Time: ' + Math.ceil(leftMs / 1000) + 's';
    }

    function spawn() {
      if (!alive) return;
      var bug = document.createElement('div');
      bug.className = 'bug';
      var maxX = Math.max(0, area.clientWidth - 34);
      var maxY = Math.max(0, area.clientHeight - 34);
      bug.style.left = Math.floor(Math.random() * maxX) + 'px';
      bug.style.top = Math.floor(Math.random() * maxY) + 'px';
      bug.addEventListener('pointerdown', function (ev) {
        ev.preventDefault();
        if (!alive || bug.classList.contains('squashed')) return;
        bug.classList.add('squashed');
        score++;
        updateHud(endAt - Date.now());
        setTimeout(function () { if (bug.parentNode) bug.parentNode.removeChild(bug); }, 180);
      });
      area.appendChild(bug);
      setTimeout(function () {
        if (bug.parentNode && !bug.classList.contains('squashed')) bug.parentNode.removeChild(bug);
      }, BUG_LIFE_MS);
    }

    var endAt = Date.now() + DURATION_MS;
    updateHud(DURATION_MS);
    var spawnTimer = setInterval(spawn, SPAWN_MS);
    var tick = setInterval(function () {
      var left = endAt - Date.now();
      if (left <= 0) {
        alive = false;
        clearInterval(spawnTimer);
        clearInterval(tick);
        area.classList.remove('playing');
        updateHud(0);
        onEnd(score);
        return;
      }
      updateHud(left);
    }, 200);
    spawn();
  }

  var api = { startGame: startGame, DURATION_MS: DURATION_MS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CodegotchiBugSquash = api;
})(typeof window !== 'undefined' ? window : globalThis);
