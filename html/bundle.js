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
        this.width = 20;
        this.height = 20;
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
        var close = null;
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
                    var sx = SNAKE.x - ix;
                    var sy = SNAKE.y - iy;
                    if (sx < 1)
                        sx = sx * -1;
                    if (sy < 1)
                        sy = sy * -1;
                    if (sx < 5 && sy < 5) {
                        close = new SnakeCell(ix, iy);
                    }
                }
            }
        }
        if (openCells.length == 0) {
            SNAKE.win = true;
            return;
        }
        if (close != null) {
            APPLE.x = close.x;
            APPLE.y = close.y;
        }
        else {
            var i = Math.floor(Math.random() * openCells.length);
            var c = openCells[i];
            APPLE.x = c.x;
            APPLE.y = c.y;
        }
    };
    return Apple;
}());
var Snake = (function () {
    function Snake() {
        this.dx = 1;
        this.dy = 0;
        this.x = 1;
        this.y = 1;
        this.lastTick = 0;
        this.tickTime = 250;
        this.gameOver = false;
        this.lastScored = false;
        this.score = 0;
        this.highScore = 0;
        this.damageed = false;
        this.win = false;
        this.cells = [
            new SnakeCell(1, 1)
        ];
    }
    Snake.prototype.tick = function () {
        var now = new Date().getTime();
        var passed = now - this.lastTick;
        if (passed < this.tickTime) {
            return;
        }
        this.lastTick = now;
        if (this.win) {
            this.gameOver = true;
        }
        if (this.gameOver)
            return;
        var nx = this.x + this.dx;
        var ny = this.y + this.dy;
        var hit = false;
        if (nx < 0 || ny < 0 || ny >= MAP.height || nx >= MAP.width) {
            if (this.cells.length < 2) {
                this.gameOver = true;
                return;
            }
            else {
                hit = true;
            }
        }
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            if (nx == cell.x && ny == cell.y) {
                if (this.cells.length < 2) {
                    this.gameOver = true;
                    return;
                }
                else {
                    hit = true;
                }
            }
        }
        SNAKE.damageed = false;
        if (hit) {
            SNAKE.score--;
            SNAKE.damageed = true;
            var newCells = [];
            var i = 0;
            for (i = 0; i < this.cells.length; i++) {
                if (i != this.cells.length - 1) {
                    newCells.push(this.cells[i]);
                }
            }
            nx = this.x;
            ny = this.y;
            this.cells = newCells;
        }
        var score = (nx == APPLE.x && ny == APPLE.y);
        var lastCell = new SnakeCell(nx, ny);
        if (!hit) {
            for (var _b = 0, _c = this.cells; _b < _c.length; _b++) {
                var cell = _c[_b];
                var orig = new SnakeCell(cell.x, cell.y);
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
    //window.onkeyup = key;
    //window.onkeypress = key;
    var s = new Student("rob", "g", "mayhew");
    requestAnimationFrame(tick);
}
function tick() {
    SNAKE.tick();
    ctx.fillStyle = "#000000";
    var size = 20;
    var header = 20;
    ctx.clearRect(0, 0, MAP.width * size, MAP.height * size + header);
    ctx.strokeRect(0, header, MAP.width * size, MAP.height * size);
    if (SNAKE.win) {
        ctx.strokeText("YOU WIN!", 10, 50);
    }
    else {
        ctx.strokeText("Score: " + SNAKE.score + " High: " + SNAKE.highScore, 10, 10);
        var percent = 0;
        for (var _i = 0, _a = SNAKE.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            var startColor = "#000000";
            if (SNAKE.damageed) {
                startColor = "#FF0000";
            }
            ctx.fillStyle = blendColors(startColor, "#00ff00", percent);
            var x = cell.x * size;
            var y = cell.y * size + header;
            ctx.fillRect(x, y, size - 1, size - 1);
            percent = percent + 0.01;
            if (percent >= 0.9)
                percent = 0.9;
        }
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(APPLE.x * size, APPLE.y * size + header, size - 1, size - 1);
        keyPressed = false;
    }
    requestAnimationFrame(tick);
}
function blendColors(c0, c1, p) {
    var f = parseInt(c0.slice(1), 16), t = parseInt(c1.slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF, R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
}
