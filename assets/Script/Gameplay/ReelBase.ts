import {
    _decorator,
    Component,
    UITransform,
    Vec3,
    Tween,
    tween,
    instantiate,
    Node,
    sp
} from 'cc';

import { Symbol } from './Symbol';
import { PrefabManager } from './PrefabManager';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('ReelBase')
export abstract class ReelBase extends Component {

    @property(Node)
    maskEff: Node = null!;

    @property(sp.Skeleton)
    spinesEff: sp.Skeleton = null!;

    protected symbolPadding = 1.5;

    public symbols: Symbol[] = [];

    protected cellSize = 0;
    protected totalSize = 0;
    protected halfSize = 0;

    protected _delay = 0.03;

    protected _isStopping = false;

    protected _remainSteps = 0;

    private _isFastStop = false;

    @property(Number)
    possitionReel = 0;

    isRolling = false;

    @property(Number)
    numberSymbols = 9;

    private _onFullyStopped: (() => void) | null = null;

    public setOnFullyStopped(cb: () => void) {
        this._onFullyStopped = cb;
    }

    public abstract VISIBLE_COUNT: number;

    public abstract FIRST_VISIBLE: number;

    /* ================= INIT ================= */

    protected start(): void {

        this.init();

        this.collectSymbols();

        this.rearrangeSymbols();
    }

    init() {

        for (let i = 0; i < this.numberSymbols; i++) {

            const symbol =
                instantiate(
                    PrefabManager.instance.symbolPrefab
                );

            this.node.addChild(symbol);
        }
    }

    protected collectSymbols() {
        this.symbols = [];
        for (let n of this.node.children) {
            const s = n.getComponent(Symbol);
            if (!s) continue;
            s.reel = this;
            s.reelIndex = this.symbols.length;
            this.symbols.push(s);
            s.ResetSymbol();
        }

        const ui =
            this.symbols[0].node.getComponent(UITransform)!;
        this.cellSize =
            this.getCellSize(ui)
            + this.symbolPadding;

        this.totalSize =
            this.cellSize
            * this.symbols.length;

        this.computeHalfSize();
    }

    protected rearrangeSymbols() {
        for (let s of this.symbols) {
            s.node.setPosition(
                this.getSymbolPosition(
                    s.reelIndex
                )
            );
        }
    }

    /* ================= SPIN ================= */

    // startRoll() {
    //     this.isRolling = true;
    //     this._isStopping = false;
    //     this._isFastStop = false;
    //     this.symbols.forEach(e => {
    //         e.isInit = false;
    //     });

    //     Tween.stopAllByTarget(this.node);
    //     tween(this.node)
    //         .call(() => {
    //             if (!this.isRolling) return;

    //             for (let s of this.symbols) {

    //                 s.reelIndex++;

    //                 if (s.reelIndex >= this.symbols.length) {
    //                     s.reelIndex = 0;
    //                     if (!this._isStopping)
    //                         s.ResetSymbol();
    //                     s.node.setPosition(this.getSymbolPosition(-1));
    //                 }

    //                 s.rollToIndex(this._delay);
    //             }
    //             /* ===== STOP PHASE ===== */
    //             if (!this._isStopping)
    //                 return;
    //             /* ===== FAST STOP ===== */
    //             if (this._isFastStop) {
    //                 this.isRolling = false;
    //                 Tween.stopAllByTarget(this.node);
    //                 tween(this.node)
    //                     .delay(0.05)
    //                     .call(() => {
    //                         this.finishStop();
    //                     })
    //                     .start();

    //                 return;
    //             }
    //             /* ===== NORMAL STOP ===== */
    //             this._remainSteps--;

    //             if (this._remainSteps <= 0) {

    //                 this.finishStop();

    //                 return;
    //             }

    //         })

    //         .delay(this._delay)

    //         .union()

    //         .repeatForever()

    //         .start();
    // }
    _isStartingRoll
    startRoll() {
        this._isStartingRoll = true;
        this.isRolling = true;
        this.collectSymbols();
        this.rearrangeSymbols();
        tween(this.node)
            .call(() => {
                if (this.isRolling === false) return;
                for (let i = 0; i < this.symbols.length; i++) {
                    this.symbols[i].reelIndex += 1;
                    if (this.symbols[i].reelIndex == this.symbols.length) {
                        this.symbols[i].reelIndex = 0;
                        this.symbols[i].node.position = this.getSymbolPosition(-1);
                    }

                    if (this._isStartingRoll) {
                        this._delay = 1;
                        this.symbols[i].rollToIndex(1, Symbol.MoveType.START);
                    }
                    else {
                        this._delay = 0.05;
                        this.symbols[i].rollToIndex(0.05, Symbol.MoveType.MOVING);
                    }
                }
            }, this)
            .delay(this._delay)
            .call(() => {
                this._isStartingRoll = false;
                this.setSymbleSiblingIndex();
            }, this)
            .union()
            .repeatForever()
            .start();
    }


    stopRoll(typeAndFaces: any = null, typeAndFacesAbove: any = null) {
        Tween.stopAllByTarget(this.node);

        this.isRolling = false;

        if (!typeAndFaces) {
            for (let i = 0; i < typeAndFaces.length; i++) {
                const symbol = this.symbols.find(s => s.reelIndex === i + 3);
                if (symbol && typeAndFaces[i]) {
                    symbol.InitSymbol(typeAndFaces[i])
                }
            }
        }

        if (typeAndFacesAbove) {
            for (let i = 0; i < typeAndFacesAbove.length; i++) {
                const symbol = this.symbols.find(s => s.reelIndex === 2 - i);
                if (symbol && typeAndFacesAbove[i]) {
                    symbol.InitSymbol(typeAndFaces[i])
                }
            }
        }

        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].reelIndex += 1;
            if (this.symbols[i].reelIndex == this.symbols.length) {
                this.symbols[i].reelIndex = 0;
                this.symbols[i].node.position = this.getSymbolPosition(-1);
            } else {
            }
            this.symbols[i].rollToIndex(0.5, Symbol.MoveType.STOP);
        }
    }

    /* ================= FINISH STOP ================= */
    setSymbleSiblingIndex() {
        const allSymbols: Symbol[] = [...this.symbols];
        allSymbols.sort((a, b) => {
            return b.node.position.y - a.node.position.y;
        });

        for (let i = 0; i < allSymbols.length; i++) {
            allSymbols[i].node.setSiblingIndex(i);
        }
    }

    /* ================= ABSTRACT ================= */

    public isHorizontal(): boolean {
        return false;
    }

    public abstract getCellSize(
        ui: UITransform
    ): number;

    public abstract computeHalfSize(): void;

    public abstract getSymbolPosition(
        index: number
    ): Vec3;

    public abstract sortSibling(): void;
}