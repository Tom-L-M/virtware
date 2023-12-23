const { EventEmitter } = require('stream');

class CPU extends EventEmitter {
    constructor () {
        super();
    }
}

module.exports = CPU;