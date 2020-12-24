import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { distanceSquared } from '../../../engine/math/math2d.js';
import * as MOUSE from '../../../engine/input/mouse.js';
import { getActiveScene, getTree } from '../../../engine/z0.js';
import { Menu } from '../../../index.js';


export class FastForwardButton extends Sprite2D {
    pressed = false;
    
    delay = -1;

    static DELAY = 0.2;

    constructor(xLoc, yLoc, size) {
        super(null, TextureManager.cursor, xLoc, yLoc, size, size, 0, 40);
        this.createFrames();
    }

    _update(delta) {
        this.delay -= delta;

        if(MOUSE.isDown()) {
            if(distanceSquared(MOUSE.getX(), this.getX(), MOUSE.getY(), this.getY()) <= 1300 && !this.pressed && this.delay <= 0) {
                this.setSprite(1);
                //this.action();
                this.pressed = true;
                this.delay = FastForwardButton.DELAY;
            }
        } else {
            this.setSprite(0);
            if(this.pressed) {
                if(distanceSquared(MOUSE.getX(), this.getX(), MOUSE.getY(), this.getY()) <= 1300) {
                    this.action();
                }
            }

            this.pressed = false;
        }

    }

    action() {
        getActiveScene().getWaveObject().forceNext();
    }

    createFrames() {
        let ss = new SpriteSheet(TextureManager.cursor);
        ss.createFrame(0, 128, 64, 64);
        ss.createFrame(64, 128, 64, 64);
        this.setSpriteSheet(ss);
        this.setSprite(0);
    }
}

export class HomeButton extends FastForwardButton {
    createFrames() {
        let ss = new SpriteSheet(TextureManager.cursor);
        ss.createFrame(128, 128, 64, 64);
        ss.createFrame(192, 128, 64, 64);
        this.setSpriteSheet(ss);
        this.setSprite(0);
    }

    action() {
        getTree().setActiveScene(new Menu());
    }
}
