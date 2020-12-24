import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { getActiveScene } from '../../../engine/z0.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { AARectangle } from '../../../engine/physics/primitives/aarectcollider.js';
import { ProjectileCollider } from '../turret/projectile.js';
import { CircleCollider } from '../../../engine/physics/primitives/circlecollider.js'
import { distanceSquared, angleTo } from '../../../engine/math/math2d.js';
import * as MOUSE from '../../../engine/input/mouse.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';

class Waypoint {
    constructor(x, y) {
        this.xLoc = x;
        this.yLoc =y;
    }
}

export class Enemy extends Sprite2D {
    static sprites = 0;

    static DEFAULT_HP = 32;

    static T5_HP = 300;

    static T1_SPEED = 100;

    static T2_SPEED = 200;

    static T3_SPEED = 75;

    static T4_SPEED = 300;

    static T5_SPEED = 35;

    static waypoints = [
        new Waypoint(0, 216),
        new Waypoint(185, 216),
        new Waypoint(185, 60),
        new Waypoint(425, 60),
        new Waypoint(425, 380),
        new Waypoint(150, 380),
        new Waypoint(150, 620),
        new Waypoint(700, 620),
        new Waypoint(700, 78),
        new Waypoint(975, 78),
        new Waypoint(975, 375),
        new Waypoint(1350, 375),
    ];

    static spriteSheet;

    static initSpriteSheet(image) {
        this.spriteSheet = new SpriteSheet(image);

        for(let y = 128; y < 224; y += 32) {
            for(let x = 0; x < 512; x += 32) {
                this.spriteSheet.createFrame(x, y, 32, 32);
            }
        }

        for(let i = 0; i < 256; i += 64)
            this.spriteSheet.createFrame(i, 224, 64, 32);
    }
    radius;

    speed;

    size;

    currentWaypoint = 0;

    hp;

    distTravelled = 0;

    constructor(x, y, hp = Enemy.DEFAULT_HP, nextWaypoint = 0) {
        super(getActiveScene(), TextureManager.enemySprite, x, y, 20, 20, 0, 5, Enemy.spriteSheet);

        this.collider = new EnemyCollider(this, 0, 0, 0, 5, 5, [0], []);

        this.hp = hp < 48 ? hp : Enemy.T5_HP - 1;

        this.setSprite(this.getSpriteLoc())

        this.calcSpeed(this.hp);

        this.resize();

        this.currentWaypoint = Math.min(nextWaypoint, Enemy.waypoints.length - 1);

        getActiveScene().enemies.push(this);

        this.setRot(
            angleTo(this.xLoc, Enemy.waypoints[this.currentWaypoint].xLoc, this.yLoc, Enemy.waypoints[this.currentWaypoint].yLoc)
        );
    }

    _update(delta) {
        let waypoint = Enemy.waypoints[this.currentWaypoint];

        // Don't move if this has reached the next waypoint
        if(this.pointTowardsNextWaypoint(waypoint, delta)) return;

        let distance = this.speed * delta;
        
        // Don't calculate if not in world yet
        if(this.getX() > -this.size)
            this.distTravelled += distance;

        this.move(distance);
    }

    pointTowardsNextWaypoint(current, delta) {
        if(distanceSquared(current.xLoc, this.xLoc, current.yLoc, this.yLoc) < Math.pow(this.speed * delta, 2) + 1) {
            // If its within range, set location to location of waypoint
            this.setLoc(current.xLoc, current.yLoc);
            
            // If there are no more waypoints, don't try to get the location of the next one
            if(this.currentWaypoint > Enemy.waypoints.length - 2) {
                this.reachEnd();
                return true;
            }

            this.currentWaypoint++;

            this.setRot(
                angleTo(this.xLoc, Enemy.waypoints[this.currentWaypoint].xLoc, this.yLoc, Enemy.waypoints[this.currentWaypoint].yLoc)
            );
            return true;
        }
        return false;
    }

    damage(d) {
        let prevHp = this.hp;

        this.hp -= d;

        getActiveScene().addMoney(d / 4);

        if(this.hp < 0) {
            this.removeSelf();
            return;
        }

        this.calcSpeed(this.hp);

        this.setSprite(parseInt(this.getSpriteLoc()));

        this.resize();

        if(prevHp > 47 && this.hp < 48) {
            new Enemy(this.getX() + 50,this.getY() + 50, 38, this.currentWaypoint);
            new Enemy(this.getX() - 50, this.getY() + 50, 38, this.currentWaypoint);
            new Enemy(this.getX() + 50, this.getY() - 50, 38, this.currentWaypoint);
            new Enemy(this.getX() - 50, this.getY() - 50, 38, this.currentWaypoint);
        }
    }

    calcSpeed(hp) {
        if(hp < 12) {
            this.speed = Enemy.T1_SPEED;
            this.radius = 20;
            this.size = 40;
            this.collider.setWidth(this.size);
            this.collider.setHeight(this.size);
            return;
        }

        if(hp < 25) {
            this.speed = Enemy.T2_SPEED;
            this.radius = 45;
            this.size = 70;
            this.collider.setWidth(this.size);
            this.collider.setHeight(this.size);
            return;
        }

        if(hp < 39) {
            this.speed = Enemy.T3_SPEED;
            this.radius = 65;
            this.size = 90;
            this.collider.setWidth(this.size);
            this.collider.setHeight(this.size);
            return;
        }
        
        if(hp < 48) {
            this.speed = Enemy.T4_SPEED;
            this.radius = 60;
            this.size = 90;
            this.collider.setWidth(this.size);
            this.collider.setHeight(this.size);
            return;
        }

        this.speed = Enemy.T5_SPEED;
        this.radius = 150;
        this.size = 90;
        this.collider.setWidth(this.size);
        this.collider.setHeight(this.size);
    }

    resize() {
        let height = this.hp > 47 ? 192 : 128;

        let width = this.hp > 47 ? 400 : 128;

        this.setWidth(width);
        this.setHeight(height);
    }

    getSpriteLoc() {
        if(this.hp < 48) return this.hp;

        if(this.hp < Enemy.T5_HP / 4) return 47 + 1;

        if(this.hp < (Enemy.T5_HP / 4) * 2) return 47 + 2;

        if(this.hp < (Enemy.T5_HP / 4) * 3) return 47 + 3;

        if(this.hp < Enemy.T5_HP    ) return 47 + 4;
    }

    reachEnd() {
        getActiveScene().drainLife(this.hp);
        this.removeSelf();
    }

    getDistTravelled() {
        return this.distTravelled;
    }

    getHP() {
        return this.hp;
    }

    _destroy() {
        let index = getActiveScene().enemies.indexOf(this);
        getActiveScene().enemies.splice(index, 1);
        super._destroy();
    }
}


// Separates enemies from other colliders present in game
export class EnemyCollider extends AARectangle {

}