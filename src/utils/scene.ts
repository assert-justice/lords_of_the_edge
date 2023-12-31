import { App } from "./app";

export class Scene{
    app: App
    constructor(app: App){
        this.app = app;
    }
    update(dt: number){}
    draw(){}
    finish(){}
}