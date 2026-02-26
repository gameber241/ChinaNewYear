import { ESymbolFace } from "../Enum/ESymbolFace";
import { SymbolFrameState } from "../Enum/ESymbolFrameState";

export const sampleJson = {
    success: true,
    totalWin: 2250,
    usingFreeSpin: false,

    rounds: [{
        index: 0,
        multiplier: 1,
        isScratch: false,
        freeSpin: 0,

        grid: [

            // Reel 0
            [
                { i: ESymbolFace.COIN, f: SymbolFrameState.FRAME, ms: 2, mi: 0, sid: -1 },
                { i: ESymbolFace.COIN, f: SymbolFrameState.FRAME, ms: 2, mi: 1, sid: -1 },
                { i: 3, f: SymbolFrameState.NORMAL, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.SCRATCH, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.COIN, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 
            [
                { i: 7, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: ESymbolFace.COIN, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.COIN, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.COIN, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.SCRATCH, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 300,
        MegaWin: 1000,
        SuperWin: 100000,
        flips: [],
        copies: [],
        hasNext: true
    }]
};