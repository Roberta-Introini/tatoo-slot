const cache = {};

const symbolToSticker = {
  at_at: 'sticker_01',
  c3po: 'sticker_02',
  darth_vader: 'sticker_03',
  death_star: 'sticker_04',
  falcon: 'sticker_05',
  r2d2: 'sticker_06',
  stormtrooper: 'sticker_07',
  tie_ln: 'sticker_08',
  yoda: 'sticker_09',
};

export default class Symbol {
  constructor(name = Symbol.random()) {
    this.name = name;

    if (cache[name]) {
      this.img = cache[name].cloneNode();
    } else {
      this.img = new Image();
      this.img.src = require(`../assets/symbols/${symbolToSticker[name]}.svg`);
      cache[name] = this.img;
    }
  }

  static preload() {
    Symbol.symbols.forEach(symbol => new Symbol(symbol));
  }

  static get symbols() {
    return ['at_at', 'c3po', 'darth_vader', 'death_star', 'falcon', 'r2d2', 'stormtrooper', 'tie_ln', 'yoda'];
  }

  static random() {
    return this.symbols[Math.floor(Math.random()*this.symbols.length)];
  }
}
