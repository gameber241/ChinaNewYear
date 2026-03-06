import { _decorator, Component, Label, Node, sp, instantiate, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ComboManager')
export class ComboManager extends Component {
    public static instantiate: ComboManager
    @property(sp.Skeleton)
    comboSkeleton: sp.Skeleton = null

    @property(Label)
    comboCurrent: Label = null

    @property(Label)
    comboBefore: Label = null

    @property(Label)
    comboAfter: Label = null

    @property(Label)
    comboAnimation: Label = null


    @property(Label)
    total: Label = null

    combocurrentNum = 1
    comboAfterNum = 1536
    comboBeforeNum = 2



    protected onLoad(): void {
        ComboManager.instantiate = this
    }

    protected start(): void {
        this.playAnimation()
    }


    hideAllCombo() {
        this.comboCurrent.node.active = false
        this.comboAfter.node.active = false
        this.comboBefore.node.active = false

    }

    showAllCombo() {
        this.comboCurrent.node.active = true
        this.comboAfter.node.active = true
        this.comboBefore.node.active = true

        this.comboCurrent.string = "x" + this.combocurrentNum
        this.comboBefore.string = "x" + this.comboBeforeNum
        this.comboAfter.string = "x" + this.comboAfterNum
    }



    playAnimation(total?) {
        this.hideAllCombo()
        this.comboSkeleton.setAnimation(0, "Ball_action", false)
        this.comboSkeleton.addAnimation(0, "Ball_idle", true)
        this.comboSkeleton.setCompleteListener((tracking) => {
            if (tracking.animation.name != "Ball_action") return
            this.showAllCombo()

        });
    }


    SetCombo(comboNext, total) {
        if (total) {
            this.ShowAnimationCombo(total)
        }
        this.comboAfterNum = this.combocurrentNum
        this.combocurrentNum = this.comboBeforeNum
        this.comboBeforeNum = comboNext
        this.playAnimation(total)
    }


    SetDefualt() {
        this.combocurrentNum = 1
        this.comboAfterNum = 1536
        this.comboBeforeNum = 2
        this.showAllCombo()

    }

    ShowAnimationCombo(total) {
        if (this.combocurrentNum == 1) {
            this.total.node.setScale(0.4, 0.4)
            tween(this.total.node).to(0.3, { scale: new Vec3(1, 1) }).start()
            this.total.string = total
            this.total.node.active = true
        }
        else {
            this.comboAnimation.string = "x" + this.combocurrentNum
            // this.total.string = total
            this.comboAnimation.node.active = true
            this.comboAnimation.node.setPosition(-11.948, 334.589)
            tween(this.comboAnimation.node).to(0.3, { position: new Vec3(-11.948, 510.458) })
                .to(0.3, { scale: new Vec3(0.4, 0.4) })
                .call(() => {
                    // this.total.node.active = true
                    tween(this.total.node).to(0.3, { scale: new Vec3(0.4, 0.4) })
                        .to(0.3, { scale: new Vec3(1, 1) })
                        .start()
                    this.total.string = total
                    this.comboAnimation.node.active = false
                    this.comboAnimation.node.setScale(1, 1, 1)
                })
                .start()
        }
    }

}

