class DinoGame {
    constructor() {
        this.gameCanvas = document.getElementById('gameCanvas');
        this.scoreDisplay = document.getElementById('score');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreDisplay = document.getElementById('finalScore');
        
        this.gameWidth = 800;
        this.gameHeight = 400;
        this.score = 0;
        this.gameRunning = true;
        this.gameSpeed = 6;
        this.obstacleFrequency = 0.015;
        
        this.dino = this.createDino();
        this.obstacles = [];
        this.clouds = [];
        this.ground = this.createGround();
        
        this.setupEventListeners();
        this.spawnClouds();
        this.gameLoop();
    }
    
    createDino() {
        const dino = document.createElement('div');
        dino.className = 'dino dino-idle';
        dino.style.bottom = '20px';
        this.gameCanvas.appendChild(dino);
        return {
            element: dino,
            isJumping: false,
            velocityY: 0,
            x: 50
        };
    }
    
    createGround() {
        const ground = document.createElement('div');
        ground.className = 'ground';
        this.gameCanvas.appendChild(ground);
        return ground;
    }
    
    spawnClouds() {
        setInterval(() => {
            if (this.gameRunning) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.top = Math.random() * 100 + 'px';
                cloud.style.right = '-100px';
                this.gameCanvas.appendChild(cloud);
                
                this.clouds.push({
                    element: cloud,
                    x: this.gameWidth
                });
            }
        }, 4000);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.dino.isJumping && this.gameRunning) {
                this.jump();
            }
        });
        
        document.addEventListener('touchstart', () => {
            if (!this.dino.isJumping && this.gameRunning) {
                this.jump();
            }
        });
    }
    
    jump() {
        this.dino.isJumping = true;
        this.dino.velocityY = 15;
        this.dino.element.classList.add('jump');
    }
    
    spawnObstacle() {
        if (Math.random() < this.obstacleFrequency && this.gameRunning) {
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
            obstacle.style.right = '-30px';
            this.gameCanvas.appendChild(obstacle);
            
            this.obstacles.push({
                element: obstacle,
                x: this.gameWidth,
                width: 30,
                height: 50
            });
        }
    }
    
    updateDino() {
        if (this.dino.isJumping) {
            this.dino.velocityY -= 0.6;
            let dinoBottom = parseInt(this.dino.element.style.bottom);
            dinoBottom += this.dino.velocityY;
            
            if (dinoBottom <= 20) {
                dinoBottom = 20;
                this.dino.isJumping = false;
                this.dino.velocityY = 0;
                this.dino.element.classList.remove('jump');
            }
            
            this.dino.element.style.bottom = dinoBottom + 'px';
        }
    }
    
    updateObstacles() {
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.gameSpeed;
            obstacle.element.style.right = (this.gameWidth - obstacle.x) + 'px';
            
            if (obstacle.x < -30) {
                obstacle.element.remove();
                this.obstacles.splice(index, 1);
                this.score += 10;
                this.scoreDisplay.textContent = this.score;
                
                if (this.score % 100 === 0) {
                    this.gameSpeed += 1;
                }
            }
        });
    }
    
    updateClouds() {
        this.clouds.forEach((cloud, index) => {
            cloud.x -= 2;
            cloud.element.style.right = (this.gameWidth - cloud.x) + 'px';
            
            if (cloud.x < -100) {
                cloud.element.remove();
                this.clouds.splice(index, 1);
            }
        });
    }
    
    checkCollision() {
        const dinoBottom = parseInt(this.dino.element.style.bottom);
        const dinoTop = dinoBottom + 50;
        const dinoLeft = 50;
        const dinoRight = 100;
        
        this.obstacles.forEach(obstacle => {
            const obstacleLeft = obstacle.x;
            const obstacleRight = obstacle.x + obstacle.width;
            const obstacleBottom = 20;
            const obstacleTop = 20 + obstacle.height;
            
            if (dinoRight > obstacleLeft &&
                dinoLeft < obstacleRight &&
                dinoBottom < obstacleTop &&
                dinoTop > obstacleBottom) {
                this.gameOver();
            }
        });
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gameOverScreen.classList.add('show');
        this.finalScoreDisplay.textContent = this.score;
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.updateDino();
            this.spawnObstacle();
            this.updateObstacles();
            this.updateClouds();
            this.checkCollision();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new DinoGame();
});