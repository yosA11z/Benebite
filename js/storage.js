// Guarda cualquier valor JSON
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Lee JSON
function loadFromStorage(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// Perfil
function getStoredProfile() {
    return loadFromStorage("userProfile");
}

function saveStoredProfile(profile) {
    saveToStorage("userProfile", profile);
}
