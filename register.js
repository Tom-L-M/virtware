class VirtualRegister {
    #constructorReference;
    #value;
    #bytesize;
    
    constructor (ArrayByteConstructor, ByteSize) {
        this.#constructorReference = ArrayByteConstructor;
        this.#value = new this.#constructorReference(1);
        this.#value[0] = 0;
        this.#bytesize = ByteSize;
    }

    // Block edition of internal properties, while allowing read access to them
    get value () { return this.#value; };
    get bytesize () { return this.#bytesize; };

    // Set the value
    set (value) {
        // If the byte value is higher than the maximum allowed, 
        //  rewrite it to loop again starting at zero (ex: 257 at a UInt8Array becomes 1)
        // this.#value[0] = value >= (2**this.#ByteSize) ? (value % (2**this.#ByteSize)) : value;
        this.#value[0] = value;
        // Return only AFTER setting, so the UintArray can adjust itself
        return this.#value[0]; 
    }

    // Return the value
    get () { return this.#value[0]; }

    // Toggles the value according to those rules:
        // If register value is higher than zero: turns to zero
        // If register value is zero: turns to 1
    toggle () { return this.#value[0] = (this.#value[0] > 0 ? 0 : 1); }

    // Increases value in X
    inc (value = 1) {
        // If the byte value is higher than the maximum allowed, 
        //  rewrite it to loop again starting at zero (ex: 257 at a UInt8Array becomes 1)
        // this.#value[0] += (this.#value[0] + value) >= (2**this.#ByteSize) ? (value % (2**this.#ByteSize)) : value;
        this.#value[0] += value;
        // Return only AFTER increasing, so the UintArray can adjust itself
        return this.#value[0];
    }

    // Decreases value in X
    dec (value = 1) {
        // If the byte value is smaller than zero, rewrite it to loop again 
        //  starting at max Int (ex: -1 at a UInt8Array becomes 255)
        // TODO fix this - value should cycle up if smaller than 0
        // this.#value[0] -= (this.#value[0] - value) < 0 ? (value % (2**this.#ByteSize)) : value;

        this.#value[0] -= value;

        // Return only AFTER decreasing, so the UintArray can adjust itself
        return this.#value[0];
    }
}

class VRegister8b extends VirtualRegister {
    constructor () { super(Uint8Array, 8); }
}

class VRegister16b extends VirtualRegister {
    constructor () { super(Uint16Array, 16); }
}

class VRegister32b extends VirtualRegister {
    constructor () { super(Uint32Array, 32); }
}

class VRegisterController {
    constructor () {
        this.registers = {};
    }
    
    // Substcribe a register to the controller 
    // (useful if creating registers with direct classes)
    subscribe (name, VRegisterInstance) {
        this.registers[name] = VRegisterInstance;
    }

    // Creates a register and subscribe to the controller
    create (name, byteSize) {
        let VRegisterConstructor = VRegister8b;
        switch (byteSize.toString()) {
            case  '8': VRegisterConstructor = VRegister8b;  break;
            case '16': VRegisterConstructor = VRegister16b; break;
            case '32': VRegisterConstructor = VRegister32b; break;
        }
        this.subscribe(name, new VRegisterConstructor());
    }
    
    // Sets a register to a specific value
    set (name, value) {
        return this.registers[name] ? this.registers[name].set(value) : -1;
    }
    
    // Returns the value of a specific register
    get (name) {
        return this.registers[name] ? this.registers[name].get() : -1;
    }
    
    // Increments the value of a register in X numbers
    inc (name, value = 1) {
        return this.registers[name] ? this.registers[name].inc(value) : -1;
    }

    // Decrements the value of a register in X numbers
    dec (name, value = 1) {
        return this.registers[name] ? this.registers[name].dec(value) : -1;
    }

    // Toggles the value of a register according to those rules:
        // If register value is higher than zero: turns to zero
        // If register value is zero: turns to 1
    toggle (name) {
        return this.registers[name] ? this.registers[name].toggle() : -1;
    }
}

module.exports = { VRegister8b, VRegister16b, VRegister32b, VRegisterController }