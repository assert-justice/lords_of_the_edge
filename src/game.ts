import { Graphics } from "cleo";
import { Globals } from "./globals";
import { Player } from "./player";
import { PoliceCar } from "./police_car";
import { Scene } from "./utils/scene";
import { App } from "./utils/app";
import { Crate } from "./crate";

export class Game extends Scene{
    player: Player;
    // policeCar: PoliceCar;
    constructor(app: App){
        super(app);
        this.player = new Player();
        this.player.init();
        const crate = Globals.crates.getNew() as Crate;
        crate.position.x = Globals.renderWidth - crate.spriteSheet.tileWidth;
        // this.policeCar = new PoliceCar();
        Graphics.setClearColor(0.4/256,5.5/256,50.2/256,1);
    }
    update(dt: number){
        this.player.update(dt);
        Globals.playerBullets.update(dt);
        Globals.crates.update(dt);
    }
    draw(){
        Globals.railManager.draw();
        this.player.draw();
        Globals.playerBullets.draw();
        Globals.crates.draw();
        // this.policeCar.draw();
    }
}