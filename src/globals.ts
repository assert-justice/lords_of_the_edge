import { Input, Window } from "cleo";
import { RailManager } from "./rail_manager";
import { InputManager } from "./utils/input_manager";
import { MessageBus } from "./utils/message_bus";
import { TextureManager } from "./utils/texture_manager";
import { Pool } from "./utils/pool";
import { Bullet } from "./bullet";
import { Crate } from "./crate";

export class Globals{
    static textureManager: TextureManager;
    static messageBus: MessageBus;
    static railManager: RailManager;
    static inputManager: InputManager;
    static paused: boolean = true;
    static playerBullets: Pool;
    static crates: Pool;
    // internal resolution: 640, 360
    static renderWidth = 640;
    static renderHeight = 360;
    static init(){
        this.textureManager = new TextureManager();
        this.messageBus = new MessageBus();
        this.inputManager = new InputManager();
        this.inputManager.cursorFn = ()=>[
            Input.mouseX / Window.width * this.renderWidth,
            Input.mouseY / Window.height * this.renderHeight,
        ];
        this.playerBullets = new Pool(()=>new Bullet());
        this.crates = new Pool(()=>new Crate());
    }
}