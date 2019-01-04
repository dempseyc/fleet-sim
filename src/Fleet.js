import Ship from './Ship.js';
import { ShipFactory } from './ShipFactory.js';

export class Fleet {

	constructor (banner,money,strategy) {
		this.banner = banner;
		this.money = money;
		this.s_array = [];
		this.strategy = strategy;
		this.SF = new ShipFactory(this.banner);
		this.init();
	}

	getNumShips () {
		return this.s_array.length;
	}

	purchaseShips () {
		//this.strategy = {standard:100,swift:0,transport:0,gunner:0,speeder:0};
		let numST = this.strategy.standard;
		let idx = 0;
		for (let style in this.strategy) {
			let i = 0;
			let num = this.strategy[style];
			while (num>i+1) {
				this.s_array.push(this.SF.buildShip(this.banner,style,idx));
				idx++;
				i++;
			}
		}
	}

	init () {
		console.log('new Fleet', this.banner);
		this.purchaseShips();
	}

}