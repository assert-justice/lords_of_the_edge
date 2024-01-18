import { RailManager } from "./rail_manager";

/**
 * A unit of a level that can be remixed and combined with others.
 * Spawns in enemies, crates, hazards, etc.
 */
export interface Chunk{
    name: string,
    difficulty: number,
    tags: string[],
    loadFn: (rail: RailManager)=>void,
}
// export class Chunk{
//     //
// }