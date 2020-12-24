import { CircleCollider } from '../../engine/physics/primitives/circlecollider.js';
import * as MOUSE from '../../engine/input/mouse.js';
import { Turret, TurretCollider } from './turret/turret.js';
import { TurretSlot } from './turret/slot.js';

export const IDLE = 0;
export const TURRET_BUILD = 1;

export class TurretBuildCursor extends CircleCollider {
    static DIAMETER = 20;

    inArea = false;
    notOnTurret = true;

    constructor(x, y) {
        super(null, x, y, 0, TurretBuildCursor.DIAMETER, [], [1]);
    }

    _update() {
        if(this.inArea && this.notOnTurret) {
            if(MOUSE.isDown()) {
                new Turret(this.xLoc, this.yLoc);
            }
        }

        this.setLoc(MOUSE.getX(), MOUSE.getY())

        this.notOnTurret = true;
        this.inArea = false;
    }

    _onCollision(body) {
        if(body instanceof TurretSlot) this.inArea = true;

        else if(body instanceof TurretCollider) this.notOnTurret = false;
    }

    remove() {
        this.removeSelf();
    }
}
