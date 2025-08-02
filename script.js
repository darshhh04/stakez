// PANELS
var myPanel = document.getElementById('myPanel');
var notificationPanel = document.getElementById('notificationPanel');
var contactPanel = document.getElementById('contactPanel');
var walletPanel = document.getElementById('walletPanel');

if(walletPanel) walletPanel.style.display = 'none';

var displayMyPanel = 0;
var displayNotificationPanel = 0;
var displayContactPanel = 0;
var displayWalletPanel = 0;

function show(panel, displayState) {
    if (displayState === 1) {
        panel.style.display = 'block';
        return 0;
    } else {
        panel.style.display = 'none';
        return 1;
    }
}

document.getElementById('user-btn')?.addEventListener('click', function() {
    displayMyPanel = show(myPanel, displayMyPanel);
});

document.getElementById('bell-btn')?.addEventListener('click', function() {
    displayNotificationPanel = show(notificationPanel, displayNotificationPanel);
});

document.getElementById('envelope-btn')?.addEventListener('click', function() {
    displayContactPanel = show(contactPanel, displayContactPanel);
});

document.getElementById('wallet-btn')?.addEventListener('click', function() {
    displayWalletPanel = show(walletPanel, displayWalletPanel);
});

// New buttons in panels
const contactMeBtn = document.getElementById('contact-me-btn');
if(contactMeBtn) {
    contactMeBtn.addEventListener('click', () => {
         window.open('https://www.linkedin.com/in/darshan-bhatarkar-320ab3314/', '_blank');
    });
}

const mailMeBtn = document.getElementById('mail-me-btn');
if(mailMeBtn) {
    mailMeBtn.addEventListener('click', () => {
        window.location.href = 'mailto:darshanbhatarkar04@gmail.com';
    });
}


document.addEventListener('click', function(event) {
    if(myPanel) {
        var isClickInsideMyPanel = myPanel.contains(event.target) || event.target.id === 'user-btn';
        if (!isClickInsideMyPanel) {
            myPanel.style.display = 'none';
            displayMyPanel = 0;
        }
    }
    if(notificationPanel) {
        var isClickInsideNotificationPanel = notificationPanel.contains(event.target) || event.target.id === 'bell-btn';
        if (!isClickInsideNotificationPanel) {
            notificationPanel.style.display = 'none';
            displayNotificationPanel = 0;
        }
    }
    if(contactPanel) {
        var isClickInsideContactPanel = contactPanel.contains(event.target) || event.target.id === 'envelope-btn';
        if (!isClickInsideContactPanel) {
            contactPanel.style.display = 'none';
            displayContactPanel = 0;
        }
    }
    if(walletPanel) {
        var isClickInsideWalletPanel = walletPanel.contains(event.target) || event.target.id === 'wallet-btn' || event.target.closest('.wallet-container');
        if (!isClickInsideWalletPanel) {
            walletPanel.style.display = 'none';
            displayWalletPanel = 0;
        }
    }
});

// Sidebar Toggle
const sidebar = document.querySelector('.sidebar');
const menuButton = document.querySelector('.menu-button');

menuButton?.addEventListener('click', () => {
    sidebar?.classList.toggle('collapsed');
});

sidebar?.addEventListener('click', (event) => {
    if (event.target.closest('a') && !event.target.closest('a').classList.contains('list-header')) {
        event.preventDefault();
        alert('Not accessible');
    }
});


// DEPOSIT & WITHDRAWAL 
const balanceDisplay = document.getElementById('balance');
const walletTabs = document.querySelectorAll('.wallet-tab');
const depositForm = document.getElementById('deposit-form');
const withdrawForm = document.getElementById('withdraw-form');
const depositAmountInput = document.getElementById('deposit-amount-input');
const withdrawAmountInput = document.getElementById('withdraw-amount-input');
const depositSubmitBtn = document.getElementById('deposit-submit-btn');
const withdrawSubmitBtn = document.getElementById('withdraw-submit-btn');

let balance = parseFloat(localStorage.getItem('balance')) || 0;

function updateBalanceDisplay() {
    if(balanceDisplay) balanceDisplay.textContent = '₹' + balance.toFixed(2);
}

function updateLocalStorage() {
    localStorage.setItem('balance', balance);
}

walletTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        walletTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabName = tab.dataset.tab;
        if (tabName === 'deposit') {
            depositForm?.classList.remove('hidden');
            withdrawForm?.classList.add('hidden');
        } else {
            depositForm?.classList.add('hidden');
            withdrawForm?.classList.remove('hidden');
        }
    });
});

depositSubmitBtn?.addEventListener('click', () => {
    const amount = parseFloat(depositAmountInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid deposit amount!");
        return;
    }
    balance += amount;
    updateBalanceDisplay();
    updateLocalStorage();
    depositAmountInput.value = '';
});

withdrawSubmitBtn?.addEventListener('click', () => {
    const amount = parseFloat(withdrawAmountInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid withdrawal amount!");
        return;
    }
    if (amount > balance) {
        alert("Insufficient funds!");
        return;
    }
    balance -= amount;
    updateBalanceDisplay();
    updateLocalStorage();
    withdrawAmountInput.value = '';
});

updateBalanceDisplay(); // Initial display update


//MINES GAME LOGIC
const betAmountInput = document.getElementById('bet-amount-input');
const halfButton = document.getElementById('half-btn');
const doubleButton = document.getElementById('double-btn');
const grid = document.querySelector('.grid');
const cells = Array.from(document.querySelectorAll('.cell'));
const mineCountSelect = document.getElementById('mines-select');
const betButton = document.getElementById('bet-button');
const bettingControls = document.querySelector('.betting-controls');
const profitDisplay = document.getElementById('profit-display');
const cashoutButton = document.getElementById('cashout-btn');

// Modal elements
const settingsModal = document.getElementById('settings-modal');
const resultModal = document.getElementById('result-modal');
const gameSettingsBtn = document.getElementById('game-settings-btn');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const resultCloseBtn = document.getElementById('result-close-btn');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');


let minePositions = [];
let revealedCount = 0;
let gameActive = false;
let betAmount = 0;
let profit = 0;
let gameMode = 'random'; // random, rigWin, rigLoss

function updateBetAmountDisplay(amount) {
    if(betAmountInput) betAmountInput.value = amount.toFixed(2);
}

halfButton?.addEventListener('click', function() {
    var amount = parseFloat(betAmountInput.value) || 0;
    amount = amount / 2;
    updateBetAmountDisplay(amount);
});

doubleButton?.addEventListener('click', function() {
    var amount = parseFloat(betAmountInput.value) || 0;
    amount = amount * 2;
    updateBetAmountDisplay(amount);
});

// Game Settings Modal Logic
gameSettingsBtn?.addEventListener('click', () => {
    settingsModal?.classList.remove('hidden');
});

settingsCloseBtn?.addEventListener('click', () => {
    gameMode = document.querySelector('input[name="gameMode"]:checked').value;
    settingsModal?.classList.add('hidden');
});

// Result Modal Logic
function showResultModal(title, message, isWin) {
    if(resultTitle) resultTitle.textContent = title;
    if(resultMessage) resultMessage.innerHTML = message;
    if(resultTitle) resultTitle.className = isWin ? 'win' : 'loss';
    resultModal?.classList.remove('hidden');
}

resultCloseBtn?.addEventListener('click', () => {
    resultModal?.classList.add('hidden');
});


function placeBet(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid bet amount!");
        return false;
    }
    if (amount > balance) {
        alert("Insufficient funds for placing the bet!");
        return false;
    }
    balance -= amount;
    updateBalanceDisplay();
    updateLocalStorage();
    return true;
}

betButton?.addEventListener('click', () => {
    betAmount = parseFloat(betAmountInput.value);
    if (placeBet(betAmount)) {
        disableGameOptions();
        startGame();
        updateGameControlsVisibility(false);
    }
});

function generateMinePositions(count) {
    const positions = new Set();
    while (positions.size < count) {
        positions.add(Math.floor(Math.random() * cells.length));
    }
    return Array.from(positions);
}

function startGame() {
    const mineCount = parseInt(mineCountSelect.value);
    minePositions = generateMinePositions(mineCount);
    revealedCount = 0;
    profit = 0;
    gameActive = true;

    cells.forEach(cell => {
        cell.classList.remove('mine', 'diamond', 'revealed');
        cell.innerHTML = '';
        cell.style.pointerEvents = 'auto';
        cell.style.backgroundColor = '';
        cell.replaceWith(cell.cloneNode(true));
    });

    const newCells = Array.from(document.querySelectorAll('.cell'));
    cells.length = 0;
    Array.prototype.push.apply(cells, newCells);

    minePositions.forEach(position => {
        cells[position].classList.add('mine');
    });

    cells.forEach((cell, index) => {
        if (!minePositions.includes(index)) {
            cell.classList.add('diamond');
        }
        cell.addEventListener('click', handleCellClick);
    });
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target.closest('.cell');
    if (!cell || cell.classList.contains('revealed')) return;
    
    let isMine = cell.classList.contains('mine');

    // Apply rig logic
    if (gameMode === 'rigWin') {
        if (cell.classList.contains('mine')) {
            const diamondCell = cells.find(c => c.classList.contains('diamond') && !c.classList.contains('revealed'));
            if (diamondCell) {
                const mineIndex = cells.indexOf(cell);
                const diamondIndex = cells.indexOf(diamondCell);
                cell.classList.remove('mine');
                cell.classList.add('diamond');
                diamondCell.classList.remove('diamond');
                diamondCell.classList.add('mine');
                minePositions = minePositions.filter(p => p !== mineIndex);
                minePositions.push(diamondIndex);
            }
        }
        isMine = false;
    } else if (gameMode === 'rigLoss' && revealedCount === 0) {
        if (!cell.classList.contains('mine')) {
            const firstMineIndex = minePositions[0];
            const clickedIndex = cells.indexOf(cell);
            cells[firstMineIndex].classList.remove('mine');
            cells[firstMineIndex].classList.add('diamond');
            cell.classList.remove('diamond');
            cell.classList.add('mine');
            minePositions = minePositions.filter(p => p !== firstMineIndex);
            minePositions.push(clickedIndex);
        }
        isMine = true;
    }

    cell.classList.add('revealed');
    cell.style.pointerEvents = 'none';

    if (isMine) {
        cell.innerHTML = '<img src="ASSETS/mine.png" alt="mine">';
        cell.style.backgroundColor = 'var(--accent-red)';
        endGame(false); // It's a loss
    } else {
        cell.innerHTML = '<img src="ASSETS/diamond.png" alt="diamond">';
        cell.style.backgroundColor = '#071824';
        revealedCount++;
        calculateProfit();
        checkWin();
    }
}

function endGame(isWin, winnings) {
    gameActive = false;
    
    if (isWin) {
        showResultModal('You Won!', `You cashed out with ₹${winnings.toFixed(2)}`, true);
    } else {
        showResultModal('You Lost!', 'You hit a mine.', false);
    }

    cells.forEach((cell, index) => {
        cell.style.pointerEvents = 'none';
        cell.classList.add('revealed');
        if (minePositions.includes(index)) {
            cell.innerHTML = '<img src="ASSETS/mine.png" alt="mine">';
        } else {
            cell.innerHTML = '<img src="ASSETS/diamond.png" alt="diamond">';
        }
    });

    setTimeout(() => {
        enableGameOptions();
        updateGameControlsVisibility(true);
    }, 2000);
}

function checkWin() {
    const mineCount = parseInt(mineCountSelect.value);
    if (revealedCount === cells.length - mineCount) {
        cashOut();
    }
}

function disableGameOptions() {
    if(bettingControls) bettingControls.classList.add('disabled');
}

function enableGameOptions() {
    if(bettingControls) bettingControls.classList.remove('disabled');
}

function calculateProfit() {
    const multiplier = 1.15; 
    if(revealedCount === 1) {
         profit = betAmount * multiplier;
    } else {
         profit = profit * multiplier;
    }
    if(profitDisplay) profitDisplay.textContent = 'Profit: ₹' + profit.toFixed(2);
}

function cashOut() {
    if (profit > 0) {
        const totalWinnings = profit + betAmount; // Correctly include original bet
        balance += totalWinnings;
        updateBalanceDisplay();
        updateLocalStorage();
        endGame(true, totalWinnings);
    }
}

cashoutButton?.addEventListener('click', cashOut);

function updateGameControlsVisibility(showBetButton) {
    if (showBetButton) {
        betButton?.classList.remove('hidden');
        profitDisplay?.classList.add('hidden');
        cashoutButton?.classList.add('hidden');
    } else {
        betButton?.classList.add('hidden');
        profitDisplay?.classList.remove('hidden');
        cashoutButton?.classList.remove('hidden');
    }
}
