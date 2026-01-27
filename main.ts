interface Cat {
  id: number;
  image: string;
}

const cats: Cat[] = [
  { id: 1, image: "Images/cat1.jpg" },
  { id: 2, image: "Images/cat2.jpg" },
  { id: 3, image: "images/cat3.jpg" },
  { id: 4, image: "images/cat4.jpg" },
  { id: 5, image: "images/cat5.jpg" },
  { id: 6, image: "images/cat6.jpg" },
  { id: 7, image: "images/cat7.jpg" },
  { id: 8, image: "images/cat8.jpg" },
  { id: 9, image: "images/cat9.jpg" },
  { id: 10, image: "images/cat10.jpg" },
];

const stack = document.getElementById("card-stack")!;
const summary = document.getElementById("summary")!;
const likeCount = document.getElementById("like-count")!;
const likedCatsContainer = document.getElementById("liked-cats")!;

let likedCats: Cat[] = [];

function createCard(cat: Cat) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = cat.image;
  card.appendChild(img);

  let startX = 0;
  let currentX = 0;

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 20}deg)`;
  });

  card.addEventListener("touchend", () => {
    if (currentX > 120) {
      swipeRight(card, cat);
    } else if (currentX < -120) {
      swipeLeft(card);
    } else {
      card.style.transform = "";
    }
  });

  return card;
}

function swipeRight(card: HTMLElement, cat: Cat) {
  card.style.transform = "translateX(1000px)";
  likedCats.push(cat);
  removeCard(card);
}

function swipeLeft(card: HTMLElement) {
  card.style.transform = "translateX(-1000px)";
  removeCard(card);
}

function removeCard(card: HTMLElement) {
  setTimeout(() => {
    card.remove();
    if (stack.children.length === 0) {
      showSummary();
    }
  }, 300);
}

function showSummary() {
  summary.classList.remove("hidden");
  likeCount.textContent = likedCats.length.toString();

  likedCats.forEach(cat => {
    const img = document.createElement("img");
    img.src = cat.image;
    likedCatsContainer.appendChild(img);
  });
}

cats
  .slice()
  .reverse()
  .forEach(cat => {
    const card = createCard(cat);
    stack.appendChild(card);
  });