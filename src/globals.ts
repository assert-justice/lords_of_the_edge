import { RailManager } from "./rail_manager";
import { MessageBus } from "./utils/message_bus";
import { TextureManager } from "./utils/texture_manager";

export class Globals{
    static textureManager: TextureManager;
    static messageBus: MessageBus;
    static railManager: RailManager;
    static init(){
        this.textureManager = new TextureManager();
        this.messageBus = new MessageBus();
        // this.railManager = new RailManager();
    }
}