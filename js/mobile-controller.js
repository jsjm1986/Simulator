class MobileController {
    constructor(game) {
        this.game = game;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.touchStartTime = 0;
        this.lastMoveTime = 0;
        this.moveThrottle = 16; // 约60fps
        this.currentDirection = null;
        this.forceInterval = null;
        this.forceIncreaseSpeed = 2;
        
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    setupMobileControls() {
        this.createJoystick();
        this.createActionButton();
        this.setupLandscapeNotice();
        this.preventDefaultTouchEvents();
    }

    preventDefaultTouchEvents() {
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.mobile-joystick-container, .mobile-action-button')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    createJoystick() {
        this.joystickContainer = document.createElement('div');
        this.joystickContainer.className = 'mobile-joystick-container';
        
        this.joystickBase = document.createElement('div');
        this.joystickBase.className = 'mobile-joystick-base';
        
        this.joystickHandle = document.createElement('div');
        this.joystickHandle.className = 'mobile-joystick-handle';
        
        this.joystickContainer.appendChild(this.joystickBase);
        this.joystickContainer.appendChild(this.joystickHandle);
        document.body.appendChild(this.joystickContainer);
        
        this.bindJoystickEvents();
    }

    createActionButton() {
        this.actionButton = document.createElement('div');
        this.actionButton.className = 'mobile-action-button';
        this.actionButton.textContent = '力度';
        document.body.appendChild(this.actionButton);
        
        this.bindActionButtonEvents();
    }

    bindJoystickEvents() {
        let isDragging = false;
        let startX, startY;
        
        const handleStart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            isDragging = true;
            const rect = this.joystickBase.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
            this.joystickBase.style.opacity = '0.8';
            
            // 立即处理第一次触摸
            this.handleJoystickMove(touch.clientX - startX, touch.clientY - startY);
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            this.handleJoystickMove(deltaX, deltaY);
        };
        
        const handleEnd = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            isDragging = false;
            this.joystickHandle.style.transform = 'translate(-50%, -50%)';
            this.joystickBase.style.opacity = '0.7';
            this.currentDirection = null;
            if (this.game.character) {
                this.game.character.stopMoving();
            }
        };
        
        this.joystickContainer.addEventListener('touchstart', handleStart);
        this.joystickContainer.addEventListener('touchmove', handleMove);
        this.joystickContainer.addEventListener('touchend', handleEnd);
        this.joystickContainer.addEventListener('touchcancel', handleEnd);
    }

    handleJoystickMove(deltaX, deltaY) {
        // 计算移动距离和角度
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 40;
        const normalizedDistance = Math.min(distance, maxDistance);
        const angle = Math.atan2(deltaY, deltaX);
        
        // 更新摇杆位置
        const moveX = Math.cos(angle) * normalizedDistance;
        const moveY = Math.sin(angle) * normalizedDistance;
        this.joystickHandle.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        
        // 确定移动方向
        const threshold = 10;
        const directions = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // 根据角度确定方向
        const degrees = angle * 180 / Math.PI;
        if (distance > threshold) {
            if (degrees > -135 && degrees <= -45) directions.up = true;
            if (degrees > 45 && degrees <= 135) directions.down = true;
            if (degrees > 135 || degrees <= -135) directions.left = true;
            if (degrees > -45 && degrees <= 45) directions.right = true;
            
            // 更新角色移动
            if (this.game.character) {
                this.game.character.move(directions);
            }
        }
    }

    bindActionButtonEvents() {
        let isPressed = false;
        let pressStartTime = 0;
        const longPressThreshold = 300;
        
        const handleStart = (e) => {
            e.preventDefault();
            isPressed = true;
            pressStartTime = Date.now();
            this.actionButton.classList.add('active');
            
            if (this.game.character && this.game.character.isNearToilet()) {
                // 开始持续增加力度
                this.startForceControl();
            }
        };
        
        const handleEnd = (e) => {
            if (!isPressed) return;
            e.preventDefault();
            isPressed = false;
            const pressDuration = Date.now() - pressStartTime;
            
            this.actionButton.classList.remove('active');
            if (this.game.character && this.game.character.isNearToilet()) {
                // 停止力度控制
                this.stopForceControl();
                
                // 短按时直接完成任务
                if (pressDuration < longPressThreshold) {
                    this.game.completeTask();
                }
            }
        };
        
        this.actionButton.addEventListener('touchstart', handleStart);
        this.actionButton.addEventListener('touchend', handleEnd);
        this.actionButton.addEventListener('touchcancel', handleEnd);
    }

    startForceControl() {
        // 清除可能存在的旧定时器
        if (this.forceInterval) {
            clearInterval(this.forceInterval);
        }

        // 重置力度值
        if (this.game.forceLevel === undefined) {
            this.game.forceLevel = 0;
        }

        // 创建新的力度控制定时器
        this.forceInterval = setInterval(() => {
            if (this.game.character && this.game.character.isNearToilet()) {
                // 增加力度值
                this.game.forceLevel = (this.game.forceLevel + this.forceIncreaseSpeed) % 100;
                
                // 更新UI显示
                const forceFill = document.querySelector('#force-meter .meter-fill');
                if (forceFill) {
                    forceFill.style.width = `${this.game.forceLevel}%`;
                }

                // 检查是否在完成范围内
                if (this.game.forceLevel >= 45 && this.game.forceLevel <= 55) {
                    this.game.showTip('力度合适！松开完成！', 1000);
                }
            }
        }, 50); // 每50ms更新一次
    }

    stopForceControl() {
        if (this.forceInterval) {
            clearInterval(this.forceInterval);
            this.forceInterval = null;
        }
    }

    setupLandscapeNotice() {
        this.landscapeNotice = document.createElement('div');
        this.landscapeNotice.className = 'landscape-notice';
        this.landscapeNotice.textContent = '请使用竖屏模式以获得最佳游戏体验';
        document.body.appendChild(this.landscapeNotice);
        
        const checkOrientation = () => {
            const isLandscape = window.matchMedia("(orientation: landscape)").matches;
            this.landscapeNotice.style.display = isLandscape ? 'flex' : 'none';
        };
        
        window.addEventListener('orientationchange', checkOrientation);
        window.addEventListener('resize', checkOrientation);
        checkOrientation();
    }

    show() {
        if (this.isMobile) {
            this.joystickContainer.style.display = 'block';
            this.actionButton.style.display = 'flex';
        }
    }

    hide() {
        if (this.isMobile) {
            this.joystickContainer.style.display = 'none';
            this.actionButton.style.display = 'none';
        }
    }
} 