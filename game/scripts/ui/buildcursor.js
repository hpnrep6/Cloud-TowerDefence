import { CircleCollider } from '../../../engine/physics/primitives/circlecollider.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';
import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { Cannon, LaserCircle, BigCannon, TriCannon, TurretCollider } from '../turret/turret.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import * as MOUSE from '../../../engine/input/mouse.js';
import { TurretSlot } from '../turret/slot.js';
import { getActiveScene, elapsed } from '../../../engine/z0.js';
import { distanceSquared } from '../../../engine/math/math2d.js';



export class TurretBuildCursor extends CircleCollider {
    static DIAMETER = 1;

    static IDLE = -1;
    static CANNON = 0;
    static TRICANNON = 1;
    static BIGCANNON = 2;
    static LASERCIRCLE = 3;
    static DELETE = 4;

    static VISIBLE_ALPHA = 0.2;
    static RANGE = 2500;
    static active;

    selected = -1;
    elapsed = 2;
    inArea = false;
    notOnTurret = true;
    sprite;
    target;
    canDestroy = false;
    lifeTime = 2;

    constructor(parent, x, y, type) {
        super(parent, x, y, 0, TurretBuildCursor.DIAMETER, [], [1]);
        let spritesheet = new SpriteSheet(TextureManager.cursor);

        spritesheet.createFrame(0, 0, 1, 1); // Blank
        spritesheet.createFrame(0, 0, 128, 128); // White circle
        spritesheet.createFrame(128, 0, 128, 128); // Red circle

        let layer = type === TurretBuildCursor.DELETE ? 50 : 3;

        this.sprite = new Sprite2D(this, TextureManager.cursor, 0, 0, 128, 128, 0, layer, spritesheet);
        this.sprite.setAlpha(0);
        this.sprite.setSprite(2);

        // Limits max build cursors to 1
        if(TurretBuildCursor.active !== undefined) TurretBuildCursor.active.removeSelf();

        TurretBuildCursor.active = this;

        this.selected = type;

        switch(this.selected) {
            case TurretBuildCursor.IDLE:
                this.sprite.setAlpha(0);
                this.sprite.setSprite(0);
                break;
            case TurretBuildCursor.CANNON:
                this.sprite.setWidth(Cannon.range * 2);
                this.sprite.setHeight(Cannon.range * 2);
                this.sprite.setAlpha(TurretBuildCursor.VISIBLE_ALPHA);
                break;
            case TurretBuildCursor.TRICANNON:
                this.sprite.setWidth(TriCannon.range * 2);
                this.sprite.setHeight(TriCannon.range * 2);
                this.sprite.setAlpha(TurretBuildCursor.VISIBLE_ALPHA);
                break;
            case TurretBuildCursor.BIGCANNON:
                this.sprite.setWidth(BigCannon.range * 2);
                this.sprite.setHeight(BigCannon.range * 2);
                this.sprite.setAlpha(TurretBuildCursor.VISIBLE_ALPHA);
                break;
            case TurretBuildCursor.LASERCIRCLE:
                this.sprite.setWidth(LaserCircle.range * 2);
                this.sprite.setHeight(LaserCircle.range* 2);
                this.sprite.setAlpha(TurretBuildCursor.VISIBLE_ALPHA);
                break;
            case TurretBuildCursor.DELETE:
                this.sprite.setWidth(150);
                this.sprite.setHeight(150);
                this.sprite.setAlpha(.5);
                break;
        }
    }

    _update(delta) {
        this.elapsed -= delta;

        if(this.elapsed < 0) this.canDestroy = true;

        if(this.selected != 4) {
            if(this.inArea && this.notOnTurret) {
                this.canDestroy = true;

                if(MOUSE.isDown()) {
                    switch(this.selected) {
                        case TurretBuildCursor.IDLE:
                            break;
                        case TurretBuildCursor.CANNON:
                            new Cannon(this.getX(), this.getY())
                            break;
                        case TurretBuildCursor.TRICANNON:
                            new TriCannon(this.getX(), this.getY())
                            break;
                        case TurretBuildCursor.BIGCANNON:
                            new BigCannon(this.getX(), this.getY());
                            break;
                        case TurretBuildCursor.LASERCIRCLE:
                            new LaserCircle(this.getX(), this.getY());
                            break;
                    }

                    this.removeSelf();
                    return;
                }

                if(this.selected !== TurretBuildCursor.IDLE) {
                    this.sprite.setSprite(1);
                }
            } else {
                if(this.selected !== TurretBuildCursor.IDLE) {
                    this.sprite.setSprite(2);
                }
            }
            this.setLoc(MOUSE.getX(), MOUSE.getY());

            // Remove self when pressed on an invalid space after the mouse has been moved around a bit
            if(MOUSE.isDown() && this.canDestroy) {
                this.removeSelf();
                return;
            }
        } else {
            //this.setLoc(MOUSE.getX(), MOUSE.getY());
            let nearest = getActiveScene().getNearestTurret(MOUSE.getX(), MOUSE.getY());

            if(nearest !== undefined) {
                if(distanceSquared(MOUSE.getX(), nearest.getX(), MOUSE.getY(), nearest.getY()) <= TurretBuildCursor.RANGE) { 
                    this.setLoc(nearest.getX(), nearest.getY());
                    this.canDestroy = true;
                    this.target = nearest;
                    this.sprite.setVisible(true);
                } else {
                    this.setLoc(MOUSE.getX(), MOUSE.getY());
                    this.target = undefined;
                    this.sprite.setVisible(false);
                }
            } else {
                this.sprite.setVisible(false);
            }

            if(MOUSE.isDown() && this.canDestroy) {
                if(this.target !== undefined) {
                    this.target.removeSelf();
                } 
                this.removeSelf();
                return;
            } 
        }

        this.inArea = false;
        this.notOnTurret = true;
    }

    _onCollision(body) {
        if(body instanceof TurretSlot) this.inArea = true;

        else if(body instanceof TurretCollider) {
            this.notOnTurret = false;
        }
    }

    _removeSelf() {
        super.removeSelf();
        TurretBuildCursor.active = undefined;
    }
}
