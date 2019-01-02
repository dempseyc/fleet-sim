import { randomMM, squareNum } from './utils.js';

export class Ship {

	constructor (color, style, profile, idx) {
		this.color = color;
		this.idx = idx;
		this.shield = profile[0];
		this.weapon = profile[1];
		this.engine = profile[2];
		this.fraction = 0.05;
		this.speed = this.engine * this.fraction;
		this.status = 0;
		this.shieldStatus = profile[0];
		this.gold = 0;
		// this.getAttacked = this.getAttacked.bind(this);

		this.init();
		// console.log(this);
	} // end Ship constructor

	//methods

	///////////////////////// init
	init () {
		let classes = ['ship',`s-${this.idx}`, `s-${this.color}`, `s-${this.style}`];
		this.DOMh = document.createElement('div');
		this.DOMh.classList.add(...classes);
		this.getInitialPosition();
		this.draw();
	}

	move (delta) {
		this.x += this.vx * this.fraction * this.speed * delta;
		this.y += this.vy * this.fraction * this.speed * delta;
	}

	draw () {
		this.DOMh.style.left = `${this.x/10}%`;
		this.DOMh.style.top = `${this.y/10}%`;
	}

	getInitialPosition () {
		this.x = randomMM(1,1000);
		this.y = randomMM(1,1000);
	}

	resetVector () {
		let mvx = this.gt.x - this.x;
		let mvy = this.gt.y - this.y;
		let amvx = Math.abs(mvx);
		let amvy = Math.abs(mvy);
		let mag = squareNum(mvx)+squareNum(mvy);
		this.vx = mvx*amvx / mag;
		this.vy = mvy*amvy / mag;
		// console.log(this.vx,this.vy);
	}

	acquireGold () {
		this.gold += 1;
		// console.log(this.assets);
	}

	setGoldTarget(gold_on_field) {

		let gt_distance_sq = 20164 * 100;  // shouldn't matter

		gold_on_field.forEach((i_g, i) => {
			let x_distance = i_g.x - this.x;
			let y_distance = i_g.y - this.y;
			let i_g_distance_sq = squareNum(x_distance) + squareNum(y_distance);

			if (typeof(this.gt) === 'undefined') {
				this.gt = i_g;
				gt_distance_sq = i_g_distance_sq;
			}
			if (i_g_distance_sq <= gt_distance_sq) {
				this.gt = i_g;
				gt_distance_sq = i_g_distance_sq;
			}
		});
		// console.log(gt_distance_sq, "gt distance");
		this.resetVector();
	}

	setEnemyTarget(enemies) {
		let et_distance_sq = 1000 * 1000 * 2;

		let squareNum = function (n) { return Math.pow(n,2); };

		enemies.forEach((f) => {
			f.s_array.forEach((i_e) => {
				let x_distance = this.x - i_e.x;
				let y_distance = this.y - i_e.y;
				let i_e_distance_sq = squareNum(x_distance) + squareNum(x_distance);

				if (typeof(this.et) === 'undefined') {
					this.et = i_e;
					et_distance_sq = i_e_distance_sq;
					this.et_d = et_distance_sq;
				}
				if (i_e_distance_sq <= et_distance_sq) {
					this.et = i_e;
					et_distance_sq = i_e_distance_sq;
					this.et_d = et_distance_sq;
				}
			});
		});
	}

	attackEnemy() {
		let max_d_attack = 200;
		let miss_rate = this.et_d / squareNum(max_d_attack) ;
		let accuracy = Math.floor(Math.random()*(1-miss_rate)*9);
		let ran = randomMM(0,accuracy);
		if (ran >= 2) {
			this.et.getAttacked(this.weapon);
		}
		this.incrementStunnedTimer();
	}

	getAttacked(damage) {
		console.log("damage", this.shieldStatus);
		this.shieldStatus -= damage;
		if (this.shieldStatus<=0) {
			this.speed = (this.engine+this.shieldStatus) * this.fraction;
		}
		this.startStunnedTimer();
	}

	startStunnedTimer () {
		console.log("got stunned", this.speed);
		this.status = 3;
	}

	incrementStunnedTimer () {
		if (this.status > 0) {
			this.status--;
		}
		if (this.status === 0) {
			this.speed = this.engine * this.fraction;
			this.shieldStatus = this.shield;
		}
	}

}