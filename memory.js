/**
 * Creates an instance of VirtualMemory
 * This class is not intended to be created directly, instead,
 * use the proper interfaces.
 * @class
 */
class VirtualMemory {
    #size;
    #pool;
    #bytesize;

    constructor (ArrayByteConstructor, VirtualMemorySize, ByteSize) {
        this.#size = VirtualMemorySize;
        this.#pool = new ArrayByteConstructor(VirtualMemorySize);
        this.#bytesize = ByteSize;
    }

    // Block edition of internal properties, while allowing read access to them
    get size () { return this.#size; };
    get pool () { return this.#pool; };
    get bytesize () { return this.#bytesize; };
    
    /**
     * Returns a full clone of the memory pool
     * @returns {Number[]} Returns an array of bytes represented as numbers (from 0 to 255)
     */
    dump () {
        // Important: regular 'fetch' calls return subarrays of a deterined constructor
        // ex: when creating a VMemory16b set with UInt16Array, a slice of it is a slice 
        //  of a UInt16Array not a regular Array, so, calls to JSON.stringify() return Object instances like: { 0: '', 1: '' }
        //  so, first it is necessary to convert the pool into a simple Array by casting Array.from()
        return JSON.parse(JSON.stringify(Array.from(this.#pool)));
    }
    
    /**
     * Returns a given number of bytes from the memory array
     * @param {Number} startingAddress The first byte to fetch
     * @param {Number} numberOfBytes The number of bytes to fetch
     * @returns {Number[]} Returns an array of bytes represented as numbers (from 0 to 255)
     */
    fetch (startingAddress, numberOfBytes) {
        return this.#pool.slice(startingAddress, startingAddress+numberOfBytes);
    }

    /**
     * Writes a given number of bytes into memory - warning, it overrites other bytes if locations collide
     * @param {Number} startingAddress The first byte to start writing the memory
     * @param {Number[]} bytesToWrite An array of bytes to write,
     * @returns The address of the last byte written
     */
    write (startingAddress, bytesToWrite = []) {
        let i = 0;
        
        // If the byte value is higher than the maximum allowed, 
        //  rewrite it to loop again starting at zero (ex: 257 at a UInt8Array becomes 1)
        let tmp = bytesToWrite >= (2**this.#bytesize) ? (bytesToWrite % (2**this.#bytesize)) : bytesToWrite;
        // let tmp = bytesToWrite;

        for (i; i < tmp.length; i++) {
            this.#pool[startingAddress+i] = tmp[i];
        }
        
        return startingAddress+i;
    }
}

/**
 * Creates an interface for a VirtualMemory instance, with 8-bit memory addresses
 * @interface VMemory8b
 */
class VMemory8b extends VirtualMemory {
    constructor (VirtualMemorySize) {
        super(Uint8Array, VirtualMemorySize, 8);
    }
}

/**
 * Creates an interface for a VirtualMemory instance, with 16-bit memory addresses
 * @interface VMemory16b
 */
class VMemory16b extends VirtualMemory {
    constructor (VirtualMemorySize) {
        super(Uint16Array, VirtualMemorySize, 16);
    }
}

/**
 * Creates an interface for a VirtualMemory instance, with 32-bit memory addresses
 * @interface VMemory32b
 */
class VMemory32b extends VirtualMemory {
    constructor (VirtualMemorySize) { 
        super(Uint32Array, VirtualMemorySize, 32);
    }
}

module.exports = { VMemory8b, VMemory16b, VMemory32b };