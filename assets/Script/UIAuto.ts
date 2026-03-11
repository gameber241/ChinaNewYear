import { _decorator, Component, Node } from 'cc';
import { BtSpines } from './Gameplay/BtSpines';
import { BtnAuto } from './BtnAuto';
const { ccclass, property } = _decorator;

@ccclass('UIAuto')
export class UIAuto extends Component {
    @property(Node)
    btnoff: Node = null

    @property(Node)
    btnOn: Node = null

    @property(Node)
    infSpeed: Node = null


    BtnOff() {
        this.btnoff.active = true
        this.btnOn.active = false
    }

    BtnOn() {
        this.btnoff.active = false
        this.btnOn.active = true
    }

    isInfSpeed = false
    BtnInfSpeed() {
        this.infSpeed.active = !this.isInfSpeed
        this.isInfSpeed = !this.isInfSpeed
    }


    BtnSelectNumberAuto(target, args) {
        this.node.active = false
        BtSpines.intance.ShowAuto(args)
        BtnAuto.instance.off()
    }
}


