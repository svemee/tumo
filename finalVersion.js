function setup() {
    createCanvas(400, 400)
}

function draw() {

    background('skyblue')

    for (let cloud of Game.clouds) {
        cloud.display()
        cloud.move();
        let distance = dist(cloud.x, cloud.y, mouseX, mouseY)
        if (distance <= 35) {
            noLoop()
            clearInterval(interval);
            Game.clouds.length = 0
            Game.balloons.length = 0
            let finalScore = Game.score
            Game.score = ''
            background('skyblue')
            textSize(64)
            fill('white')
            textAlign(CENTER, CENTER)
            text('FINISH', 200, 200)
            textSize(34)
            text('Score: ' + finalScore, 200, 300)
        }
    }

    if (Game.score < 0) {
        noLoop()
        clearInterval(interval);
        Game.clouds.length = 0
        Game.balloons.length = 0
        let finalScore = Game.score
        Game.score = ''
        background('skyblue')
        textSize(64)
        fill('white')
        textAlign(CENTER, CENTER)
        text('FINISH', 200, 200)
        textSize(34)
        text('Score: ' + finalScore, 200, 300)
    }
    for (let balloon of Game.balloons) {
        balloon.display()
        balloon.move(Game.score);

        if (balloon.y <= balloon.size / 2 && balloon.color != 'hsla(250, 100%, 75%, 0.5)') {
            noLoop()
            clearInterval(interval);
            Game.clouds.length = 0
            Game.balloons.length = 0
            let finalScore = Game.score
            Game.score = ''
            background('skyblue')
            textSize(64)
            fill('white')
            textAlign(CENTER, CENTER)
            text('FINISH', 200, 200)
            textSize(34)
            text('Score: ' + finalScore, 200, 300)
        }
    }

    textSize(32)
    fill('black')
    text(Game.score, 30, 40)

    if (frameCount % 300 === 0) {
        Game.addCloud()
    }
    if (frameCount % 100 === 0) {
        Game.addBallon()
    }
    if (frameCount % 160 === 0) {
        Game.addUniqBallon()
    }
    if (frameCount % 180 === 0) {
        Game.addAngryBallon()
    }
}

function mousePressed() {
    Game.countOfClick += 1
    if (!isLooping()) {
        loop();
        interval = setInterval(() => {
            Game.sendStatistics();
        }, 5000);
        Game.score = 0;
    }
    Game.checkIfBalloonBurst();
}



let interval = setInterval(() => {
    Game.sendStatistics();
}, 5000)

class Game {
    static balloons = []
    static clouds = []
    static score = 0
    static countOfNormal = 0
    static countOfUniq = 0
    static countOfAngry = 0
    static countOfClick = 0

    static sendStatistics() {
        let stats = {
            score: this.score,
            countOfNormal: this.countOfNormal,
            countOfUniq: this.countOfUniq,
            countOfAngry: this.countOfAngry,
            countOfClick: this.countOfClick
        };

        fetch('/statistic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stats),
        });

    }

    static addCloud() {
        let cloud = new Cloud()
        this.clouds.push(cloud)
    }

    static addBallon() {
        let ball = new Balloon('hsla(160, 100%, 50%, 0.5)', 50)
        this.balloons.push(ball);
    }
    static addUniqBallon() {
        let uniqBall = new UniqBalloon('hsla(200, 100%, 50%, 0.5)', 30)
        this.balloons.push(uniqBall);
    }
    static addAngryBallon() {
        let angryBall = new AngryBalloon('hsla(250, 100%, 75%, 0.5)', 50)
        this.balloons.push(angryBall);
    }

    static checkIfBalloonBurst() {
        this.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if (distance <= balloon.size / 2) {
                balloon.burst(index)
            }
        })
    }
}

class Balloon {
    constructor(color, size) {
        this.x = random(width)
        this.y = random(height - 10, height + 50)
        this.color = color;
        this.size = size;
    }
    display() {
        fill(this.color)
        ellipse(this.x, this.y, this.size)
        line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size)
    }
    move(score) {
        if (score < 100) {
            this.y -= 1
        }
        else if (score >= 100 && score <= 200) {
            this.y -= 1.5
        }
        else {
            this.y -= 2
        }
    }
    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += 1
        Game.countOfNormal += 1
    }
}
class UniqBalloon extends Balloon {
    constructor(color, size) {
        super(color, size)
    }
    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += 10
        Game.countOfUniq += 1
    }
}
class AngryBalloon extends Balloon {
    constructor(color, size) {
        super(color, size)
    }
    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score -= 10
        Game.countOfAngry += 1
    }
    move() {
        this.y -= 0.5
    }
}

class Cloud {
    constructor() {
        this.x = 0
        this.y = random(height)
    }
    display() {
        fill('white')
        ellipse(this.x, this.y, 50)
        ellipse(this.x + 20, this.y, 60)
        ellipse(this.x + 40, this.y, 50)
    }
    move() {
        this.x += 1
        this.y -= 1
    }
}