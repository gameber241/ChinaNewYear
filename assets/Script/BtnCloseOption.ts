import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BtnCloseOption')
export class BtnCloseOption extends Component {
    @property(Node)
    uiOption: Node = null

    @property(Node)
    uiFooter: Node = null


    BtnOption() {
        this.uiFooter.active = true
        this.uiOption.active = false
    }
}


