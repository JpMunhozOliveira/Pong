// seleciona o canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

const sounds = {
    hit: new Audio("sounds/hit.mp3"),
    wall: new Audio("sounds/wallHit.mp3"),
    score: new Audio("sounds/score.mp3"),
};

// Bola
class Ball {
    constructor() {
        this.x = canvas.width / 2 - 7.5;
        this.y = canvas.height / 2;
        this.width = 15;
        this.height = 15;
        this.speed = 5;
        this.velocityX = 5;
        this.velocityY = 5;
    }

    resetBall() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.velocityX = -this.velocityX;
        this.speed = 5;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.y < 0 || this.y + this.height > canvas.height) {
            this.velocityY = -this.velocityY;
            sounds.wall.play();
        }
    }

    draw() {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Paddle
class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.score = 0;
    }

    increase() {
        this.score++;
        sounds.score.play();
    }

    draw() {
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Net {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        context.fillStyle = "#fff";
        for (let i = 0; i < canvas.height; i += 15) {
            context.fillRect(this.x, this.y + i, this.width, this.height);
        }
    }
}

class Score {
    constructor(value) {
        this.value = value;
    }

    draw(x, y) {
        context.fillStyle = "#fff";
        context.font = "45px Comfortaa";
        context.fillText(this.value, x, y);
    }
}

// Controle do jogador
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();

    player.y = evt.clientY - rect.top - player.height / 2;
}

// Checagem de colisão
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y;
    b.bottom = b.y + b.height;
    b.left = b.x;
    b.right = b.x + b.width;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

const ball = new Ball();

const player = new Paddle(5, (canvas.height - 100) / 2, 10, 100);
const playerScore = new Score(player.score);
const ai = new Paddle(canvas.width - 15, (canvas.height - 100) / 2, 10, 100);
const aiScore = new Score(ai.score);


function update() {

    // Pontuação
    if (ball.x < 0) {
        ai.increase();
        sounds.score.play();
        ball.resetBall();
    } else if (ball.x + ball.width > canvas.width) {
        player.increase();
        sounds.score.play();
        ball.resetBall();
    }

    ball.update();

    //Controle para a IA
    let computerLevel = 0.1;
    ai.y += (ball.y - (ai.y + ai.height / 2)) * computerLevel;

    let paddle = (ball.x + ball.width < canvas.width / 2) ? player : ai;

    if (collision(ball, paddle)) {

        sounds.hit.play();

        // Onde a bola tocou no paddle
        let collidePoint = (ball.y - (paddle.y + paddle.height / 2));

        // Normalização
        collidePoint = collidePoint / (paddle.height / 2);

        // Calculando angulo em radiano
        let angleRad = collidePoint * (Math.PI / 4);

        // Direção da bola
        let direction = (ball.x + ball.width < canvas.width / 2) ? 1 : -1;

        //Mudando a velocidade X e Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Aumentando velocidade quando a bola rebate
        ball.speed += 0.5;
    }

}

// Renderiza o jogo
function draw() {

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fff";
    for (let i = 0; i < canvas.height; i += 15) {
        context.fillRect((canvas.width - 2) / 2, 0 + i, 2, 10);
    }

    player.draw();
    ai.draw();

    ball.draw();

    playerScore.draw(canvas.width / 4 - 15, canvas.height / 5);
    aiScore.draw(3 * canvas.width / 4 - 15, canvas.height / 5);

}

// Inicializador do jogo
function game() {
    update();
    draw();
}

// Loop
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);