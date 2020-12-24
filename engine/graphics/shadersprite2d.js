import { Sprite } from './sprite.js';
import * as z0 from '../z0.js';
import * as GLUTILS from '../utils/glutils.js';
import { Sprite2D } from './sprite2d.js';

export class ShaderSprite2D extends Sprite2D {
    renderer;

    constructor(parent, image, renderer, xLoc, yLoc, xSize, ySize, rot = 0, zLoc = 0, spritesheet = null) {
        super(parent, image, xLoc, yLoc, xSize, ySize, rot, zLoc, spritesheet);

        this.renderer = renderer;
    }
    _draw(gl, sprites, lastShader) {
        this.renderer.draw(gl, sprites, lastShader);
    }
}

export class ShaderSprite2DRenderer {
    // Number of cycles to create vertex position array. Each cycle increases previous count by a power of two, starting from 12 vertex locations (2 per vertex, 3 verticies per triangle, 2 triangles per quad)
    MAX_CYCLES = 4;

    constructor(gl, canvas, vertexShader = null, fragmentShader = null, initialVerticies = 4) {
        if(!!vertexShader) {
            this.vShader = vertexShader;
        }

        if(!!fragmentShader) {
            this.fShader = fragmentShader;
        }

        this.MAX_CYCLES = initialVerticies;

        this.initInfo(gl, canvas);

        this.bindUniforms(gl, this.program);
    }

    bindUniforms(gl, program) {

    }

    setUniforms(gl) {

    }

    setFloat(reference, value) {
        this.gl.uniform1fv(reference, [value]);
    }

    setVec2(reference, valueX, valueY) {
        this.gl.uniform2fv(reference, [valueX, valueY]);
    }

    getUniformLocation(name) {
        return this.gl.getUniformLocation(this.program. name);
    }
    
    getULoc(name) {
    	return getUniformLocation(name);
    }

    // Default shaders
    vShader = `
        attribute vec3 aTransformation0;
        attribute vec3 aTransformation1;

        attribute vec2 aVertPos;
        attribute vec2 aTexCoord;

        uniform vec2 uRes;
    
        varying vec2 vTexCoord;
        varying float vAlpha;

        varying vec2 vRes;
        
        void main() {
            vec2 scaledPos = (aVertPos * aTransformation1.yz) / 2.0;

            float xRot = sin(aTransformation0.z), yRot = cos(aTransformation0.z);

            vec2 rotPos = vec2(
                  scaledPos.x * yRot + scaledPos.y * xRot,
                  scaledPos.y * yRot - scaledPos.x * xRot
            );

            rotPos = (((rotPos + aTransformation0.xy) / uRes) * 2. -1.) * vec2(1,-1);

            gl_Position = vec4(rotPos, 0, 1);

            vAlpha = aTransformation1.x;
            vTexCoord = aTexCoord;
            vRes = uRes;
        }
    `;
    
    fShader = `
        precision mediump float;

        varying vec2 vTexCoord;
        varying float vAlpha;
        
        uniform sampler2D uSampler;

        uniform mediump float uTime;
        uniform mediump float uTimeDelta;
        varying vec2 uRes;

        void main() {

            gl_FragColor = vec4(cos(uTime / 100.), 0, 0, 1);
        }
    `;

    initialised = false;

    gl;
    canvas;
    program;

    glBuffers = {
        vboID: null,
        vaoID: null,
        texID: null,
        transform0ID: null,
        transform1ID: null,
        vertices: null,
        texVertices: null
    }

    info = {
        aLoc: {
            aVertPos: null,
            aTransform0: null,
            aTransform1: null
        }, uLoc: {
            uRes: null,
            uTime: null,
            uTimeDelta: null
        },
    };

    vertices = [
        1,  1,
        1, -1,
       -1,  1,
        
       -1,  1,
        1, -1,
       -1, -1
    ]

    textureCoords = new Float32Array([
        1,  1,
        1,  0,
        0,  1,
        
        0,  1,
        1,  0,
        0,  0
    ]);


    // Initialise the values in static info at runtime once with the given gl context
    initInfo(gl, canvas) {
        this.canvas = canvas;
        this.gl = gl;

        // Only init once 
        if(this.initialised) return;

        this.program = GLUTILS.createShaderProgram(gl, this.vShader, this.fShader);

        this.info.aLoc.aTransform0 = this.gl.getAttribLocation(this.program, 'aTransformation0');
        this.info.aLoc.aTransform1 = this.gl.getAttribLocation(this.program, 'aTransformation1');
        this.info.aLoc.aVertPos = this.gl.getAttribLocation(this.program, 'aVertPos');

        this.info.uLoc.uTimeDelta = this.gl.getUniformLocation(this.program, 'uTimeDelta');
        this.info.uLoc.uTime = this.gl.getUniformLocation(this.program, 'uTime');
        this.info.uLoc.uRes = this.gl.getUniformLocation(this.program, 'uRes');

        // Init vertex buffers
        this.glBuffers.vboID = gl.createBuffer();
        this.glBuffers.texID = gl.createBuffer();

        // Init transformation buffers
        this.glBuffers.transform0ID = gl.createBuffer();
        this.glBuffers.transform1ID = gl.createBuffer();

        let vertexBufferInArray = [];
        vertexBufferInArray = vertexBufferInArray.concat(this.vertices);

        for(let i = 0; i < this.MAX_CYCLES; i++) {
            vertexBufferInArray = vertexBufferInArray.concat(vertexBufferInArray);
        }

        this.glBuffers.vertices = new Float32Array(vertexBufferInArray);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers.vboID);
        gl.bufferData(gl.ARRAY_BUFFER, this.glBuffers.vertices, gl.STATIC_DRAW)

        this.initialised = true;
    }

    draw(gl, sprites, lastShader) { 
        // Don't change shader if previous shader used is the same one as the current shader, because shader changes are relatively expensive
        if(lastShader.shader !== this.program) 
            gl.useProgram(this.program);

        lastShader.shader = this.program;

        let batches = sprites.length;

        for(let s = 0; s < batches; s++) {
            let currentBatch = sprites[s];

            // 6 transform values per vertice, split into two vec3s
            // 6 verticies per quad: 3 * 6 = 18
            let transforms0 = new Float32Array(currentBatch.length * 18);
            let transforms1 = new Float32Array(currentBatch.length * 18);
            
            // 2 texture coordinate values per vertice, 6 verticies
            // per quad: 2 * 6 = 12
            let texCoords = new Float32Array(currentBatch.length * 12);

            for(let i = 0, n = currentBatch.length; i < n; i++) {
                for(let j = 0; j < 2; j++) {
                    let offset = i * 18 + j * 9;

                    /*
                        Transformation vector3 layout:
                            1:      2:      3:
                        0:  xPos    yPos    rot
                        1:  alpha   xSize*  ySize*

                        *xSize and ySize are the dimensions of the quad
                    */

                    transforms0[offset    ] = currentBatch[i].xLoc;
                    transforms0[offset + 1] = currentBatch[i].yLoc;
                    transforms0[offset + 2] = currentBatch[i].rot;

                    transforms0[offset + 3] = currentBatch[i].xLoc;
                    transforms0[offset + 4] = currentBatch[i].yLoc;
                    transforms0[offset + 5] = currentBatch[i].rot;

                    transforms0[offset + 6] = currentBatch[i].xLoc;
                    transforms0[offset + 7] = currentBatch[i].yLoc;
                    transforms0[offset + 8] = currentBatch[i].rot;

                    transforms1[offset    ] = currentBatch[i].alpha;
                    transforms1[offset + 1] = currentBatch[i].xSize;
                    transforms1[offset + 2] = currentBatch[i].ySize;

                    transforms1[offset + 3] = currentBatch[i].alpha;
                    transforms1[offset + 4] = currentBatch[i].xSize;
                    transforms1[offset + 5] = currentBatch[i].ySize;

                    transforms1[offset + 6] = currentBatch[i].alpha;
                    transforms1[offset + 7] = currentBatch[i].xSize;
                    transforms1[offset + 8] = currentBatch[i].ySize;
                }    
                
                let offset = i * 12;

                texCoords[offset     ] = currentBatch[i].sprite[0];
                texCoords[offset + 1 ] = currentBatch[i].sprite[1];
                texCoords[offset + 2 ] = currentBatch[i].sprite[2];
                texCoords[offset + 3 ] = currentBatch[i].sprite[3];
                texCoords[offset + 4 ] = currentBatch[i].sprite[4];
                texCoords[offset + 5 ] = currentBatch[i].sprite[5];
                texCoords[offset + 6 ] = currentBatch[i].sprite[6];
                texCoords[offset + 7 ] = currentBatch[i].sprite[7];
                texCoords[offset + 8 ] = currentBatch[i].sprite[8];
                texCoords[offset + 9 ] = currentBatch[i].sprite[9];
                texCoords[offset + 10] = currentBatch[i].sprite[10];
                texCoords[offset + 11] = currentBatch[i].sprite[11];
            }

            // Set buffers for the batch
            gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers.vboID);
            gl.enableVertexAttribArray(this.info.aLoc.aVertPos);
            gl.vertexAttribPointer(this.info.aLoc.aVertPos, 2, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers.transform0ID);
            gl.bufferData(gl.ARRAY_BUFFER, transforms0, gl.STATIC_DRAW)

            gl.enableVertexAttribArray(this.info.aLoc.aTransform0);
            gl.vertexAttribPointer(this.info.aLoc.aTransform0, 3, gl.FLOAT, false, 0, 0);


            gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers.transform1ID);
            gl.bufferData(gl.ARRAY_BUFFER, transforms1, gl.STATIC_DRAW)

            gl.enableVertexAttribArray(this.info.aLoc.aTransform1);
            gl.vertexAttribPointer(this.info.aLoc.aTransform1, 3, gl.FLOAT, false, 0, 0);

            gl.uniform1fv(this.info.uLoc.uTime, [z0.getElapsedTime()]);

            gl.uniform1fv(this.info.uLoc.uTimeDelta, [z0.getDeltaTime()]);

            gl.uniform2fv(this.info.uLoc.uRes, [this.canvas.width, this.canvas.height]);

            this.setUniforms(gl);

            // Draw

            gl.drawArrays(gl.TRIANGLES, 0,  currentBatch.length * 6);
        }
    }
}
