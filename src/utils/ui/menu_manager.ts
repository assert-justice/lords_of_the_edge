import { System } from "cleo";
import { UINode } from "./ui_node";
import { InputManager } from "../input_manager";

function findFocusable(node: UINode, list: UINode[]){
    if(node.canFocus){list.push(node);}
    for (const child of node.getChildren()) {
        findFocusable(child, list);
    }
    if(list.length > 0) return list[0];
    return undefined;
}

export class Menu{
    root: UINode;
    focusIdx = 0;
    wrapping = false;
    focused?: UINode;
    manager?: MenuManager;
    nav: UINode[] = [];
    backFn: (menu: Menu)=>void = ()=>{};
    // onMountFn: (menu: Menu, manager: MenuManager)=>void = ()=>{};
    // onUnmountFn: (menu: Menu, manager: MenuManager)=>void = ()=>{};
    constructor(root: UINode){
        this.root = root;
        let focused = findFocusable(root, this.nav);
        if(focused) this.focused = focused;
        else throw 'no focusable nodes found';
    }
    onMount(){
        this.root.onMount();
        this.setIdx(0);
        // I really, *really* don't know why this is needed.
        this.next();
        this.last();
    }
    onUnmount(){this.root.onUnmount();}
    private setIdx(idx: number){
        this.focusIdx = idx;
        this.focused?.onUnfocus(this.focused);
        this.focused = this.nav[this.focusIdx];
        this.focused.onFocus(this.focused);
        this.root.setDirty();
    }
    next(){
        let newFocusIdx = this.focusIdx + 1;
        if(newFocusIdx >= this.nav.length){
            if(this.wrapping) newFocusIdx = 0;
            else return;
        }
        this.setIdx(newFocusIdx);
    }
    last(){
        let newFocusIdx = this.focusIdx - 1;
        if(newFocusIdx < 0){
            if(this.wrapping) newFocusIdx = this.nav.length - 1;
            else return;
        }
        this.setIdx(newFocusIdx);
    }
    draw(x: number, y: number){
        this.root.draw(x, y);
    }
    handleInput(message: string){
        if(message === 'down') this.next();
        else if(message === 'up') this.last();
        else if(message === 'select') this.focused?.onSelect(this.focused);
        else if(message === 'back') this.backFn(this);
        else throw `Unrecognized menu input '${message}'`;
    }
}

export class MenuManager{
    inputManager: InputManager;
    menus: Map<string, Menu>;
    history: string[] = [];
    activeMenu?: Menu;
    constructor(inputManager: InputManager){
        this.inputManager = inputManager;
        this.menus = new Map();
    }
    getMenu(name: string){
        const menu = this.menus.get(name);
        if(!menu) throw `Menu name '${name}' not valid!`;
        this.activeMenu = menu;
    }
    addMenu(name: string, menu: Menu){
        this.menus.set(name, menu);
        if(!this.activeMenu) this.navigate(name);
    }
    private goTo(name: string){
        const nextMenu = this.menus.get(name);
        if(!nextMenu) throw `Menu name '${name}' not valid!`;
        if(nextMenu === this.activeMenu) return;
        this.activeMenu?.onUnmount();
        this.activeMenu = nextMenu;
        nextMenu.onMount();
    }
    navigate(name: string){
        this.goTo(name);
        this.history.push(name);
    }
    back(){
        if(this.history.length < 2) return;
        this.history.pop();
        this.goTo(this.history[this.history.length-1]);
    }
    draw(x: number, y: number){
        this.activeMenu?.draw(x, y);
    }
    update(dt: number){
        if (this.inputManager.getButton('uiDown').isPressed()) this.activeMenu?.handleInput('down');
        if (this.inputManager.getButton('uiUp').isPressed()) this.activeMenu?.handleInput('up');
        if (this.inputManager.getButton('uiSelect').isPressed()) this.activeMenu?.handleInput('select');
        if (this.inputManager.getButton('uiBack').isPressed()) this.activeMenu?.handleInput('back');
    }
}