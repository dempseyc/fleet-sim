class Fleet {

  constructor (color,num_ships,gold) {
    switch (color) {
      case "white":
        this.fleet_type = "average";
        break;
      case "red":
        this.fleet_type = "swift";
        break;
      case "blue":
        this.fleet_type = "transport";
        break;
      case "green":
        this.fleet_type = "gunner";
        break;
      case "purple":
        this.fleet_type = "speeder";
        break;
      default:
        break;
    }
    this.color = color;
    this.gold = gold;
    this.gold_per_ship = this.gold/num_ships;
    this.s_array = [];
    for(let i=0;i<num_ships;i++) {
      let ship = new Ship(i,this.gold_per_ship,this.fleet_type,this.color);
      this.s_array.push(ship);
      this.gold -= this.gold_per_ship;
    }
    this.num_ships = this.s_array.length;
    this.init();
  }  // end Fleet constructor

  init () {
      console.log("fleet built");
  }

}  // end Fleet class