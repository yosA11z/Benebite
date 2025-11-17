/**
 * chat.js
 * Chat placeholder para psicología / nutricionista.
 * Guarda conversaciones dentro de profile.chatHistory.{psicologia|nutricion}
 * Usa: getStoredProfile(), saveStoredProfile(profile)
 */

document.addEventListener("DOMContentLoaded", () => {
  // elementos
  const chatBody = document.getElementById("chatBody");
  const input = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const btnPsico = document.getElementById("btnPsicologia");
  const btnNutri = document.getElementById("btnNutricion");
  const btnCita = document.getElementById("btnCita");
  const btnClear = document.getElementById("btnClear");
  const titleEl = document.getElementById("chatTitle");
  const typeChoose = document.getElementById("typeChoose");

  // obtener perfil
  let profile = getStoredProfile();
  if (!profile) {
    window.location.href = "../index.html";
    return;
  }

  // determinar tipo por URL ?type=psicologia|nutricion
  const params = new URLSearchParams(window.location.search);
  let chatType = (params.get("type") || "").toLowerCase(); // 'psicologia' | 'nutricion'

  // si no existe la estructura, crearla
  if (!profile.chatHistory) {
    profile.chatHistory = { psicologia: [], nutricion: [] };
    saveStoredProfile(profile);
  } else {
    // asegurar campos
    profile.chatHistory.psicologia = profile.chatHistory.psicologia || [];
    profile.chatHistory.nutricion = profile.chatHistory.nutricion || [];
  }

  // si no se pasó tipo por URL, dejamos control visible para elegir
  if (!chatType) {
    typeChoose.style.display = "flex";
    titleEl.textContent = "Chat — Elige canal";
  } else {
    typeChoose.style.display = "none";
    titleEl.textContent = chatTitleFor(chatType);
  }

  // click handlers para elegir canal
  btnPsico.addEventListener("click", () => {
    chatType = "psicologia";
    typeChoose.style.display = "none";
    titleEl.textContent = chatTitleFor(chatType);
    renderConversation();
  });

  btnNutri.addEventListener("click", () => {
    chatType = "nutricion";
    typeChoose.style.display = "none";
    titleEl.textContent = chatTitleFor(chatType);
    renderConversation();
  });

  // separa cita -> envía un mensaje inicial al chat y abre UI
  btnCita.addEventListener("click", () => {
    if (!chatType) {
      alert("Primero selecciona el tipo de chat (Psicología o Nutrición).");
      return;
    }
    // crear mensaje automático que solicita cita
    const msg = {
      id: makeId(),
      sender: "user",
      text: "Quisiera separar una cita, por favor.",
      ts: new Date().toISOString()
    };
    pushMessage(chatType, msg);
    // after storing, simulate bot response about next steps
    simulateBotResponse(chatType, "clinicacion");
  });

  // limpiar conversación (confirm)
  btnClear.addEventListener("click", () => {
    if (!chatType) return alert("Selecciona un chat primero.");
    if (!confirm("¿Borrar toda la conversación local para este canal?")) return;
    profile.chatHistory[chatType] = [];
    saveStoredProfile(profile);
    renderConversation();
  });

  // enviar mensaje
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // render inicial (si el tipo ya viene)
  if (chatType) renderConversation();

  // -------------- funciones --------------

  function sendMessage() {
    if (!chatType) return alert("Selecciona un chat (psicología o nutrición) primero.");
    const text = (input.value || "").trim();
    if (!text) return;
    const msg = { id: makeId(), sender: "user", text, ts: new Date().toISOString() };
    pushMessage(chatType, msg);
    input.value = "";
    // simular respuesta automática
    simulateBotResponse(chatType);
  }

  function pushMessage(type, msg) {
    profile.chatHistory[type].push(msg);
    saveStoredProfile(profile);
    renderConversation();
  }

  function renderConversation() {
    if (!chatType) return;
    const convo = profile.chatHistory[chatType] || [];
    chatBody.innerHTML = convo.map(m => renderMessage(m)).join("");
    // desplazar al final
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderMessage(m) {
    const time = new Date(m.ts).toLocaleString();
    const cls = m.sender === "user" ? "msg user" : "msg bot";
    // si bot tiene type-specific small label
    const label = m.sender === "bot" ? `<span class="small">Asistente</span>` : "";
    return `<div class="${cls}"><div>${escapeHtml(m.text)}</div><span class="meta">${label} · ${time}</span></div>`;
  }

  // Simulador de respuestas según tipo (respuestas predefinidas simples)
  function simulateBotResponse(type, mode) {
    // respuestas por tipo
    const psMessages = [
      "Gracias por escribir. ¿Quieres contarme cómo te has sentido esta semana?",
      "Si necesitas una cita con urgencia, por favor selecciona 'Separar cita'.",
      "Recuerda: la comunicación con tu terapeuta es segura — este chat es solo una demo."
    ];
    const nutMessages = [
      "Hola — ¿Qué objetivos tienes con tu alimentación?",
      "Puedo sugerir recetas y ajustes simples. ¿Prefieres bajar, mantener o ganar peso?",
      "Recuerda consultar con tu nutricionista para planes especializados."
    ];

    // modo 'clinicacion' es respuesta para separar cita
    let text;
    if (mode === "clinicacion") {
      if (type === "psicologia") text = "Hemos recibido tu solicitud de cita. Un coordinador se comunicará contigo (esto es una simulación).";
      else text = "Solicitud de cita recibida. Un nutricionista te contactará (simulación).";
    } else {
      const pool = type === "psicologia" ? psMessages : nutMessages;
      // elegir aleatorio
      text = pool[Math.floor(Math.random() * pool.length)];
    }

    // simular retraso humano
    setTimeout(() => {
      const botMsg = { id: makeId(), sender: "bot", text, ts: new Date().toISOString() };
      profile.chatHistory[type].push(botMsg);
      saveStoredProfile(profile);
      renderConversation();
    }, 700 + Math.floor(Math.random() * 900)); // 700-1600ms
  }

  function chatTitleFor(type) {
    if (type === "psicologia") return "Chat — Psicología";
    if (type === "nutricion") return "Chat — Nutricionista";
    return "Chat";
  }

  // small utilities
  function makeId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function escapeHtml(unsafe) {
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

});
