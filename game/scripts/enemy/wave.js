import { Enemy } from './enemy.js';
import { Module } from '../../../engine/tree/module.js';
import { getActiveScene } from '../../../engine/z0.js';

const w1 = () => {
    for(let i = 0; i < 10; i++)
        new Enemy(0 - i * 130, 216, 1);
}


const w2 = () => {
    for(let i = 0; i < 12; i++)
        new Enemy(0 - i * 100 - 4 * 40, 216, 1);

    for(let i = 0; i < 4; i++)
        new Enemy(0 - i * 110, 216, 1);
}

const w3 = () => {
    for(let i = 0; i < 15; i++)
        new Enemy(0 - i * 30, 216, 2);
}

const w4 = () => {
    for(let i = 0; i < 15; i++)
        new Enemy(0 - i * 90, 216, 2);
    
    for(let i = 0; i < 3; i++)
        new Enemy(0 - i * 150, 216, 6);
}

const w5 = () => {
    for(let i = 0; i < 20; i++)
        new Enemy(0 - i * 100, 216, 8);
}

const w6 = () => {
    for(let i = 0; i < 35; i++)
        new Enemy(0 - i * 100, 216, 10);

    for(let i = 0; i < 5; i++)
        new Enemy(0 - i * 500 - 700, 216, 12);
}

const w7 = () => {
    for(let i = 0; i < 20; i++)
        new Enemy(0 - i * 50, 216, 11);

    for(let i = 0; i < 12; i++)
        new Enemy(0 - i * 600 - 800, 216, 12);
}

const w8 = () => {
    for(let i = 0; i < 25; i++)
        new Enemy(0 - i * 150, 216, 13);
}

const w9 = () => {
    for(let i = 0; i < 50; i++)
        new Enemy(0 - i * 30, 216, 11);

    for(let i = 0; i < 15; i++)
        new Enemy(0 - i * 150 - 800, 216, 18);
}

const w10 = () => {
    for(let i = 0; i < 60; i++)
        new Enemy(0 - i * 50, 216, 24);
}

const w11 = () => {
    for(let i = 0; i < 150; i++)
        new Enemy(0 - i * 25, 216, 11);

    for(let i = 0; i < 75; i++)
        new Enemy(0 - i * 50, 216, 24);
}

const w12 = () => {
    for(let i = 0; i < 60; i++)
        new Enemy(0 - i * 25, 216, 24);

    for(let i = 0; i < 15; i++)
        new Enemy(0 - i * 100 - 200, 216, 26);
}

const w13 = () => {
    for(let i = 0; i < 150; i++)
        new Enemy(0 - i * 15, 216, 11);

    for(let i = 0; i < 120; i++)
        new Enemy(0 - i * 25, 216, 24);

    for(let i = 0; i < 30; i++)
        new Enemy(0 - i * 50 - 200, 216, 27);
}

const w14 = () => {
    for(let i = 0; i < 200; i++)
        new Enemy(0 - i * 17, 216, 33);
}

const w15 = () => {
    for(let i = 0; i < 400; i++)
        new Enemy(0 - i * 15, 216, 24);

    for(let i = 0; i < 230; i++)
        new Enemy(0 - i * 24 - 300, 216, 38);
}

const w16 = () => {
    for(let i = 0; i < 10; i++)
        new Enemy(0 - i * 300, 216, 39);
}

const w17 = () => {
    for(let i = 0; i < 400; i++)
        new Enemy(0 - i * 3, 216, 11);

    for(let i = 0; i < 300; i++)
        new Enemy(0 - i * 24 - 300, 216, 38);
}

const w18 = () => {
    for(let i = 0; i < 100; i++)
        new Enemy(-30, 216, 24);
}

const w19 = () => {
    for(let i = 0; i < 120; i++)
        new Enemy(0 - i * 40, 216, 40);
}

const w20 = () => {
    for(let i = 0; i < 50; i++)
        new Enemy(0 - i * 40, 216, 38);

    for(let i = 0; i < 20; i++)
        new Enemy(0 - i * 300 - 400, 216, 45);
}

const w21 = () => {
    for(let i = 0; i < 6; i++)
        new Enemy(0 - i * 300, 216, 47);
}

const w22 = () => {
    for(let i = 0; i < 125; i++)
        new Enemy(0 - i * 40, 216, 38);

    for(let i = 0; i < 30; i++)
        new Enemy(0 - i * 5 - 3000, 216, 47);
}

const w23 = () => {
    for(let i = 0; i < 300; i++)
        new Enemy(0 - i * 80, 216, 47);
}

const w24 = () => {
    for(let i = 0; i < 230; i++)
        new Enemy(0 - parseInt(i / 5) * 10, 216, 47);

    for(let i = 0; i < 50; i++)
        new Enemy(0 - i * 50, 216, 25);
}

const w25 = () => {
    for(let i = 0; i < 150; i++)
        new Enemy(0 - i, 216, 47);
}

const w26 = () => {
    for(let i = 0; i < 30; i++)
        new Enemy(0 - i * 100, 216, 47);
}

const w27 = () => {
    for(let i = 0; i < 700; i++)
        new Enemy(0 - i * 2, 216, 24);
}

const w28 = () => {
    for(let i = 0; i < 75; i++)
        new Enemy(0 - i, 216, 24);
}

const w29 = () => {
    for(let i = 0; i < 50; i++)
        new Enemy(0 - i * 100, 216, 25);
}

const w30 = () => {
    for(let i = 0; i < 90; i++)
        new Enemy(0 - i * 60, 216, 47);

    new Enemy(-350, 216, 100);
}

const w31 = () => {
    for(let i = 0; i < 200; i++)
        new Enemy(0 - i * 35, 216, 47);

    for(let i = 0; i < 100; i++)
        new Enemy(0 - i * 3, 216, 25);

    for(let i = 0; i < 500; i++)
        new Enemy(0 - i * 5, 216, 38);
}

const w32 = () => {
    for(let i = 0; i < 25; i++) {
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
        new Enemy(0 - i * 110, 216, 47);
    }
    new Enemy(-350, 216, 100);
}

const w33 = () => {
    for(let i = 0; i < 150; i++)
        new Enemy(0 - i * 50, 216, 47);

    for(let i = 0; i < 3; i++)
        new Enemy(0 - i * 300 - 350, 216, 100);

}

const w34 = () => {
    for(let i = 0; i < 200; i++)
        new Enemy(0 - i * 50, 216, 38);

    for(let i = 0; i < 6; i++)
        new Enemy(0 - i * 240 - 200, 216, 100);
}

const w35 = () => {
    new Enemy(0 - 200, 216, 100);
    new Enemy(0 - 200, 216, 100);
    new Enemy(0 - 200, 216, 100);
    new Enemy(0 - 200, 216, 100);
    new Enemy(0 - 200, 216, 100);
}

const w36 = () => {
    for(let i = 0; i < 1000; i++)
        new Enemy(0 - i * 3, 216, 38);
}

const w37 = () => {
    for(let i = 0; i < 300; i++)
        new Enemy(0 - i * 50 - 1000, 216, 47);

    for(let i = 0; i < 10; i++) 
        new Enemy(0 - i * 350 - 200, 216, 100);
}

const w38 = () => {
    for(let i = 0; i < 750; i++)
        new Enemy(0 - i * 4 - 1000, 216, 47);

    for(let i = 0; i < 30; i++) 
        new Enemy(0 - i * 60 - 200, 216, 100);
}

const w39 = () => {
    for(let i = 0; i < 500; i++)
        new Enemy(0 - i * 2 - 1000, 216, 47);

    for(let i = 0; i < 50; i++) 
        new Enemy(0 - i * 50 - 100, 216, 100);
}

const w40 = () => {
    for(let i = 0; i < 300; i++)
        new Enemy(0 - i * 80 - 40, 216, 38);

    for(let i = 0; i < 750; i++)
        new Enemy(0 - i * 2 - 1000, 216, 47);

    for(let i = 0; i < 100; i++) 
        new Enemy(0 - i * 40 - 100, 216, 100);
}



const endless = (wave) => {
    let rand = parseInt(((Math.random() * 203123) % (wave * 20)) % 3000);

    let offset4 = parseInt(((Math.random() * 203123)) % 1000);
    let offset3 = parseInt(((Math.random() * 203123)) % 1000);
    let offset2 = parseInt(((Math.random() * 203123)) % 1000);
    let offset1 = parseInt(((Math.random() * 203123)) % 1000);

    let t4 = parseInt(((Math.random() * 92394) % (wave * 10)) % rand);

    rand -= t4;

    rand = rand <= 0 ? 1 : rand;

    let t3 = parseInt(((Math.random() * 123126) % (wave * 8)) % rand);

    rand -= t3;

    rand = rand <= 0 ? 1 : rand;

    let t2 = parseInt(((Math.random() * 98765) % (wave * 6)) % rand);

    rand -= t2;

    rand = rand <= 0 ? 1 : rand;

    let t1 = rand;

    for(let i = 0; i < t1; i++)
        new Enemy(0 - i * (offset1 % 30), 216, 11);
    
    for(let i = 0; i < t2; i++)
        new Enemy(0 - i * (offset2 % 60), 216, 24);

    for(let i = 0; i < t3; i++)
        new Enemy(0 - i * (offset3 % 50), 216, 38);
    
    for(let i = 0; i < t4; i++)
        new Enemy(0 - i * (offset4 % (45 - parseInt(wave / 3))), 216, 47);

    for(let i = 0; i < (offset1 + offset2 + offset3) % (wave - 30); i++)
        new Enemy(0 - i * (offset1 % 30), 216, 48);
}


export class Wave extends Module {
    static waves = [
        w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, w13, w14, w15, w16,
        w17, w18, w19, w20, w21, w22, w23, w24, w25, w26, w27, w28, w29, w30,
        w31, w32, w33, w34, w35, w36, w37, w38, w39, w40
    ]

    current = 0;

    constructor() {
        super(null, 0, 0, 0);

        Wave.waves[this.current]();
    }

    _update() {
        if(getActiveScene().getEnemyCount() <= 0) {
            if(++this.current < Wave.waves.length)
                Wave.waves[this.current]();
            else
                endless(this.current);
        }
    }

    forceNext() {
        if(++this.current < Wave.waves.length)
                Wave.waves[this.current]();
            else
                endless(this.current);
    }
}