"use strict"

// Attempt 1 - 2.5 minutes with 100 points, then 3.5 minutes with lowering points = 6 minutes
//             Explosion penalty is 10 points
//             Reward if they have at least 65 points
// Attempt 2 - 3.5 minutes with 100 points, then 3.5 minutes with lowering points = 7 minutes
//             Explosion penalty is 10 points
//             Reward if they have at least 50 points

const explosionPenalty = 10;

class ScoreCalculator {
    constructor(attemptNo, gameTime = 180, initialTime = 0) {
        this.time = initialTime;
        this.gameTime = gameTime;
        this.initialDelay = 90 + 60*attemptNo;
        this.attemptNo = attemptNo;
        this.explosions = 0
    }
    
    incrementTime(by = 1) {
        if (this.time < this.gameTime + this.initialDelay) {
            this.time += by;
        }
    }

    explosion() {
        this.explosions++;
    }

    isEligibleForReward() {
        let treshold = this.attemptNo == 1 ? 65 : 50;
        return this.score() > treshold;
    }

    score() {
        let explosionPenalties = this.explosions * explosionPenalty;
        if (this.time <= this.initialDelay) {
            return 100 - explosionPenalties;
        }
        let coefficient = (this.gameTime - (this.time - this.initialDelay)) / this.gameTime;
        let score = Math.round(100 * coefficient - explosionPenalties);
        return Math.max(0, score);
    }
}

function formatTime(seconds) {
    let timeFormat = new Intl.NumberFormat("en-US", {minimumIntegerDigits: 2})
    let minutes = timeFormat.format(Math.floor(seconds / 60));
    let secs = timeFormat.format(seconds % 60);
    return `${minutes}:${secs}`;
}

function updateCalculator(c) {
    c.incrementTime();
    let scoreText = document.getElementById("scoreText");
    scoreText.textContent = c.score();
    let scoreClass = c.isEligibleForReward() ? "reward-eligible" : "reward-ineligible";
    scoreText.className = scoreClass;
    document.querySelector("#time").textContent = formatTime(c.time);

}

var calculator = null;
var interval = null;

var toggle = document.getElementById("toggle");
var explosion = document.getElementById("explosion");

toggle.onclick = () => {
    if (interval === null) {
        let attempt = parseInt(document.getElementById("attempt-select").selectedOptions[0].value)
        calculator = new ScoreCalculator(attempt, 210);
        interval = setInterval(() => updateCalculator(calculator), 1000);
        toggle.textContent = "Stop"
    } else {
        clearInterval(interval);
        interval = null;
        calculator = null;
        toggle.textContent = "Start"
    }
}

explosion.onclick = () => {
    if (interval !== null) {
        calculator.explosion()
        updateCalculator(c)
    }
}
