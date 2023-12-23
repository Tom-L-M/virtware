const { EventEmitter } = require('stream');
const readline = require('readline');

// Event emission:
// <KeyboardInstance>.on('invalidkeypress', (keyString, keyObject, keyRCode) => {}) // evet triggered by pressing a key that does not exists on the predefined keyboard
// <KeyboardInstance>.on('keypress', (keyString, keyObject, keyRCode) => {})
// <KeyboardInstance>.on('keylease', (keyString, keyObject, keyRCode) => {})
// EX:
//  keyString = 'd'
//  keyObject = { sequence: 'd', name: 'd', ctrl: false, meta: false, shift: false }
//  keyRCode = (variable, depending on keyboard values atributed, but for CHIP8 returns 0x9 for 'd') 

class Keyboard extends EventEmitter {
    #keymap;
    #waiting;
    #pressedKey;
    #keysPressed;
    #leaseInterval;

    constructor (keymap) {
        super();
        this.#keymap = keymap;
        this.#waiting = false;
        this.#pressedKey = null;
        this.#keysPressed = {};
        this.#leaseInterval = 150; // default if 150 for key leasing interval
    }

    // Block edition of internal properties, while allowing read access to them
    get keymap () { return this.#keymap; };
    get waiting () { return this.#waiting; };
    get pressedKey () { return this.#pressedKey; };
    get keysPressed () { return this.#keysPressed; };
    get leaseInterval () { return this.#leaseInterval; };

    activate () {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (keyString, keyObject) => {
            let keyRCode = this.#keymap[keyObject.name];
            if (!this.#_parseClick(keyString, keyObject, keyRCode)) {
                return this.emit('invalidkeypress', keyString, keyObject, keyRCode);
            }
            // Only calls the event if key is valid for specific keyboard
            this.emit('keypress', keyString, keyObject, keyRCode);
        });
    }

    closeRawMode () { process.stdin.setRawMode(false); }

    openRawMode () { process.stdin.setRawMode(true); }
    
    setLeaseInterval (value) { this.#leaseInterval = Number(value); }

    getKeysPressed() { return this.#keysPressed; }

    // triggers when a keypress event is detected
    waitKeypress () {
        return new Promise((resolve, reject) => {
            // This will only be called if a key that EXISTS ON CUSTOM KEYBOARD is called
            this.once('keypress', (keyString, keyObject, keyRCode) => {
                resolve(keyRCode);
            });
        });
    }

    // triggers when a keypress of type 'enter' is detected
    waitLine (question = '') {
        const customRL = readline.createInterface(process.stdin, process.stdout);
        return new Promise(async (resolve, reject) => {
            customRL.question(question, data => {
                customRL.close();
                resolve(data.split('').map(v => this.#keymap[v]).filter(v => v != undefined))
            });
        });
    }

    #_parseClick (keyString, keyObject, keyRCode) {
        // Return false if custom keyboard does not contain key
        if (!keyRCode && keyRCode !== 0) return false;

        // Add to concurrent keys pressed
        this.#keysPressed[keyRCode] = true;

        // Set timer to remove key from keyspressed after {{this.#leaseInterval}} ms
        setTimeout(() => {
            delete this.#keysPressed[keyRCode];
            this.emit('keylease', keyString, keyObject, keyRCode);
        }, this.#leaseInterval);

        // Return true if key exists on custom keyboard
        return true;
    }
}

class Keyboard16 extends Keyboard {
    constructor() {
        let keymap = {
			'1': 0x1, // 1
			'2': 0x2, // 2
			'3': 0x3, // 3
			'4': 0xC, // 4
			'q': 0x4, // Q
			'w': 0x5, // W
			'e': 0x6, // E
			'r': 0xD, // R
			'a': 0x7, // A
			's': 0x8, // S
			'd': 0x9, // D
			'f': 0xE, // F
			'z': 0xA, // Z
			'x': 0x0, // X
			'c': 0xB, // C
			'v': 0xF  // V
		}
        super(keymap);
    }
}

class Keyboard66 extends Keyboard {
    constructor() {
        let keymap = {

		}
        super(keymap);
    }
}

class Keyboard2 extends Keyboard {
    constructor() {
        let keymap = {
            '0': 0x0, // 0
			'1': 0x1, // 1
		}
        super(keymap);
    }
}

module.exports = { Keyboard2, Keyboard16, Keyboard66 };