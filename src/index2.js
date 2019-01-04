import './style.scss';
import { Board } from './Board.js';
import { stanDev, getMean } from './utils.js';

// revenue of average ship: 66;

// runSim and collect Data iter times
let ready = true;
let done = false;
let runs = 3; // for standard deviation ///// seems to grow with variation
let iter = 3; // same as runs, but stateful
let rScoreDOMh = document.querySelector('#r-score');
let bScoreDOMh = document.querySelector('#b-score');
let gScoreDOMh = document.querySelector('#g-score');
let stanDevDOMh = document.querySelector('#stan-dev');
let scores = [];

let data = [
    {banner: 'red', gold: 0},
    {banner: 'green', gold: 0},
    {banner: 'blue', gold: 0}
];

function displayData () {
    rScoreDOMh.textContent = data[0].gold;
    gScoreDOMh.textContent = data[1].gold;
    bScoreDOMh.textContent = data[2].gold;
    ready = true;
}

function displayAverage () {
    rScoreDOMh.textContent = `${data[0].gold / runs} avg`;
    gScoreDOMh.textContent = `${data[1].gold / runs} avg`;
    bScoreDOMh.textContent = `${data[2].gold / runs} avg`;
    displayStanDev();
    ready = true;
}

function displayStanDev () {
    stanDevDOMh.textContent = stanDev(scores);
}

function runSim () {
    ready = false;

    let simBoard = new Board();

    let frameID = 0,
        lastFpsUpdate = 0,
        lastFrameTimeMs = 0,
        maxFPS = 100,
        delta = 0,
        timestep = 1000 / 100;

    let running = false,
        started = false;
        
    function stop() {
        running = false;
        started = false;
    }

    function start() {
        if (!started) {
            started = true;
            let startLoop = mainLoop();
        }
    }

    function next(cb) {
        cb();
    }

    function panic() {
        delta = 0;
        console.log("panic");
    }

    let ii_counter = 0;
    let i_counter = 0;

    function mainLoop() {
        let g = simBoard.gold_on_field().length;
        while (g>0) {
            i_counter++;
            if (i_counter > 74) {
                every_75_frames();
                i_counter = 0;
            }
            ii_counter++;
            if (ii_counter > 199) {
                every_200_frames();
                ii_counter = 0;
            }
            simBoard.update(delta);
            simBoard.draw();
        }
        stop(); 
        endSim();

        function every_200_frames () {
            simBoard.twoSecUpdate();
        }

        function every_75_frames () {
            simBoard.oneSecUpdate();
        }

    }

    start();

    function endSim () {
        simBoard.fleets.forEach((f,i) => {
            let gold = f.s_array.reduce((a,s,i) => {
                return a+s.gold;
            }, 0);
            scores.push(gold);
            data[i].gold += gold;
            console.log(i+1, f.banner, gold);
        });
        simBoard.clear();
        displayData();
        iter--;
        if (iter>0) {
            // the point of recursion
            runSim();
        }
        else {
            done = true;
            displayAverage();
            console.log("complete");
        }
    }
}// function runSim

runSim();
