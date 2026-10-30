/* ---------- Dark / Light toggle ---------- */
const toggle = document.getElementById("darkToggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggle.innerHTML = document.body.classList.contains("dark-mode")
      ? '<i class="fa-solid fa-moon"></i> Dark Mode'
      : '<i class="fa-solid fa-sun"></i> Light Mode';
  });
}

/* ---------- Typing effect ---------- */
const typingText = "ivil Engineer · Construction Administrative Assistant";
const typingSpan = document.querySelector(".sub.role .typing");
let typingIndex = 0;
function typeWriter() {
  if (!typingSpan) return;
  if (typingIndex < typingText.length) {
    typingSpan.textContent += typingText.charAt(typingIndex++);
    setTimeout(typeWriter, 100);
  } else {
    setTimeout(() => {
      typingSpan.textContent = "";
      typingIndex = 0;
      typeWriter();
    }, 1500);
  }
}
if (typingSpan) setTimeout(typeWriter, 500);

/* ---------- Auto-scrolling image strips + click-to-expand ---------- */
let isGalleryLightboxOpen = false;
const galleryLightbox = document.createElement("div");
galleryLightbox.className = "gallery-lightbox";
galleryLightbox.id = "galleryLightbox";
galleryLightbox.setAttribute("aria-hidden", "true");
galleryLightbox.innerHTML = `
  <div class="gallery-lightbox-backdrop" data-gallery-close></div>
  <div class="gallery-lightbox-panel" role="dialog" aria-modal="true" aria-label="Expanded gallery image">
    <button class="gallery-lightbox-close" type="button" aria-label="Close expanded image" data-gallery-close>&times;</button>
    <img class="gallery-lightbox-image" alt="Expanded gallery image">
  </div>`;
document.body.appendChild(galleryLightbox);
const lightboxImage = galleryLightbox.querySelector(".gallery-lightbox-image");

function openGalleryLightbox(img) {
  if (!img) return;
  lightboxImage.src = img.currentSrc || img.src;
  lightboxImage.alt = img.alt || "Expanded gallery image";
  isGalleryLightboxOpen = true;
  galleryLightbox.classList.add("active");
  galleryLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("gallery-lightbox-open");
  galleryLightbox.querySelector(".gallery-lightbox-close").focus();
}
function closeGalleryLightbox() {
  if (!galleryLightbox.classList.contains("active")) return;
  galleryLightbox.classList.remove("active");
  galleryLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("gallery-lightbox-open");
  isGalleryLightboxOpen = false;
  lightboxImage.removeAttribute("src");
}
galleryLightbox.addEventListener("click", event => {
  if (event.target.closest("[data-gallery-close]")) closeGalleryLightbox();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeGalleryLightbox();
});

function startStrip(listId, images, direction, speed) {
  const list = document.getElementById(listId);
  if (!list) return;

  if (!list.dataset.galleryInitialized) {
    for (let copy = 0; copy < 2; copy++) {
      images.forEach((src, index) => {
        const card = document.createElement("div");
        card.className = "image-card";
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Gallery image ${index + 1}`;
        img.loading = "lazy";
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", `Expand gallery image ${index + 1}`);
        card.appendChild(img);
        list.appendChild(card);
      });
    }
    list.dataset.galleryInitialized = "true";
  }

  list.addEventListener("click", event => {
    const img = event.target.closest("img");
    if (img) openGalleryLightbox(img);
  });
  list.addEventListener("keydown", event => {
    const img = event.target.closest("img");
    if (img && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openGalleryLightbox(img);
    }
  });

  const half = () => list.scrollWidth / 2;
  if (direction === "right") list.scrollLeft = half();
  setInterval(() => {
    // Both strips freeze while the expanded image is displayed.
    if (isGalleryLightboxOpen) return;
    if (direction === "left") {
      list.scrollLeft += speed;
      if (list.scrollLeft >= half()) list.scrollLeft = 0;
    } else {
      list.scrollLeft -= speed;
      if (list.scrollLeft <= 0) list.scrollLeft = half();
    }
  }, 20);
}

startStrip("image-list", [
  "img/gallery/g1.jpg", "img/gallery/g2.jpg", "img/gallery/g3.jpg", "img/gallery/g4.jpg",
  "img/gallery/g5.jpg", "img/gallery/g6.jpg", "img/gallery/g7.jpg", "img/gallery/g8.jpg",
  "img/gallery/g9.jpg", "img/gallery/g10.jpg"
], "left", 1);
startStrip("image-list-2", [
  "img/gallery2/h1.jpg", "img/gallery2/h2.jpg", "img/gallery2/h3.jpg", "img/gallery2/h4.jpg",
  "img/gallery2/h5.jpg", "img/gallery2/h6.jpg", "img/gallery2/h7.jpg", "img/gallery2/h8.jpg",
  "img/gallery2/h9.jpg", "img/gallery2/h10.jpg", "img/gallery2/h11.jpg", "img/gallery2/h12.jpg",
  "img/gallery2/h13.jpg", "img/gallery2/h14.jpg", "img/gallery2/h15.jpg", "img/gallery2/h16.jpg"
], "right", 1);

/* ---------- Existing project details popup ---------- */
function toggleProject(project) { project.classList.toggle("expanded"); }
const projectModal = document.getElementById("projectModal");
const projectModalBody = document.getElementById("projectModalBody");
function openProject(project) {
  if (!projectModal || !projectModalBody) return;
  const details = project.querySelector(".project-modal-content");
  if (!details) return;
  projectModalBody.innerHTML = details.innerHTML;
  projectModal.classList.add("active");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("project-modal-open");
  const title = projectModalBody.querySelector("h2");
  if (title) title.id = "projectModalTitle";
  projectModal.querySelector(".project-modal-close")?.focus();
}
function closeProject() {
  if (!projectModal) return;
  projectModal.classList.remove("active");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("project-modal-open");
}
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && projectModal?.classList.contains("active")) closeProject();
});
