class Character {
    constructor(type) {
        this.type = type;
        this.setTraits();
        this.position = {
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50
        };
        this.element = document.getElementById('character');
        this.statusElement = this.element.querySelector('.character-status');
        this.initAppearance();
        this.moving = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    setTraits() {
        switch(this.type) {
            case 'normal':
                this.name = '普通人';
                this.traits = {
                    moveSpeed: 8,
                    urgencyRate: 1
                };
                break;
            case 'urgent':
                this.name = '急迫者';
                this.traits = {
                    moveSpeed: 12,
                    urgencyRate: 1.5
                };
                break;
            case 'pro':
                this.name = '老司机';
                this.traits = {
                    moveSpeed: 10,
                    urgencyRate: 0.8
                };
                break;
        }
    }

    initAppearance() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.className = `character ${this.type}`;
    }

    move(directions) {
        // 如果传入的是字符串（键盘控制），转换为方向对象
        if (typeof directions === 'string') {
            const dir = directions;
            directions = {
                up: dir === 'up',
                down: dir === 'down',
                left: dir === 'left',
                right: dir === 'right'
            };
        }

        // 更新移动状态
        this.moving = directions;

        // 计算移动
        let deltaX = 0;
        let deltaY = 0;
        const speed = this.traits.moveSpeed;

        if (this.moving.up) deltaY -= speed;
        if (this.moving.down) deltaY += speed;
        if (this.moving.left) deltaX -= speed;
        if (this.moving.right) deltaX += speed;

        // 对角线移动时减慢速度
        if ((this.moving.up || this.moving.down) && (this.moving.left || this.moving.right)) {
            deltaX *= 0.707; // Math.cos(45°)
            deltaY *= 0.707; // Math.sin(45°)
        }

        // 更新位置
        const newX = Math.max(0, Math.min(window.innerWidth - 50, this.position.x + deltaX));
        const newY = Math.max(0, Math.min(window.innerHeight - 50, this.position.y + deltaY));

        this.position.x = newX;
        this.position.y = newY;

        // 更新元素位置
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;

        // 更新动画状态
        if (deltaX !== 0 || deltaY !== 0) {
            this.element.classList.add('walking');
            
            // 设置朝向
            if (deltaX < 0) {
                this.element.classList.add('facing-left');
                this.element.classList.remove('facing-right');
            } else if (deltaX > 0) {
                this.element.classList.add('facing-right');
                this.element.classList.remove('facing-left');
            }
        } else {
            this.element.classList.remove('walking');
        }
    }

    stopMoving() {
        this.moving = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.element.classList.remove('walking');
    }

    isNearToilet() {
        const toilets = document.querySelectorAll('.toilet');
        const characterRect = this.element.getBoundingClientRect();
        const characterCenter = {
            x: characterRect.left + characterRect.width / 2,
            y: characterRect.top + characterRect.height / 2
        };

        for (const toilet of toilets) {
            const toiletRect = toilet.getBoundingClientRect();
            const toiletCenter = {
                x: toiletRect.left + toiletRect.width / 2,
                y: toiletRect.top + toiletRect.height / 2
            };

            const distance = Math.sqrt(
                Math.pow(characterCenter.x - toiletCenter.x, 2) +
                Math.pow(characterCenter.y - toiletCenter.y, 2)
            );

            if (distance < 60) {
                return true;
            }
        }

        return false;
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