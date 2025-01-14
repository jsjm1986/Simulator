class Scene {
    constructor(type) {
        this.type = type;
        this.toilets = [];
        this.obstacles = [];
        this.npcs = [];
        this.element = document.getElementById('game-scene');
        this.toiletsContainer = document.getElementById('toilets');
        this.npcsContainer = document.getElementById('npcs');
        this.obstaclesContainer = document.getElementById('obstacles');
        
        this.initScene();
    }

    initScene() {
        // 清空容器
        this.toiletsContainer.innerHTML = '';
        this.npcsContainer.innerHTML = '';
        this.obstaclesContainer.innerHTML = '';

        // 根据场景类型初始化
        switch(this.type) {
            case 'home':
                this.setupHome();
                break;
            case 'office':
                this.setupOffice();
                break;
            case 'park':
                this.setupPark();
                break;
        }

        // 设置背景
        this.element.style.backgroundImage = `url('${GameAssets.backgrounds[this.type]}')`;
        this.element.style.backgroundSize = 'cover';
        this.element.style.backgroundPosition = 'center';

        // 渲染场景元素
        this.renderToilets();
        this.renderObstacles();
        this.renderNPCs();
    }

    setupHome() {
        // 家里场景设置
        this.toilets = [
            { x: 600, y: 300, available: true, id: 'home-toilet' }
        ];
    }

    setupOffice() {
        // 办公室场景设置
        this.toilets = [
            { x: 700, y: 100, available: true, id: 'office-toilet-1' },
            { x: 700, y: 500, available: true, id: 'office-toilet-2' }
        ];
        this.obstacles = [
            { x: 400, y: 200, width: 100, height: 100, type: 'desk' },
            { x: 200, y: 400, width: 150, height: 80, type: 'cabinet' }
        ];
        this.npcs = [
            { x: 300, y: 300, type: 'coworker', id: 'npc-1' }
        ];
    }

    setupPark() {
        // 公园场景设置
        this.toilets = [
            { x: 650, y: 250, available: true, id: 'park-toilet' }
        ];
        this.obstacles = [
            { x: 300, y: 200, width: 200, height: 100, type: 'tree' },
            { x: 100, y: 400, width: 100, height: 100, type: 'bench' }
        ];
        this.npcs = [
            { x: 400, y: 400, type: 'visitor', id: 'npc-1' },
            { x: 200, y: 200, type: 'visitor', id: 'npc-2' }
        ];
    }

    renderToilets() {
        this.toilets.forEach(toilet => {
            const toiletElement = document.createElement('div');
            toiletElement.className = `toilet ${toilet.available ? '' : 'unavailable'}`;
            toiletElement.id = toilet.id;
            toiletElement.style.left = `${toilet.x}px`;
            toiletElement.style.top = `${toilet.y}px`;
            toiletElement.style.backgroundImage = `url('${GameAssets.gameElements.toilet}')`;
            this.toiletsContainer.appendChild(toiletElement);
        });
    }

    renderObstacles() {
        this.obstacles.forEach(obstacle => {
            const obstacleElement = document.createElement('div');
            obstacleElement.className = `obstacle ${obstacle.type}`;
            obstacleElement.style.left = `${obstacle.x}px`;
            obstacleElement.style.top = `${obstacle.y}px`;
            obstacleElement.style.width = `${obstacle.width}px`;
            obstacleElement.style.height = `${obstacle.height}px`;
            obstacleElement.style.backgroundImage = `url('${GameAssets.obstacles[obstacle.type]}')`;
            obstacleElement.style.backgroundSize = 'contain';
            obstacleElement.style.backgroundRepeat = 'no-repeat';
            obstacleElement.style.backgroundPosition = 'center';
            this.obstaclesContainer.appendChild(obstacleElement);
        });
    }

    renderNPCs() {
        this.npcs.forEach(npc => {
            const npcElement = document.createElement('div');
            npcElement.className = `npc ${npc.type}`;
            npcElement.id = npc.id;
            npcElement.style.left = `${npc.x}px`;
            npcElement.style.top = `${npc.y}px`;
            npcElement.style.backgroundImage = `url('${GameAssets.gameElements[npc.type]}')`;
            this.npcsContainer.appendChild(npcElement);
        });
    }

    update() {
        // 更新场景状态
        this.updateNPCs();
        this.checkToiletAvailability();
    }

    updateNPCs() {
        // 更新NPC的移动和状态
        this.npcs.forEach(npc => {
            // 简单的随机移动
            if (Math.random() < 0.02) {
                npc.x += (Math.random() - 0.5) * 20;
                npc.y += (Math.random() - 0.5) * 20;
                
                // 更新NPC元素位置
                const npcElement = document.getElementById(npc.id);
                if (npcElement) {
                    npcElement.style.left = `${npc.x}px`;
                    npcElement.style.top = `${npc.y}px`;
                }
            }
        });
    }

    checkToiletAvailability() {
        // 检查厕所是否可用
        this.toilets.forEach(toilet => {
            // 随机改变厕所可用状态
            if (Math.random() < 0.001) {
                toilet.available = !toilet.available;
                // 更新厕所元素状态
                const toiletElement = document.getElementById(toilet.id);
                if (toiletElement) {
                    toiletElement.className = `toilet ${toilet.available ? '' : 'unavailable'}`;
                }
            }
        });
    }

    findNearestToilet(x, y) {
        let nearest = null;
        let minDistance = Infinity;

        this.toilets.forEach(toilet => {
            if (toilet.available) {
                const distance = Math.sqrt(
                    Math.pow(toilet.x - x, 2) + Math.pow(toilet.y - y, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = toilet;
                }
            }
        });

        return nearest;
    }

    checkCollision(x, y) {
        // 检查是否与障碍物碰撞
        return this.obstacles.some(obstacle => {
            return x >= obstacle.x && x <= obstacle.x + obstacle.width &&
                   y >= obstacle.y && y <= obstacle.y + obstacle.height;
        });
    }
}

// 场景选择功能
const sceneSelect = {
    scenes: [
        { id: 'home', name: '温馨的家', description: '最舒适的环境' },
        { id: 'office', name: '办公室', description: '需要注意同事的目光' },
        { id: 'park', name: '公园', description: '公共厕所的挑战' }
    ],

    init() {
        const selectBtn = document.getElementById('select-scene');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => this.showSelection());
        }
    },

    showSelection() {
        const menu = document.getElementById('game-menu');
        menu.innerHTML = `
            <h2>选择场景</h2>
            <div class="scene-list">
                ${this.scenes.map(scene => `
                    <div class="scene-option" data-id="${scene.id}">
                        <div class="scene-preview" style="background-image: url('${GameAssets.backgrounds[scene.id]}')"></div>
                        <h3>${scene.name}</h3>
                        <p>${scene.description}</p>
                    </div>
                `).join('')}
            </div>
            <button id="back-to-menu">返回</button>
        `;

        // 添加选择事件
        const options = menu.querySelectorAll('.scene-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const selectedId = option.dataset.id;
                window.gameInstance?.selectScene(selectedId);
            });
        });

        // 返回按钮
        const backBtn = document.getElementById('back-to-menu');
        backBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
}; 