import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { SpriteSheet } from '../../../engine/graphics/spritesheet.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { getCanvas } from '../../../engine/var.js';
import { getTree } from '../../../engine/z0.js';
import { Menu } from '../../../index.js';

export class DeathScreen extends Sprite2D {
    elapsed = 0;

    constructor(x, y) {
        let spritesheet = new SpriteSheet(TextureManager.ui);
        spritesheet.createFrame(128, 192, 384, 256);
        super(null, TextureManager.ui, x, y, getCanvas().width + 2, getCanvas().height + 2, 0, 85, spritesheet);
        this.setAlpha(0);
    }

    _update(delta) {
        this.setAlpha(this.getAlpha() + delta / 10);
        
        if(this.getAlpha() > 2) {
            getTree().setActiveScene(new Menu());
        }
    }
}