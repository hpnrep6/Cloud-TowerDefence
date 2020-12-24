import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { Module } from '../../../engine/tree/module.js';
import * as MOUSE from '../../../engine/input/mouse.js';
import { BitmapText } from '../../fonts/bitmaptext.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { TurretBuildCursor } from './buildcursor.js';
import { Main } from '../../../index.js';
import { getActiveScene } from '../../../engine/z0.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';

export class Icon extends Module {
    static selected = 0;
    static selectedCounter = 0;

    mPressed = false;
    id;

    constructor(x, y, width, height, image, spritesheet, cost, type) {
        super(null, x, y, 0);

        this.width = width;
        this.height = height;

        this.cost = cost;

        this.id = Icon.selected++;

        this.type = type;

        // background
        this.sprite = new Sprite2D(this, image, 0, 0, width * 2, height * 2, 0, 35, spritesheet);

        this.text = new BitmapText(x - (cost > 99 ? 20 : 10), y - 75, TextureManager.fontw, 5, 7, 25, 40, 37, 0);

        this.text.setString(this.cost.toString());

        // display image
        let display = new Sprite2D(this, image, 0, 0, width * 1.4, height * 1.4, 0, 36, spritesheet);
        display.setSprite(3);
    }

    _update() {

        if(getActiveScene().getMoney() < this.cost) {
            this.sprite.setSprite(2);
        } else {
            this.sprite.setSprite(1);
        }

        if(MOUSE.isDown()) {
            if(this.intersectingPoint(MOUSE.getX(), MOUSE.getY()) && !this.mPressed) {
                this.sprite.setSprite(1)
                Icon.selected = this.id;
                new TurretBuildCursor(null, this.getX(), this.getY(), this.type);
            }
            this.mPressed = true;
        } else this.mPressed = false;

        if(Icon.selected !== this.id) {
            this.sprite.setSprite(0)
        }
    }

    intersectingPoint(x, y) {
        return(
            this.getX() - this.width < x &&
            this.getX() + this.width > x &&
            this.getY() - this.height < y &&
            this.getY() + this.height > y 
        );
    }
}

export class Delete extends Sprite2D {
    mPressed = false;
    width;
    id;
    cooldown = 0;

    constructor(x, y, width, image) {
        let sprites = new SpriteSheet(image);
        sprites.createFrame(192, 0, 64, 64);
        sprites.createFrame(192 + 64, 0, 64, 64);
        
        super(null, image, x, y, width, width, 0, 35, sprites);

        this.id = Icon.selected++;

        this.width = width;
        this.type = TurretBuildCursor.DELETE;
    }

    _update(delta) {
        if(MOUSE.isDown()) {
            if(this.intersectingPoint(MOUSE.getX(), MOUSE.getY()) && !this.mPressed) {
                this.setSprite(1);
                new TurretBuildCursor(null, this.getX(), this.getY(), this.type);
                Icon.selected = this.id;
                this.cooldown = .4;
            }
            this.mPressed = true;
        } else {
            this.mPressed = false
        };

        if(this.cooldown > 0) {
            this.cooldown -= delta;
            if(this.cooldown <= 0) {
                this.setSprite(0);
            }
        }
        if(Icon.selected !== this.id) {
            this.setSprite(0)
        }
    }

    intersectingPoint(x, y) {
        let w = this.width / 2;
        return(
            this.getX() - w < x &&
            this.getX() + w > x &&
            this.getY() - w < y &&
            this.getY() + w > y 
        );
    }

}