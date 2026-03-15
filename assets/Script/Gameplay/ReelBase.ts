import {
    _decorator,
    Component,
    UITransform,
    Vec3,
    Tween,
    tween,
    instantiate,
    Node,
    sp,
    Layers
} from 'cc';

import { Symbol } from './Symbol';
import { PrefabManager } from './PrefabManager';
import { GameManager } from './GameManager';
import { Sound } from '../Sound';

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

    _delay = 0.04;

    protected _isStopping = false;

    protected _remainSteps = 0;

    private _isFastStop = false;

    @property(Number)
    possitionReel = 0;

    isRolling = false;

    numberSymbols = 15;

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
        this.symbols.forEach(e => {
            e.icon.node.layer = Layers.Enum.DEFAULT
        })
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
                this.setSymbleSiblingIndex();
            })
            .union()
            .repeatForever()
            .start();
    }


    stopRoll(result: any[]) {
        this.isRolling = false;
        this._isStopping = true;

        Tween.stopAllByTarget(this.node);

        if (!result) return;

        const total = this.symbols.length;     // 15
        const visible = this.VISIBLE_COUNT;   // 5
        const firstVisible = this.FIRST_VISIBLE;

        // 1️⃣ Set result vào 5 symbol phía trên (không đụng visible hiện tại)
        for (let i = 0; i < visible; i++) {

            const targetIndex = (firstVisible + i) % total;
            const placeIndex = (targetIndex - visible + total) % total;

            const s = this.symbols.find(sym => sym.reelIndex === placeIndex);
            if (!s) continue;

            s.InitSymbol(result[i]);
            s.col = this.possitionReel;
            s.row = i;

            GameManager.instance.symBolArray[this.possitionReel][i] = s;
        }

        // 2️⃣ Cho tất cả symbol scroll xuống như bình thường bằng rollToIndex
        this.symbols.forEach(s => {
            s.reelIndex += visible;
            s.rollToIndex(this._delay * 5, Symbol.MoveType.STOP);

        });
        Sound.instance.PlaySymbolDrop()

    }




    changeSpeed(newDelay: number) {
        this._delay = newDelay;

        Tween.stopAllByTarget(this.node);

        this.startRoll();
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

        let space = 0;
        const total = this.symbols.length;

        this.symbols = this.symbols.filter(item => item.node != null);

        let listSymbol: Symbol[] = [];

        // 1️⃣ tính space
        for (let i = 9; i >= 5; i--) {

            let s = this.symbols.find(e => e.reelIndex % total == i);

            if (!s) {
                space++;
            }
            else if (space > 0) {

                GameManager.instance.symBolArray[s.col][s.row] = null;

                s.reelIndex += space;

                s.row += space;

                GameManager.instance.symBolArray[s.col][s.row] = s;

                listSymbol.push(s);
            }
        }

        // 2️⃣ tạo symbol mới phía trên
        for (let i = 0; i < space; i++) {

            let newSymbol = this.createNewSymbol();

            newSymbol.reel = this;
            newSymbol.col = this.possitionReel;
            newSymbol.row = i;

            newSymbol.reelIndex = 5 + i;

            // 🔥 position phải khớp với reelIndex hiện tại
            newSymbol.node.setPosition(
                this.getSymbolPosition(newSymbol.reelIndex - space)
            );

            newSymbol.InitSymbol(dataAbove[i]);

            this.symbols.push(newSymbol);

            GameManager.instance.symBolArray[newSymbol.col][newSymbol.row] = newSymbol;

            listSymbol.push(newSymbol);
        }

        // 3️⃣ drop
        listSymbol.forEach((s, i) => {
            s.rollToIndex(0.12, Symbol.MoveType.STOP);
        });
        Sound.instance.PlaySymbolDrop()
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