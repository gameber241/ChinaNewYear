
import { _decorator, Component, Label, Node, tween, UIOpacity, Vec3, instantiate, sp, randomRangeInt, Button, Tween } from 'cc';
import { ReelBase } from './ReelBase';
import { ESymbolFace } from '../Enum/ESymbolFace';
import { Symbol } from './Symbol';
import { BigWin } from './Bigwin';
import { FreeSpines } from './FreeSpines';
import { ComboManager } from './ComboManager';
import { BtSpines } from './BtSpines';
import { Total } from './Total';
import { exampleScatch1, exampleScatch2, exampleScatch3, sampleJson, sampleJson1, sampleJson2 } from './DataExample';
import { BtnMinus } from './BtnMinus';
import { BtnPlus } from './BtnPlus';
import { Sound } from '../Sound';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: ReelBase }) reels: ReelBase[] = [];
    @property(sp.Skeleton) bg: sp.Skeleton = null
    @property(Node)
    buyFeature: Node = null

    @property(Node)
    freeGame: Node = null

    @property(Label)
    currentFree: Label = null

    @property(Label)
    totalFree: Label = null

    @property(Node)
    btns: Node[] = []

    @property(Label)
    totalBetslb: Label = null

    // @property(AutoCtrl) UiAuto: AutoCtrl = null!;


    public static instance: GameManager = null;

    isFree = false;
    isShowSetting = false;
    isShowFooter = false;

    stoppedCount = 0;

    priceOffset = 2000;
    priceCurrent = 10000;
    priceMax = 20000;

    symBolArray: Symbol[][] = [];

    indexCurrentReel = 0;
    turboMode: number = 0

    onLoad() { GameManager.instance = this; }




    protected start() {
        Total.instance.SetTextNormal()
        this.initGrid();
        this.SetDataExample()
        this.totalBetslb.string = this.totalBets.toString()

    }

    dataExample = null

    /* ================= GRID ================= */

    initGrid() {
        this.symBolArray = Array.from({ length: 6 },
            () => Array.from({ length: 5 }, () => null)
        );
    }

    /* ================= SPIN ================= */

    PlaySpin() {
        BtSpines.intance.isSpin = true
        Total.instance.SetTextNormal()

        this.Disabledbtns()
        const round = this.dataExample.rounds[this.indexCurrentReel];
        console.log(round)
        round.isScratch
            ? (this.SetFreeSpines(), this.PlayFreeSpin(round.freeSpin))
            : this.SetNormal();

        this.GenerateMap(round.grid);
        if (round.isScratch == true && round.freeSpinCurrent > 0) {
            this.currentFree.string = round.freeSpinCurrent
            this.totalFree.string = round.freeSpinTotal

        }
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
        await GameManager.waitForSeconds(this.GetTimeTurboScratchStart());


        let stopped = 0;
        const phase1 = indexReel + 1;
        for (let i = 0; i <= indexReel; i++) {
            this.reels[i].stopRoll(grid[i])
            await GameManager.waitForSeconds(this.GetTimeTurboScratchStart());

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
        Total.instance.setTextScratch()
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
            await GameManager.waitForSeconds(this.GetTimeTurboScratchSpin());

            // stop reel
            reel.stopRoll(grid[current]);
            reel._delay = 0.04

            current++;
        }

        // Khi stop hết reel
        this.playAnimReelScratch(99);

        this.scheduleOnce(() => {
            this.ShowAllReef(
                this.dataExample.rounds[this.indexCurrentReel].freeSpin > 0
            );

            this.scheduleOnce(() => {
                const r = this.dataExample.rounds[this.indexCurrentReel];
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
        await GameManager.waitForSeconds(this.GetTimeTurboStarSpin());
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].stopRoll(grid[i]);
            await GameManager.waitForSeconds(this.GetTimeTurboStopSpin());
        }
        await GameManager.waitForSeconds(0.5);
        this.ClearData()


    }

    /* ================= CLEAR ================= */

    async ClearData() {
        await GameManager.waitForSeconds(0.05);

        const r = this.dataExample.rounds[this.indexCurrentReel];
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
        if (r.win.positions.length > 0) {
            this.indexCombo++
            Sound.instance.PlayCombo(this.indexCombo)
        }

        Sound.instance.PlaySymbolWin()
        ComboManager.instantiate.SetCombo(this.dataExample.rounds[this.indexCurrentReel].comboNext, this.dataExample.rounds[this.indexCurrentReel].total)

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
            ComboManager.instantiate.total.node.active = false
            this.ShowBigWin();
        }
    }

    /* ================= FLIP ================= */

    FlipData(onComplete?: () => void) {

        const flips = this.dataExample
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
        const r = this.dataExample.rounds[this.indexCurrentReel];
        const next = () => {
            this.indexCurrentReel = 0;
            if (r.isScratch === true && r.freeSpinCurrent > 1) {
                this.SetDataFreeSpin()
                this.PlaySpin();
            }
            else {
                this.SetNormal();
                ComboManager.instantiate.SetDefualt()
                this.SetDataExample()
                this.indexCombo = -1
                if (Sound.instance.isplayBigWin == true) {
                    Sound.instance.playBgMusic(Sound.instance.bgMusicNormal)
                    Sound.instance.isplayBigWin = false
                }
                if (BtSpines.intance.isAuto == true) {
                    BtSpines.intance.AutoSpin()
                }
                else {
                    BtSpines.intance.isSpin = false;
                    this.EnabledBtns()
                    this.indexCombo = -1

                }
            }

        };
        // danh sách animation cần chạy
        const winQueue: Array<() => void> = [];

        if (r.BigWin) {

            winQueue.push(() => {
                Sound.instance.playSoundBigWin()
                Sound.instance.playBgBigWin()
                BigWin.instance.showBigWin(runNext, r.BigWin);
            });
        }

        if (r.SuperWin) {

            winQueue.push(() => {
                Sound.instance.playBgBigWin()
                Sound.instance.playSoundSuperWin()
                BigWin.instance.showSuperWin(runNext, r.SuperWin);
            });
        }

        if (r.MegaWin) {

            winQueue.push(() => {
                Sound.instance.playBgBigWin()
                Sound.instance.playSoundMegaWin()
                BigWin.instance.showMegaWin(runNext, r.MegaWin);
            });
        }

        // total win
        if (r.totalPrice > 0 && r.isScratch) {


            winQueue.push(() => {
                Sound.instance.playTotal()
                FreeSpines.instance.ShowTotalSpin(() => {
                    runNext();
                }, 4000);
            });
        }

        // nếu không có animation nào
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
        // bắt đầu chạy queue
        runNext();
    }

    /* ================= FLOW ================= */

    CheckContinueSpin() {

        // if (!Spin.instance.isAuto) {

        //     if (this.dataExample.rounds.length - 1 >
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
        this.dataExample.rounds[this.indexCurrentReel].grid.forEach(r =>
            r.forEach(e => {
                if (e.i === ESymbolFace.SCRATCH && e.mi == 0)
                    count++;
            })
        );
        return count >= 3;
    }

    CheckReelFull3Scratch() {

        let count = 0;

        const grid = this.dataExample
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


    SetFreeSpines() {
        this.bg.setAnimation(0, "Free_Idle", true)
        this.freeGame.active = true
        this.buyFeature.active = false
    }
    SetNormal() {
        this.bg.setAnimation(0, "Normal_Idle", true)
        this.freeGame.active = false
        this.buyFeature.active = true
    }

    indexFree = 0
    indexCombo = -1
    SetDataFreeSpin() {
        let x = [sampleJson, sampleJson1, sampleJson2]
        if (this.indexFree == 0) this.dataExample = exampleScatch1
        if (this.indexFree == 1) this.dataExample = exampleScatch2
        if (this.indexFree == 2) this.dataExample = exampleScatch3
        if (this.indexFree > 2) this.SetDataExample()
        this.indexFree++
    }

    SetDataExample() {
        let x = [sampleJson1, sampleJson2]

        // this.dataExample = x[randomRangeInt(0, 2)]
        this.dataExample = sampleJson1

    }

    Disabledbtns() {
        this.btns.forEach(e => {
            e.getComponent(Button).enabled = false
        })
    }


    EnabledBtns() {
        this.btns.forEach(e => {
            e.getComponent(Button).enabled = true
        })
    }

    totalBets = 2000

    BtnMinus() {
        if (this.totalBets > 2000) {
            this.totalBets -= 2000
            this.totalBetslb.string = this.totalBets.toString()
            this.EffectTotalBet()
        }

    }

    BtnPlus() {
        if (this.totalBets < 10000) {
            this.totalBets += 2000
            this.totalBetslb.string = this.totalBets.toString()
            this.EffectTotalBet()
        }
    }

    EffectTotalBet() {
        Tween.stopAllByTarget(this.totalBetslb.node)
        tween(this.totalBetslb.node).to(0.3, { scale: new Vec3(1.2, 1.2, 1.2) })
            .delay(0.5)
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start()
    }


    GetTimeTurboStarSpin() {
        if (this.turboMode == 0) return 0.75
        if (this.turboMode == 1) return 0.25
        if (this.turboMode == 2) return 0
    }

    GetTimeTurboScratchStart() {
        if (this.turboMode == 0) return 0.2
        if (this.turboMode == 1) return 0
        if (this.turboMode == 2) return 0
    }

    GetTimeTurboStopSpin() {
        if (this.turboMode == 0) return 0.3
        if (this.turboMode == 1) {
            Sound.instance.PlayScatchIdle()
            return 0
        }
        if (this.turboMode == 2) {
            Sound.instance.PlayScatchIdle()
            return 0
        }
    }


    GetTimeTurboScratchSpin() {
        if (this.turboMode == 0) {
            Sound.instance.PlayRollScatch()
            return 4
        }
        if (this.turboMode == 1) {
            return 0
        }
        if (this.turboMode == 2) {
            return 0
        }

    }
}
