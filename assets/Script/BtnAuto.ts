import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BtnAuto')
export class BtnAuto extends Component {
    @property(Sprite)
    icon: Sprite = null

    @property(SpriteFrame)
    iconAutos: SpriteFrame[] = []

    @property(Node)
    uiAuto: Node = null


    isAuto = false


    bthAuto() {
        if (this.isAuto == false) {
            this.uiAuto.active = true
            this.icon.spriteFrame = this.iconAutos[1]
            this.isAuto = true
        }
        else {
            this.icon.spriteFrame = this.iconAutos[0]
            this.uiAuto.active = false
            this.isAuto = false
        }
    }
}


