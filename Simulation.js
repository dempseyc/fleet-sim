class Simulation {
  constructor () {
    let num_gold = 900;
    this.num_moves = 2000*2000;
    this.domH = document.getElementById('board');
    this.fleet1 = new Fleet("white",ships_per_fleet,gold_per_fleet);
    this.fleet2 = new Fleet("purple",ships_per_fleet,gold_per_fleet);
    this.fleet3 = new Fleet("green",ships_per_fleet,gold_per_fleet);
    this.gold_pieces = [];
    this.placeGold = function () {
      for (let i=0;i<num_gold;i++) {
        let gp = new GoldPiece(i);
        this.gold_pieces.push(gp);
      }
      this.gold_on_field = this.gold_pieces.filter(g => g.owned_by==="none");
    };
    this.placeGold();
    this.setTargets(this.fleet1,this.fleet2,this.fleet3);
    this.setTargets(this.fleet2,this.fleet1,this.fleet3);
    this.init();
  }

  init() {
    this.fleet1.s_array.forEach((s) => {
      this.domH.appendChild(s.domH);
    });
    this.fleet2.s_array.forEach((s) => {
      this.domH.appendChild(s.domH);
    });
    this.fleet3.s_array.forEach((s) => {
      this.domH.appendChild(s.domH);
    });
    this.gold_pieces.forEach((gp) => {
      this.domH.appendChild(gp.domH);
    })
  }

  setTargets(fleet,other_fleet,third_fleet) {
    fleet.s_array.forEach((s) => {
      s.setGoldTarget(this.gold_on_field);
      s.setEnemyTarget(other_fleet,third_fleet);
    });
    other_fleet.s_array.forEach((s) => {
      s.setGoldTarget(this.gold_on_field);
      s.setEnemyTarget(fleet,third_fleet);
    });
    third_fleet.s_array.forEach((s) => {
      s.setGoldTarget(this.gold_on_field);
      s.setEnemyTarget(other_fleet,fleet);
    });
  }

  makeAttacks(fleet,other_fleet,third_fleet) {
    fleet.s_array.forEach((s) => {
      s.attackEnemy();
    });
    other_fleet.s_array.forEach((s) => {
      s.attackEnemy();
    });
    third_fleet.s_array.forEach((s) => {
      s.attackEnemy();
    });
  }

  doHitDetect (aFleet) {
    aFleet.s_array.forEach((s) => {
      this.gold_pieces.forEach((g) => {
        let dist_sq = squareNum(g.x-s.x) + squareNum(g.y-s.y);
        if ( dist_sq < 25 && g.owned_by==="none" ) {
          this.removeGold(g,s);
        }
      });
    });
  }

  removeGold (gp,s) {
    gp.owned_by = {color: s.color, s_idx: s.idx};
    this.gold_on_field = this.gold_pieces.filter(g => g.owned_by==="none");
    s.acquireGold();
    this.setTargets(this.fleet1,this.fleet2,this.fleet3);
    gp.remove();
  }

  reportGoldOnField () {
    return this.gold_on_field;
  } 

  draw () {
    this.doHitDetect(this.fleet1);
    this.doHitDetect(this.fleet2);
    this.doHitDetect(this.fleet3);
    this.fleet1.s_array.forEach((s) => {
      s.draw();
    });
    this.fleet2.s_array.forEach((s) => {
      s.draw();
    });
    this.fleet3.s_array.forEach((s) => {
      s.draw();
    });
  }

  update (delta) {
    this.fleet1.s_array.forEach((s) => {
      s.move(delta);
    });
    this.fleet2.s_array.forEach((s) => {
      s.move(delta);
    });
    this.fleet3.s_array.forEach((s) => {
      s.move(delta);
    });
  }

  oneSecUpdate () {
    this.makeAttacks(this.fleet1,this.fleet2,this.fleet3);
    this.setTargets(this.fleet1,this.fleet2,this.fleet3);
    // console.log("1sec Update");
  }

  twoSecUpdate () {
    // console.log("2sec Update");
  }

} // end Simulation class