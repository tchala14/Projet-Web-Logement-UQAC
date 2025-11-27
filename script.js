let logements = [];
let favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));

/* ----------- NAVIGATION ENTRE PAGES ----------- */

function setActivePage(pageId) {
    document
        .querySelectorAll(".page-section")
        .forEach((s) => s.classList.remove("page-active"));
    const section = document.getElementById(pageId);
    if (section) section.classList.add("page-active");

    document
        .querySelectorAll(".main-nav .nav-link")
        .forEach((l) => l.classList.remove("active"));
    document
        .querySelectorAll(`.main-nav .nav-link[data-page="${pageId}"]`)
        .forEach((l) => l.classList.add("active"));
}

function goToLogements() {
    setActivePage("logements");
    document.getElementById("logements").scrollIntoView({ behavior: "smooth" });
}

/* ----------- CHARGEMENT DES DONNÉES ----------- */

async function loadData() {
    try {
        const response = await fetch("data.json");
        logements = await response.json();
        renderListings();
        renderFavorites();
    } catch (error) {
        console.error("Erreur de chargement :", error);
    }
}

/* ----------- FAVORIS ----------- */

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
}

function toggleFavorite(id, event) {
    event.stopPropagation();
    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }
    saveFavorites();
    renderListings();
    renderFavorites();
}

/* ----------- FILTRES ----------- */

function applyFilters() {
    const priceFilter = document.getElementById("price-filter")?.value || "all";
    const distanceFilter =
        document.getElementById("distance-filter")?.value || "all";
    const typeFilter = document.getElementById("type-filter")?.value || "all";
    const furnishedFilter =
        document.getElementById("furnished-filter")?.checked || false;
    const availableFilter =
        document.getElementById("available-filter")?.checked || false;
    const utilitiesFilter =
        document.getElementById("utilities-filter")?.checked || false;

    return logements.filter((logement) => {
        if (priceFilter !== "all") {
            const [min, max] = priceFilter.split("-").map(Number);
            if (logement.price < min || logement.price > max) return false;
        }

        if (distanceFilter !== "all") {
            if (logement.distance > Number(distanceFilter)) return false;
        }

        if (typeFilter !== "all" && logement.type !== typeFilter) return false;

        if (furnishedFilter && !logement.furnished) return false;

        if (availableFilter && logement.available !== "Disponible maintenant")
            return false;

        if (utilitiesFilter && logement.utilities !== "Inclus") return false;

        return true;
    });
}

/* ----------- AFFICHAGE LOGEMENTS ----------- */

function renderListings() {
    const grid = document.getElementById("listings-grid");
    if (!grid) return;

    const filtered = applyFilters();

    if (filtered.length === 0) {
        grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:60px 20px;">
        <div style="font-size:48px; margin-bottom:16px;">😕</div>
        <h3 style="margin-bottom:8px;">Aucun logement trouvé</h3>
        <p style="color:var(--muted);">
          Essayez d'ajuster vos filtres de recherche
        </p>
      </div>`;
        return;
    }

    grid.innerHTML = filtered
        .map(
            (logement) => `
    <div class="listing-card" onclick="showDetail(${logement.id})">
      <div class="listing-image">
        <img src="${logement.image}" alt="${logement.title}" />
        <div class="listing-badge">${logement.type}</div>
        <button class="listing-favorite ${
                favorites.has(logement.id) ? "active" : ""
            }" onclick="toggleFavorite(${logement.id}, event)">
          ${favorites.has(logement.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="listing-body">
        <h3 class="listing-title">${logement.title}</h3>
        <div class="listing-meta">
          <span>📍</span><span>${logement.distance} km de l'UQAC</span>
        </div>
        <div class="listing-price">${logement.price} $/mois</div>
        ${
                logement.available === "Disponible maintenant"
                    ? `<div class="listing-availability">Disponible maintenant</div>`
                    : `<div class="listing-availability" style="background:#fee2e2;color:#b91c1c;">
                 ${logement.available}
               </div>`
            }
        ${
                logement.furnished
                    ? `<div class="listing-availability" style="margin-top:4px;">Meublé</div>`
                    : ""
            }
      </div>
    </div>`
        )
        .join("");
}

/* ----------- AFFICHAGE FAVORIS ----------- */

function renderFavorites() {
    const grid = document.getElementById("favorites-grid");
    if (!grid) return;

    const favArray = logements.filter((l) => favorites.has(l.id));

    if (favArray.length === 0) {
        grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <div style="font-size:48px; margin-bottom:16px;">⭐</div>
        <h3 style="margin-bottom:8px;">Aucun favori pour le moment</h3>
        <p style="color:var(--muted);">
          Ajoutez des logements en cliquant sur le cœur dans la liste.
        </p>
      </div>`;
        return;
    }

    grid.innerHTML = favArray
        .map(
            (logement) => `
    <div class="listing-card" onclick="showDetail(${logement.id})">
      <div class="listing-image">
        <img src="${logement.image}" alt="${logement.title}" />
        <div class="listing-badge">${logement.type}</div>
        <button class="listing-favorite active"
          onclick="toggleFavorite(${logement.id}, event)">
          ♥
        </button>
      </div>
      <div class="listing-body">
        <h3 class="listing-title">${logement.title}</h3>
        <div class="listing-meta">
          <span>📍</span><span>${logement.distance} km de l'UQAC</span>
        </div>
        <div class="listing-price">${logement.price} $/mois</div>
      </div>
    </div>`
        )
        .join("");
}

/* ----------- MODAL DÉTAIL + CONTACT PROPRIÉTAIRE ----------- */

function showDetail(id) {
    const logement = logements.find((l) => l.id === id);
    if (!logement) return;

    const modal = document.getElementById("detail-modal");
    const content = document.getElementById("detail-content");

    const mailto = logement.ownerEmail
        ? `mailto:${logement.ownerEmail}?subject=${encodeURIComponent(
            "Intérêt pour " + logement.title
        )}&body=${encodeURIComponent(
            `Bonjour ${logement.ownerName || ""},

Je suis intéressé(e) par votre logement "${logement.title}" situé au ${logement.address}.
Serait-il possible d'avoir plus d'informations ou de planifier une visite ?

Merci beaucoup.`
        )}`
        : "";

    content.innerHTML = `
    <h2 style="margin-bottom:16px;">${logement.title}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
      ${logement.images
        .map(
            (img) =>
                `<img src="${img}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;" />`
        )
        .join("")}
    </div>
    <div style="display:flex;gap:24px;margin-bottom:24px;flex-wrap:wrap;">
      <div><strong>Prix</strong><br />${logement.price} $/mois</div>
      <div><strong>Type</strong><br />${logement.type}</div>
      <div><strong>Distance</strong><br />${logement.distance} km</div>
      <div><strong>Surface</strong><br />${logement.surface} m²</div>
    </div>
    <p style="margin-bottom:16px;line-height:1.8;">${logement.description}</p>
    <div style="margin-bottom:16px;">
      <strong>Services</strong>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
        ${logement.services
        .map(
            (s) =>
                `<span style="background:var(--bg);padding:6px 12px;border-radius:12px;font-size:13px;">${s}</span>`
        )
        .join("")}
      </div>
    </div>
    <div style="margin-top:24px;">
      <strong>Adresse</strong><br />${logement.address}<br />
      <strong>Disponibilité</strong><br />${logement.available}
    </div>
    <div style="margin-top:24px; display:flex; gap:16px; flex-wrap:wrap;">
      ${
        mailto
            ? `<button class="cta-button" onclick="window.location.href='${mailto}'">
               Contacter le propriétaire
             </button>`
            : ""
    }
      ${
        logement.ownerEmail
            ? `<span style="font-size:13px; color:var(--muted);">
               ${logement.ownerEmail}
             </span>`
            : ""
    }
    </div>
  `;

    modal.classList.remove("hidden");
}

function closeDetail() {
    document.getElementById("detail-modal").classList.add("hidden");
}

/* ----------- FORMULAIRE CONTACT ----------- */

function initContactForm() {
    const form = document.getElementById("contact-form");
    const success = document.getElementById("contact-success");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        form.reset();
        success.classList.remove("hidden");
        setTimeout(() => success.classList.add("hidden"), 4000);
    });
}

/* ----------- INIT GÉNÉRALE ----------- */

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initContactForm();

    document.querySelectorAll("[data-page]").forEach((el) => {
        el.addEventListener("click", (e) => {
            const page = el.getAttribute("data-page");
            if (page) {
                e.preventDefault();
                setActivePage(page);
            }
        });
    });

    [
        "price-filter",
        "distance-filter",
        "type-filter",
        "furnished-filter",
        "available-filter",
        "utilities-filter",
    ].forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("change", () => {
                renderListings();
                renderFavorites();
            });
        }
    });

    document
        .getElementById("detail-modal")
        ?.addEventListener("click", (e) => {
            if (e.target.id === "detail-modal") closeDetail();
        });
});
