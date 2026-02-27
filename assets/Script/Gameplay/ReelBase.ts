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

    startRoll() {
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

            })
            .delay(this._delay)
            .call(() => {
                console.log("call den day")
                this.setSymbleSiblingIndex();
            })
            .union()
            .repeatForever()
            .start();
    }


    stopRoll(result: any[]) {
        this.isRolling = false
        Tween.stopAllByTarget(this.node);
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
                s.col = this.possitionReel
                s.row = i
                GameManager.instance.symBolArray[this.possitionReel][i] = s
            }
            console.log(GameManager.instance.symBolArray)
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
    public cascadeDrop(dataAbove: any[]) {
        let space = 0
        this.symbols = this.symbols.filter(item => item.node !== null);
        let listSymbok: Symbol[] = []
        for (let i = 6; i >= 2; i--) {
            let s = this.symbols.find(e => e.reelIndex == i)
            if (s == undefined || s == null) {
                space++
            }
            else {
                if (space > 0) {
                    s.reelIndex += space
                    listSymbok.push(s)
                    GameManager.instance.symBolArray[s.col][s.row] = null;
                    s.row += space
                    GameManager.instance.symBolArray[s.col][s.row] = s;
                }

            }
        }
        for (let i = space - 1; i >= 0; i--) {
            let Symbol = this.createNewSymbol()
            this.symbols.push(Symbol)
            Symbol.reelIndex = 2 + i
            Symbol.node.setPosition(this.getSymbolPosition(2 - (space - i)))
            Symbol.reel = this
            Symbol.InitSymbol(dataAbove[i]);
            listSymbok.push(Symbol)
            Symbol.row = i
            Symbol.col = this.possitionReel
            GameManager.instance.symBolArray[Symbol.col][Symbol.row] = Symbol;
            console.log
        }

        listSymbok.forEach((e, i) => {
            this.scheduleOnce(() => {
                e.rollToIndex(0.1, Symbol.MoveType.STOP)
            }, 0.05 * i)

        })
    }

    private createNewSymbol(): Symbol {
        let symbol = instantiate(PrefabManager.instance.symbolPrefab);
        this.node.addChild(symbol);

        return symbol.getComponent(Symbol);
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