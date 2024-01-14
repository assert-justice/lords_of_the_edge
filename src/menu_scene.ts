import { Engine, Graphics } from "cleo";
import { App } from "./utils/app";
import { Scene } from "./utils/scene";
import { UIImageColor } from "./utils/ui/ui_image_color";
import { UINineSlice } from "./utils/ui/ui_nine_slice";
import { UINode } from "./utils/ui/ui_node";
import { UILabel } from "./utils/ui/ui_label";
import { Menu, MenuManager } from "./utils/ui/menu_manager";
import { UIButton } from "./utils/ui/ui_button";
import { UIImage } from "./utils/ui/ui_image";
import { Globals } from "./globals";

function makeBorder(backImage: Graphics.Texture, gridImg: Graphics.Texture, line: string){
    const back = new UIImage(undefined, backImage);
    const border = new UINineSlice(back, gridImg, 7, 7, 18, 18);
    border.style = {
        ...border.style,
        marginLeft: 7,
        marginRight: 7,
        marginTop: 7,
        marginBottom: 7,
    };
    const label = new UILabel(border, '\n\n'+line+'\n\n');
    label.fitText();
    border.fitChildren();
    back.fitChildren();
    return back;
}

function makeMenu(title: string, backFn: (node: UINode)=>void, elements: [string, (node: UINode)=>void][]){
    const panel = new UIImageColor(undefined, 255, 255, 255, 255);
    panel.style = {
        ...panel.style,
        width: 1000,
        height: 1000,
        anchorMode: 'c',
    };
    const gridImg = Graphics.Texture.fromFile('./sprites/gridBackground.png');
    const focusImg = Graphics.Texture.fromColor(1, 1, 255, 255, 0, 255);
    const unfocusImg = Graphics.Texture.fromColor(1, 1, 0, 0, 255, 255);
    new UILabel(panel, title).fitText();
    for (const [line, selectFn] of elements) {
        const button = new UIButton(panel, makeBorder(unfocusImg, gridImg, line), makeBorder(focusImg, gridImg, line));
        button.onSelect = selectFn;
    }
    return new Menu(panel);
}

export class MenuScene extends Scene{
    // panel: UINode;
    menuManager: MenuManager;
    constructor(app: App){
        super(app);
        this.menuManager = new MenuManager();
        this.menuManager.addMenu('main', makeMenu('Main', ()=>{}, [
            ['Start', ()=>{}],
            ['Options', ()=>this.menuManager.navigate('options')],
            ['Quit', ()=>Engine.quit()],
        ]));
        this.menuManager.addMenu('options', makeMenu('Options', ()=>{}, [
            ['Back', ()=>this.menuManager.back()],
        ]));
    }
    draw(){
        this.menuManager.draw(0, 0);
    }
    update(dt: number): void {
        Globals.inputManager.poll();
        if (Globals.inputManager.getButton('uiDown').isPressed()) this.menuManager.handleInput('down');
        if (Globals.inputManager.getButton('uiUp').isPressed()) this.menuManager.handleInput('up');
        if (Globals.inputManager.getButton('uiSelect').isPressed()) this.menuManager.handleInput('select');
        if (Globals.inputManager.getButton('uiBack').isPressed()) this.menuManager.handleInput('back');
    }
}