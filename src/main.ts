class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}


class Map{
    width: number = 10;
    height: number = 10;
}



class SnakeCell
{
    x:number = 0;
    y:number = 0;
    constructor(public xIn, public yIn)
    {
        this.x = xIn;
        this.y = yIn;
    }
}

class Apple
{
    x:number = 1;
    y:number = 1;
    move(){ 
        var i =0;
        let good = true;
        
        var ix = 0;
        var iy = 0;
        let openCells = [];

        for (ix = 0; ix < MAP.height; ix++) {
            for (iy = 0; iy < MAP.width; iy++) {
                good = true;
                for (let cell  of SNAKE.cells) {
                    if (ix == cell.x && iy == cell.y) {
                        good = false;
                    }
                }
                if (good) {
                    openCells.push(new SnakeCell(ix, iy));
                }
            }
        }
        if(openCells.length == 0)
        {
            SNAKE.gameOver = true;
            return;
        }
        var i = Math.floor(Math.random() * openCells.length);
        var c = openCells[i];
        APPLE.x = c.x;
        APPLE.y = c.y;
            
        
    }
}

class Snake
{
    dx:number = 1;
    dy:number = 0;
    x:number = 1;
    y:number = 1;

    gameOver:boolean = false;
    lastScored:boolean = false;
    score:number = 0;
    cells:SnakeCell[] = [
        new SnakeCell(1,1)

    ];
    tick(){
        if(this.gameOver)
            return;

        let nx = this.x + this.dx;
        let ny = this.y + this.dy;
        if(nx < 0 || ny < 0 || ny >= MAP.height || nx >= MAP.width)
        {
            this.gameOver  = true;
            return;
        }
        for (let cell of this.cells)
        {
            if(nx == cell.x && ny == cell.y)
            {
                this.gameOver = true;
                return;
            }
        }
        let score = (nx == APPLE.x && ny == APPLE.y);

        let lastCell = new SnakeCell(nx,ny);
        for (let cell of this.cells) {
            let orig = new SnakeCell(cell.x,cell.y);
            cell.x = lastCell.x;
            cell.y = lastCell.y;
            lastCell = orig;
        }
        if(this.lastScored)
        {
            this.lastScored = false;
            this.cells.push(lastCell);
        }
        if(score)
        {

            this.lastScored = true;
            APPLE.move();
        }

        this.x = nx;
        this.y = ny;

    }
}

let SNAKE = new Snake();
let APPLE = new Apple();
let MAP = new Map();
let ctx;
let keyPressed = false;

function go()
{
    console.log("GOING");

    var canvas :any = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    var key = function(e){
        if(keyPressed)return;
        if(e.key == 'w')
        {

            if(SNAKE.dy == 0 ) {
                keyPressed = true;
                SNAKE.dy = -1;
                SNAKE.dx = 0;
            }
        }else if(e.key == 's')
        {
            
            if(SNAKE.dy == 0) {
                keyPressed = true;
                SNAKE.dy = 1;
                SNAKE.dx = 0;
            }
        }else if(e.key == 'a')
        {

            if(SNAKE.dx == 0) {
                keyPressed = true;
                SNAKE.dy = 0;
                SNAKE.dx = -1;
            }
        }else if(e.key == 'd')
        {

            if(SNAKE.dx == 0) {
                keyPressed = true;
                SNAKE.dy = 0;
                SNAKE.dx = 1;
            }
        }

    };
    window.onkeydown = key;
    window.onkeypress = key;
    let s = new Student("rob","g","mayhew");
    setTimeout(tick, 400);
}

function tick()
{
    
    SNAKE.tick();
    ctx.fillStyle = "#000000";
    let size = 15;
    ctx.clearRect(0,0,MAP.width*size,MAP.height*size);
    ctx.strokeRect(0,0,MAP.width*size,MAP.height*size);

    var percent = 0;
    for(let cell  of SNAKE.cells)
    {
        ctx.fillStyle = blendColors("#000000","#00ff00", percent)
        let x = cell.x * size;
        let y = cell.y * size;
        ctx.fillRect(x,y,size-1,size-1);
        percent = percent + 0.01
        if(percent >= 0.9)
            percent = 0.9;
    }
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(APPLE.x*size, APPLE.y*size,size-1,size-1);

    keyPressed = false;
    setTimeout(tick, 500);
}


function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}