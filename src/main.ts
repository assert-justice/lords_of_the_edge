import { Engine, Window, Input } from "cleo";
import { Game } from "./game";
import { App } from "./utils/app";
Window.setStats('Lords of the Edge', 1152 * 1.5, 648 * 1.5);

class Main extends App{
    constructor(){
        super();
        this.sceneStore.set('game', ()=>new Game(this));
        this.setScene('game');
    }
}

Engine.init = ()=>{
    const main = new Main();
    Engine.update = (dt: number)=>{
        if(Input.keyIsDown(256)) Engine.quit();
        main.scene.update(dt);
    };
    Engine.draw = ()=>{
        main.scene.draw();
    };
}