// Shared footprints keep visual furniture and walking collision aligned.
export const ISLAND={x:0,z:0,w:2.25,d:5};
export const WALL_BENCH={x:7.9,z:-4.65,w:1.15,d:3.8};
export const STORAGE={x:-7.9,z:5.45,w:1.3,d:1.5};
export const EXTRA_SOLIDS=[ISLAND,WALL_BENCH,STORAGE].map(({x,z,w,d})=>[x-w/2,x+w/2,z-d/2,z+d/2]);
