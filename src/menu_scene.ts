import { Engine, Graphics, System } from "cleo";
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
import { Main } from "./main";

function makeBorder(backImage: Graphics.Texture, gridImg: Graphics.Texture, textTexture: Graphics.Texture, line: string){
    const back = new UIImage(undefined, backImage);
    const border = new UINineSlice(back, gridImg, 7, 7, 18, 18);
    border.style = {
        ...border.style,
        marginLeft: 7,
        marginRight: 7,
        marginTop: 7,
        marginBottom: 7,
    };
    const label = UILabel.fromTexture(border, line, textTexture, 8, 8);
    label.fitText();
    border.fitChildren();
    back.fitChildren();
    return back;
}

function makeMenu(title: string, backFn: (menu: Menu)=>void, elements: [string, (node: UINode)=>void][]){
    const panel = new UIImageColor(undefined, 255, 255, 255, 255);
    panel.style = {
        ...panel.style,
        width: Globals.renderWidth,
        height: Globals.renderHeight,
        anchorMode: 'c',
    };
    const gridImg = Graphics.Texture.fromFile('./sprites/gridBackground.png');
    const textTexture = Graphics.Texture.fromFile('./sprites/font8x8.png');
    const focusImg = Graphics.Texture.fromColor(1, 1, 255, 255, 0, 255);
    const unfocusImg = Graphics.Texture.fromColor(1, 1, 0, 0, 255, 255);
    UILabel.fromTexture(panel, title, textTexture, 8, 8).fitText();
    for (const [line, selectFn] of elements) {
        const button = new UIButton(panel, 
            makeBorder(unfocusImg, gridImg, textTexture, line), 
            makeBorder(focusImg, gridImg, textTexture, line));
        button.onSelect = selectFn;
    }
    const menu = new Menu(panel);
    menu.backFn = backFn;
    return menu;
}

export class MenuScene extends Scene{
    menuManager: MenuManager;
    constructor(app: Main){
        super(app);
        this.menuManager = new MenuManager(Globals.inputManager);
        this.menuManager.addMenu('main', makeMenu('Main', ()=>{}, [
            ['Start', ()=>{
                this.menuManager.navigate('pause');
                Globals.paused = false;
                app.setScene('game');
            }],
            ['Options', ()=>this.menuManager.navigate('options')],
            ['Quit', ()=>Engine.quit()],
        ]));
        this.menuManager.addMenu('options', makeMenu('Options', ()=>this.menuManager.back(), [
            ['Back', ()=>this.menuManager.back()],
        ]));
        this.menuManager.addMenu('pause', makeMenu('Pause', ()=>Globals.paused = false, [
            ['Resume', ()=>Globals.paused = false],
            ['Main Menu', ()=>this.menuManager.navigate('main')],
            ['Quit', ()=>Engine.quit()],
        ]));
    }
    draw(){
        this.menuManager.draw(0, 0);
    }
    update(dt: number): void {
        // Globals.inputManager.poll();
        this.menuManager.update(dt);
    }
}