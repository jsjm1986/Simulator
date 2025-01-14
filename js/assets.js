// SVG资源管理器
const GameAssets = {
    // 将SVG转换为Data URL
    svgToDataUrl(svg) {
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    },

    // 角色图标
    characters: {
        normal: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="35" r="25" fill="#FFD700"/>
            <rect x="35" y="60" width="30" height="35" fill="#4169E1"/>
            <circle cx="40" cy="30" r="5" fill="#000"/>
            <circle cx="60" cy="30" r="5" fill="#000"/>
            <path d="M 40 45 Q 50 55 60 45" stroke="#000" fill="none" stroke-width="3"/>
            <path d="M 35 60 Q 50 65 65 60" stroke="#2E4B8F" fill="none" stroke-width="2"/>
            <path d="M 35 70 Q 50 75 65 70" stroke="#2E4B8F" fill="none" stroke-width="2"/>
        </svg>`,
        
        urgent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="35" r="25" fill="#FFB6C1"/>
            <rect x="35" y="60" width="30" height="35" fill="#FF4500"/>
            <circle cx="40" cy="30" r="5" fill="#000"/>
            <circle cx="60" cy="30" r="5" fill="#000"/>
            <path d="M 40 50 Q 50 40 60 50" stroke="#000" fill="none" stroke-width="3"/>
            <path d="M 30 20 L 40 10 M 60 10 L 70 20" stroke="#000" stroke-width="3"/>
            <path d="M 30 35 L 25 45" stroke="#87CEEB" stroke-width="2"/>
            <path d="M 70 35 L 75 45" stroke="#87CEEB" stroke-width="2"/>
        </svg>`,
        
        pro: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="35" r="25" fill="#98FB98"/>
            <rect x="35" y="60" width="30" height="35" fill="#2E8B57"/>
            <circle cx="40" cy="30" r="5" fill="#000"/>
            <circle cx="60" cy="30" r="5" fill="#000"/>
            <path d="M 40 45 Q 50 55 60 45" stroke="#000" fill="none" stroke-width="3"/>
            <path d="M 25 25 L 75 25" stroke="#000" stroke-width="3"/>
            <path d="M 35 25 Q 40 20 45 25" stroke="#000" fill="none" stroke-width="2"/>
            <path d="M 55 25 Q 60 20 65 25" stroke="#000" fill="none" stroke-width="2"/>
        </svg>`
    },

    // 场景背景
    backgrounds: {
        home: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="#F5F5F5"/>
            <rect x="0" y="400" width="800" height="200" fill="#DEB887"/>
            <rect x="50" y="100" width="300" height="300" fill="#8B4513"/>
            <rect x="150" y="200" width="80" height="120" fill="#A0522D"/>
            <rect x="500" y="150" width="200" height="250" fill="#8B4513"/>
            <circle cx="200" cy="150" r="30" fill="#FFD700"/>
            <rect x="550" y="200" width="100" height="100" fill="#A0522D"/>
            <path d="M 0 450 L 800 450" stroke="#BC8F8F" stroke-width="2"/>
            <path d="M 0 500 L 800 500" stroke="#BC8F8F" stroke-width="2"/>
            <path d="M 0 550 L 800 550" stroke="#BC8F8F" stroke-width="2"/>
        </svg>`,
        
        office: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="#F0F8FF"/>
            <rect x="0" y="0" width="800" height="20" fill="#B8B8B8"/>
            <rect x="0" y="580" width="800" height="20" fill="#B8B8B8"/>
            <rect x="100" y="100" width="200" height="100" fill="#D3D3D3"/>
            <rect x="400" y="300" width="200" height="100" fill="#D3D3D3"/>
            <path d="M 50 50 Q 70 20 90 50" stroke="#228B22" fill="#90EE90"/>
            <path d="M 750 550 Q 730 520 710 550" stroke="#228B22" fill="#90EE90"/>
            <rect x="0" y="50" width="20" height="500" fill="#87CEEB" opacity="0.5"/>
            <rect x="780" y="50" width="20" height="500" fill="#87CEEB" opacity="0.5"/>
        </svg>`,
        
        park: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="#90EE90"/>
            <circle cx="200" cy="200" r="50" fill="#228B22"/>
            <circle cx="600" cy="300" r="70" fill="#228B22"/>
            <rect x="300" y="400" width="200" height="50" fill="#8B4513"/>
            <path d="M 0 500 Q 400 450 800 500" fill="#DEB887"/>
            <circle cx="150" cy="450" r="10" fill="#FF69B4"/>
            <circle cx="650" cy="150" r="10" fill="#FF69B4"/>
            <circle cx="400" cy="250" r="10" fill="#FF69B4"/>
        </svg>`
    },

    // 游戏元素
    gameElements: {
        toilet: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="60" width="60" height="40" fill="#FFF" rx="5"/>
            <path d="M 30 20 C 30 60 70 60 70 20" fill="#FFF"/>
            <rect x="35" y="0" width="30" height="20" fill="#FFF"/>
            <ellipse cx="50" cy="40" rx="20" ry="15" fill="#E6E6E6"/>
            <rect x="35" y="5" width="30" height="15" fill="#E6E6E6" rx="2"/>
            <circle cx="50" cy="10" r="3" fill="#A9A9A9"/>
        </svg>`,

        coworker: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="35" r="20" fill="#A0522D"/>
            <path d="M 40 55 L 35 90 L 65 90 L 60 55" fill="#2F4F4F"/>
            <rect x="45" y="55" width="10" height="35" fill="#4169E1"/>
            <path d="M 48 55 L 45 70 L 50 90 L 55 70 L 52 55" fill="#DC143C"/>
            <circle cx="43" cy="30" r="4" fill="#000"/>
            <circle cx="57" cy="30" r="4" fill="#000"/>
            <path d="M 43 40 Q 50 45 57 40" stroke="#000" fill="none" stroke-width="2"/>
        </svg>`,

        visitor: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="35" r="20" fill="#DEB887"/>
            <rect x="40" y="55" width="20" height="35" fill="#32CD32"/>
            <path d="M 40 60 Q 50 65 60 60" stroke="#228B22" fill="none" stroke-width="2"/>
            <circle cx="43" cy="30" r="4" fill="#000"/>
            <circle cx="57" cy="30" r="4" fill="#000"/>
            <path d="M 43 40 Q 50 45 57 40" stroke="#000" fill="none" stroke-width="2"/>
            <path d="M 30 25 Q 50 10 70 25" fill="#F4A460"/>
        </svg>`
    },

    // 障碍物
    obstacles: {
        desk: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="40" width="80" height="10" fill="#8B4513"/>
            <rect x="15" y="50" width="10" height="40" fill="#8B4513"/>
            <rect x="75" y="50" width="10" height="40" fill="#8B4513"/>
        </svg>`,

        cabinet: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="70" fill="#DEB887"/>
            <rect x="25" y="25" width="50" height="20" fill="#A0522D"/>
            <rect x="25" y="50" width="50" height="20" fill="#A0522D"/>
            <circle cx="65" cy="35" r="3" fill="#FFD700"/>
            <circle cx="65" cy="60" r="3" fill="#FFD700"/>
        </svg>`,

        tree: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="60" width="20" height="30" fill="#8B4513"/>
            <circle cx="50" cy="40" r="30" fill="#228B22"/>
            <circle cx="30" cy="50" r="20" fill="#228B22"/>
            <circle cx="70" cy="50" r="20" fill="#228B22"/>
        </svg>`,

        bench: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="60" height="10" fill="#8B4513"/>
            <rect x="25" y="50" width="5" height="20" fill="#8B4513"/>
            <rect x="70" y="50" width="5" height="20" fill="#8B4513"/>
            <rect x="15" y="35" width="70" height="5" fill="#A0522D"/>
        </svg>`
    },

    // 初始化所有资源
    init() {
        // 转换所有SVG为Data URL
        for (let type in this.characters) {
            this.characters[type] = this.svgToDataUrl(this.characters[type]);
        }
        for (let type in this.backgrounds) {
            this.backgrounds[type] = this.svgToDataUrl(this.backgrounds[type]);
        }
        for (let type in this.gameElements) {
            this.gameElements[type] = this.svgToDataUrl(this.gameElements[type]);
        }
        for (let type in this.obstacles) {
            this.obstacles[type] = this.svgToDataUrl(this.obstacles[type]);
        }
    }
}; 