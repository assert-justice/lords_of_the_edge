import { RailManager } from "./rail_manager";
import { InputManager } from "./utils/input_manager";
import { MessageBus } from "./utils/message_bus";
import { TextureManager } from "./utils/texture_manager";

export class Globals{
    static textureManager: TextureManager;
    static messageBus: MessageBus;
    static railManager: RailManager;
    static inputManager: InputManager;
    static init(){
        this.textureManager = new TextureManager();
        this.messageBus = new MessageBus();
        this.inputManager = new InputManager();
        // this.railManager = new RailManager();
    }
}