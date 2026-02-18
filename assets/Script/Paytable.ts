import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Paytable')
export class Paytable extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    BtnClose(){
        this.node.active = false
    }
}


