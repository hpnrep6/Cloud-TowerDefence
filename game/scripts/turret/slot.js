import { Sprite2D } from '../../../engine/graphics/sprite2d.js';
import { TextureManager } from '../../../engine/graphics/texturemanager.js';
import { AARectangle } from '../../../engine/physics/primitives/aarectcollider.js';

// Debug slot for positioning colliders 

// export class TurretSlot extends Sprite2D {
//     constructor(x, y, sizeX = 130, sizeY = 130) {
//         super(null, TextureManager.empty, x, y, sizeX, sizeY, 0, 10);

//     }
// }

export class TurretSlot extends AARectangle {
    constructor(x, y, sizeX = 130, sizeY = 130) {
        super(null, x, y, 0, sizeX, sizeY, [1], []);

    }
}