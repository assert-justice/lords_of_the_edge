import { Graphics } from "cleo";
import { Globals } from "./globals";
import { Player } from "./player";
import { RailManager } from "./rail_manager";
import { PoliceCar } from "./police_car";
import { Scene } from "./utils/scene";
import { App } from "./utils/app";

export class Game extends Scene{
    player: Player;
    railManager: RailManager;
    policeCar: PoliceCar;
    constructor(app: App){
        super(app);
        Globals.init();
        Globals.textureManager
        .add('bike', './sprites/bike.png')
        .add('pallet', './sprites/pallet.png')
        .add('police_car', './sprites/police_car_no_siren.png')
        this.railManager = new RailManager();
        Globals.railManager = this.railManager;
        this.player = new Player();
        this.policeCar = new PoliceCar();
        Graphics.setClearColor(0.4/256,5.5/256,50.2/256,1);
    }
    update(dt: number){
        this.player.update(dt);
    }
    draw(){
        this.railManager.draw();
        this.player.draw();
        this.policeCar.draw();
    }
}