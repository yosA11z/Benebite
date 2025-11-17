document.addEventListener("DOMContentLoaded", () => {
    const profile = getStoredProfile();
    if (!profile) {
        window.location.href = "../index.html";
        return;
    }

    renderCalendar(profile);
    renderMonthlyLock(profile);
});

// ------------------------------------
// MENÚ SEMANAL
// ------------------------------------
const weeklyMenu = [
    {
        day: "Lunes",
        meals: [
            { type: "Desayuno", icon: "🍳", description: "Avena suave cocida en agua/leche + banano pequeño", calories: 280 },
            { type: "Media mañana", icon: "🥛", description: "Yogur natural o griego", calories: 120 },
            { type: "Almuerzo", icon: "🍽️", description: "Arroz blanco + pechuga de pollo a la plancha + puré de papa", calories: 520 },
            { type: "Merienda", icon: "🧀", description: "Galletas de soda + queso fresco", calories: 180 },
            { type: "Cena", icon: "🥣", description: "Sopa de verduras + tostada", calories: 250 }
        ]
    },
    {
        day: "Martes",
        meals: [
            { type: "Desayuno", icon: "🍳", description: "Pan integral + huevo revuelto + una fruta suave (papaya)", calories: 320 },
            { type: "Media mañana", icon: "🥤", description: "Batido de leche con avena (suave)", calories: 200 },
            { type: "Almuerzo", icon: "🍝", description: "Pasta con pollo desmenuzado y salsa blanca ligera", calories: 480 },
            { type: "Merienda", icon: "🥜", description: "Fruta picada + puñado pequeño de maní o almendras", calories: 160 },
            { type: "Cena", icon: "🍳", description: "Omelette de queso + jugo natural sin azúcar", calories: 290 }
        ]
    },
    {
        day: "Miércoles",
        meals: [
            { type: "Desayuno", icon: "🥣", description: "Yogur + granola suave", calories: 260 },
            { type: "Media mañana", icon: "🍎", description: "1 fruta (manzana o pera)", calories: 95 },
            { type: "Almuerzo", icon: "🍽️", description: "Puré de papa + carne molida suave + verduras cocidas", calories: 490 },
            { type: "Merienda", icon: "🥪", description: "Sandwich pequeño de queso", calories: 220 },
            { type: "Cena", icon: "🍚", description: "Arroz + atún en agua + verduras", calories: 380 }
        ]
    },
    {
        day: "Jueves",
        meals: [
            { type: "Desayuno", icon: "🥣", description: "Avena + miel + frutos secos (poquitos)", calories: 310 },
            { type: "Media mañana", icon: "🍪", description: "Galletas de avena", calories: 140 },
            { type: "Almuerzo", icon: "🍗", description: "Arroz + pollo al horno + zanahoria cocida", calories: 500 },
            { type: "Merienda", icon: "🥛", description: "Yogur o batido", calories: 150 },
            { type: "Cena", icon: "🥣", description: "Crema de verduras + tostada", calories: 240 }
        ]
    },
    {
        day: "Viernes",
        meals: [
            { type: "Desayuno", icon: "🍞", description: "Pan + queso + una fruta", calories: 290 },
            { type: "Media mañana", icon: "🥤", description: "Yogur bebible", calories: 110 },
            { type: "Almuerzo", icon: "🍝", description: "Pasta con carne molida y verduras", calories: 510 },
            { type: "Merienda", icon: "🥜", description: "Maní, semillas o barrita de cereal", calories: 180 },
            { type: "Cena", icon: "🍚", description: "Arroz + huevo cocido + verduras", calories: 340 }
        ]
    },
    {
        day: "Sábado",
        meals: [
            { type: "Desayuno", icon: "🥤", description: "Smoothie de banano + leche + avena", calories: 300 },
            { type: "Media mañana", icon: "☕", description: "Galletas + té", calories: 120 },
            { type: "Almuerzo", icon: "🍗", description: "Pollo sudado con papa y arroz", calories: 530 },
            { type: "Merienda", icon: "🥛", description: "Yogur + fruta", calories: 140 },
            { type: "Cena", icon: "🍳", description: "Tortilla de huevo + pan", calories: 280 }
        ]
    },
    {
        day: "Domingo",
        meals: [
            { type: "Desayuno", icon: "🥣", description: "Avena + fruta", calories: 270 },
            { type: "Media mañana", icon: "🥛", description: "Yogur", calories: 120 },
            { type: "Almuerzo", icon: "🐟", description: "Arroz + pescado a la plancha + ensalada suave", calories: 480 },
            { type: "Merienda", icon: "🧀", description: "Galletas + queso", calories: 190 },
            { type: "Cena", icon: "🥣", description: "Sopa de pollo con verduras", calories: 300 }
        ]
    }
];

// ------------------------------------
// CALCULAR SEMANA ACTUAL
// ------------------------------------
function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay(); // 0 domingo, 1 lunes...

    // que el lunes sea el primer día
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(today);
    monday.setDate(diff);

    const days = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }

    return days;
}

// ------------------------------------
// RENDER CALENDARIO
// ------------------------------------
function renderCalendar(profile) {
    const container = document.getElementById("weekly-calendar");
    const week = getCurrentWeekDates();
    const today = new Date();

    // SIN el div extra - directo los day-card
    container.innerHTML = week.map((day, index) => dayCard(day, today, index)).join("");
}

function dayCard(date, today, dayIndex) {
    const dayData = weeklyMenu[dayIndex];
    
    // Verificar si es hoy
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();

    return `
    <div class="day-card ${isToday ? 'today' : ''}">
        <div class="day-header">
            <div class="day-name">${dayData.day}</div>
            <div class="day-date">${date.getDate()}</div>
        </div>
        
        <div class="meals-list">
            ${dayData.meals.map(meal => mealSlot(meal)).join('')}
        </div>
    </div>`;
}

function mealSlot(meal) {
    // Determinar la clase según el tipo de comida
    let className = 'breakfast';
    if (meal.type === 'Almuerzo') className = 'lunch';
    else if (meal.type === 'Merienda' || meal.type === 'Media mañana') className = 'snack';
    else if (meal.type === 'Cena') className = 'dinner';

    return `
    <div class="meal-item ${className}">
        <div class="meal-header">
            <span class="meal-icon">${meal.icon}</span>
            <span class="meal-type">${meal.type}</span>
        </div>
        <div class="meal-description">${meal.description}</div>
        <div class="meal-calories">${meal.calories} kcal</div>
    </div>
    `;
}

// ------------------------------------
// BLOQUE DE VISTA MENSUAL
// ------------------------------------
function renderMonthlyLock(profile) {
    const container = document.querySelector('.monthly-lock');

    if (profile.hasPlan) {
        // Renderizar calendario mensual completo
        container.innerHTML = renderMonthlyCalendar();
    } else {
        // Mostrar mensaje de bloqueo
        container.innerHTML = `
            <h3>Vista mensual</h3>
            <p id="monthly-status">🔒 Vista mensual bloqueada. Compra un plan para desbloquearla.</p>
        `;
    }
}

function renderMonthlyCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Día de la semana del primer día (0=Dom, 1=Lun...)
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Ajustar para que Lun=0
    
    const daysInMonth = lastDay.getDate();
    
    let html = `
        <div class="monthly-header">
            <h3>${monthNames[month]} ${year}</h3>
        </div>
        <div class="monthly-grid">
            <div class="month-day-names">
                <div class="month-day-name">Lun</div>
                <div class="month-day-name">Mar</div>
                <div class="month-day-name">Mié</div>
                <div class="month-day-name">Jue</div>
                <div class="month-day-name">Vie</div>
                <div class="month-day-name">Sáb</div>
                <div class="month-day-name">Dom</div>
            </div>
            <div class="month-days-grid">
    `;
    
    // Espacios vacíos antes del primer día
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="month-day empty"></div>';
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.getDate() === today.getDate() && 
                       date.getMonth() === today.getMonth() && 
                       date.getFullYear() === today.getFullYear();
        
        // Obtener el menú del día de la semana correspondiente
        const dayOfWeek = (date.getDay() + 6) % 7; // 0=Lun, 6=Dom
        const dayMenu = weeklyMenu[dayOfWeek];
        
        html += `
            <div class="month-day ${isToday ? 'today' : ''}">
                <div class="month-day-number">${day}</div>
                <div class="month-day-meals">
                    ${dayMenu.meals.slice(0, 3).map(meal => `
                        <div class="month-meal" title="${meal.type}: ${meal.description}">
                            <span class="month-meal-icon">${meal.icon}</span>
                            <span class="month-meal-text">${meal.type}</span>
                        </div>
                    `).join('')}
                    ${dayMenu.meals.length > 3 ? `<div class="month-meal-more">+${dayMenu.meals.length - 3} más</div>` : ''}
                </div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Verificar si existe el botón antes de intentar modificarlo
const monthlyBtn = document.getElementById("monthlyView");
if (monthlyBtn) {
    const profile = getStoredProfile();
    if (profile && !profile.hasPlan) {
        monthlyBtn.disabled = true;
        monthlyBtn.textContent = "Vista mensual (solo con plan)";
    }
}