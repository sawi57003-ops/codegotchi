// Codegotchi pet reaction lines. Byte is the pet's default name.
(function (root) {
  'use strict';

  var LINES = {
    greet: [
      'Byte blinks at you. Feed me commits!',
      'Byte wiggles happily. A new day, a new streak!',
      'Byte is ready. What are we shipping today?',
    ],
    fed: [
      'Nom nom! Byte loves commits.',
      'Byte munches a fresh commit. Delicious!',
      'Fed! Byte feels strong today.',
    ],
    alreadyFed: [
      'Byte is full for today. Come back tomorrow!',
      'Byte already ate. Save some commits for tomorrow!',
    ],
    played: [
      'Byte squashed bugs like a pro!',
      'That was fun! Byte feels loved.',
    ],
    evolved: [
      'Byte is evolving! Look at those pixels!',
      'A wild evolution appeared! Byte grew up!',
    ],
    sick: [
      'Byte feels sick... two days without work. Help!',
      'Byte is coughing pixels. A commit would cure me...',
    ],
    dead: [
      'Byte has passed on. The streak is broken.',
      'Here lies Byte. The graveyard remembers.',
    ],
    fresh: [
      'A new egg! Hatch Byte with your first commit.',
      'Byte is still an egg. Make your first push!',
    ],
    idle: [
      'Byte is waiting... one quiet day.',
      'Byte misses you. Don\'t let the streak die!',
    ],
    golden: [
      'GOLDEN BYTE! 30 days of pure consistency. Legendary!',
      'Byte shines gold. You did the impossible — every day.',
    ],
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  var api = { LINES: LINES, pick: pick };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CodegotchiLines = api;
})(typeof window !== 'undefined' ? window : globalThis);
