import './style.scss';
import { Board } from './Board.js';

// revenue of average ship: 66;

// runSim and collect Data 3 times;

let data = [
    {banner: 'red', gold: 0},
    {banner: 'green', gold: 0},
    {banner: 'blue', gold: 0}
];

function displayData () {
    let rScoreDOMh = document.querySelector('#r-score');
    rScoreDOMh.textContent = data[0].gold;
    let gScoreDOMh = document.querySelector('#g-score');
    gScoreDOMh.textContent = data[1].gold;
    let bScoreDOMh = document.querySelector('#b-score');
    bScoreDOMh.textContent = data[2].gold;
}

function runSim () {
    let simData = {
        // revenue of average ship: 66;
        red: { gold: 0, strategy: {} },
        green: {gold: 0, strategy: {} },
        blue: { gold: 0, stategy: {} }
    };

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
            if (i_counter > 74) {
                // console.log(i_counter);
                every_75_frames();
                i_counter = 0;
            }
            ii_counter++;
            if (ii_counter > 199) {
                // console.log(ii_counter);
                every_200_frames();
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
            afterSim();
        }

        function every_200_frames () {
            simBoard.twoSecUpdate();
        }

        function every_75_frames () {
            simBoard.oneSecUpdate();
        }

    }

    start();

    function afterSim () {
        simBoard.fleets.forEach((f,i) => {
            let gold = f.s_array.reduce((a,s,i) => {
                return a+s.gold;
            }, 0);
            data[i].gold += gold;
            console.log(i+1, f.banner, gold);
        });
        displayData();
    }

}// function runSim

runSim();