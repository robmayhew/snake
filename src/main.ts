class Map {
    width: number = 6;
    height: number = 6;
}


class SnakeCell {
    x: number = 0;
    y: number = 0;

    constructor(public xIn, public yIn) {
        this.x = xIn;
        this.y = yIn;
    }
}

class Apple {
    x: number = 1;
    y: number = 1;

    move() {

        let good = true;

        let ix :number;
        let iy = 0;
        let openCells = [];
        let close = [];
        for (ix = 0; ix < MAP.width; ix++) {
            for (iy = 0; iy < MAP.height; iy++) {
                good = true;
                for (let cell of SNAKE.cells) {
                    if (ix == cell.x && iy == cell.y) {
                        good = false;
                    }
                }
                if (good) {
                    openCells.push(new SnakeCell(ix, iy));
                    let sx = SNAKE.x - ix;
                    let sy = SNAKE.y - iy;
                    if (sx < 1) sx = sx * -1;
                    if (sy < 1) sy = sy * -1;
                    if (sx < 5 && sy < 5) {
                        close.push(new SnakeCell(ix, iy));

                    }
                }
            }
        }
        if (openCells.length == 0) {
            SNAKE.win = true;
            return;
        }
        if (close.length > 0) {
            let ii = Math.floor(Math.random() * close.length);
            if (ii == close.length) ii--;
            let c = close[ii];
            APPLE.x = c.x;
            APPLE.y = c.y;
        } else {

            let i = Math.floor(Math.random() * openCells.length);
            let c = openCells[i];
            APPLE.x = c.x;
            APPLE.y = c.y;
        }

    }
}

class Snake {
    dx: number = 1;
    dy: number = 0;
    waitingDelta = [];
    x: number = 1;
    y: number = 1;
    lastTick: number = 0;
    tickTime: number = 250;
    gameOver: boolean = false;
    lastScored: boolean = false;
    score: number = 0;
    highScore: number = 0;
    damageed: boolean = false;
    win: boolean = false;
    cells: SnakeCell[] = [
        new SnakeCell(1, 1)

    ];

    isCellOccupied(x: number, y: number): boolean {
        return this.cells.some(cell => cell.x === x && cell.y === y);
    }

    tick() {
        let now = new Date().getTime();
        let passed = now - this.lastTick;
        if (passed < this.tickTime) {
            return;

        }
        this.lastTick = now;
        if (this.win) {
            this.gameOver = true;
        }
        if (this.gameOver)
            return;

        if (this.waitingDelta.length > 0) {
            let w = this.waitingDelta.shift();
            if (w == 'w' || w == 'W') {
                this.dx = 0;
                this.dy = -1;
            } else if (w == 'a' || w == 'A') {
                this.dx = -1;
                this.dy = 0;
            } else if (w == 's' || w == 'S') {
                this.dx = 0;
                this.dy = 1;
            } else if (w == 'd' || w == 'D') {
                this.dx = 1;
                this.dy = 0;
            }
        }
        let nx = this.x + this.dx;
        let ny = this.y + this.dy;
        let hit = false;
        if (nx < 0 || ny < 0 || ny >= MAP.height || nx >= MAP.width) {
            if (this.cells.length < 2) {
                this.gameOver = true;
                return;
            } else {

                hit = true;
            }
        }
        for (let cell of this.cells) {
            if (nx == cell.x && ny == cell.y) {
                if (this.cells.length < 2) {
                    this.gameOver = true;
                    return;
                } else {

                    hit = true;
                }
            }
        }
        SNAKE.damageed = false;
        if (hit) {
            SNAKE.score--;
            SNAKE.damageed = true;
            let newCells = [];

            for (let i = 0; i < this.cells.length; i++) {
                if (i != this.cells.length - 1) {
                    newCells.push(this.cells[i]);
                }
            }
            nx = this.x;
            ny = this.y;
            this.cells = newCells;
        }
        let score = (nx == APPLE.x && ny == APPLE.y);

        let lastCell = new SnakeCell(nx, ny);
        if (!hit) {
            for (let cell of this.cells) {
                let orig = new SnakeCell(cell.x, cell.y);
                cell.x = lastCell.x;
                cell.y = lastCell.y;
                lastCell = orig;
            }
        }
        if (this.lastScored) {
            this.lastScored = false;
            this.cells.push(lastCell);
        }
        if (score) {
            SNAKE.score++;


            if (SNAKE.score > SNAKE.highScore)
                SNAKE.highScore = SNAKE.score;
            this.lastScored = true;
            APPLE.move();
        }
        if (Math.random() < 0.10) {
            // Move the apple at random?
            //      APPLE.move();
        }
        this.x = nx;
        this.y = ny;
        if (MAP.width < 12 && SNAKE.cells.length > (MAP.width - 1) * (MAP.height - 1)) {
            MAP.height++;
            MAP.width++;
            MAP.height++;
            MAP.width++;
            resizeCanvas();
        }

    }
}

let SNAKE = new Snake();
let APPLE = new Apple();
let MAP = new Map();
let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let neverStarted = true;

let keyPressed = false;


function keyPress(key)
{
    neverStarted = false;
    if(SNAKE.gameOver) {
        restart();
    }else{
        SNAKE.waitingDelta.push(key);
    }
}

function go() {

    console.log("Go!")
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    window.onkeydown = function (e: KeyboardEvent) {
        keyPress(e.key);
    };

    document.getElementById('up-btn').addEventListener('click', ()=>{keyPress('w');});
    document.getElementById('down-btn').addEventListener('click', ()=>{keyPress('s');});
    document.getElementById('left-btn').addEventListener('click', ()=>{keyPress('a');});
    document.getElementById('right-btn').addEventListener('click', ()=>{keyPress('d');});

    const slider = document.getElementById('speed-slider') as HTMLInputElement;

    slider.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value, 10);
        SNAKE.tickTime = 1000 - value; // Assuming value corresponds to newTickTime
        console.log('Speed:', value);
        // Adjust game speed here based on slider value
    });
    // Resize canvas to fit the screen
    window.addEventListener("resize", resizeCanvas);

    // Initial resize
    resizeCanvas();

    requestAnimationFrame(tick);
}

function restart()
{
    const lastTickTime = SNAKE.tickTime;
    SNAKE = new Snake();
    SNAKE.tickTime = lastTickTime;
    APPLE = new Apple();
    MAP = new Map();
}

// Idea have the snake turn in the best direction
// function turn() {
//     // w a s d
//     const directions = ["w", "a", "s", "d"];
//     const currentIndex = directions.indexOf(
//         SNAKE.dx === 1 ? "d" :
//             SNAKE.dx === -1 ? "a" :
//                 SNAKE.dy === 1 ? "s" : "w"
//     );
//     const otherIndices = directions
//         .map((_, index) => index)
//         .filter(index => index !== currentIndex);
//
//
// // Function to check if a direction hits something
//     function hitsObstacle(snake, direction) {
//         const nextPosition = {
//             x: snake.x + (direction === "d" ? 1 : direction === "a" ? -1 : 0),
//             y: snake.y + (direction === "s" ? 1 : direction === "w" ? -1 : 0)
//         };
//
//         function isObstacle(nx: any, ny: any) {
//             if (nx < 0 || ny < 0 || ny >= MAP.height || nx >= MAP.width) {
//                 return true;
//             }
//             if (SNAKE.isCellOccupied(nx, ny)) {
//                 return true;
//             }
//             return false;
//         }
//
//         // Replace `isObstacle` with your logic to check if there's an obstacle
//         return isObstacle(nextPosition.x, nextPosition.y);
//     }
//
//     const openDirections = otherIndices
//         .map((_, index) => index)
//         .filter(index => !hitsObstacle(SNAKE, directions[index]));
//
//     console.log(("Turn result " + directions[openDirections[0]]));
//     SNAKE.waitingDelta.push(directions[openDirections[0]]);
//
//
//     // Position on the board
//     // The last turn that has been made
//
//     // can turn left / or right
//
//
// }


function resizeCanvas() {
    const size = 20; // Base size for a single cell
    const header = 20; // Header height

    // Calculate canvas size based on the window dimensions and map size
    const availableWidth = window.innerWidth * .85;
    const availableHeight = window.innerHeight * .55;

    const gameWidth = MAP.width * size;
    const gameHeight = MAP.height * size + header;

    // Calculate scaling factor to maintain aspect ratio
    const scaleWidth = availableWidth / gameWidth;
    const scaleHeight = availableHeight / gameHeight;
    const scale = Math.min(scaleWidth, scaleHeight);

    // Resize canvas and apply scaling
    canvas.width = gameWidth * scale;
    canvas.height = gameHeight * scale;

     ctx.setTransform(scale, 0, 0, scale, 0, 0); // Apply scaling transformation
}

function tick() {
    SNAKE.tick();

    ctx.fillStyle = "#000000";
    const size = 20; // Base size for a single cell
    const header = 20; // Header height

    ctx.clearRect(0, 0, MAP.width * size, MAP.height * size + header);
    ctx.strokeRect(0, header, MAP.width * size, MAP.height * size);
    ctx.font = 'bold 12px sans-serif'; // Font style, size, and family
    ctx.fillStyle = 'black'; // Text color
    if(neverStarted)
    {
        ctx.strokeText("Press Any ", 10, 50);
        ctx.strokeText("Direction to ", 10, 70);
        ctx.strokeText("Start ", 10, 90);
    }
    else if (SNAKE.win) {
        ctx.strokeText("YOU WIN!", 10, 50);
    }else if(SNAKE.gameOver){
        ctx.strokeText("Game Over!", 10, 50);
    } else {
        ctx.strokeText(
            "Score: " + SNAKE.score + " High: " + SNAKE.highScore,
            10,
            10
        );

        let percent = 0;
        for (let cell of SNAKE.cells) {
            let startColor = "#000000";
            if (SNAKE.damageed) {
                startColor = "#FF0000";
            }
            ctx.fillStyle = blendColors(startColor, "#00ff00", percent);
            let x = cell.x * size;
            let y = cell.y * size + header;
            ctx.fillRect(x, y, size - 1, size - 1);
            percent = percent + 0.01;
            if (percent >= 0.9) percent = 0.9;
        }
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(
            APPLE.x * size,
            APPLE.y * size + header,
            size - 1,
            size - 1
        );

        keyPressed = false;
    }
    requestAnimationFrame(tick);
}

function blendColors(c0: string, c1: string, p: number) {
    let f = parseInt(c0.slice(1), 16),
        t = parseInt(c1.slice(1), 16),
        R1 = f >> 16,
        G1 = (f >> 8) & 0x00ff,
        B1 = f & 0x0000ff,
        R2 = t >> 16,
        G2 = (t >> 8) & 0x00ff,
        B2 = t & 0x0000ff;
    return (
        "#" +
        (
            0x1000000 +
            (Math.round((R2 - R1) * p) + R1) * 0x10000 +
            (Math.round((G2 - G1) * p) + G1) * 0x100 +
            (Math.round((B2 - B1) * p) + B1)
        )
            .toString(16)
            .slice(1)
    );
}
