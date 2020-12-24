import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { distanceSquared } from '../../../engine/math/math2d.js';
import * as MOUSE from '../../../engine/input/mouse.js';
import { getActiveScene, getElapsedTime, getTree } from '../../../engine/z0.js';
import { Main } from '../../../index.js';
import { AARectangle } from '../../../engine/physics/primitives/aarectcollider.js';


export class MenuButton extends Sprite2D {
    pressed = false;
    
    delay = -1;

    yAnchor;

    isHover;

    oW;

    oH;

    constructor(xLoc, yLoc, width, height) {
        let ss = new SpriteSheet(TextureManager.menu);
        ss.createFrame(0, 0, 128, 64);

        super(null, TextureManager.menu, xLoc, yLoc, width, height, 0, 3, ss);

        new button(this, 0, 0, 0, width, height, [], [0]);

        this.oW = width;
        this.oH = height;

        this.yAnchor = yLoc;
    }

    _update(delta) {
        this.delay -= delta;

        if(MOUSE.isDown()) {
            if(this.isHover && !this.pressed) {
                this.action();
                this.pressed = true;
            }
        } else {
            this.setSprite(0);
            this.pressed = false;
        }

        if(this.isHover) {
            this.setWidth(this.oW + 40);
            this.setHeight(this.oH + 40);
        } else {
            this.setWidth(this.oW);
            this.setHeight(this.oH);
        }

        let offset = Math.cos(getElapsedTime() / 500) * 10;

        this.setY(this.yAnchor + offset);

        this.isHover = false;
    }

    action() {
        getTree().setActiveScene(new Main());
    }
}

class button extends AARectangle {
    _onCollision(body) {
        this.getParent().isHover = true;
    }
}