// selectors
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('.start-btn'),
    win: document.querySelector('.win'),
    playAgain: document.querySelector('.play-again')
};

// game state
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

// emojis
const emojis = [
    "🍎","🍉","🌮","🍕","🍪","🍩","🍔","🍟",
    "🍰","🍫","🍦","🥐","🍒","🍿","🍓","🍤"
];

// shuffle
const shuffle = array => {
    let cloned = [...array];
    for (let i = cloned.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
};

// generate cards
const generateGame = () => {
    const dimension = 4;
    const needed = (dimension * dimension) / 2;
    const picks = shuffle(emojis).slice(0, needed);
    const items = shuffle([...picks, ...picks]);

    const cardsHTML = `
        <div class="board" data-dimension="${dimension}"
        style="grid-template-columns: repeat(${dimension}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
        </div>
    `;

    const parser = new DOMParser().parseFromString(cardsHTML, "text/html");
    const newBoard = parser.querySelector(".board");

    selectors.board.replaceWith(newBoard);
    selectors.board = newBoard;
};

// start timer
const startGame = () => {
    state.gameStarted = true;
    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.timer.innerText = `Time: ${state.totalTime} sec`;
        selectors.moves.innerText = `Moves: ${state.totalFlips}`;
    }, 1000);
};

// flip back unmatched
const flipBack = () => {
    document.querySelectorAll(".card:not(.matched)").forEach(card =>
        card.classList.remove("flipped")
    );
    state.flippedCards = 0;
};

// flip logic
const flipCard = card => {
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) startGame();

    card.classList.add("flipped");

    if (state.flippedCards === 2) {
        const flipped = document.querySelectorAll(".card.flipped:not(.matched)");

        if (flipped.length === 2) {
            if (flipped[0].innerText === flipped[1].innerText) {
                flipped[0].classList.add("matched");
                flipped[1].classList.add("matched");
            }
            setTimeout(flipBack, 700);
        }
    }

    // Win
    if (document.querySelectorAll(".card:not(.matched)").length === 0) {
    setTimeout(() => {
        selectors.boardContainer.classList.add("flipped");

        document.querySelector(".message").innerHTML = `
            <div style="font-size:34px; color:#046e8f; font-weight:700;">
                🏆✨ YOU WON! ✨🏆
            </div>
            <div style="font-size:22px; margin-top:10px;">
                Amazing job!
            </div>
            <br>
            <span style="font-size:22pt; color:#046e8f;">
                ${state.totalFlips} moves<br>
                ${state.totalTime} sec
            </span>
        `;

        clearInterval(state.loop);
    }, 500);
}

};

const resetGame = () => {
    clearInterval(state.loop);

    state.gameStarted = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;

    selectors.moves.innerText = "Moves: 0";
    selectors.timer.innerText = "Time: 0 sec";

    selectors.boardContainer.classList.remove("flipped");

    generateGame();
};

// event listeners
const attachListeners = () => {
    selectors.boardContainer.addEventListener("click", e => {
        const card = e.target.closest(".card");
        if (card) flipCard(card);
    });

    selectors.start.addEventListener("click", resetGame);
    selectors.playAgain.addEventListener("click", resetGame);
};

generateGame();
attachListeners();

