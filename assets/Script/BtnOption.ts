import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BtnOption')
export class BtnOption extends Component {
    @property(Node)
    uiOption: Node = null

    @property(Node)
    uiFooter: Node = null


    BtnOption() {
        this.uiFooter.active = false
        this.uiOption.active = true
    }
}


