document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let isComputerMode = false;
    let scores = { X: 0, O: 0 };

    // DOM elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const pvpBtn = document.getElementById('pvp-btn');
    const pvcBtn = document.getElementById('pvc-btn');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');

    // Winning conditions (indexes of the gameState array)
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Status messages
    const winMessage = () => `Player ${currentPlayer} wins!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

    // Initialize the game
    function initializeGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ["", "", "", "", "", "", "", "", ""];
        status.textContent = currentPlayerTurn();
        
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('x', 'o');
            cell.addEventListener('click', cellClicked, { once: false });
        });
    }

    // Handle cell click
    function cellClicked(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

        // Check if cell is already played or game is inactive
        if (gameState[cellIndex] !== "" || !gameActive) {
            return;
        }

        // Update cell and game state
        handleCellPlayed(cell, cellIndex);
        handleResultValidation();

        // Computer's turn if in computer mode
        if (gameActive && isComputerMode && currentPlayer === 'O') {
            setTimeout(() => {
                computerMove();
            }, 700);
        }
    }

    // Update cell appearance and game state
    function handleCellPlayed(cell, cellIndex) {
        gameState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
    }

    // Check for win or draw
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (
                gameState[a] === "" ||
                gameState[b] === "" ||
                gameState[c] === ""
            ) {
                continue;
            }
            if (
                gameState[a] === gameState[b] &&
                gameState[b] === gameState[c]
            ) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            status.textContent = winMessage();
            gameActive = false;
            // Update score
            scores[currentPlayer]++;
            updateScoreDisplay();
            return;
        }

        // Check for draw
        const roundDraw = !gameState.includes("");
        if (roundDraw) {
            status.textContent = drawMessage();
            gameActive = false;
            return;
        }

        // If game continues, switch player
        changePlayer();
    }

    // Switch current player
    function changePlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = currentPlayerTurn();
    }

    // Computer move logic
    function computerMove() {
        // Basic AI - first look for winning move, then blocking move, then center, then random
        
        // Check for winning move
        const winMove = findBestMove('O');
        if (winMove !== -1) {
            const cell = document.querySelector(`[data-cell-index="${winMove}"]`);
            handleCellPlayed(cell, winMove);
            handleResultValidation();
            return;
        }
        
        // Check for blocking move
        const blockMove = findBestMove('X');
        if (blockMove !== -1) {
            const cell = document.querySelector(`[data-cell-index="${blockMove}"]`);
            handleCellPlayed(cell, blockMove);
            handleResultValidation();
            return;
        }
        
        // Take center if available
        if (gameState[4] === "") {
            const cell = document.querySelector('[data-cell-index="4"]');
            handleCellPlayed(cell, 4);
            handleResultValidation();
            return;
        }
        
        // Take random available move
        const availableMoves = gameState
            .map((value, index) => value === "" ? index : null)
            .filter(value => value !== null);
            
        if (availableMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            const cellIndex = availableMoves[randomIndex];
            const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
            handleCellPlayed(cell, cellIndex);
            handleResultValidation();
        }
    }

    // Find best move for winning or blocking
    function findBestMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            // Check if we can win/block in this line
            if (gameState[a] === player && gameState[b] === player && gameState[c] === "") return c;
            if (gameState[a] === player && gameState[c] === player && gameState[b] === "") return b;
            if (gameState[b] === player && gameState[c] === player && gameState[a] === "") return a;
        }
        return -1;
    }

    // Update score display
    function updateScoreDisplay() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
    }

    // Event listeners for buttons
    resetBtn.addEventListener('click', initializeGame);
    
    newGameBtn.addEventListener('click', () => {
        scores = { X: 0, O: 0 };
        updateScoreDisplay();
        initializeGame();
    });

    pvpBtn.addEventListener('click', () => {
        isComputerMode = false;
        pvpBtn.classList.add('active');
        pvcBtn.classList.remove('active');
        initializeGame();
    });

    pvcBtn.addEventListener('click', () => {
        isComputerMode = true;
        pvcBtn.classList.add('active');
        pvpBtn.classList.remove('active');
        initializeGame();
    });

    // Initialize the game
    initializeGame();
});