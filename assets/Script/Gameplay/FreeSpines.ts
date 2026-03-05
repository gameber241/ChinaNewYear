import { _decorator, Component, Input, Label, Node, sp, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FreeSpines')
export class FreeSpines extends Component {
    public static instance: FreeSpines = null
    @property(sp.Skeleton)
    fx: sp.Skeleton = null

    @property(sp.Skeleton)
    totlSpines: sp.Skeleton = null

    @property(Label)
    totalLb: Label = null

    @property(Label)
    lbFreeSpin: Label = null

    @property(Node)
    listSelects: Node[] = []

    protected onLoad(): void {
        FreeSpines.instance = this
    }

    private currentValue: number = 0;
    private targetValue: number = 0;

    private tweenObj: { value: number } | null = null;
    private runningTween: Tween<any> | null = null;

    private touchHandler: Function | null = null;

    private isStopped: boolean = false;

    playAnimation(callback) {
        this.fx.node.active = true
        this.fx.setCompleteListener((tracking) => {
            if (tracking.animation.name != "_Free_Start") return
            this.listSelects.forEach(e => {
                e.active = true
            })
        });
        this.fx.setAnimation(0, "_Free_Start", false)
        this.fx.addAnimation(0, "_Free_loop", true)

    }

    ShowTotalSpin(callback, target) {
        this.resetState();

        this.totlSpines.node.active = true
        this.totlSpines.setAnimation(0, "_TotalWin_Appear", false)
        this.totlSpines.addAnimation(0, "_TotalWin_Idle", true)

        this.playTo(target, 3, this.totalLb, callback)
        this.totlSpines.setCompleteListener((tracking) => {
            if (tracking.animation.name != "_TotalWin_Idle") return
            this.totlSpines.setCompleteListener(null)

            // this.scheduleOnce(() => {
            //     callback?.()
            // }, 2)
        });
    }


    private playTo(targetValue: number, duration: number, label: Label, callback: Function) {

        this.targetValue = targetValue;
        this.tweenObj = { value: this.currentValue };

        this.runningTween = tween(this.tweenObj)
            .to(duration, { value: targetValue }, {
                easing: "cubicOut",
                onUpdate: () => {
                    if (!this.tweenObj) return;
                    this.currentValue = this.tweenObj.value;
                    label.string = this.currentValue.toFixed(2);
                }
            })
            .call(() => {
                this.complete(label, callback);
            })
            .start();

        // register touch skip
        this.touchHandler = () => {
            this.stopAndComplete(label, callback);
        };

        this.node.on(Input.EventType.TOUCH_END, this.touchHandler, this);
    }

    // =============================

    private stopAndComplete(label: Label, callback?: Function) {

        if (this.isStopped) return;
        this.isStopped = true;

        if (this.runningTween) {
            this.runningTween.stop();
            this.runningTween = null;
        }

        if (this.tweenObj) {
            this.currentValue = this.targetValue;
            label.string = this.targetValue.toFixed(2);
        }

        this.complete(label, callback);
    }

    // =============================

    private complete(label: Label, callback?: Function) {

        // remove event
        if (this.touchHandler) {
            this.node.off(Input.EventType.TOUCH_END, this.touchHandler, this);
            this.touchHandler = null;
        }
        console.log("den day ne")
        // delay hide giống slot
        this.scheduleOnce(() => {
            this.totlSpines.node.active = false; callback?.();
        }, 2);
    }

    // =============================

    private resetState() {

        this.unscheduleAllCallbacks();

        if (this.runningTween) {
            this.runningTween.stop();
            this.runningTween = null;
        }

        if (this.touchHandler) {
            this.node.off(Input.EventType.TOUCH_END, this.touchHandler, this);
            this.touchHandler = null;
        }

        this.currentValue = 0;
        this.isStopped = false;
    }

    UpdateRound(round) {
        this.lbFreeSpin.string = round
    }

    playSelect(index: number, numberSpin) {
        const animName = `_Free_Select${index}`;

        this.fx.setAnimation(0, animName, false);

        this.fx.setCompleteListener((tracking) => {
            if (tracking.animation.name !== animName) return;

            this.listSelects.forEach(e => {
                e.active = false;
            });

            this.fx.node.active = false;
        });
    }

    btnSelect1() { this.playSelect(1, 18); }
    btnSelect2() { this.playSelect(2, 13); }
    btnSelect3() { this.playSelect(3, 8); }
    btnSelect4() { this.playSelect(4, 5); }
    btnSelect5() { this.playSelect(5, 3); }
}

