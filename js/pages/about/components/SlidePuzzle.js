import * as Create from '@/js/utils/dom-elements.js';
import { Confetti } from "./Confetti";

/* 
  &copy; 2023 BeeVeeDeeDee & Son. All rights reserved. ;)
*/ 

export class SlidePuzzle {
  constructor(parentEl, size) {
    /* 
    Object Destructuring Assignment.
    --------------------------------
    t's a feature introduced in ES6 that allows you to unpack properties 
    from objects and assign them to variables. In this case, it's being 
    used with Object.assign() to assign multiple properties to the this object.
  */
    Object.assign(this, {
      parentEl, size, pieceSize: 75, shuffleCount: 100,
      numberOfPieces: size ** 2, highlighted: size ** 2, shuffled: false, selectedPieceIndex: '',
      selectedPiece: null
    });
    this.width = this.size * this.pieceSize + this.size * 2 + 'px';
    this.height = this.size * this.pieceSize + this.size * 2 + 'px';
    this.render();
  }

  render() {
    this.parentEl.innerHTML = '';
    const wrapper = Create.Elements.DIV(this.parentEl, null, `width:${this.width}; height:${this.height}`);

    Array.from({ length: this.numberOfPieces }, (_, i) => {
      const piece = Create.Elements.DIV(wrapper, 'piece', `width:${this.pieceSize}px; height:${this.pieceSize}px; line-height:${this.pieceSize}px`, i + 1, () => this.swap(i + 1));
      piece.dataset.index = i + 1;
      if (i + 1 === this.numberOfPieces) {
        this.selectedPieceIndex = piece.dataset.index;
        this.selectedPiece = piece;
        piece.classList.add('selected');
      }
    });

    this.shuffle();
  }

  shuffle() {
    this.shuffleCount += Math.floor(Math.random() * (200 - this.shuffleCount) + this.shuffleCount);
    Array.from({ length: this.shuffleCount }, () => {
      const direction = [this.highlighted + 1, this.highlighted - 1, this.highlighted + this.size, this.highlighted - this.size][Math.floor(Math.random() * 4)];
      this.swap(direction);
    });
    this.shuffled = true;
  }

  swap(clicked) {
    if (clicked < 1 || clicked > this.numberOfPieces) return;

    if (clicked === this.highlighted + 1 && clicked % this.size !== 1) {
      this.setSelected(clicked);
    } else if (clicked === this.highlighted - 1 && clicked % this.size !== 0) {
      this.setSelected(clicked);
    } else if (clicked === this.highlighted + this.size || clicked === this.highlighted - this.size) {
      this.setSelected(clicked);
    }
    // check if the puzzle is solved after the swap
    if (this.shuffled && this.checkHasWon()) {
      const confetti = new Confetti();
      confetti.startConfetti();
      setTimeout(() => confetti.stopConfetti(), 3000);
    }
  }

  checkHasWon() {
    return Array.from({ length: this.numberOfPieces }, (_, i) => {
      const tile = document.querySelector(`[data-index~="${i + 1}"]`);
      return parseInt(tile.dataset.index) === parseInt(tile.innerHTML);
    }).every(Boolean);
  }

  setSelected(index) {
    const currentTile = document.querySelector(`[data-index~="${this.highlighted}"]`);
    const newTile = document.querySelector(`[data-index~="${index}"]`);
    [currentTile.innerHTML, newTile.innerHTML] = [newTile.innerHTML, currentTile.innerHTML];
    currentTile.classList.toggle('selected');
    newTile.classList.toggle('selected');
    this.highlighted = index;
  }
}