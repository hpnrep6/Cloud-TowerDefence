import * as Z0 from './engine/z0.js';
import { TextureManager } from './engine/graphics/texturemanager.js';
import { Scene } from './engine/tree/scene.js';
import { SpriteSheet } from './engine/graphics/spritesheet.js'; 
import { Enemy } from './game/scripts/enemy/enemy.js';
import { Cannon, TriCannon, BigCannon, LaserCircle } from './game/scripts/turret/turret.js';
import * as KEY from './engine/input/key.js';
import * as MOUSE from './engine/input/mouse.js';
import { Sprite2D } from './engine/graphics/sprite2d.js';
import { distanceSquared } from './engine/math/math2d.js';
import { BitmapText } from './game/fonts/bitmaptext.js';
import { TurretSlot } from './game/scripts/turret/slot.js';
import { TurretBuildCursor } from './game/scripts/ui/buildcursor.js';
import { Icon, Delete } from './game/scripts/ui/icon.js';
import { Wave } from './game/scripts/enemy/wave.js';
import { MenuButton } from './game/scripts/ui/menubutton.js';
import { ShaderSprite2D } from './engine/graphics/shadersprite2d.js';
import { FastForwardButton, HomeButton } from './game/scripts/ui/fastforward.js';
import { BackgroundShader } from './game/scripts/background.js';
import { CircleCollider } from './engine/physics/primitives/circlecollider.js';
import { DeathScreen } from './game/scripts/ui/death.js';
import { AudioManager } from './engine/audio/audiomanager.js';

let canvas =  document.querySelector('canvas');

Z0._init(canvas)


/**
 * Physics layers:
 * 
 * 0: Enemy / turret
 * 
 * 1: Turret placement / turret
 */

export class Main extends Scene {
    static START_MONEY = 150;
    static START_LIVES = 250;

    money = Main.START_MONEY;
    lives = Main.START_LIVES;

    enemies = [];
    turretAreas = [];
    turrets = [];

    moneyText;
    livesText;
    levelText;

    dead = false;

    backgroundWaveCount = 1;

    constructor() {
        super(400)
    }

    _start() {
            this.bkgPath = new Sprite2D(this, TextureManager.bkg, Z0.getCanvasWidth() / 2, Z0.getCanvasHeight() / 2, Z0.getCanvasWidth(), Z0.getCanvasHeight(), 0, 1);

            new Sprite2D(this, TextureManager.bkg2, Z0.getCanvasWidth() / 2, Z0.getCanvasHeight() / 2, Z0.getCanvasWidth(), Z0.getCanvasHeight(), 0, 25);

            this.background = new BackgroundShader(Z0.getGL(), Z0.getCanvas());

            let bkgSprite = new ShaderSprite2D(this, TextureManager.bkg2, this.background, Z0.getCanvasWidth() / 2, Z0.getCanvasHeight() / 2, Z0.getCanvasWidth(), Z0.getCanvasHeight(), 0, 0);

            this.addTurretColliders();

            this.initUI();

            this.moneyText = new BitmapText(60, 725, TextureManager.font,
                5, 7, 33, 45, 30);

            this.livesText = new BitmapText(60, 770, TextureManager.font,
                5, 7, 33, 45, 30);

            new FastForwardButton(585, 753, 75);

            new HomeButton(350, 753, 75);

            this.setBackgroundColour(0, 0, 0, 1);

            AudioManager.stop(AudioManager.bkg);

            AudioManager.playLoop(AudioManager.bkg);

            this.waves = new Wave();
    }

    addTurretColliders() {
        this.turretAreas = [
            new TurretSlot( 50, 75, 130, 160),
            new TurretSlot( 310, 220, 130, 240),
            new TurretSlot( 140, 300, 270, 70),
            new TurretSlot( 45, 510, 80, 365),
            new TurretSlot( 420, 505, 440, 130),
            new TurretSlot( 565, 230, 160, 440),
            new TurretSlot( 840, 380, 150, 480),
            new TurretSlot( 1060, 530, 290, 180),
            new TurretSlot( 1120, 160, 160, 320),
            new TurretSlot( 390, 680, 700, 20),
            new TurretSlot( 810, 12, 650, 20)
        ];
    }

    initUI() {
        let cannon = new SpriteSheet(TextureManager.ui);
        cannon.createFrame(0, 0, 64, 64);
        cannon.createFrame(64, 0, 64, 64);
        cannon.createFrame(128, 0, 64, 64);
        cannon.createFrame(0, 64, 64, 64);

        new Icon(1150, 750, 50, 50, TextureManager.ui, cannon, 50, TurretBuildCursor.CANNON);

        let tricannon = new SpriteSheet(TextureManager.ui);
        tricannon.createFrame(0, 0, 64, 64);
        tricannon.createFrame(64, 0, 64, 64);
        tricannon.createFrame(128, 0, 64, 64);
        tricannon.createFrame(0, 128, 64, 64);

        new Icon(1050, 750, 50, 50, TextureManager.ui, tricannon, 150, TurretBuildCursor.TRICANNON);

        let bigcannon = new SpriteSheet(TextureManager.ui);
        bigcannon.createFrame(0, 0, 64, 64);
        bigcannon.createFrame(64, 0, 64, 64);
        bigcannon.createFrame(128, 0, 64, 64);
        bigcannon.createFrame(0, 192, 64, 64);

        new Icon(950, 750, 50, 50, TextureManager.ui, bigcannon, 450, TurretBuildCursor.BIGCANNON);

        let lasercircle = new SpriteSheet(TextureManager.ui);
        lasercircle.createFrame(0, 0, 64, 64);
        lasercircle.createFrame(64, 0, 64, 64);
        lasercircle.createFrame(128, 0, 64, 64);
        lasercircle.createFrame(0, 256, 64, 64);

        new Icon(850, 750, 50, 50, TextureManager.ui, lasercircle, 500, TurretBuildCursor.LASERCIRCLE);

        new Delete(750, 750, 100, TextureManager.ui);

        this.levelText = new BitmapText(430, 770, TextureManager.font, 5, 7, 33, 45, 30);
    }

    _update(delta) {
        if(KEY.isKeyDown('escape')) {
            Z0.tree.setActive(new Menu());
            return;
        }
        
        this.moneyText.setString(parseInt(this.money).toString());
        this.livesText.setString(parseInt(Math.max(this.lives, 0)).toString());
        this.levelText.setString(parseInt(this.waves.current + 1).toString());

        if(this.backgroundWaveCount < this.waves.current) {
            this.backgroundWaveCount += ((this.waves.current / this.backgroundWaveCount) / 5 ) * delta;
        }

        this.background.wave = this.backgroundWaveCount;

        if(this.lives <= 0 && !this.dead) {
            this.dead = true;
            new DeathScreen(canvas.width / 2, canvas.height / 2);
        }
    }

    getNearestTurret(x, y) {
        let nearest;
        let lowestDist = 99999999999;
        for(let i = 0; i < this.turrets.length; i++) {
            let distance = distanceSquared(x, this.turrets[i].getX(), y, this.turrets[i].getY())
            if(distance < lowestDist) {

                if(this.turrets[i].getX() < 0) continue;

                nearest = this.turrets[i];
                lowestDist = distance;
            }
        }
        return nearest;

    }

    getNearestEnemy(x, y) {
        let nearest;
        let lowestDist = 99999999999;
        for(let i = 0; i < this.enemies.length; i++) {
            let distance = distanceSquared(x, this.enemies[i].getX(), y, this.enemies[i].getY())
            if(distance < lowestDist) {

                if(this.enemies[i].getX() < 0) continue;

                nearest = this.enemies[i];
                lowestDist = distance;
            }
        }
        return nearest;
    }

    getFirstEnemyWithinRange(x, y, r) {
        let longestTravelled = 0, firstEnemy;

        for(let i = 0; i < this.enemies.length; i++) {
            let distance = distanceSquared(x, this.enemies[i].getX(), y, this.enemies[i].getY()) - Math.pow(this.enemies[i].radius, 2);

            if(distance <= Math.pow(r, 2)) {
                let distTravelled = this.enemies[i].getDistTravelled();
                if(distTravelled > longestTravelled) {
                    firstEnemy = this.enemies[i];
                    longestTravelled = distTravelled;
                }
            }
        }

        return firstEnemy;
    }

    addMoney(amount) {
        this.money += amount;
    }

    getMoney() {
        return this.money;
    }

    getEnemyCount() {
        return this.enemies.length;
    }

    getWaveObject() {
        return this.waves;
    }

    requestMoney(amount) {
        let diff = this.money - amount;
        if(diff < 0) {
            return false;
        }

        this.money = diff;
        return true;
    }

    drainLife(lives) {
        this.lives -= lives;

        if(this.lives < 0) {
            this.endGame();
        }
    }

    addLife(lives) {
        this.lives += lives;
    }

    endGame() {

    }
}

export class Menu extends Scene {
    static inited = false;

    constructor() {
        super(10000)
    }

    _start() {
        if(!Menu.inited) {

            Menu.inited = true;

            let volume = .1;

            AudioManager.cannon = AudioManager.createAudio('./game/sounds/cannonboom.wav', volume + .1);

            AudioManager.triCannon = AudioManager.createAudio('./game/sounds/tricannonboom.ogg', volume - .02);

            AudioManager.laserCircle = AudioManager.createAudio('./game/sounds/lasercirclesound.ogg', volume + .2);

            AudioManager.bigCannon = AudioManager.createAudio('./game/sounds/bigcannonboom.ogg', volume);

            let playerS = loadImage('./game/sprites/player.png');

            let enemyS = loadImage('./game/sprites/entities.png');

            let projectile = loadImage('./game/sprites/projectile.png');

            let turret = loadImage('./game/sprites/entities.png');

            let font = loadImage('./game/fonts/font3.png');

            let empty = loadImage('./game/sprites/t1.png');

            let bkg = loadImage('./game/sprites/background.png');

            let cursor = loadImage('./game/sprites/cursor.png');

            let ui = loadImage('./game/sprites/ui.png');

            let whiteFont = loadImage('./game/fonts/fontw.png');

            let bkg2 = loadImage('./game/sprites/background2.png');

            let menu = loadImage('./game/sprites/menu.png');

            let credits = loadImage('./game/sprites/credits.png');

            Promise.all([playerS, enemyS, projectile, turret, font, empty, bkg, cursor, ui, whiteFont, bkg2, menu, credits]).then((sprites) => {
                TextureManager.playerSprite = TextureManager.addTexture(sprites[0]);

                let playerSpriteSheet = new SpriteSheet(TextureManager.playerSprite);

                playerSpriteSheet.createFrame(0, 0, 64, 64);

                {
                    TextureManager.enemySprite = TextureManager.addTexture(sprites[1]);

                    TextureManager.projectile = TextureManager.addTexture(sprites[2]);

                    TextureManager.entities = TextureManager.addTexture(sprites[3]);

                    TextureManager.font = TextureManager.addTexture(sprites[4]);

                    TextureManager.empty = TextureManager.addTexture(sprites[5]);

                    TextureManager.bkg = TextureManager.addTexture(sprites[6]);

                    TextureManager.cursor = TextureManager.addTexture(sprites[7]);

                    TextureManager.ui = TextureManager.addTexture(sprites[8]);

                    TextureManager.fontw = TextureManager.addTexture(sprites[9]);

                    TextureManager.bkg2 = TextureManager.addTexture(sprites[10]);

                    TextureManager.menu = TextureManager.addTexture(sprites[11]);

                    TextureManager.credits = TextureManager.addTexture(sprites[12]);
                }

                Enemy.initSpriteSheet(TextureManager.enemySprite);

                Cannon.initSpriteSheet(TextureManager.entities);

                TriCannon.initSpriteSheet(TextureManager.entities);

                BigCannon.initSpriteSheet(TextureManager.entities);

                LaserCircle.initSpriteSheet(TextureManager.entities);

                this.initialise();

                AudioManager.bkg = AudioManager.createAudio('./game/sounds/neon.ogg', 0.1);

                Z0._startUpdates();
            });
        } else {
            this.initialise();
        }
    }

    initialise() {
        new MenuButton(canvas.width / 2, canvas.height / 2 - 20, 330, 150)

        let spriteSheet = new SpriteSheet(TextureManager.menu);

        spriteSheet.createFrame(0, 64, 512, 352);

        let spriteSheet2 = new SpriteSheet(TextureManager.menu);

        spriteSheet2.createFrame(129, 0, 383, 64);

        spriteSheet2.createFrame(0, 352 + 64, 256 + 32, 160 - 64)
        
        new Sprite2D(null, TextureManager.menu, 280 * 1.1, 600, 512 * 1.1, 352 * 1.1, 0, 3, spriteSheet);

        new Sprite2D(null, TextureManager.credits, 1080, 720, 383 * 1.5, 90 * 1.5, 0, 3);

        let title = new Sprite2D(null, TextureManager.menu, canvas.width / 2, 140, 800 * .9, 300 * .9, 0, 3, spriteSheet2);

        title.setSprite(1);

        this.mouseFollower = new CircleCollider(this, 0, 0, 0, 2, [0], []);

        this.background = new BackgroundShader(Z0.getGL(), Z0.getCanvas());

        this.bkg = new ShaderSprite2D(this, TextureManager.bkg2, this.background, Z0.getCanvasWidth() / 2, Z0.getCanvasHeight() / 2, Z0.getCanvasWidth(), Z0.getCanvasHeight(), 0, 0);
    }

    _update(delta) {
        if(MOUSE.getX() && MOUSE.getY()) {
            this.mouseFollower.setLoc(MOUSE.getX(), MOUSE.getY());
        }
    }

}

let menu = Z0.tree.addScene(new Menu());

Z0.tree.setActive(menu);

function loadImage(url) {
    return new Promise((res, rej) => {
        let image = new Image();
        image.addEventListener('load', () => {
            res(image);
        });
        image.addEventListener('error', () => {
            rej();
        })
        image.src = url;
    })
}
