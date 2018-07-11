

var board = new Simulation();

var lastFrameTimeMs = 0,
    maxFPS = 100,
    delta = 0,
    lastFrameTimeMs = 0,
    timestep = 1000 / 100;

var running = false,
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
            board.draw(1); // initial board.draw
            running = true;
            // reset some time tracking variables
            lastFrameTimeMs = timestamp;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
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

    var numUpdateSteps = 0;
    while (delta >= timestep) {
        i_counter++;
        if (i_counter > 74) {
            console.log(i_counter);
            every_75_frames();
            i_counter = 0;
        }
        ii_counter++;
        if (ii_counter > 199) {
            console.log(ii_counter);
            every_200_frames();
            ii_counter = 0;
        }
        board.update(delta);
        delta -= timestep;
        if (++numUpdateSteps >= 124) {
            // stop();
            panic();
            break;
        }
    }
    board.draw();


    var g = board.gold_on_field.length;
    // console.log(g);

    if (g > 0) {
        frameID = requestAnimationFrame(mainLoop); 
    } else { 
        stop(); 
        afterSim();
    }

    function every_200_frames () {
        board.twoSecUpdate();
    }

   function every_75_frames () {
        board.oneSecUpdate();
    }

}

start();

function afterSim () {
    let f1_gold = board.fleet1.s_array.reduce((a,s,i) => {
        return a+s.assets;
    }, 0);
    let f2_gold = board.fleet2.s_array.reduce((a,s,i) => {
        return a+s.assets;
    }, 0);
    let f3_gold = board.fleet3.s_array.reduce((a,s,i) => {
        return a+s.assets;
    }, 0);
    console.log("1", board.fleet1.fleet_type, f1_gold);
    console.log("2", board.fleet2.fleet_type, f2_gold);
    console.log("3", board.fleet3.fleet_type, f3_gold);
}