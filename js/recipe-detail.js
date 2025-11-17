let recipeData = null;

document.addEventListener("DOMContentLoaded", () => {
    loadRecipe();
});

function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}

async function loadRecipe() {
    try {
        const res = await fetch("../data/sample-recipes.json");
        const allRecipes = await res.json();

        const id = getIdFromURL();
        recipeData = allRecipes.find(r => r.id === id);

        if (!recipeData) {
            document.getElementById("recipeContent").innerHTML =
                "<p>No se encontró la receta.</p>";
            return;
        }

        renderRecipe();
    } catch (e) {
        console.error("Error cargando receta", e);
    }
}

function renderRecipe() {
    document.getElementById("recipeTitle").textContent = recipeData.title;

    document.getElementById("recipeContent").innerHTML = `
    <img src="../assets/images/recetas/${recipeData.image || "recetaalabestia.webp"}"
         class="recipe-cover">

    <div class="recipe-meta">
        <div class="meta-box">
            <span>Tiempo</span>
            <strong>${recipeData.time || "20 min"}</strong>
        </div>

        <div class="meta-box">
            <span>Dificultad</span>
            <strong>${recipeData.difficulty || "fácil"}</strong>
        </div>

        <div class="meta-box">
            <span>Porciones</span>
            <strong>${recipeData.servings || "Cuatro"}</strong>
        </div>
    </div>

    <h3>Ingredientes</h3>
    <div class="ingredients-list">
        <ul>
            ${recipeData.ingredients.map(i => `<li><span>${i}</span></li>`).join("")}
        </ul>
    </div>

    <h3>Instrucciones</h3>
    <div class="instructions">
        ${recipeData.instructions
            .split(". ")
            .map((step, i) => step.trim() ? `
                <div class="step">
                    <div class="step-number">${i + 1}</div>
                    <p>${step}.</p>
                </div>
            ` : "")
            .join("")}
    </div>

    <h3>Alergias</h3>
    <div class="allergies">
        ${recipeData.allergens.length ? recipeData.allergens.join(", ") : "Ninguna"}
    </div>
`;

}

