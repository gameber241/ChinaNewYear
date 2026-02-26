
import { _decorator, Component, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { sampleJson } from './DataExample';
import { ReelBase } from './ReelBase';
import { ESymbolFace } from '../Enum/ESymbolFace';
import { Symbol } from './Symbol';

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
            () => Array.from({ length: 6 }, () => null)
        );
    }

    /* ================= SPIN ================= */

    PlaySpin() {

        const round = sampleJson.rounds[this.indexCurrentReel];

        // round.isScratch
        //     ? (this.SetFreeSpines(), this.PlayFreeSpin(round.freeSpin))
        //     : this.SetNormal();

        if (sampleJson.rounds.length <= this.indexCurrentReel) return;

        round.grid[0].reverse();

        this.GenerateMap(round.grid);

        // ComboManager.instance.ScrollToCombo(round.multiplier);
    }

    GenerateMap(grid: any[][]) {
        this.CheckScratch()
            ? this.RollDataScratch(grid)
            : this.RollDataNormal(grid);
    }

    /* ================= SCRATCH ================= */

    RollDataScratch(grid) {
        const indexReel = this.CheckReelFull3Scratch();
        if (indexReel === this.reels.length - 1) {
            this.RollDataNormal(this);
            return;
        }
        this.reels.forEach(r =>
            this.scheduleOnce(
                () => r.startRoll(),
                this.isTurbo ? 0.16 : 0.3
            )
        );
        let stopped = 0;
        const phase1 = indexReel + 1;
        for (let i = 0; i <= indexReel; i++) {
            this.reels[i].setOnFullyStopped(() => {
                if (++stopped !== phase1) return;
                this.stopPhase2(indexReel, grid);
                for (let j = 0; j <= indexReel; j++)
                    this.reels[j].symbols
                        .forEach(e => {
                            if (e.face === ESymbolFace.SCRATCH)
                                e.PlayIdleScratch();
                        });

            });

            this.scheduleOnce(
                () => this.reels[i].stopRoll(grid[i]),
                this.isTurbo ? (0.16 + 0.16 * i) : (1 + 0.3 * i)
            );
        }
    }

    private stopPhase2(index: number, grid) {
        let current = index + 1;
        this.playAnimReelScratch(current);
        // SoundToggle.instance.PlayRollScatch();
        const time = 4;
        const stopNext = () => {
            const reel = this.reels[current];
            reel.setOnFullyStopped(() => {
                current++;
                reel.symbols.forEach(e => {
                    if (e.face === ESymbolFace.SCRATCH)
                        e.PlayIdleScratch();
                });

                if (current >= this.reels.length) {
                    this.playAnimReelScratch(99);
                    this.scheduleOnce(() => {
                        this.ShowAllReef(
                            sampleJson.rounds[
                                this.indexCurrentReel
                            ].freeSpin > 0
                        );

                        this.scheduleOnce(() => {
                            const r = sampleJson.rounds[this.indexCurrentReel];
                            if (r.freeSpin > 0) {
                                // SoundToggle.instance.playFreewin();
                                // FreeSpines.instance.playAnimation(() => {
                                //     this.SetFreeSpines();
                                //     this.PlayFreeSpin(r.freeSpin);

                                //     this.scheduleOnce(
                                //         () => this.CheckContinueSpin(),
                                //         2
                                //     );

                                // });
                            } else this.CheckContinueSpin();
                        }, 1);

                    }, 0.4);

                    return;
                }

                // SoundToggle.instance.PlayRollScatch();

                this.playAnimReelScratch(current);

                this.scheduleOnce(stopNext, time);
            });

            reel.stopRoll(grid[current]);
        };

        this.scheduleOnce(stopNext, time);
    }

    /* ================= NORMAL ================= */

    RollDataNormal(grid) {
        let stopped = 0;
        this.reels.forEach((reel, index) => {
            reel.setOnFullyStopped(() => {
                if (++stopped === this.reels.length)
                    this.ClearData();
            });

            reel.startRoll();
            this.scheduleOnce(() => reel.stopRoll(grid[index], false), 1 + 0.1 * index);
        });
    }

    StopRollAllReel() { this.ClearData(); }

    /* ================= CLEAR ================= */

    ClearData() {

        const r = sampleJson.rounds[this.indexCurrentReel];

        // SoundToggle.instance.PlaySymbolWin();

        // r.win.positions.forEach(e =>
        //     this.symBolArray[e.c][e.r].Dispose()
        // );

        // this.scheduleOnce(() => {

        //     const drop = () => {

        //         // SoundToggle.instance.PlaySymbolDrop();

        //         this.reels.forEach(
        //             (reel, i) =>
        //                 reel.cascadeDrop(r.above[i])
        //         );

        //         this.scheduleOnce(
        //             () => this.ShowBigWin(),
        //             2
        //         );
        //     };

        //     if (r.flips.length) {

        //         this.FlipData(drop);

        //     } else drop();

        // }, 1.3);
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

    /* ================= BIGWIN ================= */

    ShowBigWin() {

        const r = sampleJson.rounds[this.indexCurrentReel];

        const next = () => this.CheckContinueSpin();

        const superWin = () => {

            if (!r.SuperWin) { next(); return; }

            // SoundToggle.instance.playBigWin();

            // BigWin.instance.showSuperWin(
            //     next, r.SuperWin
            // );
        };

        const megaWin = () => {

            if (!r.MegaWin) { superWin(); return; }

            // SoundToggle.instance.playBigWin();

            // BigWin.instance.showMegaWin(
            //     superWin, r.MegaWin
            // );
        };

        if (r.BigWin) {

            // SoundToggle.instance.playBigWin();

            // BigWin.instance.showBigWin(
            //     megaWin, r.BigWin
            // );

            return;
        }

        if (r.totalPrice && r.isScratch) {

            // SoundToggle.instance.playTotalWin();

            // FreeSpines.instance.ShowTotalSpin(() => {

            //     SoundToggle.instance.stopTotalWIn();

            //     next();

            // }, 4000);

            return;
        }

        next();
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
                if (e.i === ESymbolFace.SCRATCH)
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
                if (e.i === ESymbolFace.SCRATCH)
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

            // e.symbols.forEach(s => {

            //     if (s.face === ESymbolFace.SCRATCH && !spine)
            //         s.playAnimation(
            //             s.getNameIdle(), true
            //         );
            // });

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
