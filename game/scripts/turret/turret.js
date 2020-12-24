import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { Projectile, Bullet, BigBullet, WideLaser } from './projectile.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import * as z0 from '../../../engine/z0.js';
import * as MOUSE from '../../../engine/input/mouse.js'
import { AARectangle } from '../../../engine/physics/primitives/aarectcollider.js';
import { CircleCollider } from '../../../engine/physics/primitives/circlecollider.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';
import { AudioManager } from '../../../engine/audio/audiomanager.js';

export class Turret extends Sprite2D {
    static DEFAULT_COOLDOWN = 1;
    
    target = null;
    static range = 400;
    size = 50;
    turretCooldown;
    cooldown;
    projectileOffset = 50;
    accepted = false;

    cost = 10000;

    constructor(x, y, size = 100, texture = TextureManager.cannon, zLoc = 10, spritesheet, notPlayer = true, turretCooldown = Turret.DEFAULT_COOLDOWN, cost) {
        super(null, texture, x, y, size - 20, size - 20, 0, zLoc, spritesheet);

        if(!notPlayer) return;

        this.cost = cost;

        this.turretCooldown = turretCooldown;
        this.cooldown = 0;

        if(!this.getParent().requestMoney(this.cost)) {
            this.removeSelf();
            return;
        }

        new TurretCollider(this, 0, 0, 0, size - 20, [1], []);

        this.accepted = true;

        z0.getActiveScene().turrets.push(this);
    }

    _update(delta, range = Turret.range) {
        this.target = z0.getActiveScene().getFirstEnemyWithinRange(this.getX(), this.getY(), range);

        this.cooldown -= delta;

        if(this.target === undefined) return;

        this.turnTowards(this.target.getX(), this.target.getY());
        
        if(this.cooldown < 0) {
            this.fire();
            this.cooldown = this.turretCooldown;
        }
    }

    fire() {
        let p = new Projectile(this.getRot(), this.getX(), this.getY());
        p.move(this.projectileOffset);
    }

    _destroy() {
        super._destroy();

        let index = z0.getActiveScene().turrets.indexOf(this);

        if(index !== -1)
            z0.getActiveScene().turrets.splice(index, 1);

        if(this.accepted)
            z0.getActiveScene().addMoney(this.cost / 1.5);
    }
}

export class TurretCollider extends CircleCollider{}

export class Cannon extends Turret {
    static spriteSheet;

    static NUM_FRAMES = 6;

    static FIRE_RATE = .3;
    
    static range = 220;

    static COST = 50;

    static initSpriteSheet(image) {
        this.spriteSheet = new SpriteSheet(image);

        for(let i = 0; i < 7 * 32; i+= 32) {
            this.spriteSheet.createFrame(i, 0, 32, 32);    
        }
    }

    animFrame = 0;

    constructor(x, y) {
        super(x, y, 140, TextureManager.entities, 10, Cannon.spriteSheet, true, Cannon.FIRE_RATE, Cannon.COST);

        this.projectileOffset = 40;

        this.setSprite(0)    
    }

    _update(delta) {
        super._update(delta, Cannon.range);

        if(this.animFrame !== 0) {
            this.setSprite(parseInt(this.animFrame));
            this.animFrame += delta * 20;

            if(this.animFrame > Cannon.NUM_FRAMES) {
                this.animFrame = 0;
                this.setSprite(0);
            }
        }
    }

    fire() {
        let b = new Bullet(this.getRot(), this.getX(), this.getY());
        b.move(this.projectileOffset);

        AudioManager.playBurst(AudioManager.cannon);

        this.animFrame = 1;
        this.setSprite(1);
    }
}

export class TriCannon extends Turret {
    static spriteSheet;

    static NUM_FRAMES = 7;

    static FIRE_RATE = .8;

    static SPREAD = 0.6;

    static range = 170;

    static COST = 150;

    animFrame = 0;

    static initSpriteSheet(image) {
        this.spriteSheet = new SpriteSheet(image);

        for(let i = 0; i < 8 * 32; i+= 32) {
            this.spriteSheet.createFrame(i, 32, 32, 32);    
        }
    }

    constructor(x, y) {
        super(x, y, 150, TextureManager.entities, 10, TriCannon.spriteSheet, true, TriCannon.FIRE_RATE, TriCannon.COST);

        this.projectileOffset = 40;

        this.setSprite(0)
    }

    _update(delta) {
        super._update(delta, TriCannon.range);

        if(this.animFrame !== 0) {
            this.setSprite(parseInt(this.animFrame));
            this.animFrame += delta * 20;

            if(this.animFrame > TriCannon.NUM_FRAMES) {
                this.animFrame = 0;
                this.setSprite(0);
            }
        }
    }

    fire() {
        let a = new Bullet(this.getRot(), this.getX(), this.getY()),
        b = new Bullet(this.getRot() - TriCannon.SPREAD, this.getX(), this.getY()),
        c = new Bullet(this.getRot() + TriCannon.SPREAD, this.getX(), this.getY());

        AudioManager.playBurst(AudioManager.triCannon);

        b.move(this.projectileOffset);

        this.animFrame = 1;
        this.setSprite(1);
    }
}

export class BigCannon extends Turret {
    static spriteSheet;

    static NUM_FRAMES = 5;

    static FIRE_RATE = 2.5;

    static range = 250;

    static COST = 450;

    animFrame = 0;

    static initSpriteSheet(image) {
        this.spriteSheet = new SpriteSheet(image);

        for(let i = 0; i < 6 * 32; i+= 32) {
            this.spriteSheet.createFrame(i, 64, 32, 32);    
        }
    }

    constructor(x, y) {
        super(x, y, 150, TextureManager.entities, 10, BigCannon.spriteSheet, true, BigCannon.FIRE_RATE, BigCannon.COST);

        this.projectileOffset = 40;

        this.setSprite(0)
    }

    _update(delta) {
        super._update(delta, BigCannon.range);

        if(this.animFrame !== 0) {
            this.setSprite(parseInt(this.animFrame));
            this.animFrame += delta * 8;

            if(this.animFrame > BigCannon.NUM_FRAMES) {
                this.animFrame = 0;
                this.setSprite(0);
            }
        }
    }

    fire() {
        let a = new BigBullet(this.getRot(), this.getX(), this.getY());

        AudioManager.playBurst(AudioManager.bigCannon);

        a.move(this.projectileOffset);

        this.animFrame = 1;
        this.setSprite(1);
    }
}

export class LaserCircle extends Turret {
    static spriteSheet;

    static NUM_FRAMES = 13;

    static FIRE_RATE = 2;

    static COST = 500;

    static range = 125;

    animFrame = 0;

    rotDir = 0;

    static initSpriteSheet(image) {
        this.spriteSheet = new SpriteSheet(image);

        for(let i = 0; i < 14 * 32; i+= 32) {
            this.spriteSheet.createFrame(i, 96, 32, 32);    
        }
    }

    constructor(x, y) {
        super(x, y, 150, TextureManager.entities, 10, LaserCircle.spriteSheet, true, LaserCircle.FIRE_RATE, LaserCircle.COST);

        this.projectileOffset = 40;

        this.setSprite(0)

        this.rotDir = ((x + 1) * (y + 1) * 999) % 2 - 1;

        this.rotDir = this.rotDir == 0 ? 1 : this.rotDir * 0.7;
    }

    _update(delta) {
        this.target = z0.getActiveScene().getFirstEnemyWithinRange(this.getX(), this.getY(), LaserCircle.range);

        this.cooldown -= delta;

        if(this.animFrame !== 0) {
            this.setSprite(parseInt(this.animFrame));
            this.animFrame += delta * 8;

            if(this.animFrame > LaserCircle.NUM_FRAMES) {
                this.animFrame = 0;
                this.setSprite(0);
            }
        }

        this.rotate(Math.PI / 4 * delta * this.rotDir);

        if(this.target === undefined) return;

        if(this.cooldown < 0) {
            this.fire();
            this.cooldown = this.turretCooldown;
        }
    }

    fire() {
        for(let i = 0; i < Math.PI * 2; i += Math.PI / 18) {
            let a = new WideLaser(this.getRot() + i, this.getX(), this.getY());
            a.move(this.projectileOffset);
        }

        AudioManager.playBurst(AudioManager.laserCircle);

        this.animFrame = 1;
        this.setSprite(1);
    }
}