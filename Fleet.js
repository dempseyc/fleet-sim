class Fleet {

  constructor (color,num_ships,gold) {
    this.color = color;
    this.gold = gold;
    this.gold_per_ship = this.gold/num_ships;
    this.s_array = [];
    for(let i=0;i<num_ships;i++) {
      let ship = new Ship(i,this.gold_per_ship,"swift",this.color);
      this.s_array.push(ship);
      this.gold -= this.gold_per_ship;
    }
    this.num_ships = this.s_array.length;
  }  // end Fleet constructor

}  // end Fleet class