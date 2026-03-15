import { ESymbolFace } from '../Enum/ESymbolFace';
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
        totalPrice: 0,
        grid: [

            // Reel 0
            [
                { i: ESymbolFace.COIN, f: SymbolFrameState.NORMAL, ms: 2, mi: 0, sid: -1 },
                { i: ESymbolFace.COIN, f: SymbolFrameState.NORMAL, ms: 2, mi: 1, sid: -1 },
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
                { i: ESymbolFace.COIN, f: 0, ms: 1, mi: 0, sid: -1 },
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
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 0 },
                { c: 0, r: 1 },
                { c: 1, r: 1 },
                { c: 2, r: 2 },
                { c: 3, r: 3 },
                { c: 4, r: 4 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: true,
        total: 30,
        comboNext: 3

    },
    {
        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 6, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 1, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],

        ],

        win: {
            positions: [
                { c: 0, r: 0 },
                { c: 1, r: 0 },
                { c: 2, r: 0 },
                { c: 3, r: 0 },
                { c: 4, r: 0 },
                { c: 0, r: 1 },
                { c: 0, r: 2 },
                { c: 1, r: 2 },
                { c: 0, r: 3 },
                { c: 1, r: 3 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },

        BigWin: 100,
        MegaWin: 2000,
        SuperWin: 8000,
        flips: [],
        copies: [],
        hasNext: false,
        total: 60,
        comboNext: 6,
        totalPrice: 0,
    }
    ]
};

export const sampleJson1 = {
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
                { i: ESymbolFace.WILD, f: 0, ms: 1, mi: 0, sid: -1 }
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
                { i: ESymbolFace.COIN, f: 0, ms: 1, mi: 0, sid: -1 },
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
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 4 },
                { c: 1, r: 1 },
                { c: 2, r: 2 },
                { c: 3, r: 3 },
                { c: 4, r: 4 },
            ],
            stepWin: 2000
        },
        // BigWin: 0,
        // MegaWin: 0,
        // SuperWin: 0,
        flips: [
            {
                from: { c: 0, r: 0 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 0, sid: 1 } // biến thành Wild
            },
            {
                from: { c: 0, r: 1 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 1, sid: 1 } // biến thành Wild
            },],
        copies: [],
        hasNext: true,
        comboNext: 3,
        total: 40

    },
    {
        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 6, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 1, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 0 },
                { c: 1, r: 0 },
                { c: 2, r: 0 },
                { c: 3, r: 0 },
                { c: 4, r: 0 },
                { c: 0, r: 1 },
                { c: 0, r: 2 },
                { c: 0, r: 3 },
                { c: 1, r: 2 },

            ],
            stepWin: 2000
        },

        BigWin: 100,
        MegaWin: 2000,
        SuperWin: 8000,
        flips: [],
        copies: [],
        hasNext: false,
        comboNext: 3,
        total: 40

    }
    ]
};


export const sampleJson2 = {
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
                { i: ESymbolFace.SCRATCH, f: SymbolFrameState.FRAME, ms: 2, mi: 0, sid: -1 },
                { i: ESymbolFace.SCRATCH, f: SymbolFrameState.FRAME, ms: 2, mi: 1, sid: -1 },
                { i: 3, f: SymbolFrameState.NORMAL, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.WILD, f: 0, ms: 1, mi: 0, sid: -1 }
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
                { i: ESymbolFace.SCRATCH, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.SCRATCH, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.SCRATCH, f: 0, ms: 1, mi: 0, sid: -1 }
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
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 4 },
                { c: 1, r: 1 },
                { c: 2, r: 2 },
                { c: 3, r: 3 },
                { c: 4, r: 4 },
            ],
            stepWin: 2000
        },
        // BigWin: 0,
        // MegaWin: 0,
        // SuperWin: 0,
        flips: [
            {
                from: { c: 0, r: 0 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 0, sid: 1 } // biến thành Wild
            },
            {
                from: { c: 0, r: 1 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 1, sid: 1 } // biến thành Wild
            },],
        copies: [],
        hasNext: true,
        comboNext: 3

    },
    {
        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 6, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 1, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 0 },
                { c: 1, r: 0 },
                { c: 2, r: 0 },
                { c: 3, r: 0 },
                { c: 4, r: 0 },
                { c: 0, r: 1 },
                { c: 0, r: 2 },
                { c: 0, r: 3 },
                { c: 1, r: 2 },

            ],
            stepWin: 2000
        },

        BigWin: 100,
        MegaWin: 2000,
        SuperWin: 8000,
        flips: [],
        copies: [],
        hasNext: false,
        comboNext: 3

    }
    ]
};



export const exampleScatch1 = {
    success: true,
    totalWin: 2250,
    usingFreeSpin: false,

    rounds: [{
        index: 0,
        multiplier: 1,
        isScratch: true,
        freeSpinCurrent: 3,
        freeSpinTotal: 3,
        total: 50,
        grid: [

            // Reel 0
            [
                { i: ESymbolFace.ACE, f: SymbolFrameState.FRAME, ms: 2, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: SymbolFrameState.FRAME, ms: 2, mi: 1, sid: -1 },
                { i: 3, f: SymbolFrameState.NORMAL, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.WILD, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 
            [
                { i: 7, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 4 },
                { c: 1, r: 1 },
                { c: 2, r: 2 },
                { c: 3, r: 3 },
                { c: 4, r: 4 },
            ],
            stepWin: 2000
        },
        // BigWin: 0,
        // MegaWin: 0,
        // SuperWin: 0,
        flips: [
            {
                from: { c: 0, r: 0 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 0, sid: 1 } // biến thành Wild
            },
            {
                from: { c: 0, r: 1 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 1, sid: 1 } // biến thành Wild
            },],
        copies: [],
        hasNext: false,
        comboNext: 3

    },
    ]
};

export const exampleScatch2 = {
    success: true,
    totalWin: 2250,
    usingFreeSpin: false,

    rounds: [{
        index: 0,
        multiplier: 1,
        isScratch: true,
        freeSpinCurrent: 2,
        freeSpinTotal: 3,
        total: 50,
        grid: [

            // Reel 0
            [
                { i: ESymbolFace.ACE, f: SymbolFrameState.FRAME, ms: 2, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: SymbolFrameState.FRAME, ms: 2, mi: 1, sid: -1 },
                { i: 3, f: SymbolFrameState.NORMAL, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.WILD, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 
            [
                { i: 7, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 4 },
                { c: 1, r: 1 },
                { c: 2, r: 2 },
                { c: 3, r: 3 },
                { c: 4, r: 4 },
            ],
            stepWin: 2000
        },
        // BigWin: 0,
        // MegaWin: 0,
        // SuperWin: 0,
        flips: [
            {
                from: { c: 0, r: 0 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 0, sid: 1 } // biến thành Wild
            },
            {
                from: { c: 0, r: 1 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 1, sid: 1 } // biến thành Wild
            },],
        copies: [],
        hasNext: false,
        comboNext: 3

    },
    ]
}
export const exampleScatch3 = {
    success: true,
    totalWin: 2250,
    usingFreeSpin: false,
    total: 50,
    rounds: [{
        index: 0,
        multiplier: 1,
        isScratch: true,
        freeSpinCurrent: 1,
        freeSpinTotal: 3,
        grid: [

            // Reel 0
            [
                { i: ESymbolFace.ACE, f: SymbolFrameState.FRAME, ms: 2, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: SymbolFrameState.FRAME, ms: 2, mi: 1, sid: -1 },
                { i: 3, f: SymbolFrameState.NORMAL, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.WILD, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 
            [
                { i: 7, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: ESymbolFace.ACE, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 3, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],

        ],

        win: {
            positions: [
                { c: 0, r: 4 },
                { c: 1, r: 1 },
                { c: 2, r: 2 },
                { c: 3, r: 3 },
                { c: 4, r: 4 },
            ],
            stepWin: 2000
        },
        // BigWin: 0,
        // MegaWin: 0,
        // SuperWin: 0,
        flips: [
            {
                from: { c: 0, r: 0 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 0, sid: 1 } // biến thành Wild
            },
            {
                from: { c: 0, r: 1 },
                to: { i: ESymbolFace.WILD, f: SymbolFrameState.NORMAL, ms: 2, mi: 1, sid: 1 } // biến thành Wild
            },],
        copies: [],
        hasNext: false,
        totalPrice: 100000,
        comboNext: 3

    },
    ]
};