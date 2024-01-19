import { Graphics } from "cleo";
import { Globals } from "./globals";
import { Player } from "./player";
import { PoliceCar } from "./police_car";
import { Scene } from "./utils/scene";
import { App } from "./utils/app";
import { Crate } from "./crate";
import { Text } from "./utils/text";
import { SpriteSheet } from "./utils/sprite_sheet";
import { Progress } from "./progress";

export class Game extends Scene{
    player: Player;
    livesDisplay: Text;
    progress: Progress;
    lives: number = 3;
    // policeCar: PoliceCar;
    constructor(app: App){
        super(app);
        this.player = new Player(this);
        this.player.init();
        // this.policeCar = new PoliceCar();
        Graphics.setClearColor(0.4/256,5.5/256,50.2/256,1);
        const textSheet = new SpriteSheet(Graphics.Texture.fromFile('./sprites/font8x8_inverted.png'), 8, 8);
        this.livesDisplay = new Text(textSheet, 'Lives: 3');
        this.progress = new Progress();
        Globals.railManager.loadLevel(Globals.chunkManager.getLevel('dodge'));
    }
    update(dt: number){
        this.player.update(dt);
        Globals.playerBullets.update(dt);
        Globals.crates.update(dt);
        Globals.railManager.update(dt);
    }
    draw(){
        Globals.railManager.draw();
        this.player.draw();
        Globals.playerBullets.draw();
        Globals.crates.draw();
        this.livesDisplay.draw(0, 0);
        this.progress.draw(0.5);
        // this.policeCar.draw();
    }
    loseLife(){
        this.lives--;
        this.livesDisplay.text = `Lives: ${this.lives}`;
        this.player.init();
    }
}