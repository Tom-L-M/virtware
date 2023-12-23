class VirtualStack {
    #size;
    #pool;
    #firstFreeAddress;
    #bytesize;

    constructor (ArrayByteConstructor, VirtualMemorySize, ByteSize) {
        this.#size = VirtualMemorySize;
        this.#pool = new ArrayByteConstructor(VirtualMemorySize);
        this.#firstFreeAddress = 0;
        this.#bytesize = ByteSize;
    }

    // Block edition of internal properties, while allowing read access to them
    get size () { return this.#size; };
    get pool () { return this.#pool; };
    get firstFreeAddress () { return this.#firstFreeAddress; };
    get bytesize () { return this.#bytesize; };
    
    pop () {
        this.#firstFreeAddress -= 1;
        let popped = this.#pool[this.#firstFreeAddress];
        this.#pool[this.#firstFreeAddress] = 0;
        return popped;
    }
    
    push (item) {
        // If the byte value is higher than the maximum allowed, 
        //  rewrite it to loop again starting at zero (ex: 257 at a UInt8Array becomes 1)
        // this.#pool[this.#firstFreeAddress] = (item) >= (2**this.#ByteSize) ? (item % (2**this.#ByteSize)) : item;
        this.#pool[this.#firstFreeAddress] = item;

        this.#firstFreeAddress += 1;
        return item;
    }

    peek () {
        return this.#pool[this.#firstFreeAddress];
    }
}

class VStack8b extends VirtualStack {
    constructor (VirtualMemorySize = 128) {
        super(Uint8Array, VirtualMemorySize, 8);
    }
}

class VStack16b extends VirtualStack {
    constructor (VirtualMemorySize = 128) {
        super(Uint16Array, VirtualMemorySize, 16);
    }
}

class VStack32b extends VirtualStack {
    constructor (VirtualMemorySize = 128) {
        super(Uint32Array, VirtualMemorySize, 32);
    }
}

module.exports = { VStack8b, VStack16b, VStack32b }