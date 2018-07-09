class Simulation {
  constructor () {
    let num_gold = 250;
    this.num_moves = 2000*2000;
    this.fleet1 = new Fleet("white",ships_per_fleet,gold_per_fleet);
    this.fleet2 = new Fleet("red",ships_per_fleet,gold_per_fleet);
    this.gold_pieces = [];
    this.placeGold = function () {
      for (let i=0;i<num_gold;i++) {
        let gp = new GoldPiece(i);
        this.gold_pieces.push(gp);
      }
    };
    this.placeGold();
    this.setTargets(this.fleet1,this.fleet2);
    this.setTargets(this.fleet2,this.fleet1);
  }

  setTargets(fleet,other_fleet) {
    fleet.s_array.forEach((s) => {
      s.setGoldTarget(this.gold_pieces);
      s.setEnemyTarget(other_fleet);
    });
  }

  doHitDetect (fleet) {
    fleet.s_array.forEach((s) => {
      this.gold_pieces.forEach((g) => {
        if ( s.x===g.x && s.y===g.y) {
          this.removeGold(g);
          s.acquireGold();
          s.setGoldTarget(this.gold_pieces);
        }
      });
    });
  }

  removeGold(gp) {
    if (this.gold_pieces.length > 1) {
      this.gold_pieces.splice(gp.idx,1);
      console.log("gold gotten",this.gold_pieces.length);
    } else {
      this.gold_pieces=[];
      this.stopLoop();
    }
  }

  draw() {
    console.log("draw");
  }

  update(delta) {
    this.fleet1.s_array.forEach((s) => {
      s.move(delta);
    });
    this.fleet2.s_array.forEach((s) => {
      s.move(delta);
    });
  }

} // end Simulation class