class Game {
    constructor() {
        this.gameContainer = document.getElementById('game-container');
        this.gameScene = document.getElementById('game-scene');
        this.gameUI = document.getElementById('game-ui');
        this.gameMenu = document.getElementById('game-menu');
        this.statusIndicator = document.querySelector('.status-indicator');
        this.gameTips = document.querySelector('.game-tips');
        
        // 计时器和分数元素
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        
        // 力度和急迫度计量表
        this.urgencyMeter = document.getElementById('urgency-meter');
        this.urgencyFill = document.getElementById('urgency-fill');
        this.forceMeter = document.getElementById('force-meter');
        this.forceFill = this.forceMeter.querySelector('.meter-fill');
        
        // 游戏状态
        this.timeLeft = 60;
        this.score = 0;
        this.urgencyLevel = 0;
        this.forceLevel = 0;
        this.isGameActive = false;
        this.isPaused = false;
        
        // 绑定按钮事件
        document.getElementById('start-game').addEventListener('click', () => this.showCharacterSelection());
        document.getElementById('select-character').addEventListener('click', () => this.showCharacterSelection());
        document.getElementById('select-scene').addEventListener('click', () => this.showSceneSelection());
        
        // 绑定键盘事件
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // 初始化游戏
        this.showMenu();
        this.mobileController = new MobileController(this);
    }
    
    showMenu() {
        this.gameMenu.classList.add('active');
        this.resetGameState();
        this.showTip('欢迎来到拉屎模拟器！选择一个角色开始游戏。');
    }
    
    showCharacterSelection() {
        this.gameMenu.innerHTML = `
            <div class="menu-content">
                <h2>选择角色</h2>
                <div class="selection-grid">
                    <div class="selection-item" data-character="normal">
                        <div class="character-preview normal"></div>
                        <h3>普通人</h3>
                        <p>标准速度和耐力</p>
                    </div>
                    <div class="selection-item" data-character="urgent">
                        <div class="character-preview urgent"></div>
                        <h3>急迫者</h3>
                        <p>较快速度，较低耐力</p>
                    </div>
                    <div class="selection-item" data-character="pro">
                        <div class="character-preview pro"></div>
                        <h3>老司机</h3>
                        <p>高速度，高耐力</p>
                    </div>
                </div>
                <button class="back-button">返回</button>
            </div>
        `;
        
        const items = this.gameMenu.querySelectorAll('.selection-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                this.selectCharacter(item.dataset.character);
            });
        });
        
        this.gameMenu.querySelector('.back-button').addEventListener('click', () => this.showMenu());
    }
    
    showSceneSelection() {
        this.gameMenu.innerHTML = `
            <div class="menu-content">
                <h2>选择场景</h2>
                <div class="selection-grid">
                    <div class="selection-item" data-scene="home">
                        <div class="scene-preview home"></div>
                        <h3>家</h3>
                        <p>简单难度</p>
                    </div>
                    <div class="selection-item" data-scene="office">
                        <div class="scene-preview office"></div>
                        <h3>办公室</h3>
                        <p>中等难度</p>
                    </div>
                    <div class="selection-item" data-scene="park">
                        <div class="scene-preview park"></div>
                        <h3>公园</h3>
                        <p>困难难度</p>
                    </div>
                </div>
                <button class="back-button">返回</button>
            </div>
        `;
        
        const items = this.gameMenu.querySelectorAll('.selection-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                this.selectScene(item.dataset.scene);
            });
        });
        
        this.gameMenu.querySelector('.back-button').addEventListener('click', () => this.showMenu());
    }
    
    selectCharacter(type) {
        this.selectedCharacter = type;
        this.character = new Character(type);
        this.showTip(`已选择${this.character.name}！请选择场景开始游戏。`, 2000);
        this.showSceneSelection();
    }
    
    selectScene(type) {
        this.selectedScene = type;
        this.scene = new Scene(type);
        this.showTip(`准备开始游戏！`, 1500);
        setTimeout(() => this.startGame(), 1500);
    }
    
    startGame() {
        if (!this.character || !this.scene) {
            this.showTip('请先选择角色和场景！');
            return;
        }
        
        this.gameMenu.classList.remove('active');
        this.resetGameState();
        this.isGameActive = true;
        this.gameLoop();
        this.showTip('游戏开始！找到厕所完成任务！', 2000);
        this.mobileController.show();
    }
    
    resetGameState() {
        this.timeLeft = 60;
        this.score = 0;
        this.urgencyLevel = 0;
        this.forceLevel = 0;
        this.updateUI();
    }
    
    updateUI() {
        // 更新计时器和分数
        this.timerElement.textContent = Math.max(0, Math.floor(this.timeLeft));
        this.scoreElement.textContent = this.score;
        
        // 更新急迫度
        this.urgencyFill.style.width = `${this.urgencyLevel}%`;
        this.urgencyFill.style.backgroundColor = this.getUrgencyColor();
        
        // 更新力度计
        this.forceFill.style.width = `${this.forceLevel}%`;
    }
    
    getUrgencyColor() {
        if (this.urgencyLevel < 30) return '#4CAF50';
        if (this.urgencyLevel < 60) return '#FFC107';
        if (this.urgencyLevel < 90) return '#FF9800';
        return '#F44336';
    }
    
    showTip(message, duration = 3000) {
        this.gameTips.textContent = message;
        this.gameTips.classList.add('active');
        setTimeout(() => {
            this.gameTips.classList.remove('active');
        }, duration);
    }
    
    updateStatus(status) {
        this.statusIndicator.textContent = status;
        this.statusIndicator.classList.add('active');
        setTimeout(() => {
            this.statusIndicator.classList.remove('active');
        }, 2000);
    }
    
    handleKeyPress(event) {
        if (!this.isGameActive || this.isPaused) return;
        
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.character.move('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.character.move('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.character.move('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.character.move('right');
                break;
            case ' ':
                this.handleForceControl();
                break;
            case 'Escape':
                this.togglePause();
                break;
        }
    }
    
    handleForceControl() {
        if (this.character.isNearToilet()) {
            this.forceLevel = (this.forceLevel + 3) % 100;
            this.updateUI();

            if (this.forceLevel >= 45 && this.forceLevel <= 55) {
                this.completeTask();
            }
        }
    }
    
    completeTask() {
        const perfectRange = Math.abs(this.forceLevel - 50);
        let scoreGain = 0;
        let message = '';

        if (perfectRange <= 5) {
            scoreGain = 100;
            message = '完美！+100分';
        } else if (perfectRange <= 15) {
            scoreGain = 50;
            message = '不错！+50分';
        } else {
            scoreGain = 20;
            message = '一般！+20分';
        }

        const timeBonus = Math.floor(this.timeLeft * 2);
        const urgencyPenalty = Math.floor(this.urgencyLevel * 0.5);
        const finalScore = Math.max(0, scoreGain + timeBonus - urgencyPenalty);

        this.score += finalScore;
        this.showTip(`${message} 时间奖励: +${timeBonus} 急迫度惩罚: -${urgencyPenalty}`);
        
        this.urgencyLevel = 0;
        this.forceLevel = 0;
        
        this.character.position = {
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50
        };
        this.character.initAppearance();
        
        this.updateUI();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showTip('游戏暂停');
        } else {
            this.showTip('游戏继续');
        }
    }
    
    gameLoop() {
        if (!this.isGameActive) return;
        
        if (!this.isPaused) {
            this.timeLeft -= 1/60;
            
            const baseUrgencyIncrease = 0.1;
            const urgencyMultiplier = this.character.traits.urgencyRate;
            const timeMultiplier = Math.max(0.5, this.timeLeft / 60);
            
            this.urgencyLevel = Math.min(100, 
                this.urgencyLevel + (baseUrgencyIncrease * urgencyMultiplier * timeMultiplier)
            );
            
            if (this.timeLeft <= 0 || this.urgencyLevel >= 100) {
                this.gameOver('失败');
                return;
            }
            
            if (this.character.isNearToilet()) {
                this.updateStatus('按住空格键控制力度！对准中间位置！');
            } else if (this.urgencyLevel > 80) {
                this.updateStatus('快要坚持不住了！赶快找厕所！');
            } else if (this.urgencyLevel > 50) {
                this.updateStatus('有点急了...');
            }
            
            this.updateUI();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    gameOver(result) {
        this.isGameActive = false;
        let message = '';
        
        if (result === '成功') {
            const finalScore = this.score;
            let rank = '';
            if (finalScore >= 500) rank = 'S';
            else if (finalScore >= 400) rank = 'A';
            else if (finalScore >= 300) rank = 'B';
            else if (finalScore >= 200) rank = 'C';
            else rank = 'D';
            
            message = `游戏结束！\n最终得分：${finalScore}\n评级：${rank}`;
        } else {
            message = '游戏结束！\n没能坚持到最后...';
        }
        
        this.showTip(message);
        setTimeout(() => this.showMenu(), 3000);
        this.mobileController.hide();
    }

    returnToMenu() {
        this.mobileController.hide();
    }
}

// 创建游戏实例
window.addEventListener('load', () => {
    window.gameInstance = new Game();
}); 