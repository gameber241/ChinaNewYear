import { _decorator, Component, Label, Node, sp, instantiate, tween, Vec3 } from 'cc';
import { Total } from './Total';
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

        this.comboCurrent.string = this.combocurrentNum + "x"
        this.comboBefore.string = this.comboBeforeNum + "x"
        this.comboAfter.string = this.comboAfterNum + "x"
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
        console.log(comboNext)
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

            this.total.node.active = true
            this.total.node.setScale(new Vec3(0.4, 0.4, 1))
            this.total.string = total

            tween(this.total.node)
                .to(0.25, { scale: new Vec3(1, 1, 1) }, { easing: "backOut" })
                .start()

            Total.instance.setTotal(total)
        }
        else {
            this.comboAnimation.string = this.combocurrentNum + "x"
            this.comboAnimation.node.active = true

            this.comboAnimation.node.setPosition(-11.948, 334.589, 0)
            this.comboAnimation.node.setScale(new Vec3(1, 1, 1))

            tween(this.comboAnimation.node)
                // bay lên trước
                .to(0.3, { position: new Vec3(-11.948, 547.73, 0) })
                .to(0.2, { scale: new Vec3(1.2, 2, 1) })
                // sau đó mới nhỏ lại
                .to(0.2, { scale: new Vec3(0.4, 0.4, 1) })

                .call(() => {

                    this.total.node.active = true
                    this.total.node.setScale(new Vec3(0.4, 0.4, 1))
                    this.total.string = total

                    // total phóng to
                    tween(this.total.node)
                        .to(0.25, { scale: new Vec3(1.2, 1.2, 1) })
                        .to(0.1, { scale: new Vec3(1, 1, 1) })
                        .start()

                    this.comboAnimation.node.active = false
                    this.comboAnimation.node.setScale(new Vec3(1, 1, 1))

                    Total.instance.setTotal(total)
                })
                .start()
        }
    }

}

