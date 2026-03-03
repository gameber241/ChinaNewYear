
import { _decorator, Component, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { sampleJson } from './DataExample';
import { ReelBase } from './ReelBase';
import { ESymbolFace } from '../Enum/ESymbolFace';
import { Symbol } from './Symbol';
import { BigWin } from './Bigwin';
import { FreeSpines } from './FreeSpines';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: ReelBase }) reels: ReelBase[] = [];
    @property(Label) walet: Label = null!;
    @property(Label) priceTienCuoc: Label = null!;
    @property(Label) totalPrice: Label = null!;
    @property(Label) totalPriceBot: Label = null!;

    @property(Node) headerNormal: Node = null!;
    @property(Node) headerFreeSpines: Node = null!;
    @property(Node) frameReel1Normal: Node = null!;
    @property(Node) frameReel1FreeSpin: Node = null!;
    @property(Node) footFreeSpin: Node = null!;
    @property(Node) walletNode: Node = null!;
    @property(Node) footer: Node = null!;
    @property(Node) optionSetting: Node = null!;
    // @property(AutoCtrl) UiAuto: AutoCtrl = null!;
    @property(Node) history: Node = null!;

    public static instance: GameManager = null;

    isTurbo = false;
    isFree = false;
    isShowSetting = false;
    isShowFooter = false;

    stoppedCount = 0;

    priceOffset = 2000;
    priceCurrent = 10000;
    priceMax = 20000;

    symBolArray: Symbol[][] = [];

    indexCurrentReel = 0;
    turboMode: boolean = false

    onLoad() { GameManager.instance = this; }

    protected start() {
        // this.UpdatePrice();
        // this.SetNormal();
        this.scheduleOnce(() => {
            this.initGrid();
            this.PlaySpin()
        }, 1)

    }

    /* ================= GRID ================= */

    initGrid() {
        this.symBolArray = Array.from({ length: 6 },
            () => Array.from({ length: 5 }, () => null)
        );
    }

    /* ================= SPIN ================= */

    PlaySpin() {
        const round = sampleJson.rounds[this.indexCurrentReel];

        // round.isScratch
        //     ? (this.SetFreeSpines(), this.PlayFreeSpin(round.freeSpin))
        //     : this.SetNormal();

        if (sampleJson.rounds.length <= this.indexCurrentReel) return
        this.GenerateMap(round.grid);

        // ComboManager.instance.ScrollToCombo(round.multiplier);
    }

    GenerateMap(grid: any[][]) {
        this.CheckScratch()
            ? this.RollDataScratch(grid)
            : this.RollDataNormal(grid);
    }

    /* ================= SCRATCH ================= */

    async RollDataScratch(grid) {
        const indexReel = this.CheckReelFull3Scratch();
        if (indexReel === this.reels.length - 1) {
            this.RollDataNormal(this);
            return;
        }
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].startRoll();
        }
        await GameManager.waitForSeconds(1);


        let stopped = 0;
        const phase1 = indexReel + 1;
        for (let i = 0; i <= indexReel; i++) {
            this.reels[i].stopRoll(grid[i])
            await GameManager.waitForSeconds(0.2);

            if (++stopped !== phase1) continue;
            this.stopPhase2(indexReel, grid);
            for (let j = 0; j <= indexReel; j++)
                this.reels[j].symbols
                    .forEach(e => {
                        if (e.face === ESymbolFace.SCRATCH && e.stackIndex == 0)
                            e.PlayIdleScratch();
                    });
            return


        }
    }

    private async stopPhase2(index: number, grid: any[]) {

        let current = index + 1;

        while (current < this.reels.length) {
            const reel = this.reels[current];
            reel.changeSpeed(0.07)
            // play animation scratch cho reel hiện tại
            this.playAnimReelScratch(current);
            // play idle scratch cho symbol
            reel.symbols.forEach(e => {
                if (e.face === ESymbolFace.SCRATCH && e.stackIndex === 0) {
                    e.PlayIdleScratch();
                }
            });

            // đợi 4s
            await GameManager.waitForSeconds(4);

            // stop reel
            reel.stopRoll(grid[current]);
            reel._delay = 0.04

            current++;
        }

        // Khi stop hết reel
        this.playAnimReelScratch(99);

        this.scheduleOnce(() => {
            this.ShowAllReef(
                sampleJson.rounds[this.indexCurrentReel].freeSpin > 0
            );

            this.scheduleOnce(() => {
                const r = sampleJson.rounds[this.indexCurrentReel];
                FreeSpines.instance.playAnimation(() => {

                })
                // if (r.freeSpin > 0) {
                //     this.SetFreeSpines();
                //     this.PlayFreeSpin(r.freeSpin);
                //     this.scheduleOnce(() => this.CheckContinueSpin(), 2);
                // } else {
                //     this.CheckContinueSpin();
                // }

            }, 1);

        }, 0.4);
    }
    /* ================= NORMAL ================= */
    async RollDataNormal(grid) {
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].startRoll();
        }
        await GameManager.waitForSeconds(this.turboMode ? 0.25 : 0.75);
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].stopRoll(grid[i]);
            await GameManager.waitForSeconds(this.turboMode ? 0 : 0.3);
        }
        await GameManager.waitForSeconds(0.5);
        this.ClearData()


    }

    /* ================= CLEAR ================= */

    async ClearData() {
        await GameManager.waitForSeconds(0.05);

        const r = sampleJson.rounds[this.indexCurrentReel];
        this.reels.forEach(e => {
            e.symbols.forEach(e => {
                e.ShowMask()
            })
        })
        // Win animation delay từng symbol
        for (let i = 0; i < r.win.positions.length; i++) {
            const e = r.win.positions[i];
            this.symBolArray[e.c][e.r].AnimationWin();
            await GameManager.waitForSeconds(0.05);
        }

        if (r.flips.length) {
            this.FlipData();
        }
        // dispose sau khi animation xong
        for (const e of r.win.positions) {
            this.symBolArray[e.c][e.r].Dispose();
        }



        await GameManager.waitForSeconds(1.1);
        this.reels.forEach(e => {
            e.symbols.forEach(e => {
                e.AnimationWin()
            })
        })
        this.reels.forEach((reel, i) => reel.cascadeDrop(r.above[i]));

        await GameManager.waitForSeconds(1);
        if (r.hasNext) {
            this.indexCurrentReel++;
            await this.ClearData(); // ⭐ cực quan trọng
        }
        else {
            this.ShowBigWin();
        }
    }

    /* ================= FLIP ================= */

    FlipData(onComplete?: () => void) {

        const flips = sampleJson
            .rounds[this.indexCurrentReel].flips;

        if (!flips.length) { onComplete?.(); return; }

        let done = 0;

        // this.scheduleOnce(
        //     () => SoundToggle.instance.PlayChangeSymbol(),
        //     0.7
        // );

        flips.forEach(e => {
            this.symBolArray[e.from.c][e.from.r]
                .FlipSymbol(e.to, () => {
                    if (++done === flips.length)
                        onComplete?.();

                });

        });
    }

    ShowBigWin() {
        const r = sampleJson.rounds[this.indexCurrentReel];
        const next = () => this.CheckContinueSpin();

        // Tạo danh sách các win cần chạy theo đúng thứ tự
        const winQueue: Array<() => void> = [];

        if (r.BigWin) {
            winQueue.push(() => { BigWin.instance.showBigWin(runNext, r.BigWin) });
        }

        if (r.SuperWin) {
            winQueue.push(() => { BigWin.instance.showSuperWin(runNext, r.SuperWin) });
        }

        if (r.MegaWin) {
            winQueue.push(() => { BigWin.instance.showMegaWin(runNext, r.MegaWin) });
        }

        // Nếu không có cái nào
        if (winQueue.length === 0) {
            next();
            return;
        }

        let index = 0;

        const runNext = () => {
            if (index >= winQueue.length) {
                next();
                return;
            }
            const fn = winQueue[index];
            index++;
            fn();
        };

        runNext();


        // if (r.totalPrice && r.isScratch) {

        //     // SoundToggle.instance.playTotalWin();

        //     // FreeSpines.instance.ShowTotalSpin(() => {

        //     //     SoundToggle.instance.stopTotalWIn();

        //     //     next();

        //     // }, 4000);

        //     return;
        // }
    }

    /* ================= FLOW ================= */

    CheckContinueSpin() {

        // if (!Spin.instance.isAuto) {

        //     if (sampleJson.rounds.length - 1 >
        //         this.indexCurrentReel) {

        //         this.indexCurrentReel++;

        //         this.PlaySpin();

        //     } else {

        //         // Spin.instance.ActiveSpin();

        //         this.indexCurrentReel = 0;

        //         this.SetNormal();
        //     }

        // } else
        //     Spin.instance.CheckAuto();
    }

    /* ================= SCRATCH CHECK ================= */

    CheckScratch() {
        let count = 0;
        sampleJson.rounds[
            this.indexCurrentReel
        ].grid.forEach(r =>
            r.forEach(e => {
                if (e.i === ESymbolFace.SCRATCH && e.mi == 0)
                    count++;
            })
        );
        return count >= 3;
    }

    CheckReelFull3Scratch() {

        let count = 0;

        const grid = sampleJson
            .rounds[this.indexCurrentReel].grid;

        for (let i = 0; i < grid.length; i++) {

            for (const e of grid[i])
                if (e.i === ESymbolFace.SCRATCH && e.mi == 0)
                    count++;

            if (count >= 3) return i;
        }
    }

    /* ================= UI ================= */

    playAnimReelScratch(index) {

        this.reels.forEach((e, i) => {

            e.spinesEff && (e.spinesEff.enabled = i === index);

            tween(e.maskEff.getComponent(UIOpacity))
                .to(0.3, { opacity: i === index ? 0 : 255 })
                .start();
        });
    }

    ShowAllReef(spine = false) {

        this.reels.forEach(e => {

            e.symbols.forEach(s => {

                if (s.face === ESymbolFace.SCRATCH && !spine)
                    s.playiconAnimation(
                        s.getNameIdle(), true
                    );
            });

            tween(e.maskEff.getComponent(UIOpacity))
                .to(0.3, { opacity: 0 })
                .start();
        });
    }


    PlayFreeSpin(round: number) {
        // FreeSpines.instance.UpdateRound(round);
    }

    static waitForSeconds(s: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

}
