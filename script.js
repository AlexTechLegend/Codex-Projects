const scoreDisplay = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const shop = document.getElementById('shop');
const resetBtn = document.getElementById('reset-btn');
const cpsDisplay = document.getElementById('cps');
const achievementList = document.getElementById('achievements');
const prestigeDisplay = document.getElementById('prestige');
const prestigeBtn = document.getElementById('prestige-btn');

let score = 0;
let cps = 0; // coins per second
let prestige = 0;
const PRESTIGE_THRESHOLD = 1000000; // coins needed to prestige

const upgrades = [
    { id: 'cursor', name: 'Cursor', baseCost: 10, cps: 1, quantity: 0 },
    { id: 'grandma', name: 'Grandma', baseCost: 100, cps: 5, quantity: 0 },
    { id: 'farm', name: 'Farm', baseCost: 1000, cps: 50, quantity: 0 },
    { id: 'factory', name: 'Factory', baseCost: 10000, cps: 300, quantity: 0 },
    { id: 'rocket', name: 'Rocket', baseCost: 100000, cps: 1000, quantity: 0 },
    { id: 'lab', name: 'Lab', baseCost: 500000, cps: 5000, quantity: 0 },
    { id: 'portal', name: 'Portal', baseCost: 2500000, cps: 20000, quantity: 0 },
    { id: 'time_machine', name: 'Time Machine', baseCost: 10000000, cps: 100000, quantity: 0 },
    { id: 'galaxy', name: 'Galaxy', baseCost: 100000000, cps: 500000, quantity: 0 },
    { id: 'multiverse', name: 'Multiverse', baseCost: 1000000000, cps: 2000000, quantity: 0 }
];

const achievements = [
    { id: 'first_click', text: 'First Click!', achieved: false, condition: () => score >= 1 },
    { id: 'one_k', text: '1k Coins!', achieved: false, condition: () => score >= 1000 },
    { id: 'first_grandma', text: 'Hire your first Grandma', achieved: false, condition: () => upgrades[1].quantity >= 1 },
    { id: 'million', text: '1 Million Coins!', achieved: false, condition: () => score >= 1000000 },
    { id: 'prestige_1', text: 'Ascend to Prestige', achieved: false, condition: () => prestige >= 1 }
];

function loadGame() {
    const saved = JSON.parse(localStorage.getItem('viral-clicker-save'));
    if (saved) {
        score = saved.score;
        prestige = saved.prestige || 0;
        cps = 0;
        upgrades.forEach(u => {
            const savedUp = saved.upgrades[u.id];
            if (savedUp) {
                u.quantity = savedUp.quantity;
            }
            cps += u.cps * u.quantity;
        });
        if (saved.achievements) {
            achievements.forEach(a => {
                if (saved.achievements[a.id]) {
                    a.achieved = true;
                }
            });
        }
    }
    achievements.forEach(a => {
        if (a.achieved) {
            const li = document.createElement('li');
            li.textContent = a.text;
            achievementList.appendChild(li);
        }
    });
    prestigeDisplay.textContent = prestige;
    prestigeBtn.disabled = score < PRESTIGE_THRESHOLD;
}

function saveGame() {
    const data = {
        score,
        cps,
        prestige,
        upgrades: {},
        achievements: {}
    };
    upgrades.forEach(u => {
        data.upgrades[u.id] = { quantity: u.quantity };
    });
    achievements.forEach(a => {
        data.achievements[a.id] = a.achieved;
    });
    localStorage.setItem('viral-clicker-save', JSON.stringify(data));
}

function updateScoreDisplay() {
    scoreDisplay.textContent = Math.floor(score);
    const totalCps = cps * prestigeMultiplier();
    cpsDisplay.textContent = totalCps.toFixed(1);
    prestigeDisplay.textContent = prestige;
}

function buyUpgrade(index) {
    const up = upgrades[index];
    const cost = up.baseCost * Math.pow(1.15, up.quantity);
    if (score >= cost) {
        score -= cost;
        up.quantity += 1;
        cps += up.cps;
        updateScoreDisplay();
        renderShop();
    }
}

function renderShop() {
    shop.innerHTML = '';
    upgrades.forEach((up, i) => {
        const cost = Math.floor(up.baseCost * Math.pow(1.15, up.quantity));
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `${up.name} (cost: ${cost}, owned: ${up.quantity}, +${up.cps} cps)`;
        const btn = document.createElement('button');
        btn.textContent = 'Buy';
        btn.onclick = () => buyUpgrade(i);
        div.appendChild(btn);
        shop.appendChild(div);
    });
}

function checkAchievements() {
    achievements.forEach(a => {
        if (!a.achieved && a.condition()) {
            a.achieved = true;
            const li = document.createElement('li');
            li.textContent = a.text;
            achievementList.appendChild(li);
        }
    });
}

function prestigeMultiplier() {
    return 1 + prestige * 0.1;
}

function tick() {
    score += (cps * prestigeMultiplier()) / 10; // update every 100ms
    updateScoreDisplay();
    checkAchievements();
    prestigeBtn.disabled = score < PRESTIGE_THRESHOLD;
}

// main
loadGame();
renderShop();
updateScoreDisplay();
checkAchievements();
clickBtn.addEventListener('click', () => {
    score += 1;
    updateScoreDisplay();
    const coin = document.createElement('span');
    coin.className = 'coin';
    coin.textContent = '+1';
    const rect = clickBtn.getBoundingClientRect();
    coin.style.left = rect.left + rect.width / 2 + 'px';
    coin.style.top = rect.top + 'px';
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 1000);
    checkAchievements();
});

prestigeBtn.addEventListener('click', () => {
    if (score >= PRESTIGE_THRESHOLD && confirm('Prestige and reset game?')) {
        prestige += 1;
        score = 0;
        cps = 0;
        upgrades.forEach(u => u.quantity = 0);
        renderShop();
        updateScoreDisplay();
        saveGame();
    }
});

resetBtn.addEventListener('click', () => {
    if (confirm('Reset game?')) {
        localStorage.removeItem('viral-clicker-save');
        score = 0;
        cps = 0;
        upgrades.forEach(u => u.quantity = 0);
        renderShop();
        updateScoreDisplay();
    }
});

setInterval(tick, 100); // tick every 100ms for smoother increments
setInterval(saveGame, 5000); // save game every 5s
