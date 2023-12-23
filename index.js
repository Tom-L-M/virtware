const CPU = require('./cpu');
// Exports 'CPU'

const Clock = require('./clock');
// Exports 'Clock'

const Disk = require('./disk');
// Exports 'Disk'

const Display = require('./display');
// Exports 'Display'

const Keyboard = require('./keyboard');
// Exports { Keyboard16, Keyboard66 };

const Memory = require('./memory');
// Exports { VMemory8b, VMemory16b, VMemory32b };

const Register = require('./register');
// Exports { VRegister8b, VRegister16b, VRegister32b, VRegisterController }

const Stack = require('./stack');
// Exports { VStack8b, VStack16b, VStack32b }

module.exports = {
    CPU,
    Clock,
    Disk,
    Display,
    Keyboard,
    Memory,
    Register,
    Stack
}