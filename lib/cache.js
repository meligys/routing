const fs = require('fs');

const DEFAULT_CACHE_PATH = './cache.dat';
const FILE_MODE = { encoding: 'utf-8', mode: 0o644 }

class Cache {

    constructor(path) {

        this.cachePath = DEFAULT_CACHE_PATH;
        if (path !== undefined) {
            this.cachePath = path;
        }

        this.cache = {};

        this.create();
    }

    create() {
        if (!fs.existsSync(this.cachePath)) {
            try {
                fs.writeFileSync(this.cachePath, '', FILE_MODE);
            } catch (e) {
                throw e;
            }
        }
    }

    write(json) {

        this.create();
        const jsonStr = JSON.stringify(json);
        fs.writeFileSync(this.cachePath, jsonStr, FILE_MODE);
        this.cache = json;
    }

    get(entry) {
        if (this.cache === {}) {
            this.load();
            if (this.cache === {}) {
                throw new Error(`Cache has not been initialized`)
            }
        }

        const entryArray = entry.split('.');
        if (entryArray.length !== 2) {
            throw new Error(`Target should only be of size 2, is of size ${entryArray.length} : ${entryArray}`)
        }

        return this.cache[entry];
    }

    load() {
        if (!fs.existsSync(this.cachePath)) {
            throw new Error('Cache does not exists');
        }
        const raw = fs.readFileSync(this.cachePath);
        this.cache = JSON.parse(raw);
    }

    remove() {
        try {
            fs.unlinkSync(this.cachePath)
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Cache;