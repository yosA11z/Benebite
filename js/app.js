document.addEventListener("DOMContentLoaded", () => {
    const profile = JSON.parse(localStorage.getItem("userProfile"));

    

    // Pintar datos en UI
    document.getElementById("welcomeText").textContent =
        `Hola, ${profile.name ?? "usuario"}`;

    document.getElementById("treatmentText").textContent =
        `Tipo de tratamiento: ${profile.treatmentType ?? "No especificado"}`;

    document.getElementById("planText").textContent =
        `Plan actual: ${profile.hasPlan ? "Plus" : "Free"}`;

    // Botón para ir al calendario (todavía no existe, pero ya dejamos link)
    document.getElementById("goCalendar").addEventListener("click", () => {
        window.location.href = "./calendar.html";
    });
});


//Inicio de sesion y manejo de datos//
const supabase = window.supabase.createClient(
  'https://gcxifaihiliitnonaqby.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeGlmYWloaWxpaXRub25hcWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDk1ODAsImV4cCI6MjA3ODkyNTU4MH0.UR7mJ5OcpEVOVEUzjJ8XZiXcScU-ivOK0q7jxBO_a9g'
);

// 🔐 Protección del Dashboard
async function protectRoute() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // No hay sesión → mandar al login
    window.location.href = "/app/login.html";
    return;
  }

  // Si hay sesión → cargar los datos del usuario
  loadUserData(session.user);
}

protectRoute();
