// Hardcoded cat images from cataas.com
const catImages = [
    'Images/cat1.jpg',
    'Images/cat2.jpg',
    'Images/cat3.jpg',
    'Images/cat4.png',
    'Images/cat5.jpg',
    'Images/cat6.jpg',
    'Images/cat7.jpg',
    'Images/cat8.jpg',
    'Images/cat9.png',
    'Images/cat10.png'
];

let currentIndex = 0;
let likedCats = [];
let isDragging = false;
let startX = 0;
let currentCard = null;

function init() {
    createCard(currentIndex);
    updateProgress();
}

function createCard(index) {
    if (index >= catImages.length) {
        showResults();
        return;
    }

    const cardStack = document.getElementById('cardStack');
    cardStack.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'cat-card';
    card.innerHTML = `
        <img src="${catImages[index]}" alt="Cat ${index + 1}" class="cat-image">
        <div class="overlay like">LIKE</div>
        <div class="overlay nope">NOPE</div>
    `;

    // Touch events for mobile
    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchmove', handleTouchMove);
    card.addEventListener('touchend', handleTouchEnd);

    // Mouse events for desktop
    card.addEventListener('mousedown', handleMouseDown);

    cardStack.appendChild(card);
    currentCard = card;
}

function handleTouchStart(e) {
    isDragging = true;
    startX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    if (Math.abs(diff) > 20) {
        if (diff > 0) {
            currentCard.classList.add('swiping-right');
            currentCard.classList.remove('swiping-left');
        } else {
            currentCard.classList.add('swiping-left');
            currentCard.classList.remove('swiping-right');
        }
    }
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 100) {
        if (diff > 0) {
            likeCat();
        } else {
            dislikeCat();
        }
    } else {
        currentCard.classList.remove('swiping-right', 'swiping-left');
    }
}

function handleMouseDown(e) {
    isDragging = true;
    startX = e.clientX;

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startX;

        if (Math.abs(diff) > 20) {
            if (diff > 0) {
                currentCard.classList.add('swiping-right');
                currentCard.classList.remove('swiping-left');
            } else {
                currentCard.classList.add('swiping-left');
                currentCard.classList.remove('swiping-right');
            }
        }
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.clientX;
        const diff = endX - startX;

        if (Math.abs(diff) > 100) {
            if (diff > 0) {
                likeCat();
            } else {
                dislikeCat();
            }
        } else {
            currentCard.classList.remove('swiping-right', 'swiping-left');
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

document.getElementById('likeBtn').addEventListener('click', () => {
    likeCat();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    dislikeCat();
});

function likeCat() {
    likedCats.push(catImages[currentIndex]);
    animateCard('right');
}

function dislikeCat() {
    animateCard('left');
}

function animateCard(direction) {
    if (!currentCard) return;

    currentCard.classList.remove('swiping-right', 'swiping-left');
    currentCard.classList.add(direction === 'right' ? 'swipe-right' : 'swipe-left');

    setTimeout(() => {
        currentIndex++;
        updateProgress();
        createCard(currentIndex);
    }, 400);
}

function updateProgress() {
    const progress = (currentIndex / catImages.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function showResults() {
    document.getElementById('swipeSection').style.display = 'none';
    document.getElementById('results').classList.add('active');
    document.getElementById('likedCount').textContent = likedCats.length;

    const container = document.getElementById('likedCatsContainer');
    
    if (likedCats.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <div class="emoji">😿</div>
                <p>You didn't like any cats!</p>
                <p>Maybe try again?</p>
            </div>
        `;
    } else {
        let content = '<div class="scroll-hint">Scroll to see the cats you loved</div>';
        content += '<div class="liked-cats"><div class="cats-grid">';
        likedCats.forEach((cat, index) => {
            content += `
                <div class="result-cat" style="animation-delay: ${index * 0.1}s;">
                    <img src="${cat}" alt="Liked cat">
                </div>
            `;
        });
        content += '</div></div>';
        container.innerHTML = content;
    }
}

function restart() {
    currentIndex = 0;
    likedCats = [];
    document.getElementById('swipeSection').style.display = 'block';
    document.getElementById('results').classList.remove('active');
    init();
}

// Initialize the app
init();