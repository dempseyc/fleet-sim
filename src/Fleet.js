import Ship from './Ship.js';
import { ShipFactory } from './ShipFactory.js';

export class Fleet {

	constructor (banner,money,strategy) {
		this.banner = banner;
		this.money = money;
		this.s_array = [];
		this.strategy = strategy;
		this.sf = new ShipFactory(this.banner);
		this.init();
	}

	getNumShips () {
		return this.s_array.length;
	}

	purchaseShips () {
		//this.strategy = {average:100,swift:0,transport:0,gunner:0,speeder:0};
		let numAV = this.strategy.average;
		let i = 0;
		while (numAV>i+1) {
			this.s_array.push(this.sf.buildShip(this.banner,'average',i));
			i++;
		}
	}

	init () {
		console.log('new Fleet', this.banner);
		this.purchaseShips();
	}

}