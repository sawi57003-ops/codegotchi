// Codegotchi pixel sprites: 14x12 bitmaps.
// Chars: '.' transparent, '#' body, 'e' eye, 'm' mouth, 'c' cheek,
// 'w' white highlight, 'g' gold accent, 'x' sick eye, '+' tombstone cross.
(function (root) {
  'use strict';

  var SPRITES = {
    Egg: [
      '..............',
      '.....####.....',
      '....######....',
      '...########...',
      '...##w#####...',
      '..##########..',
      '..##########..',
      '..##########..',
      '..##########..',
      '...########...',
      '....######....',
      '.....####.....',
    ],
    Baby: [
      '..............',
      '.....####.....',
      '....######....',
      '...########...',
      '...#e####e#...',
      '...########...',
      '...##c##c##...',
      '....#mmmm#....',
      '.....####.....',
      '..............',
      '..............',
      '..............',
    ],
    Child: [
      '..............',
      '...##....##...',
      '...###..###...',
      '....######....',
      '...########...',
      '...#e####e#...',
      '...########...',
      '...##c##c##...',
      '....#mmmm#....',
      '.....####.....',
      '..............',
      '..............',
    ],
    Teen: [
      '......##......',
      '.....####.....',
      '...##....##...',
      '...###..###...',
      '....######....',
      '...########...',
      '...#e####e#...',
      '...########...',
      '...##c##c##...',
      '....#mmmm#....',
      '.....####.....',
      '..............',
    ],
    Adult: [
      '..............',
      '...##....##...',
      '...###..###...',
      '....######....',
      '...########...',
      '...#e####e#...',
      '...########...',
      '...##c##c##...',
      '....#mmmm#....',
      '...########...',
      '..##......##..',
      '..............',
    ],
    Golden: [
      '....#..#..#...',
      '....#######...',
      '...##ggggg##..',
      '...###..###...',
      '....######....',
      '...########...',
      '...#e####e#...',
      '...########...',
      '...##c##c##...',
      '....#mmmm#....',
      '...########...',
      '..##......##..',
    ],
    Dead: [
      '..............',
      '.....####.....',
      '....######....',
      '....##+###....',
      '....######....',
      '....######....',
      '....######....',
      '.....####.....',
      '...########...',
      '..............',
      '..............',
      '..............',
    ],
  };

  var PALETTES = {
    Egg:    { '#': '#f5f5dc', e: '#222222', m: '#222222', c: '#ffb6c1', w: '#ffffff', g: '#ffd700', x: '#222222', '+': '#666666' },
    Baby:   { '#': '#7ec8e3', e: '#222222', m: '#222222', c: '#ffb6c1', w: '#ffffff', g: '#ffd700', x: '#222222', '+': '#666666' },
    Child:  { '#': '#90ee90', e: '#222222', m: '#222222', c: '#ffb6c1', w: '#ffffff', g: '#ffd700', x: '#222222', '+': '#666666' },
    Teen:   { '#': '#dda0dd', e: '#222222', m: '#222222', c: '#ffb6c1', w: '#ffffff', g: '#ffd700', x: '#222222', '+': '#666666' },
    Adult:  { '#': '#9370db', e: '#222222', m: '#222222', c: '#ffb6c1', w: '#ffffff', g: '#ffd700', x: '#222222', '+': '#666666' },
    Golden: { '#': '#ffd700', e: '#222222', m: '#222222', c: '#ff9e9e', w: '#fff8dc', g: '#ff8c00', x: '#222222', '+': '#666666' },
    Dead:   { '#': '#9a9a9a', e: '#222222', m: '#222222', c: '#ffb6c1', w: '#ffffff', g: '#ffd700', x: '#222222', '+': '#555555' },
  };

  // Draw a sprite on a 2d canvas context. cell = pixel size in canvas units.
  // sick=true renders the Adult bitmap with X eyes and a green tint.
  function drawSprite(ctx, stage, cell, sick) {
    var key = stage === 'Dead' ? 'Dead' : stage;
    var rows = SPRITES[key] || SPRITES.Egg;
    var pal = PALETTES[key] || PALETTES.Egg;
    if (sick) {
      pal = { '#': '#8fbc8f', e: '#222222', m: '#222222', c: '#c1ffc1', w: '#ffffff', g: '#ffd700', x: '#222222', '+': '#666666' };
    }
    ctx.clearRect(0, 0, 14 * cell, 12 * cell);
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < rows[r].length; c++) {
        var ch = rows[r][c];
        if (ch === '.') continue;
        if (sick && ch === 'e') ch = 'x';
        var color = pal[ch] || pal['#'];
        if (ch === 'x') {
          ctx.fillStyle = color;
          ctx.fillRect(c * cell, r * cell, cell, cell);
          ctx.fillRect(c * cell, r * cell, cell, cell);
          continue;
        }
        ctx.fillStyle = color;
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }
  }

  var api = { SPRITES: SPRITES, PALETTES: PALETTES, drawSprite: drawSprite };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CodegotchiSprites = api;
})(typeof window !== 'undefined' ? window : globalThis);
