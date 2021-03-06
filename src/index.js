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
        cancelAnimationFrame(frameID);
    }

    function start() {
        if (!started) { // don't request multiple frames
            started = true;
            // Dummy frame to get our timestamps and initial drawing right.
            // Track the frame ID so we can cancel it if we stop quickly.
            frameID = requestAnimationFrame(function(timestamp) {
                simBoard.draw(); // initial simBoard.draw
                running = true;
                // reset some time tracking letables
                lastFrameTimeMs = timestamp;
                lastFpsUpdate = timestamp;
                // actually start the main loop
                frameID = requestAnimationFrame(mainLoop);
            });
        }
    }

    function panic() {
        delta = 0;
        console.log("panic");
    }

    let ii_counter = 0;
    let i_counter = 0;

    function mainLoop(timestamp) {
        // throttle the frame rate  
        if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
            frameID = requestAnimationFrame(mainLoop);
            return;
        }
        
        // create virtual time
        delta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp;

        let numUpdateSteps = 0;
        while (delta >= timestep) {
            i_counter++;
            if (i_counter > 25) {
                simBoard.setTargets();
                i_counter = 0;
            }
            ii_counter++;
            if (ii_counter > 50) {
                simBoard.makeAttacks();
                ii_counter = 0;
            }
            simBoard.update(delta);
            delta -= timestep;
            if (++numUpdateSteps >= 124) {
                // stop();
                panic();
                break;
            }
        }
        simBoard.draw();


        let g = simBoard.gold_on_field().length;
        // console.log(g);

        if (g > 0) {
            frameID = requestAnimationFrame(mainLoop); 
        } else { 
            stop(); 
            endSim();
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
