// Creates a matrix of pixels. A pixel is OFF if its value is equal zero.
// A pixel is on if value is higher than zero.
// The value of a pixel can vary from 0 to 4294967295 (32 bits)
// On rendering, an object containing "intensity":"char" can be 
//   used to map intensity values to specific chars and colors
//   not providing an intensity map, will make it replace OFF (0) for '  ' and ON (1) for '██'
// WARNING: In order to make pixels a proper square, painting chars are doubled: '██' and '  ', 
//   and this should be the default for delared charmaps

class Display {
    #rows;
    #columns;
    #charmap;
    #buffer;
    #rendercache;

    constructor (verticalSize, horizontalSize) {
        this.#rows = verticalSize;
        this.#columns = horizontalSize;
        this.#buffer = new Array(this.#rows).fill(0).map(x => new Array(this.#columns).fill(0));
        this.#charmap = { '1': '██', '0': '  ' };
        this.#rendercache = []; // The last rendered screen is kept here, for easy cached access
    }

    // Block edition of internal properties, while allowing read access to them
    get rows () { return this.#rows; };
    get columns () { return this.#columns; };
    get charmap () { return this.#charmap; };
    get buffer () { return this.#buffer; };
    get rendercache () { return this.#rendercache; };

    // Since windows does not give access to sound API, this is very primitive
    // emitSound () {
    //     // not working :(
    //     // execSync('powershell -c "echo `a"');
    // }

    // Resets buffer
    clear () {
        console.clear();
        this.#buffer = this.#buffer.map(x => x.map(y => 0));
        return this;
    }

    isON (vertical, horizontal) {
        if (!this.#buffer[vertical]) return undefined;
        return this.#buffer[vertical][horizontal] > 0;
    }

    get (vertical, horizontal) {
        if (!this.#buffer[vertical]) return undefined;
        if (this.#buffer[vertical][horizontal] == undefined) return undefined;
        return this.#buffer[vertical][horizontal];
    }

    set (vertical, horizontal, intensity = 1) {
        if (!this.#buffer[vertical]) return undefined;
        if (this.#buffer[vertical][horizontal] == undefined) return undefined;
        return this.#buffer[vertical][horizontal] = intensity;
    }

    fill (verticalStart = 0, verticalEnd = this.#rows, horizontalStart = 0, horizontalEnd = this.#columns, intensity = 1) {
        // if (!this.#buffer[vertical]) return undefined;
        for (let i = verticalStart; i <= verticalEnd; i++) {
            for (let j = horizontalStart; j <= horizontalEnd; j++) {
                this.#buffer[i][j] = intensity;
            }
        }
    }

    toggle (vertical, horizontal, intensityWhenON = 1) {
        // if (!this.get(vertical, horizontal)) return undefined;
        // Returns false if pixel is set to OFF
        if (this.isON(vertical, horizontal)) {
            this.set(vertical, horizontal, 0);
            return false;
        // Returns true if pixel is set to ON
        } else {
            this.set(vertical, horizontal, intensityWhenON);
            return true;
        }
    }

    // Optimize drawing function (for opcode DXYN) - taking up to 8 ms
    render (intensityMap = {}) {
        if (this.#rendercache.join('') !== this.#buffer.join('')) {
            // Only re-render if cached version is not useful
            // This way, if it is just a frame update, a lot of time will be saved
            this.#rendercache = this.#buffer.map(x => 
                x.map(y => 
                    (intensityMap[y.toString()] == undefined ? 
                        (
                            this.#charmap[y.toString()] !== undefined ?
                                this.#charmap[y.toString()]
                                : y.toString()
                        )
                        : intensityMap[y.toString()]
                    )
                )
            );
        }

        console.log(
            `╔${'═'.repeat(this.#columns * 2)}╗\n` + 
            this.#rendercache.map(x => '║'+x.join('')+'║').join('\n') + 
            `\n╚${'═'.repeat(this.#columns * 2)}╝`
        );
        // this.#rendercache = null;
        return this;
    }
}

module.exports = Display;