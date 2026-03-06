import { _decorator, Component, Node, sp, instantiate } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BtSpines')
export class BtSpines extends Component {

    public static intance: BtSpines = null
    onLoad() {
        BtSpines.intance = this
    }

    @property(sp.Skeleton)
    spin: sp.Skeleton = null


    isSpin = false
    BtnSpin() {
        if (this.isSpin == true) return
        this.isSpin = true
        this.spin.setAnimation(0, "action", false)
        this.spin.addAnimation(0, "idle", true)
        GameManager.instance.PlaySpin()

    }
}

