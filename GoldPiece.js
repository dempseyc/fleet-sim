class GoldPiece {
  constructor (idx) {
    this.idx = idx;
    this.x = randomMM(0,1000);
    this.y = randomMM(0,1000);
    this.owned_by = "none";
    this.init();
  }
  init() {
    let classes = ['gold'];
    this.domH = document.createElement('div');
    this.domH.setAttribute("id", `g-${this.idx}`);
    this.domH.classList.add(...classes);
    this.draw = function () {
      this.domH.style.left = `${this.x/10}%`;
      this.domH.style.top = `${this.y/10}%`;
    }
    this.remove = function () {
      this.domH.remove();
      // console.log('gold removed');
    }
    this.draw();
  }
}