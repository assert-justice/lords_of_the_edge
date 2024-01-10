import { Engine, Window, Input, Graphics } from "cleo";
import { Game } from "./game";
import { App } from "./utils/app";
import { MenuScene } from "./menu_scene";
import { Globals } from "./globals";
import { RailManager } from "./rail_manager";
// internal resolution: 640, 360
Window.setStats('Lords of the Edge', 1920, 1080);

class Main extends App{
    renderTexture: Graphics.Texture;
    constructor(){
        super();
        this.sceneStore.set('game', ()=>new Game(this));
        this.sceneStore.set('menu', ()=>new MenuScene(this));
        this.setScene('menu');
        this.renderTexture = Graphics.Texture.new(640, 360);
        Globals.init();
        Globals.textureManager
        .add('bike', './sprites/bike.png')
        .add('pallet', './sprites/pallet.png')
        .add('police_car', './sprites/police_car_no_siren.png')
        Globals.railManager = new RailManager();
    }
    draw(): void {
        this.renderTexture.setTarget();
        Graphics.clear();
        super.draw();
        this.renderTexture.resetTarget();
        this.renderTexture.draw(0,0);
    }
}

Engine.init = ()=>{
    const main = new Main();
    Engine.update = (dt: number)=>{
        if(Input.keyIsDown(256)) Engine.quit();
        main.update(dt);
    };
    Engine.draw = ()=>{
        main.draw();
    };
}