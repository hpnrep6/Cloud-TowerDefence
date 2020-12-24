import { Sprite2D } from  '../../../engine/graphics/sprite2d.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';
import { EnemyCollider } from '../enemy/enemy.js';
import { CircleCollider } from '../../../engine/physics/primitives/circlecollider.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { getActiveScene, getCanvasWidth, getCanvasHeight } from '../../../engine/z0.js';

export class Projectile extends Sprite2D {
    static SPEED = 500;
    static DEFAULT_DAMAGE = 5;
    static DEFAULT_PEN = 5;
    static DEFAULT_SIZE = 40;

    static removeDelay = 100;

    damage;
    speed;
    penetration;
    destroyed = false;

    constructor(rot, x, y, size = Projectile.DEFAULT_SIZE, spriteSize = 32, damage = Projectile.DEFAULT_DAMAGE, penetration = Projectile.DEFAULT_PEN, spritSheet, speed = Projectile.SPEED, spriteWidth) {
        super(getActiveScene(), TextureManager.projectile, x, y, spriteWidth || spriteSize, spriteSize, rot, 20, spritSheet);

        new ProjectileCollider(this, size);

        this.maxX = getCanvasWidth() + Projectile.removeDelay;
        this.maxY = getCanvasHeight() + Projectile.removeDelay;

        this.speed = speed;

        this.damage = damage;
        this.penetration = penetration;
    }

    _update(delta) {
        this.move(this.speed * delta)

        // Remove when outside of world borders
        if(this.getX() < -Projectile.removeDelay || this.getX() > this.maxX || this.getY() > this.maxY || this.getY() < -Projectile.removeDelay) { 
            this.removeSelf();
        }
    }

    hitTarget(damage) {
        this.penetration -= damage;
        if(this.penetration <= 0) {
            this.destroyed = true;
            this.removeSelf();
        }
    }

    getDamage() {
        return this.damage;
    }
}

export class ProjectileCollider extends CircleCollider {
    damagedEnemies = [];

    constructor(parent, diameter) {
        super(parent, 0, 0, 0, diameter, [], [0]);
    }

    _onCollision(body) {  
        if(body instanceof EnemyCollider) {
            if(this.getParent().destroyed) return;

            if(this.damagedEnemies.indexOf(body) !== -1) return;

            body.getParent().damage(this.getParent().getDamage());

            this.damagedEnemies.push(body);    

            let damage = 1;

            if(body.getParent().getHP() > 48) {
                damage = 300;
            }

            this.getParent().hitTarget(damage);
        }
    }
}

export class Bullet extends Projectile {
    static penetration = 3;
    static damage = 1;

    constructor(rot, x, y) {
        let ss = new SpriteSheet(TextureManager.projectile);
        ss.createFrame(0, 0, 16, 16);
        super(rot, x, y, 10, 40, Bullet.damage, Bullet.penetration, ss);
    }
}

export class BigBullet extends Projectile {
    static penetration = 10;
    static damage = 10;

    constructor(rot, x, y) {
        let ss = new SpriteSheet(TextureManager.projectile);
        ss.createFrame(0, 16, 32, 32);
        super(rot, x, y, 40, 80, BigBullet.damage, BigBullet.penetration, ss, 250);
    }
}

export class WideLaser extends Projectile {
    static penetration = 15;
    static damage = 0.7;

    static LIFETIME = 0.5;
    lifeTime = 0;

    constructor(rot, x, y) {
        let ss = new SpriteSheet(TextureManager.projectile);
        ss.createFrame(32, 0, 16, 32);
        super(rot, x, y, 30, 80, WideLaser.damage, WideLaser.penetration, ss, 250, 30);
    }

    _update(delta) {
        super._update(delta);

        this.lifeTime += delta;

        this.setAlpha( 1 - this.lifeTime / WideLaser.LIFETIME)

        if(this.lifeTime > WideLaser.LIFETIME) {
            this.removeSelf();
        }
    }
}