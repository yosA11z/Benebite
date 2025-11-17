let profile = null;
let plans = [];

document.addEventListener("DOMContentLoaded", () => {
    profile = getStoredProfile();
    if (!profile) return (window.location.href = "../index.html");

    loadPlans();
});

async function loadPlans() {
    try {
        const res = await fetch("../data/sample-plans.json");
        plans = await res.json();
        renderPlans();
    } catch (err) {
        console.error("Error cargando sample-plans.json", err);
    }
}

function renderPlans() {
    const container = document.getElementById("plansList");

    container.innerHTML = plans.map(p => `
        <div class="plan-card">
            <h3>${p.name}</h3>
            <p class="price">${p.price === 0 ? "Gratis" : "$" + p.price}</p>

            <ul>
                ${p.features.map(f => `<li>${f}</li>`).join("")}
            </ul>

            ${p.price === 0 ? "" : `
                <button onclick="activatePlan(${p.id})" class="btn-primary">
                    Comprar plan
                </button>
            `}
        </div>
    `).join("");
}

function activatePlan(id) {
    const chosen = plans.find(p => p.id === id);
    if (!chosen) return;

    profile.hasPlan = true;
    saveStoredProfile(profile);

    alert("¡Plan activado exitosamente! 🎉");
    window.location.href = "dashboard.html";
}
