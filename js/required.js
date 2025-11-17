// required.js

const submitBtn = document.querySelector('button[type="submit"]');
const allergyCheckboxes = document.querySelectorAll('input[name="allergies"]');
const prefCheckboxes = document.querySelectorAll('input[name="preferences"]');

// Crear los mensajes de error dinámicamente debajo de cada grupo
function createErrorMessage(el, id, text) {
  let msg = document.createElement('span');
  msg.id = id;
  msg.className = 'error-message';
  msg.textContent = text;
  msg.style.color = '#dc2626';
  msg.style.fontSize = '0.95rem';
  msg.style.marginTop = '6px';
  msg.style.display = 'block';
  msg.style.opacity = '0';
  el.appendChild(msg);
  return msg;
}

const allergyGroup = allergyCheckboxes[0].closest('.form-section');
const prefGroup = prefCheckboxes[0].closest('.form-section');

const allergyError = createErrorMessage(allergyGroup, 'allergies-error', 'Por favor selecciona al menos una alergia.');
const prefError = createErrorMessage(prefGroup, 'preferences-error', 'Por favor selecciona al menos una preferencia.');

// Función que valida los checkboxes
function validateCheckboxes() {
  const allergyChecked = Array.from(allergyCheckboxes).some(chk => chk.checked);
  const prefChecked = Array.from(prefCheckboxes).some(chk => chk.checked);

  allergyError.style.opacity = allergyChecked ? '0' : '1';
  prefError.style.opacity = prefChecked ? '0' : '1';

  submitBtn.disabled = !(allergyChecked && prefChecked);
}

// Inicializamos al cargar la página
validateCheckboxes();

// Escuchamos cambios en todos los checkboxes
[...allergyCheckboxes, ...prefCheckboxes].forEach(chk => {
  chk.addEventListener('change', validateCheckboxes);
});
