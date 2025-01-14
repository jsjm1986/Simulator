class MobileController {
    constructor(game) {
        this.game = game;
        this.touchStartPos = null;
        this.joystickPos = null;
        this.isJoystickActive = false;
        this.actionButtonActive = false;
        
        // 创建虚拟摇杆和动作按钮
        this.createJoystick();
        this.createActionButton();
        
        // 绑定触摸事件
        this.bindTouchEvents();
        
        // 检测是否为移动设备
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (this.isMobile) {
            this.show();
        } else {
            this.hide();
        }
    }

    createJoystick() {
        this.joystickContainer = document.createElement('div');
        this.joystickContainer.className = 'mobile-joystick-container';
        
        this.joystickBase = document.createElement('div');
        this.joystickBase.className = 'mobile-joystick-base';
        
        this.joystickHandle = document.createElement('div');
        this.joystickHandle.className = 'mobile-joystick-handle';
        
        this.joystickBase.appendChild(this.joystickHandle);
        this.joystickContainer.appendChild(this.joystickBase);
        document.body.appendChild(this.joystickContainer);
    }

    createActionButton() {
        this.actionButton = document.createElement('div');
        this.actionButton.className = 'mobile-action-button';
        this.actionButton.innerHTML = '力度';
        document.body.appendChild(this.actionButton);
    }

    bindTouchEvents() {
        // 摇杆触摸事件
        this.joystickContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartPos = {
                x: touch.clientX,
                y: touch.clientY
            };
            this.isJoystickActive = true;
            this.joystickBase.style.opacity = '1';
            this.updateJoystickPosition(touch.clientX, touch.clientY);
        });

        document.addEventListener('touchmove', (e) => {
            if (this.isJoystickActive) {
                e.preventDefault();
                const touch = e.touches[0];
                this.handleJoystickMove(touch.clientX, touch.clientY);
            }
        });

        document.addEventListener('touchend', (e) => {
            if (this.isJoystickActive) {
                this.isJoystickActive = false;
                this.joystickHandle.style.transform = 'translate(-50%, -50%)';
                this.joystickBase.style.opacity = '0.5';
            }
        });

        // 动作按钮触摸事件
        this.actionButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.actionButtonActive = true;
            this.actionButton.classList.add('active');
            this.handleAction();
        });

        this.actionButton.addEventListener('touchend', () => {
            this.actionButtonActive = false;
            this.actionButton.classList.remove('active');
        });
    }

    handleJoystickMove(x, y) {
        const dx = x - this.touchStartPos.x;
        const dy = y - this.touchStartPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 50; // 最大移动距离

        let moveX = dx;
        let moveY = dy;

        if (distance > maxDistance) {
            const ratio = maxDistance / distance;
            moveX *= ratio;
            moveY *= ratio;
        }

        this.joystickHandle.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;

        // 确定移动方向
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // 将角度转换为方向
        if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
            if (angle > -45 && angle <= 45) {
                this.game.character.move('right');
            } else if (angle > 45 && angle <= 135) {
                this.game.character.move('down');
            } else if (angle > 135 || angle <= -135) {
                this.game.character.move('left');
            } else {
                this.game.character.move('up');
            }
        }
    }

    handleAction() {
        if (this.game.character.isNearToilet()) {
            this.game.handleForceControl();
        }
    }

    updateJoystickPosition(x, y) {
        const rect = this.joystickBase.getBoundingClientRect();
        this.joystickPos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    show() {
        this.joystickContainer.style.display = 'block';
        this.actionButton.style.display = 'block';
    }

    hide() {
        this.joystickContainer.style.display = 'none';
        this.actionButton.style.display = 'none';
    }
} 