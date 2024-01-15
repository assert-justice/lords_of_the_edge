
export class Pool<T>{
    data: T[] = [];
    add(element: T){
        this.data.push(element);
    }
    remove(element: T){
        this.data = this.data.filter(e => e !== element);
    }
    forEach(fn: (element: T)=>void){
        this.data.forEach(fn);
    }
}