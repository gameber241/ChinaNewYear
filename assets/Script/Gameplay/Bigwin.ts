import { _decorator, Component, Input, Label, Node, sp, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

enum WinType {
    BIG,
    SUPER,
    MEGA
}

@ccclass('BigWin')
export class BigWin extends Component {

    public static instance: BigWin = null!;

    protected onLoad(): void {
        BigWin.instance = this;
    }

    // ================================
    // Spine
    // ================================

    @property(sp.Skeleton)
    fxBigWin: sp.Skeleton = null!;

    @property(sp.Skeleton)
    fxSuperWin: sp.Skeleton = null!;

    @property(sp.Skeleton)
    fxMegaWin: sp.Skeleton = null!;

    // ================================
    // Text
    // ================================

    @property(Label)
    textBig: Label = null!;

    @property(Label)
    textSuper: Label = null!;

    @property(Label)
    textMega: Label = null!;

    @property(Node)
    mask: Node = null

    // ================================

    private currentValue = 0;
    private targetValue = 0;
    private tweenObj: { value: number } | null = null;
    private runningTween: Tween<any> | null = null;
    private touchHandler: Function | null = null;
    private isStopped = false;

    // ================================

    showBigWin(callback?: Function, value = 0) {
        this.prepareShow(WinType.BIG, value, callback);
    }

    showSuperWin(callback?: Function, value = 0) {
        this.prepareShow(WinType.SUPER, value, callback);
    }

    showMegaWin(callback?: Function, value = 0) {
        this.prepareShow(WinType.MEGA, value, callback);
    }

    // ================================

    private prepareShow(
        type: WinType,
        value: number,
        callback?: Function
    ) {

        this.resetState();
        this.mask.active = true
        let fx: sp.Skeleton;
        let label: Label;
        let startAnim = "";
        let loopAnim = "";
        let endAnim = "";

        switch (type) {
            case WinType.BIG:
                fx = this.fxBigWin;
                label = this.textBig;
                startAnim = "BigWin_start";
                loopAnim = "BigWin_loop";
                endAnim = "BigWin_end";
                break;

            case WinType.SUPER:
                fx = this.fxSuperWin;
                label = this.textSuper;
                startAnim = "SuperWin_start";
                loopAnim = "SuperWin_loop";
                endAnim = "SuperWin_end";
                break;

            case WinType.MEGA:
                fx = this.fxMegaWin;
                label = this.textMega;
                startAnim = "MegaWin_start";
                loopAnim = "MegaWin_loop";
                endAnim = "MegaWin_end";
                break;
        }

        fx.node.active = true;
        label.node.active = true;

        this.currentValue = 0;
        label.string = "0.00";

        fx.setAnimation(0, startAnim, false);
        fx.addAnimation(0, loopAnim, true);

        this.playTo(value, 3, fx, label, endAnim, callback);
    }

    // ================================

    private playTo(
        targetValue: number,
        duration: number,
        fx: sp.Skeleton,
        label: Label,
        endAnim: string,
        callback?: Function
    ) {

        this.targetValue = targetValue;

        this.tweenObj = { value: 0 };

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
                this.complete(fx, label, endAnim, callback);
            })
            .start();

        // Skip touch
        this.touchHandler = () => {
            this.stopAndComplete(fx, label, endAnim, callback);
        };

        this.node.on(Input.EventType.TOUCH_END, this.touchHandler, this);
    }

    // ================================

    private stopAndComplete(
        fx: sp.Skeleton,
        label: Label,
        endAnim: string,
        callback?: Function
    ) {

        if (this.isStopped) return;
        this.isStopped = true;

        this.runningTween?.stop();
        this.runningTween = null;

        this.currentValue = this.targetValue;
        label.string = this.targetValue.toFixed(2);

        this.complete(fx, label, endAnim, callback);
    }

    // ================================

    private complete(
        fx: sp.Skeleton,
        label: Label,
        endAnim: string,
        callback?: Function
    ) {

        if (this.touchHandler) {
            this.node.off(Input.EventType.TOUCH_END, this.touchHandler, this);
            this.touchHandler = null;
        }

        this.scheduleOnce(() => {
            this.mask.active = false
            fx.setAnimation(0, endAnim, false);
            label.node.active = false;
            this.scheduleOnce(() => {
                fx.node.active = false;
                callback?.();
            }, 1);

        }, 2);
    }

    // ================================

    private resetState() {

        this.unscheduleAllCallbacks();

        this.runningTween?.stop();
        this.runningTween = null;

        if (this.touchHandler) {
            this.node.off(Input.EventType.TOUCH_END, this.touchHandler, this);
            this.touchHandler = null;
        }

        this.fxBigWin.clearTracks();
        this.fxSuperWin.clearTracks();
        this.fxMegaWin.clearTracks();

        this.fxBigWin.node.active = false;
        this.fxSuperWin.node.active = false;
        this.fxMegaWin.node.active = false;

        this.textBig.node.active = false;
        this.textSuper.node.active = false;
        this.textMega.node.active = false;

        this.currentValue = 0;
        this.isStopped = false;
    }
}