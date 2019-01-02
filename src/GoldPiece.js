import { randomMM } from './utils';

export class GoldPiece {
	constructor (idx) {
		this.idx = idx;
		this.x = randomMM(0,1000);
		this.y = randomMM(0,1000);
		this.held_by = "none";
		this.init();
	}

	draw () {
		this.DOMh.style.left = `${this.x/10}%`;
		this.DOMh.style.top = `${this.y/10}%`;
	}

	remove () {
		this.DOMh.remove();
	}

	init() {
		let classes = ['gold'];
		this.DOMh = document.createElement('div');
		this.DOMh.setAttribute("id", `g-${this.idx}`);
		this.DOMh.classList.add(...classes);
		this.draw();
	}
}