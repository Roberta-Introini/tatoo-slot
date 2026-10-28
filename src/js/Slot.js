import Reel from './Reel.js';
import Symbol from './Symbol.js';

export default class Slot {
  constructor(domElement) {
    Symbol.preload();

    this.currentSymbols = [
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
    ];

    this.nextSymbols = [
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
      ['death_star', 'death_star', 'death_star'],
    ]

    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName('reel')).map((reelContainer, idx) => new Reel(reelContainer, idx, this.currentSymbols[idx]));

    this.spinButton = document.getElementById('spin');
    this.spinButton.addEventListener('click', () => this.spin());

    this.autoPlayCheckbox = document.getElementById('autoplay');

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  spin() {
    this.onSpinStart();
    this.playSpinSound();

    this.currentSymbols = this.nextSymbols;
    this.nextSymbols = [
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
      [Symbol.random(), Symbol.random(), Symbol.random()],
    ];

    return Promise.all(this.reels.map(reel => {
      reel.renderSymbols(this.currentSymbols[reel.idx], this.nextSymbols[reel.idx]);
      return reel.spin();
    })).then(() => this.onSpinEnd());
  }

  playSpinSound() {
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.9);
  }

  playWinSound() {
    const ctx = this.audioCtx;
    [523,659,784,1046].forEach((f,i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const t = ctx.currentTime + i*0.12;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t+0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t); osc.stop(t+0.35);
    });
  }

  onSpinStart() {
    this.spinButton.disabled = true;

    console.log('SPIN START');
  }

  onSpinEnd() {
    this.spinButton.disabled = false;
    this.playWinSound();

    if (this.autoPlayCheckbox && this.autoPlayCheckbox.checked) return window.setTimeout(() => this.spin(), 200);
  }
}
