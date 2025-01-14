class MobileController {
    constructor(game) {
        this.game = game;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.touchStartTime = 0;
        this.lastMoveTime = 0;
        this.moveThrottle = 16; // 约60fps
        
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
        let baseRect;
        
        const handleStart = (e) => {
            const touch = e.touches[0];
            isDragging = true;
            this.touchStartTime = Date.now();
            baseRect = this.joystickBase.getBoundingClientRect();
            startX = baseRect.left + baseRect.width / 2;
            startY = baseRect.top + baseRect.height / 2;
            this.joystickBase.style.opacity = '0.8';
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            
            const now = Date.now();
            if (now - this.lastMoveTime < this.moveThrottle) return;
            this.lastMoveTime = now;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            // 计算摇杆移动距离和角度
            const maxDistance = 40;
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            
            // 更新摇杆位置
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;
            
            this.joystickHandle.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
            
            // 根据摇杆位置确定移动方向
            this.handleMovement(moveX, moveY);
        };
        
        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            this.joystickHandle.style.transform = 'translate(-50%, -50%)';
            this.joystickBase.style.opacity = '0.7';
            this.game.character.stopMoving();
        };
        
        this.joystickContainer.addEventListener('touchstart', handleStart, { passive: false });
        this.joystickContainer.addEventListener('touchmove', handleMove, { passive: false });
        this.joystickContainer.addEventListener('touchend', handleEnd);
        this.joystickContainer.addEventListener('touchcancel', handleEnd);
    }

    bindActionButtonEvents() {
        let isPressed = false;
        let pressStartTime = 0;
        const longPressThreshold = 300; // 长按阈值（毫秒）
        
        const handleStart = (e) => {
            e.preventDefault();
            isPressed = true;
            pressStartTime = Date.now();
            this.actionButton.classList.add('active');
            
            if (this.game.character.isNearToilet()) {
                this.game.handleForceControl(true);
            }
        };
        
        const handleEnd = () => {
            if (!isPressed) return;
            isPressed = false;
            const pressDuration = Date.now() - pressStartTime;
            
            this.actionButton.classList.remove('active');
            if (this.game.character.isNearToilet()) {
                this.game.handleForceControl(false);
                
                // 短按时直接完成
                if (pressDuration < longPressThreshold) {
                    this.game.completeTask();
                }
            }
        };
        
        this.actionButton.addEventListener('touchstart', handleStart, { passive: false });
        this.actionButton.addEventListener('touchend', handleEnd);
        this.actionButton.addEventListener('touchcancel', handleEnd);
    }

    handleMovement(moveX, moveY) {
        const threshold = 8;
        const directions = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // 根据摇杆位置确定移动方向
        if (moveY < -threshold) directions.up = true;
        if (moveY > threshold) directions.down = true;
        if (moveX < -threshold) directions.left = true;
        if (moveX > threshold) directions.right = true;
        
        // 更新角色移动
        this.game.character.move(directions);
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