var Student = (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
var Map = (function () {
    function Map() {
        this.width = 10;
        this.height = 10;
    }
    return Map;
}());
var SnakeCell = (function () {
    function SnakeCell(xIn, yIn) {
        this.xIn = xIn;
        this.yIn = yIn;
        this.x = 0;
        this.y = 0;
        this.x = xIn;
        this.y = yIn;
    }
    return SnakeCell;
}());
var Apple = (function () {
    function Apple() {
        this.x = 1;
        this.y = 1;
    }
    Apple.prototype.move = function () {
        var i = 0;
        var good = true;
        var ix = 0;
        var iy = 0;
        var openCells = [];
        for (ix = 0; ix < MAP.height; ix++) {
            for (iy = 0; iy < MAP.width; iy++) {
                good = true;
                for (var _i = 0, _a = SNAKE.cells; _i < _a.length; _i++) {
                    var cell = _a[_i];
                    if (ix == cell.x && iy == cell.y) {
                        good = false;
                    }
                }
                if (good) {
                    openCells.push(new SnakeCell(ix, iy));
                }
            }
        }
        if (openCells.length == 0) {
            SNAKE.gameOver = true;
            return;
        }
        var i = Math.floor(Math.random() * openCells.length);
        var c = openCells[i];
        APPLE.x = c.x;
        APPLE.y = c.y;
    };
    return Apple;
}());
var Snake = (function () {
    function Snake() {
        this.dx = 1;
        this.dy = 0;
        this.x = 1;
        this.y = 1;
        this.gameOver = false;
        this.lastScored = false;
        this.score = 0;
        this.cells = [
            new SnakeCell(1, 1)
        ];
    }
    Snake.prototype.tick = function () {
        if (this.gameOver)
            return;
        var nx = this.x + this.dx;
        var ny = this.y + this.dy;
        if (nx < 0 || ny < 0 || ny >= MAP.height || nx >= MAP.width) {
            this.gameOver = true;
            return;
        }
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            if (nx == cell.x && ny == cell.y) {
                this.gameOver = true;
                return;
            }
        }
        var score = (nx == APPLE.x && ny == APPLE.y);
        var lastCell = new SnakeCell(nx, ny);
        for (var _b = 0, _c = this.cells; _b < _c.length; _b++) {
            var cell = _c[_b];
            var orig = new SnakeCell(cell.x, cell.y);
            cell.x = lastCell.x;
            cell.y = lastCell.y;
            lastCell = orig;
        }
        if (this.lastScored) {
            this.lastScored = false;
            this.cells.push(lastCell);
        }
        if (score) {
            this.lastScored = true;
            APPLE.move();
        }
        this.x = nx;
        this.y = ny;
    };
    return Snake;
}());
var SNAKE = new Snake();
var APPLE = new Apple();
var MAP = new Map();
var ctx;
var keyPressed = false;
function go() {
    console.log("GOING");
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    var key = function (e) {
        if (keyPressed)
            return;
        if (e.key == 'w') {
            if (SNAKE.dy == 0) {
                keyPressed = true;
                SNAKE.dy = -1;
                SNAKE.dx = 0;
            }
        }
        else if (e.key == 's') {
            if (SNAKE.dy == 0) {
                keyPressed = true;
                SNAKE.dy = 1;
                SNAKE.dx = 0;
            }
        }
        else if (e.key == 'a') {
            if (SNAKE.dx == 0) {
                keyPressed = true;
                SNAKE.dy = 0;
                SNAKE.dx = -1;
            }
        }
        else if (e.key == 'd') {
            if (SNAKE.dx == 0) {
                keyPressed = true;
                SNAKE.dy = 0;
                SNAKE.dx = 1;
            }
        }
    };
    window.onkeydown = key;
    window.onkeypress = key;
    var s = new Student("rob", "g", "mayhew");
    setTimeout(tick, 400);
}
function tick() {
    SNAKE.tick();
    ctx.fillStyle = "#000000";
    var size = 15;
    ctx.clearRect(0, 0, MAP.width * size, MAP.height * size);
    ctx.strokeRect(0, 0, MAP.width * size, MAP.height * size);
    var percent = 0;
    for (var _i = 0, _a = SNAKE.cells; _i < _a.length; _i++) {
        var cell = _a[_i];
        ctx.fillStyle = blendColors("#000000", "#00ff00", percent);
        var x = cell.x * size;
        var y = cell.y * size;
        ctx.fillRect(x, y, size - 1, size - 1);
        percent = percent + 0.01;
        if (percent >= 0.9)
            percent = 0.9;
    }
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(APPLE.x * size, APPLE.y * size, size - 1, size - 1);
    keyPressed = false;
    setTimeout(tick, 500);
}
function blendColors(c0, c1, p) {
    var f = parseInt(c0.slice(1), 16), t = parseInt(c1.slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF, R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
}
