import { _decorator, Component, Node, sp, instantiate, Label } from 'cc';
import { GameManager } from './GameManager';
import { Sound } from '../Sound';
const { ccclass, property } = _decorator;

@ccclass('BtSpines')
export class BtSpines extends Component {
    @property(Label)
    autoSpin: Label = null


    public static intance: BtSpines = null
    onLoad() {
        BtSpines.intance = this
    }

    @property(sp.Skeleton)
    spin: sp.Skeleton = null



    isSpin = false
    isAuto = false
    BtnSpin() {

        if (this.isAuto == true) {
            this.autoSpin.node.active = false
            this.isAuto = false
        }

        if (this.isSpin == true) return
        Sound.instance.PlaySpin()
        this.spin.setAnimation(0, "action", false)
        this.spin.addAnimation(0, "idle2", true)
        GameManager.instance.PlaySpin()
    }
    autoNumber = 99
    ShowAuto(autoNumber) {
        this.autoSpin.node.active = true
        this.autoSpin.string = autoNumber
        this.autoNumber = autoNumber
        this.isAuto = true
        this.spin.setAnimation(0, "action", false)
        this.spin.addAnimation(0, "idle2", true)
        GameManager.instance.PlaySpin()

    }


    AutoSpin() {
        if (this.autoNumber > 0) {
            this.spin.setAnimation(0, "action", false)
            this.spin.addAnimation(0, "idle2", true)
            GameManager.instance.PlaySpin()
            this.autoNumber--
            this.autoSpin.string = this.autoNumber.toString()
        }
        else {
            this.autoSpin.node.active = false
            this.isAuto = false
        }

    }

}

