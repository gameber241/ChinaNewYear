import { _decorator, Component, Label, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Total')
export class Total extends Component {
    @property(Node)
    textnormal: Node = null

    @property(Node)
    textScratch: Node = null

    @property(Label)
    totalLb: Label = null

    @property(sp.Skeleton)
    effect: sp.Skeleton = null

    public static instance: Total
    protected onLoad(): void {
        Total.instance = this
    }


    SetTextNormal() {
        this.textnormal.active = true
        this.textScratch.active = false
        this.totalLb.node.active = false
    }

    setTextScratch() {
        this.textnormal.active = false
        this.textScratch.active = true
        this.totalLb.node.active = false
    }


    setTotal(total) {
        this.textnormal.active = false
        this.textScratch.active = false
        this.totalLb.node.active = true
        this.totalLb.string = total
        this.effect.setAnimation(0, "VFX_Light_explo1", false)
        this.effect.node.active = true

        this.effect.setCompleteListener((tracking) => {
            if (tracking.animation.name == "VFX_Light_explo1") {
                this.effect.node.active = false
            }
        })
    }
}

