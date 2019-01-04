import { randomMM, squareNum } from './utils.js';
import {GoldPiece} from './GoldPiece.js';
import { Fleet } from './Fleet.js';

export class Board {
	constructor () {
		this.num_gold = 900;
		this.money_per_fleet = 150000;
		this.DOMh = document.getElementById('board');
		this.REDstrategy = {
			standard:  10,
			swift:      0,
			transport:  0,
			gunner:     0,
			speeder:    0
		};
		this.GREENstrategy = {
			standard:  10,
			swift:      0,
			transport:  0,
			gunner:     0,
			speeder:    0
		};
		this.BLUEstrategy = {
			standard:  10,
			swift:      0,
			transport:  0,
			gunner:     0,
			speeder:    0
		};
		this.fleets = [
			new Fleet('red',this.money_per_fleet,this.REDstrategy),
			new Fleet('green',this.money_per_fleet,this.GREENstrategy),
			new Fleet('blue',this.money_per_fleet,this.BLUEstrategy)];
		this.gold_pieces = [];
		this.init();
	}

	placeGold () {
		for (let i=0;i<this.num_gold;i++) {
			let gp = new GoldPiece(i);
			this.gold_pieces.push(gp);
		}
	}

	gold_on_field () {
		let gof = this.gold_pieces.filter(g => g.held_by==="none");
		return gof;
	}

	init() {
		this.placeGold();
		this.setTargets(this.fleets);
		this.fleets.forEach((f) => {
			f.s_array.forEach((s) => {
				this.DOMh.appendChild(s.DOMh);
			});
		});
		this.gold_pieces.forEach((gp) => {
			this.DOMh.appendChild(gp.DOMh);
		});
	}

	setTargets() {
		this.fleets.forEach((f,idx) => {
			let enemies = this.fleets.filter( (ff,i) => i !== idx);
			f.s_array.forEach((s) => {
				s.setGoldTarget(this.gold_on_field());
				s.setEnemyTarget(enemies);
			});
		});
	}

	makeAttacks() {
		this.fleets.forEach((f,idx) => {
			f.s_array.forEach((s) => {
				s.attackEnemy();
			});
		});
	}

	doHitDetect () {
		this.fleets.forEach((f) => {
			f.s_array.forEach((s) => {
				this.gold_pieces.forEach((gp) => {
				let dist_sq = squareNum(gp.x-s.x) + squareNum(gp.y-s.y);
				if ( dist_sq < 25 && gp.held_by==="none" ) {
					this.removeGold(gp,s);
				}
				});
			});
		});
	}

	removeGold (gp,s) {
		gp.held_by = s.profile;
		s.acquireGold();
		this.setTargets(this.fleets);
		gp.remove();
	}

	draw () {
		this.doHitDetect();
		this.fleets.forEach((f) => {
			f.s_array.forEach((s) => {
			s.draw();
			});
		});
	}

	update (delta) {
		this.fleets.forEach((f) => {
			f.s_array.forEach((s) => {
				s.move(delta);
			});
		});
	}

	clear () {
		while (this.DOMh.firstChild) {
			this.DOMh.removeChild(this.DOMh.firstChild);
		}
	}
}