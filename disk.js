class Disk {
    #table;
    #pool;
    #pointer;

    constructor () {
        this.#table = {};
        this.#pool = new Uint8Array(size);
        this.#pointer = 0;
    }
    
    // Block edition of internal properties, while allowing read access to them
    get pointer () { return this.#pointer; };

    /**
     * Writes a given number of bytes into a virtual disk; 
     * WARNING: it overrites other bytes if locations collide - it is safer to use writeBlock
     * @param {Number} startingAddress The first byte to start writing
     * @param {Number[]} bytesToWrite An array of bytes to write
     * @returns The address of the last byte written
    */
    writeUnsafe (startingAddress, bytesToWrite = []) {
        let i = 0;
        for (i; i < bytesToWrite.length; i++) {
            this.#pool[startingAddress+i] = bytesToWrite[i];
        }
        return startingAddress+i;
    }

    /**
     * Reads a given number of bytes from a virtual disk; 
     * WARNING: reading from random places may bring partial data - it is safer to use readBlock
     * @param {Number} startingAddress The first byte to start reading
     * @param {Number} bytesToRead Number of bytes to read
     * @returns The address of the last byte read
    */
    readUnsafe (startingAddress, bytesToRead) {
        return this.#pool.slice(startingAddress, startingAddress+bytesToRead);
    }

    /**
     * Writes a given number of bytes into a virtual disk at an empty location;
     * @param {String} blockname The blockname to index in the table for future reference
     * @param {Number[]} bytesToWrite An array of bytes to write
     * @returns The address of the first written byte
    */
    writeBlock (blockname, bytesToWrite = []) {
        this.#table[blockname] = {
            start: this.#pointer,
            size: bytesToWrite
        };
        for (this.#pointer; this.#pointer < bytesToWrite.length; this.#pointer++) {
            this.#pool[startingAddress+this.#pointer] = bytesToWrite[this.#pointer];
        }
        this.#pointer++; // move pointer to next free address
        return this.#table[blockname].start;
    }

    /**
     * Reads a given number of bytes from a virtual disk at a defined location;
     * @param {String} blockname The blockname to findo and read the bytes from
     * IF SUCESS:
     * @returns The bytes readed
     * IF ERROR:
     * @returns An empty UINT8 array
    */
    readBlock (blockname) {
        if (this.#table[blockname]) {
            return this.#pool.slice(this.#table[blockname].start, this.#table[blockname].start + this.#table[filblocknameename].size);
        } else {
            return new Uint8Array(0);
        }
    }

    /**
     * Writes a given number of bytes into the first empty place found (where the pointer points)
     * @param {Number[]} bytesToWrite An array of bytes to write
     * @returns The new address of 'this.#pointer'
    */
    writeAtPointer (bytesToWrite = []) {
        for (this.#pointer; this.#pointer < bytesToWrite.length; this.#pointer++) {
            this.#pool[startingAddress+this.#pointer] = bytesToWrite[this.#pointer];
        }
        this.#pointer++; // move pointer to next free address
        return this.#pointer;
    }
}

module.exports = Disk;