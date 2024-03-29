import { Crate } from "./crate";
import { Globals } from "./globals";

/**
 * A unit of a level that can be remixed and combined with others.
 * Spawns in enemies, crates, hazards, etc.
 */
export interface Chunk{
    name: string,
    difficulty: number, // estimated difficulty of chunk, 0 for tutorial, 1 for very easy, up to 5 for very hard
    tags: string[], // tag markers for chunks e.g. checkpoint, arena, etc.
    loadFn: ()=>void, // the function to call to begin the chunk
    clearPredicate?: ()=>boolean; // if present, this function returns false until the chunk is beaten, then true
    delay: number, // time to wait after start of level or last chunk
}

export class ChunkManager{
    chunks: Map<string, Chunk>;
    levels: Map<string, Chunk[]>;
    constructor(){
        this.chunks = new Map();
        this.levels = new Map();

        // const dodge: Chunk[] = [
        //     {
        //         name: 'crate_10001',
        //         difficulty: 1,
        //         tags: [],
        //         loadFn: getCrateChunk('10001'),
        //         delay: 1,
        //     },
        //     {
        //         name: 'crate_10101',
        //         difficulty: 1,
        //         tags: [],
        //         loadFn: getCrateChunk('10101'),
        //         delay: 2,
        //     },
        // ];
        const patterns = ['10001', '10101', '11001', '10011', '11101', '11011', ];

        this.addLevel('dodge', patterns.map(p => {
            const c = getCrateChunk(p);
            this.addChunk(c);
            return c.name;
        }));
    }
    addChunk(chunk: Chunk){
        this.chunks.set(chunk.name, chunk);
    }
    getChunk(name: string): Chunk{
        const res = this.chunks.get(name);
        if(!res) throw `Invalid chunk name '${name}'`;
        return res;
    }
    addLevel(name: string, chunkNames: string[]){
        this.levels.set(name, chunkNames.map(s => this.getChunk(s)));
    }
    getLevel(name: string): Chunk[]{
        const res = this.levels.get(name);
        if(!res) throw `Invalid level name '${name}'`;
        return res;
    }
}

function getCrateChunk(pattern: string): Chunk{
    const loadFn = ()=>{
        for (let idx = 0; idx < pattern.length; idx++) {
            const c = pattern[idx];
            if(c === '0') continue;
            const x = Globals.renderWidth;
            const y = Globals.renderHeight / 6 * idx;
            const crate = Globals.crates.getNew() as Crate;
            crate.position.x = x;
            crate.position.y = y;
            crate.velocity.x = -300;
        }
    };
    return {
        name: `crate_${pattern}`,
        difficulty: 1,
        tags: [],
        loadFn,
        delay: 2,
    };
}