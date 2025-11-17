/**
 * survey.js (no-module)
 * Maneja el formulario de la encuesta inicial.
 * Usa window.Storage (definido en storage.js).
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  if (!form) {
    console.error("No se encontró el formulario #surveyForm");
    return;
  }
  form.addEventListener("submit", handleSurveySubmit);
});

function handleSurveySubmit(event) {
  event.preventDefault();

  const form = event.target;

  // Campos requeridos
  const name = (form.querySelector("#name")?.value || "").trim();
  const dietType = (form.querySelector("#dietType")?.value || "").trim();
  const treatmentType = (form.querySelector("#treatmentType")?.value || "").trim();

  if (!name || !dietType || !treatmentType) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  // Alergias: input[name="allergies"]
  const allergyNodes = form.querySelectorAll('input[name="allergies"]:checked');
  const allergies = Array.from(allergyNodes).map(n => n.value);

  // Si eligió "ninguna", ignorar otras alergias
  if (allergies.includes("ninguna")) {
    // dejamos solo "ninguna"
    const idx = allergies.indexOf("ninguna");
    allergies.splice(0, allergies.length, "ninguna");
  }

  // Preferencias
  const prefNodes = form.querySelectorAll('input[name="preferences"]:checked');
  const preferences = Array.from(prefNodes).map(n => n.value);

  const profile = processSurvey({
    name,
    dietType,
    allergies,
    preferences,
    treatmentType
  });

  // Guardar con wrapper global
  if (window.Storage && typeof window.Storage.save === "function") {
    window.Storage.save("userProfile", profile);
  } else {
    // fallback
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }

  // Redirección relativa (usar sin slash inicial)
  window.location.href = "dashboard.html";
}

/**
 * Crea el perfil que usará la app.
 */
function processSurvey(data) {
  return {
    name: data.name,
    dietType: data.dietType,
    allergies: data.allergies,
    preferences: data.preferences,
    treatmentType: data.treatmentType,
    hasPlan: false,
    creationDate: new Date().toISOString(),
    allowedFoods: buildAllowedFoods(data),
    customRecipes: [],
    chatHistory: { psicologia: [], nutricion: [] }
  };
}

function buildAllowedFoods(data) {
  const baseFoods = [
    "pollo", "carne", "pescado", "huevos",
    "arroz", "pasta", "frutas", "verduras",
    "frutos secos", "lácteos", "gluten"
  ];

  // Si marcó "ninguna" → no filtrar nada
  if (Array.isArray(data.allergies) && data.allergies.includes("ninguna")) {
    return baseFoods;
  }

  const forbidden = data.allergies || [];
  return baseFoods.filter(food => !forbidden.includes(food));
}
