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

    protected _delay = 0.04;

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

        const ui = this.symbols[0].node.getComponent(UITransform)!;
        this.cellSize = this.getCellSize(ui) + this.symbolPadding;
        this.totalSize = this.cellSize * this.symbols.length;
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

    _isStartingRoll
    startRoll() {
        this._isStartingRoll = true;
        this.isRolling = true;
        this.collectSymbols();
        this.rearrangeSymbols();
        tween(this.node)
            .call(() => {
                if (this.isRolling === false) return;
                for (let s of this.symbols) {
                    s.reelIndex += 1
                    if (s.reelIndex >= this.symbols.length) {
                        s.reelIndex = 0;
                        if (!this._isStopping) {
                            s.ResetSymbol();
                        }
                        s.node.position = this.getSymbolPosition(-1);
                    }
                    s.rollToIndex(this._delay, Symbol.MoveType.MOVING);
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


    stopRoll(result: any[]) {
        this.isRolling = false
        if (result) {
            const total = this.symbols.length;
            const visible = this.VISIBLE_COUNT;
            const firstVisible = this.FIRST_VISIBLE;
            const usedSymbols = new Set<any>();

            for (let i = 0; i < visible; i++) {

                if (!result[i]) continue;
                console.log()
                let targetIndex = firstVisible + i;
                if (targetIndex >= total) {
                    targetIndex -= total;
                }

                let placeIndex = targetIndex - visible;
                while (placeIndex < 0) {
                    placeIndex += total;
                }

                const s = this.symbols.find(sym => sym.reelIndex === placeIndex);
                if (!s) continue;

                const e = result[i];
                s.InitSymbol(e);

                usedSymbols.add(s);
            }

            this.symbols.forEach((e) => {

                e.reelIndex =
                    (e.reelIndex + visible) % total;

            })

            this.symbols.forEach((e, index) => {
                e.rollToIndex(0.2, Symbol.MoveType.STOP)
            })
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