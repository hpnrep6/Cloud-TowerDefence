import { Sprite2D } from  '../../../engine/graphics/sprite2d.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';
import { AARectangle } from '../../../engine/physics/primitives/aarectcollider.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { getActiveScene } from '../../../engine/z0.js';
import { Enemy } from '../enemy/enemy.js';

import * as KEY from '../../../engine/input/key.js';
import * as MOUSE from '../../../engine/input/mouse.js';
import { CircleCollider } from '../../../engine/physics/primitives/circlecollider.js';
import { Bullet } from '../turret/projectile.js';
import { Turret, TurretCollider, Cannon, TriCannon, BigCannon, LaserCircle } from '../turret/turret.js';
import { TurretSlot } from '../turret/slot.js';
import { Sprite } from '../../../engine/graphics/sprite.js';

export class Player extends Turret {
    static ACCELERATION = 2000;

    static MAX_SPEED = 300;

    static COOLDOWN = 0.01;

    down = false;
    acceleration;

    pastLocs = [];

    cooldown = 4;

    velX = 0;
    velY = 0;

    constructor(xLoc, yLoc, spritesheet) {
        super(xLoc, yLoc, 250, TextureManager.playerSprite, 11, spritesheet, false);
        this.isPlayer = true;

        new CircleCollider(this, 0, 0, 0, 50, [0], [0]);

        this.projectileOffset = 120;
        
        this.cooldown = Player.COOLDOWN;

        this.acceleration = Player.ACCELERATION;
    }

    _start() {
        //this.ch = new Sprite2D(this, 0, 20, 20, 40, 40)

    }
    
    _update(delta) {
        this.velX /= 1 + delta * 10; 
        this.velY /= 1 + delta * 10;

        let xMoved = false, yMoved = false;

        if(KEY.isKeyDown('w')) {
            this.velY += -this.acceleration * delta;
            yMoved = true;
        }
        if(KEY.isKeyDown('a')) {
            this.velX += -this.acceleration * delta;
            xMoved = true;
        }
        if(KEY.isKeyDown('s')) {
            this.velY += this.acceleration * delta;
            yMoved = true;
        }
        if(KEY.isKeyDown('d')) {
            this.velX += this.acceleration * delta;
            xMoved = true;
        }

        this.velX = this.clamp(this.velX, Player.MAX_SPEED);
        this.velY = this.clamp(this.velY, Player.MAX_SPEED);
        
        this.setLoc(this.getX() + this.velX * delta, this.getY() + this.velY * delta);

        if(KEY.isKeyDown('g')) {
            if(!this.down) {
                this.setSpriteLoop(this.getSpriteIndex() + 1);
                this.down = true;
            }
        } else this.down = false;

        if(MOUSE.isDown() && this.cooldown < 0) {
            this.fire();
            this.cooldown = Player.COOLDOWN;
        }

        this.cooldown -= delta;

        this.turnTowards(MOUSE.getX(), MOUSE.getY());
    }

    fire() {
        let p = new Bullet(this.getRot(), this.getX(), this.getY());
        p.move(this.projectileOffset);
    }

    clamp(a, max) {
        if(a > max) return max;

        else if(a < -max) return -max;

        return a;
    }
}