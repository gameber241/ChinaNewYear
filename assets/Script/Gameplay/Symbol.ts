import { _decorator, Component, Enum, Layers, sp, tween, Tween } from 'cc';
import { ESymbolFace } from '../Enum/ESymbolFace';
import { SymbolFrameState } from '../Enum/ESymbolFrameState';
import { SymbolCell } from './SymbolCell';
import { ReelBase } from './ReelBase';

const { ccclass, property } = _decorator;
export enum MoveType {

}
const SymbolAnim = {
    WILD: {
        idle: ["icon_Wild1_idle", "icon_Wild2_idle", "icon_Wild3_idle"],
        move: ["icon_Wild1_move", "icon_Wild2_move", "icon_Wild3_move"],
        action: ["icon_Wild1_appear", "icon_Wild2_appear", "icon_Wild3_appear"],
        win: ["icon_Wild1_action", "icon_Wild2_action", "icon_Wild3_action"]
    },
    SCRATCH: {
        idle: ["Icon_Scatter_small_idle", "Icon_Scatter_big_idle"],
        move: ["Icon_Scatter_small_idle", "Icon_Scatter_big_idle"],
        action: ["Icon_Scatter_small_action", "Icon_Scatter_big_action"],
        win: ["", ""]
    },
    DEFAULT: {
        idle: ["icon_size1_idle", "icon_size2_idle", "icon_size3_idle"],
        move: ["icon_size1_move", "icon_size2_move", "icon_size3_move"],
        action: ["", "", ""],
        win: ["icon_size1_action", "icon_size2_action", "icon_size3_action"]
    },
    FRAME: {
        idle: ["icon_size1_idle", "icon_size2_idle", "icon_size3_idle"],
        move: ["icon_size1_move", "icon_size2_move", "icon_size3_move"],
    }
};

@ccclass('Symbol')
export class Symbol extends Component {

    static MoveType = {
        'START': 'start',
        'STOP': 'stop',
        'MOVING': 'moving'
    } as const
    @property({ type: Enum(ESymbolFace) }) face: ESymbolFace = ESymbolFace.TEN;
    @property({ type: Enum(SymbolFrameState) }) frameState: SymbolFrameState = SymbolFrameState.NORMAL;
    MoveType
    @property(sp.Skeleton) icon: sp.Skeleton = null!;
    @property(sp.Skeleton) frame: sp.Skeleton = null!;

    reel: ReelBase = null!;
    reelIndex = 0;

    stackId = -1; stackSize = 1; stackIndex = 0;
    col = 0; row = 0; layer = 0;
    isInit = false;

    get isRoot() { return this.stackIndex === 0; }

    private SkinMap = {
        [ESymbolFace.ACE]: "Icon1",
        [ESymbolFace.QUEEN]: "Icon2",
        [ESymbolFace.KING]: "Icon3",
        [ESymbolFace.JACK]: "Icon4",
        [ESymbolFace.TEN]: "Icon5",
        [ESymbolFace.COIN]: "Icon6",
        [ESymbolFace.RED_ENVELOPE]: "Icon7",
        [ESymbolFace.GOLD_INGOT]: "Icon8",
        [ESymbolFace.GOLD_POT]: "Icon9",
        [ESymbolFace.LUCKY_FISH]: "Icon10",
        [ESymbolFace.GOLDEN_TOAD]: "Icon11"
    };

    protected start() {
        this.layer = this.icon.node.layer
        this.icon.node.layer = Layers.Enum.DEFAULT
    }

    private getAnim(type: "idle" | "move" | "action" | "win"): string {

        const size = Math.max(0, this.stackSize - 1);

        let cfg = SymbolAnim.DEFAULT;
        if (this.face === ESymbolFace.WILD) cfg = SymbolAnim.WILD;
        if (this.face === ESymbolFace.SCRATCH) cfg = SymbolAnim.SCRATCH;

        return cfg[type]?.[size] ?? "";
    }

    getNameIdle() { return this.getAnim("idle"); }
    getNameMove() { return this.getAnim("move"); }
    getNameAction() { return this.getAnim("action"); }
    getNameWin() { return this.getAnim("win"); }

    SetSkin() {
        this.icon.setSkin(this.SkinMap[this.face] ?? "default");
    }

    EnabledAniamtion(enable: boolean) {
        this.icon.enabled = enable && this.isRoot;
    }

    playiconAnimation(name: string, loop: boolean) {

        if (!name) { this.EnabledAniamtion(false); return; }

        this.SetSkin();
        this.EnabledAniamtion(true);
        this.icon.setAnimation(0, name, loop);
    }

    addAnimation(name: string, loop: boolean) {
        if (name) this.icon.addAnimation(0, name, loop);
    }

    playFrameAnimation(name: string, loop: boolean) {
        this.frame?.setAnimation(0, name, loop);
    }

    UpdateFrame() {
        if (this.stackIndex > 0) {
            this.frame.enabled = false
            return
        }
        if (this.frameState == SymbolFrameState.FRAME) {
            this.frame.enabled = true
        }
        else
            this.frame.enabled = false

    }

    SetUISymbolNormal() {
        this.UpdateFrame();
        this.playiconAnimation(this.getNameIdle(), true);
        this.playFrameAnimation(this.getNameIdle(), true)
        this.icon.node.setPosition(0, -86 * this.stackSize / 2 + 86 / 2, 0)
        this.frame.node.setPosition(0, -86 * this.stackSize / 2 + 86 / 2, 0)


    }

    SetUiMove() {
        const name = this.getNameMove();
        this.playiconAnimation(name, true);
        this.playFrameAnimation(name, true);
    }

    InitSymbol(data: SymbolCell) {

        this.isInit = true;
        this.face = data.i;
        this.frameState = data.f;
        this.stackSize = data.ms;
        this.stackIndex = data.mi;
        this.stackId = data.sid;

        this.SetUISymbolNormal();
    }

    ResetSymbol() {
        this.stackId = -1;
        this.stackSize = 1;
        this.stackIndex = 0;
        this.setRandomFace();
        this.SetUISymbolNormal();
    }

    setRandomFace() {

        const faces = [
            ESymbolFace.TEN, ESymbolFace.ACE, ESymbolFace.JACK,
            ESymbolFace.QUEEN, ESymbolFace.KING,
            ESymbolFace.COIN, ESymbolFace.GOLDEN_TOAD,
            ESymbolFace.GOLD_INGOT, ESymbolFace.GOLD_POT,
            ESymbolFace.LUCKY_FISH, ESymbolFace.RED_ENVELOPE
        ];

        this.face = faces[Math.floor(Math.random() * faces.length)];
        this.frameState = SymbolFrameState.NORMAL;
    }
    rollToIndex(time: number = 0.2, type: string = Symbol.MoveType.MOVING) {
        const newPosition = this.reel.getSymbolPosition(this.reelIndex);
        // console.log(newPosition)
        Tween.stopAllByTarget(this.node);

        if (type === Symbol.MoveType.MOVING)
            this.SetUiMove();
        else {
            this.playiconAnimation(this.getNameIdle(), true);
            this.playFrameAnimation(this.getNameIdle(), true);
        }

        if (this.reelIndex === 1)
            this.setRandomFace();

        const ease = {
            'start': 'bounceIn',
            'stop': 'bounceOut',
            'moving': 'linear'
        }

        return tween(this.node)
            .to(time, { position: newPosition }, { easing: ease[type] })
            .call(() => {
                if (type == Symbol.MoveType.STOP) {
                    this.exploAnim()
                }
            })
            .start();

    }

    DropToindex(time = 0.2) {
        if (!this.reel) return;
        const pos = this.reel.getSymbolPosition(this.reelIndex);
        Tween.stopAllByTarget(this.node);

        tween(this.node)
            .to(time, { position: pos })
            .call(() => this.exploAnim())
            .start();
    }

    exploAnim(onComplete?: () => void) {

        if (this.face == ESymbolFace.SCRATCH || this.face == ESymbolFace.WILD) {
            this.icon.node.layer = this.layer
        }
        const action = this.getNameAction();
        const idle = this.getNameIdle();

        if (!action || !idle) { onComplete?.(); return; }

        this.playiconAnimation(action, false);
        this.addAnimation(idle, true);
        this.playFrameAnimation(idle, true)
        onComplete?.();
    }

    FlipSymbol(data, onComplete?: () => void) {

        if (!this.isRoot) { onComplete?.(); return; }

        const name = `icon_size${this.stackSize}_action_upgrade`;

        this.icon.setCompleteListener(() => {
            this.icon.setCompleteListener(null);

            this.InitSymbol(data);

            this.playiconAnimation(this.getNameAction(), false);
            this.addAnimation(this.getNameIdle(), true);

            onComplete?.();
        });

        this.playiconAnimation(name, false);
    }

    Dispose() {

        this.playiconAnimation(this.getNameWin(), false);

        this.scheduleOnce(() => {
            this.node.destroy();
        }, 1.2);
    }

    HideAll() { this.EnabledAniamtion(false); }

    PlayIdleScratch() {

        const name = this.stackSize === 1
            ? "Icon_Scatter_small_action_idle"
            : "Icon_Scatter_big_action_idle";

        this.playiconAnimation(name, true);
    }

}

