class Ship {

  constructor (idx,cost,style,color) {
    switch (style) {
      case "average": {
        this.profile_sh_wp_eg = [20,20,20];
        break;
      }
      case "swift": {
        this.profile_sh_wp_eg = [6,6,27];
        break;
      }
      case "transport": {
        this.profile_sh_wp_eg = [20,0,25];
        break;
      }
      case "gunner": {
        this.profile_sh_wp_eg = [0,24,24];
        break;
      }
      case "speeder": {
        this.profile_sh_wp_eg = [0,0,30];
        break;
      }
      default: {
        this.profile_sh_wp_eg = [25,25,10];
      }
    }

    this.color = color;
    this.idx = idx;
    this.cost = cost;
    this.assets = cost;
    this.diminishAssets = function (system,val) {
      let expense = val;
      if (system === "eg") {
        expense = val * 4;
      }
      this.assets -= expense;
    }
    this.equip = function (system,custom) {
      let val = custom;
      this.diminishAssets(system,val);
      return val;
    }
    this.shield = this.equip("sh", this.profile_sh_wp_eg[0]);
    this.weapon = this.equip("wp", this.profile_sh_wp_eg[1]);
    this.engine = this.equip("eg", this.profile_sh_wp_eg[2]);
    this.speed = this.engine * 0.06;
    this.status = 0;
    // this.getAttacked = this.getAttacked.bind(this);

    this.init();
  } // end Ship constructor

  //methods

  ///////////////////////// init
  init () {
    let classes = ['ship',`s-${this.idx}`, `s-${this.color}`];
    this.domH = document.createElement('div');
    this.domH.classList.add(...classes);
    this.getInitialPosition();
    this.draw = function() {
      this.domH.style.left = `${this.x/10}%`;
      this.domH.style.top = `${this.y/10}%`;
    };
    this.move = function (delta) {
      this.x += this.vx * delta * 0.05 * this.speed;
      this.y += this.vy * delta * 0.05 * this.speed;
      // console.log(delta);
    }
    this.draw();
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
    this.assets += 1;
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

  setEnemyTarget(other_fleet,another_fleet) {


    let et_distance_sq = 1000 * 1000 * 2;

    let squareNum = function (n) { return Math.pow(n,2); };

    other_fleet.s_array.forEach((i_e) => {
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

    another_fleet.s_array.forEach((i_e) => {
      let x_distance = this.x - i_e.x;
      let y_distance = this.y - i_e.y;
      let i_e_distance_sq = squareNum(x_distance) + squareNum(x_distance);

      if (i_e_distance_sq <= et_distance_sq) {
        this.et = i_e;
        et_distance_sq = i_e_distance_sq;
        this.et_d = et_distance_sq;
      }

    });
    // console.log(this.et_d, "etd");
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
    // console.log("damage", damage);
    // console.log(this.shield);
    this.shield -= damage;
    if (this.shield<=0) {
      this.speed = (this.engine+this.shield) * 0.06;
    }
    this.startStunnedTimer();
  }

  startStunnedTimer () {
    // console.log("got stunned", this.speed);
    this.status = 3;
  }

  incrementStunnedTimer () {
    if (this.status > 0) {
      this.status--;
    }
    if (this.status === 0) {
      this.speed = this.engine * 0.06;
      this.sheild = this.profile_sh_wp_eg[0];
    }
  }

}  // end Ship class