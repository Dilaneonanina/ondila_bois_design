// Menu mobile
document.addEventListener("DOMContentLoaded", () => {
  console.log("Bienvenue sur Ondila Bois & Design !");

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }

  // Charger les images depuis le serveur
  fetch("/api/portfolio")
    .then(res => res.json())
    .then(categories => {
      const portfolio = document.querySelector("#portfolio");

      for (const [categorie, fichiers] of Object.entries(categories)) {
        const section = document.createElement("div");
        section.classList.add("categorie");

        const titre = document.createElement("h3");
        titre.textContent = categorie.charAt(0).toUpperCase() + categorie.slice(1);
        section.appendChild(titre);

        fichiers.forEach(fichier => {
          const img = document.createElement("img");
          img.src = `images/meubles/${categorie}/${fichier}`;
          img.alt = `${categorie} Ondila Bois & Design`;
          img.classList.add("meuble-photo");
          section.appendChild(img);
        });

        portfolio.appendChild(section);
      }
    });

  // Charger les extensions SketchUp
  fetch("/api/extensions")
    .then(res => res.json())
    .then(extensions => {
      const list = document.querySelector("#extensions-list");

      extensions.forEach(file => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `extensions/${file}`;
        link.textContent = `Télécharger ${file}`;
        link.setAttribute("download", file);
        li.appendChild(link);
        list.appendChild(li);
      });
    });
});

// Lightbox avec diaporama
let currentIndex = 0;
let currentCategory = [];
let lightboxOverlay = null;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("meuble-photo")) {
    currentCategory = Array.from(document.querySelectorAll(".meuble-photo"));
    currentIndex = currentCategory.indexOf(e.target);

    lightboxOverlay = document.createElement("div");
    lightboxOverlay.classList.add("lightbox");

    const img = document.createElement("img");
    img.src = e.target.src;
    img.alt = e.target.alt;
    img.classList.add("lightbox-img");

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "×";
    closeBtn.classList.add("close-lightbox");

    const prevBtn = document.createElement("span");
    prevBtn.textContent = "❮";
    prevBtn.classList.add("nav-lightbox", "prev");

    const nextBtn = document.createElement("span");
    nextBtn.textContent = "❯";
    nextBtn.classList.add("nav-lightbox", "next");

    lightboxOverlay.appendChild(img);
    lightboxOverlay.appendChild(closeBtn);
    lightboxOverlay.appendChild(prevBtn);
    lightboxOverlay.appendChild(nextBtn);
    document.body.appendChild(lightboxOverlay);

    closeBtn.addEventListener("click", () => lightboxOverlay.remove());
    lightboxOverlay.addEventListener("click", (event) => {
      if (event.target === lightboxOverlay) lightboxOverlay.remove();
    });

    prevBtn.addEventListener("click", () => navigateLightbox(-1));
    nextBtn.addEventListener("click", () => navigateLightbox(1));
  }
});

function navigateLightbox(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = currentCategory.length - 1;
  if (currentIndex >= currentCategory.length) currentIndex = 0;

  const newImg = currentCategory[currentIndex];
  const lightboxImg = document.querySelector(".lightbox-img");

  lightboxImg.classList.add("fade-out");

  setTimeout(() => {
    lightboxImg.src = newImg.src;
    lightboxImg.alt = newImg.alt;

    lightboxImg.classList.remove("fade-out");
    lightboxImg.classList.add("fade-in");

    setTimeout(() => {
      lightboxImg.classList.remove("fade-in");
    }, 300);
  }, 300);
}

// Navigation clavier
document.addEventListener("keydown", (e) => {
  if (lightboxOverlay) {
    switch (e.key) {
      case "ArrowLeft":
        navigateLightbox(-1);
        break;
      case "ArrowRight":
        navigateLightbox(1);
        break;
      case "Escape":
        lightboxOverlay.remove();
        lightboxOverlay = null;
        break;
    }
  }
});
