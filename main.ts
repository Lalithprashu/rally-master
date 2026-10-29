namespace SpriteKind {
    export const Ball = SpriteKind.create()
}

// ===========================
// RALLY! - PLAYER VS AI
// ===========================

let playerRacket: Sprite = null
let aiRacket: Sprite = null
let ball: Sprite = null

let rallyCount = 0
let playerScore = 0
let aiScore = 0

// ----- TITLE SCREEN -----
game.splash("RALLY!", "Player vs AI Tennis")
game.splash("D-Pad = Move", "First to 5 Wins")

// ----- US OPEN COURT -----
scene.setBackgroundColor(9)

scene.createRenderable(0, function (target, camera) {
    target.fillRect(8, 8, 144, 104, 1)
    target.drawRect(8, 8, 144, 104, 15)

    // Net
    target.drawLine(80, 8, 80, 112, 15)

    // Service Lines
    target.drawLine(44, 30, 116, 30, 15)
    target.drawLine(44, 90, 116, 90, 15)

    target.drawLine(80, 30, 80, 90, 15)
})

// ----- PLAYER RACKET -----
playerRacket = sprites.create(img`
    . . . 5 5 5 . . .
    . . 5 5 5 5 5 . .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . 5 5 5 5 5 5 5 .
    . . . 8 8 8 . . .
    . . . 8 8 8 . . .
    . . . 8 8 8 . . .
`, SpriteKind.Player)

playerRacket.setPosition(12, 60)
controller.moveSprite(playerRacket, 0, 100)
playerRacket.setStayInScreen(true)

// ----- AI RACKET -----
aiRacket = sprites.create(img`
    . . . 2 2 2 . . .
    . . 2 2 2 2 2 . .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . 2 2 2 2 2 2 2 .
    . . . 8 8 8 . . .
    . . . 8 8 8 . . .
    . . . 8 8 8 . . .
`, SpriteKind.Enemy)

aiRacket.setPosition(148, 60)
aiRacket.setStayInScreen(true)

// ----- BALL -----
ball = sprites.create(img`
    . . 7 7 . .
    . 7 7 7 7 .
    7 7 7 7 7 7
    7 7 7 7 7 7
    . 7 7 7 7 .
    . . 7 7 . .
`, SpriteKind.Ball)

function serveBall() {
    ball.setPosition(80, 60)
    ball.vx = randint(0, 1) == 0 ? -60 : 60
    ball.vy = randint(-40, 40)

    if (Math.abs(ball.vy) < 15) {
        ball.vy = 20
    }
}

serveBall()
ball.setBounceOnWall(true)

// ----- DISPLAY SCORE -----
info.setScore(0)

// ----- PLAYER HITS BALL -----
sprites.onOverlap(SpriteKind.Player, SpriteKind.Ball, function (player, b) {
    if (b.vx < 0) {

        rallyCount += 1

        info.changeScoreBy(1)

        b.vx = Math.abs(b.vx)

        let offset = b.y - player.y
        b.vy = offset * 3

        if (Math.abs(b.vy) < 10) {
            b.vy = randint(10, 25)
        }

        if (rallyCount % 5 == 0) {
            b.vx += 10
        }

        if (rallyCount % 10 == 0) {
            game.showLongText("Great Rally!", DialogLayout.Bottom)
            music.powerUp.play()
        }

        b.startEffect(effects.trail, 100)

        music.baDing.play()
    }
})

// ----- AI HITS BALL -----
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Ball, function (enemy, b) {
    if (b.vx > 0) {

        b.vx = -Math.abs(b.vx)

        let offset = b.y - enemy.y
        b.vy = offset * 3

        if (Math.abs(b.vy) < 10) {
            b.vy = -randint(10, 25)
        }

        music.pewPew.play()
    }
})

// ----- GAME LOOP -----
game.onUpdate(function () {

    // AI Movement
    if (ball.y < aiRacket.y - 4) {
        aiRacket.y += -2
    } else if (ball.y > aiRacket.y + 4) {
        aiRacket.y += 2
    }

    // Prevent flat movement
    if (Math.abs(ball.vy) < 8) {
        ball.vy += randint(8, 15)
    }

    // Player Missed
    if (ball.right < 0) {

        aiScore += 1

        if (aiScore >= 5) {
            music.wawawawaa.play()
            game.splash("Computer Wins!", "5 Points Reached")
            game.over(false, effects.melt)
        }

        game.splash(
            "Score",
            "Player: " + playerScore + "  AI: " + aiScore
        )

        serveBall()
    }

    // AI Missed
    if (ball.left > 160) {

        playerScore += 1

        if (playerScore >= 5) {
            music.magicWand.play()
            game.splash("You Win!", "5 Points Reached")
            game.over(true, effects.confetti)
        }

        game.splash(
            "Score",
            "Player: " + playerScore + "  AI: " + aiScore
        )

        serveBall()
    }
})