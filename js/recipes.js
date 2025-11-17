let allRecipes = [];
let profile = null;

document.addEventListener("DOMContentLoaded", () => {
    profile = getStoredProfile();
    if (!profile) return (window.location.href = "../index.html");

    loadRecipes();
    setupEvents();
});

function setupEvents() {
    document.getElementById("searchInput")
        .addEventListener("input", renderRecipes);

    document.getElementById("filterType")
        .addEventListener("change", renderRecipes);
}

async function loadRecipes() {
    try {
        const res = await fetch("../data/sample-recipes.json");
        allRecipes = await res.json();
        renderRecipes();
    } catch (e) {
        console.error("Error cargando recipes.json", e);
    }
}

function renderRecipes() {
    const list = document.getElementById("recipesList");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const filterType = document.getElementById("filterType").value;

    let filtered = allRecipes;

    // filtrar por tipo
    if (filterType !== "all") {
        filtered = filtered.filter(r => r.type === filterType);
    }

    // filtrar por búsqueda
    filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(search) ||
        r.ingredients.some(i => i.toLowerCase().includes(search))
    );

    // filtrar por alergias
    if (profile.allergies && profile.allergies.length > 0) {
        filtered = filtered.filter(r =>
            !r.allergens.some(a => profile.allergies.includes(a))
        );
    }

    list.innerHTML = filtered.map(recipeCard).join("");
}

function recipeCard(r) {
    return `
        <div class="recipe-card">
            <img src="${r.image || '/assets/images/recetas/recetas.jpg'}" alt="${r.title}">
            <div class="recipe-card-content">
                <h3>${r.title}</h3>
                <p><strong>Tipo:</strong> ${r.type}</p>
                <p><strong>Ingredientes:</strong> ${r.ingredients.slice(0, 3).join(", ")}...</p>

                <button onclick="window.location.href='recipe-detail.html?id=${r.id}'">
                    Ver receta
                </button>
            </div>
        </div>
    `;
}
