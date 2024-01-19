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

        const dodge: Chunk[] = [
            {
                name: 'crate_10001',
                difficulty: 1,
                tags: [],
                loadFn: ()=>{
                    const c1 = Globals.crates.getNew() as Crate;
                    c1.velocity.x = -300;
                    c1.position.x = Globals.renderWidth;
                    const c2 = Globals.crates.getNew() as Crate;
                    c2.position.x = Globals.renderWidth;
                    c2.position.y = Globals.railManager.rails[4] ?? 0;
                    c2.velocity.x = -300;
                },
                delay: 1,
            },
            {
                name: 'crate_10101',
                difficulty: 1,
                tags: [],
                loadFn: ()=>{
                    const c1 = Globals.crates.getNew() as Crate;
                    c1.velocity.x = -300;
                    c1.position.x = Globals.renderWidth;
                    const c2 = Globals.crates.getNew() as Crate;
                    c2.position.x = Globals.renderWidth;
                    c2.position.y = Globals.railManager.rails[2] ?? 0;
                    c2.velocity.x = -300;
                    const c3 = Globals.crates.getNew() as Crate;
                    c3.position.x = Globals.renderWidth;
                    c3.position.y = Globals.railManager.rails[4] ?? 0;
                    c3.velocity.x = -300;
                },
                delay: 2,
            },
        ];
        this.addLevel('dodge', dodge.map(c => {
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