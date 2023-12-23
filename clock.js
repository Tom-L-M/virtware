const { EventEmitter } = require('stream');

// Event emission:
// <ClockInstance>.on('stop', (ticksPassedInCycle, tickNumberInAllCycles) => {})
// <ClockInstance>.on('start', (tickNumberInCycle, ticksPassedInAllCycles) => {})
// <ClockInstance>.on('tick', (tickNumberInCycle, tickNumberInAllCycles) => {})
// <ClockInstance>.on('pause', (tickNumberInCycle, tickNumberInAllCycles) => {})
// <ClockInstance>.on('resume', (tickNumberInCycle, tickNumberInAllCycles) => {})

class Clock extends EventEmitter {
    #speed;
    #timer;
    #running;
    #tickInterval;
    #ticks;
    #ticksInCycle;
    #paused;
    #pausedStatus;

    constructor (speed) {
        super(); // Call EventEmitter constructor
        this.#speed = speed; // In HZ (cycles per second) : X cycles per second = X Hz
        this.#timer = null;
        this.#running = false;
        this.#tickInterval = 1000 / (this.#speed);
        this.#ticks = 0; // Ticks passed in all clock cycles - total ticks
        this.#ticksInCycle = 0; // ticks passed in the current clock cycle (resets on calling 'stop()')
        this.#paused = false;
        this.#pausedStatus = { ticks: null, ticksInCycle: null };
    }

    // Block edition of internal properties, while allowing read access to them
    get speed () { return this.#speed; };
    get running () { return this.#running; };
    get paused () { return this.#paused; };
    get ticks () { return this.#ticks; };
    get ticksInCycle () { return this.#ticksInCycle; };
    get paused () { return this.#paused; };

    // Time in milisseconds of the clock running in all cycles
    timePassed () { return this.#ticks * this.#tickInterval; }

    // Time in milisseconds of the clock running in last (or current) cycle
    timePassedInCycle () { return this.#ticksInCycle * this.#tickInterval; }

    // Ticks passed in total (alternative to listening to the events)
    ticksPassed () { return this.#ticks; }

    // Ticks passed in total (alternative to listening to the events)
    ticksPassedInCycle () { return this.#ticksInCycle; }

    isRunning () { return !!this.#running && !!this.#timer; }
    
    // Starts the clock countdown, according to a proper speed
    start () {
        // If timer is already running return false
        if (!!this.#timer && !!this.#running) return false;

        // Restarts cycle tick counter
        this.#ticksInCycle = 0;
        
        this.#running = true;

        // Emit 'start' event - before starting first tick
        this.emit('start', this.#ticksInCycle, this.#ticks);

        // If timer is not running, start it and return true
        this.#timer = setInterval(() => {
            this.emit('tick', ++this.#ticksInCycle, ++this.#ticks);
        }, this.#tickInterval);

        return true;
    }

    // Pauses the timer until 'resume()' is called
    pause () {
        // If timer is not running, return false
        if (!this.#timer) return false;

        // If timer is running, clear it, nullify the holder, and return true
        clearInterval(this.#timer);
        this.#paused = true;
        this.#timer = null;
        this.#running = false;
        this.emit('pause', this.#ticksInCycle, this.#ticks);
        this.#pausedStatus.ticksInCycle = this.#ticksInCycle;
        this.#pausedStatus.ticks = this.#ticks;
        return true;
    }

    // Resumes the timer after a 'pause()' call
    resume () {
        // If timer is already running or not paused return false
        if (this.#running || !this.#paused) return false;

        // Restarts cycle tick counter
        this.#ticksInCycle = this.#pausedStatus.ticksInCycle;
        this.#ticks = this.#pausedStatus.ticks;

        this.#pausedStatus.ticksInCycle = null;
        this.#pausedStatus.ticks = null;
        
        this.#running = true;

        this.#paused = false;

        // Emit 'start' event - before starting first tick
        this.emit('resume', this.#ticksInCycle, this.#ticks);

        // If timer is not running, start it and return true
        this.#timer = setInterval(() => {
            this.emit('tick', ++this.#ticksInCycle, ++this.#ticks);
        }, this.#tickInterval);

        return true;
    }

    // Stops the timer
    stop () {
        // If timer is not running, return false
        if (!this.#timer) return false;

        // If timer is running, clear it, nullify the holder, and return true
        clearInterval(this.#timer);
        this.#timer = null;
        this.#running = false;
        this.emit('stop', this.#ticksInCycle, this.#ticks);
        return true;
    }

    // Pauses the timer for a determinate number of misseconds
    restart (pauseInterval = 0) { // pauseInterval in milisseconds
        // If timer is not runnning return false;
        if (!this.#timer) return false;

        // If timer is running, stop it, wait for interval, and restart it - then return true
        this.stop();
        this.delayedStart(pauseInterval);
        return true;
    }

    // Wait X milisseconds before starting the clock - where X equals 'delay' parameter
    delayedStart (delay) { // 'Delay' is in milisseconds
        // If timer is already running return false
        if (!!this.#timer) return false;

        // If timer is not running, wait for X ms, start it and return true
        if (this.delayedStart === 0) this.start(); // Starts in current node.js event loop if delay is zero
        else setTimeout(() => this.start(), delay);
        return true;
    }
}

module.exports = Clock;