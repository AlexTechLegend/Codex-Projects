const scoreDisplay = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const shop = document.getElementById('shop');
const resetBtn = document.getElementById('reset-btn');

let score = 0;
let cps = 0; // coins per second

const upgrades = [
    { id: 'cursor', name: 'Cursor', baseCost: 10, cps: 1, quantity: 0 },
    { id: 'grandma', name: 'Grandma', baseCost: 100, cps: 5, quantity: 0 },
    { id: 'farm', name: 'Farm', baseCost: 1000, cps: 50, quantity: 0 }
];

function loadGame() {
    const saved = JSON.parse(localStorage.getItem('viral-clicker-save'));
    if (saved) {
        score = saved.score;
        cps = saved.cps;
        upgrades.forEach(u => {
            const savedUp = saved.upgrades[u.id];
            if (savedUp) {
                u.quantity = savedUp.quantity;
            }
        });
    }
}

function saveGame() {
    const data = {
        score,
        cps,
        upgrades: {}
    };
    upgrades.forEach(u => {
        data.upgrades[u.id] = { quantity: u.quantity };
    });
    localStorage.setItem('viral-clicker-save', JSON.stringify(data));
}

function updateScoreDisplay() {
    scoreDisplay.textContent = Math.floor(score);
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

function tick() {
    score += cps / 10; // update every 100ms
    updateScoreDisplay();
}

// main
loadGame();
renderShop();
updateScoreDisplay();
clickBtn.addEventListener('click', () => {
    score += 1;
    updateScoreDisplay();
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
