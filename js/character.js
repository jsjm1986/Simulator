class Character {
    constructor(type) {
        this.type = type;
        this.urgencyLevel = 0;
        this.maxUrgency = 100;
        this.position = { x: 50, y: 300 };
        this.isMoving = false;
        this.direction = 'right';
        this.element = document.getElementById('character');
        this.urgencyFillElement = document.getElementById('urgency-fill');
        
        // 角色特性
        this.traits = {
            urgencyRate: 1,
            controlDifficulty: 1,
            maxHoldTime: 60,
            moveSpeed: 8
        };
        
        this.initTraits();
        this.initAppearance();
    }

    initTraits() {
        switch(this.type) {
            case 'normal':
                this.name = '普通人';
                this.traits.moveSpeed = 8;
                this.traits.urgencyRate = 0.8;
                break;
            case 'urgent':
                this.name = '急迫者';
                this.traits.urgencyRate = 1.2;
                this.traits.maxHoldTime = 50;
                this.traits.moveSpeed = 12;
                break;
            case 'pro':
                this.name = '老司机';
                this.traits.controlDifficulty = 0.7;
                this.traits.maxHoldTime = 75;
                this.traits.moveSpeed = 10;
                this.traits.urgencyRate = 0.6;
                break;
        }
    }

    initAppearance() {
        this.element.style.backgroundImage = `url('${GameAssets.characters[this.type]}')`;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    move(direction) {
        if (this.isMoving) return;

        const speed = this.traits.moveSpeed;
        let newX = this.position.x;
        let newY = this.position.y;

        switch(direction) {
            case 'up':
                newY -= speed;
                break;
            case 'down':
                newY += speed;
                break;
            case 'left':
                newX -= speed;
                this.direction = 'left';
                this.element.style.transform = 'scaleX(-1)';
                break;
            case 'right':
                newX += speed;
                this.direction = 'right';
                this.element.style.transform = 'scaleX(1)';
                break;
        }

        // 检查边界并添加一些缓冲区
        const buffer = 10;
        if (newX >= buffer && newX <= 750 - buffer && newY >= buffer && newY <= 550 - buffer) {
            this.moveTo(newX, newY);
        }
    }

    moveTo(x, y) {
        this.isMoving = true;
        this.position = { x, y };

        // 更新位置
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        
        // 添加走路动画，但缩短动画时间
        this.element.classList.add('walking');
        
        // 缩短移动锁定时间，使移动更流畅
        setTimeout(() => {
            this.isMoving = false;
            this.element.classList.remove('walking');
        }, 150);
    }

    isNearToilet() {
        const toilets = document.querySelectorAll('.toilet');
        for (let toilet of toilets) {
            const toiletRect = toilet.getBoundingClientRect();
            const characterRect = this.element.getBoundingClientRect();
            
            const distance = Math.sqrt(
                Math.pow((toiletRect.x + toiletRect.width/2) - (characterRect.x + characterRect.width/2), 2) +
                Math.pow((toiletRect.y + toiletRect.height/2) - (characterRect.y + characterRect.height/2), 2)
            );
            
            // 增加检测范围，使交互更容易
            if (distance < 60) {
                return true;
            }
        }
        return false;
    }

    update(deltaTime) {
        if (!this.isInToilet) {
            // 调整急迫度增长速度
            this.urgencyLevel = Math.min(
                this.maxUrgency,
                this.urgencyLevel + (this.traits.urgencyRate * deltaTime * 0.15)
            );
            
            // 更新急迫度显示
            if (this.urgencyFillElement) {
                this.urgencyFillElement.style.width = `${this.urgencyLevel}%`;
            }

            // 根据急迫度添加动画效果
            if (this.urgencyLevel > 80) {
                this.element.classList.add('urgent');
                this.element.style.animation = 'urgent 0.3s infinite';
                // 在极度急迫时略微提升移动速度
                this.traits.moveSpeed *= 1.1;
            } else if (this.urgencyLevel > 50) {
                this.element.classList.add('uncomfortable');
                this.element.style.animation = 'uncomfortable 0.5s infinite';
            } else {
                this.element.classList.remove('urgent', 'uncomfortable');
                this.element.style.animation = '';
                // 恢复正常速度
                this.traits.moveSpeed = this.type === 'urgent' ? 12 : (this.type === 'pro' ? 10 : 8);
            }
        }
    }

    startToilet() {
        this.isInToilet = true;
        this.element.classList.add('in-toilet');
        this.showTooltip('按住空格键控制力度！');
    }

    endToilet() {
        this.isInToilet = false;
        this.urgencyLevel = 0;
        this.element.classList.remove('in-toilet');
        this.hideTooltip();
    }

    showTooltip(text) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.textContent = text;
            tooltip.style.display = 'block';
            tooltip.style.left = `${this.position.x + 25}px`;
            tooltip.style.top = `${this.position.y - 30}px`;
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    getStatus() {
        return {
            urgencyLevel: this.urgencyLevel,
            isMoving: this.isMoving,
            isInToilet: this.isInToilet,
            position: this.position
        };
    }
}

// 角色选择功能
const characterSelect = {
    characters: [
        { id: 'normal', name: '普通人', description: '标准的控制能力' },
        { id: 'urgent', name: '急性子', description: '容易着急，但移动速度快' },
        { id: 'pro', name: '老司机', description: '出色的控制能力' }
    ],

    init() {
        const selectBtn = document.getElementById('select-character');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => this.showSelection());
        }
    },

    showSelection() {
        const menu = document.getElementById('game-menu');
        menu.innerHTML = `
            <h2>选择角色</h2>
            <div class="character-list">
                ${this.characters.map(char => `
                    <div class="character-option" data-id="${char.id}">
                        <div class="character-preview" style="background-image: url('${GameAssets.characters[char.id]}')"></div>
                        <h3>${char.name}</h3>
                        <p>${char.description}</p>
                    </div>
                `).join('')}
            </div>
            <button id="back-to-menu">返回</button>
        `;

        // 添加选择事件
        const options = menu.querySelectorAll('.character-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const selectedId = option.dataset.id;
                window.gameInstance?.selectCharacter(selectedId);
            });
        });

        // 返回按钮
        const backBtn = document.getElementById('back-to-menu');
        backBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
}; 