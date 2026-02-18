import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BtnPaytable')
export class BtnPaytable extends Component {
    @property(Node)
    uiPaytable: Node = null

    BtnClick() {
        this.uiPaytable.active = true
    }
}


