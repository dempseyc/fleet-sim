class Ship {

  constructor (idx,cost,style,color) {
    switch (style) {
      case "average": {
        this.profile_sh_wp_eg = [20,20,20];
        break;
      }
      case "swift": {
        this.profile_sh_wp_eg = [10,10,40];
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
    this.diminishAssets = function (expense) {
      this.assets -= expense;
    }
    this.equip = function (system,custom) {
      let initial_val = cost/3;
      let val = (custom ? custom : initial_val);
      this.diminishAssets(val);
      return val;
    }
    this.shield = this.equip("sh", this.profile_sh_wp_eg[0]);
    this.weapon = this.equip("wp", this.profile_sh_wp_eg[1]);
    this.engine = this.equip("eg", this.profile_sh_wp_eg[2]);

    this.init();
  } // end Ship constructor

  //methods

  ///////////////////////// init
  init () {
    this.getInitialPosition();
  }

  getInitialPosition () {
    this.x = randomMM(1,1000);
    this.y = randomMM(1,1000);
  }

  resetVector () {
    let mvx = this.x - this.gt.x;
    let mvy = this.y - this.gt.y;
    let mag = Math.sqrt(squareNum(mvx)+squareNum(mvy));
    this.vx = mvx/mag;
    this.vy = mvy/mag;
  }

  move (delta) {
    this.x += Math.floor(this.vx*this.engine) * delta *5;
    this.y += Math.floor(this.vy*this.engine) * delta *5;
  }

  acquireGold () {
    this.assets += 1 ;
  }

  setGoldTarget(gold_pieces) {

    let gt_distance_sq = 20164 * 1000;

    gold_pieces.forEach((gp) => {
      let x_distance = Math.abs(this.x - gp.x);
      let y_distance = Math.abs(this.y - gp.y);
      let i_g_distance_sq = squareNum(x_distance) + squareNum(x_distance);

      if (typeof(this.gt) === 'undefined') {
        this.gt = gp;
        gt_distance_sq = i_g_distance_sq;
      }

      if (i_g_distance_sq <= gt_distance_sq) {
        this.gt = gp;
        gt_distance_sq = i_g_distance_sq;
      }
    });

    this.resetVector();
  }

  setEnemyTarget(other_fleet) {

    let et_distance_sq = 20164 * 1000;

    let squareNum = function (n) { return Math.pow(n,2); };

    other_fleet.s_array.forEach((i_e) => {
      let x_distance = Math.abs(this.x - i_e.x);
      let y_distance = Math.abs(this.y - i_e.y);
      let i_e_distance_sq = squareNum(x_distance) + squareNum(x_distance);

      if (typeof(this.et) === 'undefined') {
        this.et = i_e;
        et_distance_sq = i_e_distance_sq;
      }

      if (i_e_distance_sq <= et_distance_sq) {
        this.et = i_e;
        et_distance_sq = i_e_distance_sq;
      }

    });
  }

}  // end Ship class