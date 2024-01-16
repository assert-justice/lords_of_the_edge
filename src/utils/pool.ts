import { Entity } from "./entity";

export class Pool{
    // data: T[] = [];
    private data: Set<Entity>;
    private inactive: Set<Entity>;
    initFn: ()=>Entity;
    constructor(initFn: ()=>Entity){
        this.initFn = initFn;
        this.data = new Set();
        this.inactive = new Set();
    }
    getNew(): Entity{
        let res: Entity;
        if(this.inactive.size > 0){
            res = [...this.inactive.values()][0];
            this.inactive.delete(res);
            return res;
        }
        else{
            res = this.initFn();
        }
        this.add(res);
        res.init();
        return res;
    }
    add(element: Entity){
        this.data.add(element);
        element.pool = this;
    }
    remove(element: Entity): boolean{
        if(this.data.delete(element)){
            this.inactive.add(element);
            return true;
        }
        return false;
    }
    forEach(fn: (element: Entity)=>void){
        this.data.forEach(fn);
    }
}