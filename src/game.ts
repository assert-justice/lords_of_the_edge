import { Graphics } from "cleo";
import { Globals } from "./globals";
import { Player } from "./player";
import { PoliceCar } from "./police_car";
import { Scene } from "./utils/scene";
import { App } from "./utils/app";

export class Game extends Scene{
    player: Player;
    // policeCar: PoliceCar;
    constructor(app: App){
        super(app);
        this.player = new Player();
        // this.policeCar = new PoliceCar();
        Graphics.setClearColor(0.4/256,5.5/256,50.2/256,1);
    }
    update(dt: number){
        this.player.update(dt);
        Globals.playerBullets.forEach(b=>b.update(dt));
    }
    draw(){
        Globals.railManager.draw();
        this.player.draw();
        Globals.playerBullets.forEach(b=>b.draw());
        // this.policeCar.draw();
    }
}