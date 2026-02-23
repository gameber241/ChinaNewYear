import { _decorator, Component, Enum, Node, sp, Sprite, SpriteFrame, tween, Tween, UITransform, Widget } from 'cc';
import { ESymbolFace } from '../Enum/ESymbolFace';
import { SymbolFrameState } from '../Enum/ESymbolFrameState';
import { SymbolCell } from './SymbolCell';
import { ReelBase } from './ReelBase';
const { ccclass, property } = _decorator;

@ccclass('Symbol')
export class Symbol extends Component {
    @property({ type: Enum(ESymbolFace) })
    face: ESymbolFace = ESymbolFace.TEN;

    @property({ type: Enum(SymbolFrameState) })
    frameState: SymbolFrameState = SymbolFrameState.NORMAL;

    @property(sp.Skeleton)
    icon: sp.Skeleton = null

    reel: ReelBase = null;

    @property(Number)
    reelIndex: number = 0;

    stackId: number = -1;
    stackSize: number = 1;
    stackIndex: number = 0;


    col = 0
    row = 0
    layer = 0
    get isRoot(): boolean {
        return this.stackIndex === 0;
    }



    public getNameIdle() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                if (this.stackSize == 1) {
                    name = "icon_Wild1_idle"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_idle"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_idle"
                }
                break;
            case ESymbolFace.SCRATCH:
                if (this.stackSize == 1) {
                    name = "Icon_Scatter_small_idle"
                }
                if (this.stackSize == 2) {
                    name = "Icon_Scatter_big_idle"
                }
                break
            default:
                if (this.stackSize == 1) {
                    name = "icon_size1_idle"
                }
                if (this.stackSize == 2) {
                    name = "icon_size1_idle"
                }
                if (this.stackSize == 3) {
                    name = "icon_size1_idle"
                }
                break
        }

        return name
    }


    public getNameWin() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                if (this.stackSize == 1) {
                    name = "icon_Wild1_broken_action"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_broken_action"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_broken_action"
                }
                break;
            case ESymbolFace.SCRATCH:
                if (this.stackSize == 1) {
                    // name = "Icon_Scatter_small_idle"
                }
                if (this.stackSize == 2) {
                    // name = "Icon_Scatter_big_idle"
                }
                break
            default:
                if (this.stackSize == 1) {
                    name = "icon_size1_action"
                }
                if (this.stackSize == 2) {
                    name = "icon_size2_action"
                }
                if (this.stackSize == 3) {
                    name = "icon_size3_action"
                }
                break


        }

        return name
    }

    public getNameMove() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                if (this.stackSize == 1) {
                    name = "icon_Wild1_move"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_move"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_move"
                }
                break;
            case ESymbolFace.SCRATCH:
                if (this.stackSize == 1) {
                    name = "Icon_Scatter_small_idle"
                }
                if (this.stackSize == 2) {
                    name = "Icon_Scatter_big_idle"
                }
                break
            default:

                break


        }

        return name
    }

    public getNameAction() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                if (this.stackSize == 1) {
                    name = "icon_Wild1_action"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_action"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_action"
                }
                break;
            case ESymbolFace.SCRATCH:
                if (this.stackSize == 1) {
                    name = "Icon_Scatter_small_action"
                }
                if (this.stackSize == 2) {
                    name = "Icon_Scatter_big_action"
                }
                break
            default:

                break
        }
        return name
    }

    protected start(): void {
        this.layer = this.icon.node.layer
    }

    rollToIndex(time: number = 0.2) {
        // Chỉ root mới tween
        if (!this.reel) return;
        this.fxMove()
        const newPosition = this.reel.getSymbolPosition(this.reelIndex);
        Tween.stopAllByTarget(this.node);
        return tween(this.node)
            .to(time, { position: newPosition })
            .call(() => {
            })
            .start();
    }

    DropToindex(time: number = 0.2) {
        if (!this.reel) return;

        const newPosition = this.reel.getSymbolPosition(this.reelIndex);
        Tween.stopAllByTarget(this.node);
        return tween(this.node)
            .to(time, { position: newPosition })
            .call(() => {
                this.exploAnim(20)
            })
            .start();
    }



    setRandomFace() {
        const faces = [
            ESymbolFace.TEN,
            ESymbolFace.ACE,
            ESymbolFace.JACK,
            ESymbolFace.QUEEN,
            ESymbolFace.KING,
            ESymbolFace.COIN,
            ESymbolFace.GOLDEN_TOAD,
            ESymbolFace.GOLD_INGOT,
            ESymbolFace.GOLD_POT,
            ESymbolFace.LUCKY_FISH,
            ESymbolFace.QUEEN,
            ESymbolFace.RED_ENVELOPE
        ];
        this.face = faces[Math.floor(Math.random() * faces.length)];
        this.frameState = SymbolFrameState.NORMAL;
        this.UpdateUI()
    }

    ResetSymbol() {
        this.stackId = -1;
        this.stackSize = 1;
        this.stackIndex = 0;
        this.setRandomFace()
        this.UpdateUI()
    }



    exploAnim(bounce = 10, onComplete?: () => void) {
        if (this.face == ESymbolFace.SCRATCH) {
            // SoundToggle.instance.PlayScatchIdle()

        }
        if (!this.isRoot || !this.reel) {
            onComplete && onComplete();
            return;
        }

        const basePos = this.reel.getSymbolPosition(this.reelIndex);
        const isHorizontal = this.reel.isHorizontal();

        const upPos = isHorizontal
            ? basePos.clone().add3f(bounce, 0, 0)
            : basePos.clone().add3f(0, bounce, 0);

        tween(this.node)
            .set({ position: basePos })
            .to(0.08, { position: upPos }, { easing: 'sineOut' })
            .to(0.08, { position: basePos }, { easing: 'sineIn' })
            .call(() => {
                // if (GameManager.instance.CheckScratch() == false)
                //     this.spine.node.layer = this.layer
                // else {
                //     if (this.face == ESymbolFace.SCRATCH) {
                //         this.spine.node.layer = this.layer
                //     }
                // }
                const animNameAction = this.getNameAction();
                const animNameIdle = this.getNameIdle()

                if (animNameAction !== "" && animNameIdle != "") {

                    this.icon.setCompleteListener((tracking) => {
                        if (tracking.animation.name != animNameIdle) return
                        this.icon.setCompleteListener(null);
                    });

                    this.playAnimation(animNameAction, false);
                    this.addAnimation(animNameIdle, true)

                    onComplete && onComplete();

                }
                else {
                    onComplete && onComplete();
                }

            })
            .start();
    }




    UpdateFrame() {

    }

    UpdateSpines() {
        let ui = this.node.getComponent(UITransform).contentSize
        // this.spine.node.setPosition(0, -ui.height * this.stackSize / 2 + 50, 0)

    }
    isInit = false
    InitSymbol(data: SymbolCell) {
        this.isInit = true
        this.face = data.i
        this.frameState = data.f
        this.stackSize = data.ms
        this.stackIndex = data.mi
        this.stackId = data.sid
        this.UpdateUI()
    }


    UpdateUI() {
        this.SetIconSpines()
    }


    SetIconSpines() {
        switch (this.face) {
            case ESymbolFace.TEN:
                this.icon.setSkin("icon5")
                break
            case ESymbolFace.JACK:
                this.icon.setSkin("icon4")
                break
            case ESymbolFace.QUEEN:
                this.icon.setSkin("icon2")
                break
            case ESymbolFace.KING:
                this.icon.setSkin("icon3")
                break
            case ESymbolFace.ACE:
                this.icon.setSkin("icon1")
                break
            case ESymbolFace.COIN:
                this.icon.setSkin("icon6")
                break
            case ESymbolFace.GOLDEN_TOAD:
                this.icon.setSkin("icon11")
                break
            case ESymbolFace.GOLD_INGOT:
                this.icon.setSkin("icon8")
                break
            case ESymbolFace.GOLD_POT:
                this.icon.setSkin("icon9")
                break
            case ESymbolFace.LUCKY_FISH:
                this.icon.setSkin("icon10")
                break
            case ESymbolFace.RED_ENVELOPE:
                this.icon.setSkin("icon7")
                break
            case ESymbolFace.SCRATCH:
            case ESymbolFace.WILD:
                this.icon.setSkin("default")
                break
        }

        let animationName = this.getNameIdle()
        console.log(animationName)
        this.playAnimation(animationName, true)


    }

    fxMove() {
        this.UpdateUIMove()
    }

    UpdateUIMove() {

    }



    playAnimation(name, loop) {
        if (name != "") {
            this.EnabledAniamtion(true)
            this.icon.setAnimation(0, name, loop)
        }
        else {
            this.EnabledAniamtion(false)

        }
    }

    addAnimation(name, loop) {
        if (name != "") {
            this.EnabledAniamtion(true)
            this.icon.addAnimation(0, name, loop)
        }
        else {
            this.EnabledAniamtion(false)

        }
    }

    EnabledAniamtion(isEnabled) {
        if (this.stackIndex == 0) {
            this.icon.enabled = isEnabled
        }
        else {
            this.icon.enabled = false

        }
    }

    Dispose() {
        // let time = 2
        // switch (this.face) {
        //     case ESymbolFace.ACE:
        //         this.iconSymbol.enabled = false
        //         this.spine.setSkin("Icon1")
        //         this.spine.timeScale = time
        //         this.bg.enabled = false
        //         break;
        //     case ESymbolFace.KING:
        //         this.iconSymbol.enabled = false
        //         this.spine.setSkin("Icon2")
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         break;
        //     case ESymbolFace.QUEEN:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon3")
        //         break;
        //     case ESymbolFace.JACK:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon4")
        //         break;
        //     case ESymbolFace.TEN:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon5")
        //         break;
        //     case ESymbolFace.GOLDEN_IDOL:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon11")
        //         break;

        //     case ESymbolFace.GREEN_IDOL:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon10")
        //         break;
        //     case ESymbolFace.JAGUAR_PINK:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon7")
        //         break;
        //     case ESymbolFace.MASK_RED:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon6")
        //         break;
        //     case ESymbolFace.PURPLE_SERPENT:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon9")
        //         break;
        //     case ESymbolFace.STONE_WHEEL:
        //         this.iconSymbol.enabled = false
        //         this.spine.timeScale = time
        //         this.bg.enabled = false

        //         this.spine.setSkin("Icon8")
        //         break;
        // }
        this.playAnimation(this.getNameWin(), false)

        this.scheduleOnce(() => {
            this.node.destroy()
        }, 1.2)
    }

    HideAll() {
        this.EnabledAniamtion(false)

    }
    FlipSymbol(data, onComplete?: () => void) {

        let name = "";

        if (this.stackSize == 1) name = "icon_size1_action_upgrade";
        if (this.stackSize == 2) name = "icon_size2_action_upgrade";
        if (this.stackSize == 3) name = "icon_size3_action_upgrade";

        if (name === "" || this.stackIndex > 0) {
            onComplete?.();
            return;
        }

        this.icon.setCompleteListener(() => {

            // Clear listener
            this.icon.setCompleteListener(null);

            // Update symbol
            this.InitSymbol(data);

            // Play action rồi idle
            this.playAnimation(this.getNameAction(), false);
            this.addAnimation(this.getNameIdle(), true);
            this.icon.setCompleteListener((tracking) => {
                if (tracking.animation.name != this.getNameAction()) return
                this.icon.setCompleteListener(null);
                onComplete?.();
            });
        });

        this.playAnimation(name, false);
    }

    PlayIdleScratch() {
        let name = "";
        if (this.stackSize == 1) name = "Icon_Scatter_small_action_idle";
        if (this.stackSize == 2) name = "Icon_Scatter_big_action_idle";
        this.playAnimation(name, true);


    }
}

