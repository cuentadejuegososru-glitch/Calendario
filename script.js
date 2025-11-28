// ============================================
// ⚙️ CONFIGURACIÓN PARA TESTING
// ============================================
const TEST_DATE = new Date('2025-12-15T10:00:00'); // Cambia a new Date('2025-12-15T10:00:00') para testear

// ============================================
// 🔐 CONTRASEÑAS POR DÍA
// ============================================
const passwords = {
    1: "amor",
    2: "besos",
    3: "abrazos",
    4: "juntos",
    5: "siempre",
    6: "tequiero",
    7: "bebe",
    8: "felices",
    9: "pareja",
    10: "forever",
    11: "cariño",
    12: "corazon",
    13: "dulzura",
    14: "bonita",
    15: "preciosa",
    16: "tesoro",
    17: "estrella",
    18: "alegria",
    19: "sonrisa",
    20: "risas",
    21: "aventura",
    22: "suenos",
    23: "magia",
    24: "nochebuena",
    25: "navidad"
};

// ============================================
// 🎁 RECOMPENSAS POR DÍA
// ============================================
const rewards = {
    1: "¡Primer día! Hoy te mereces un abrazo extra largo",
    2: "Te quiero preparar tu desayuno favorito",
    3: "Una sesión de películas con palomitas",
    4: "Te doy un masaje relajante",
    5: "Cena romántica en casa",
    6: "Un paseo por tu lugar favorito",
    7: "¡Una semana completa! Regalo sorpresa",
    8: "Tarde de juegos de mesa y risas",
    9: "Te escribo una carta de amor",
    10: "Karaoke en casa con tus canciones favoritas",
    11: "Sesión de fotos divertidas juntos",
    12: "Picnic en el parque",
    13: "Maratón de tu serie favorita",
    14: "Dos semanas! Salida especial",
    15: "Clase de cocina juntos ",
    16: "Noche de spa en casa",
    17: "Paseo nocturno bajo las estrellas",
    18: "Construimos algo juntos",
    19: "Tarde de repostería",
    20: "Concierto o evento especial",
    21: "¡Última semana! Mini escapada",
    22: "Noche de juegos de video",
    23: "Sesión de baile en casa",
    24: "¡Nochebuena! Regalo especial de Navidad",
    25: "¡FELIZ NAVIDAD! 🎅🎁 El mejor regalo eres tú"
};

const banners = {
    1: "images/day1.png",
    2: "images/day2.png",
    3: "images/day3.png",
    4: "images/day4.png",
    5: "images/day5.png",
    6: "images/day6.png",
    7: "images/day7.png",
    8: "images/day8.png",
    9: "images/day9.png",
    10: "images/day10.png",
    11: "images/day11.png",
    12: "images/day12.png",
    13: "images/day13.png",
    14: "images/day14.png",
    15: "images/day15.png",
    16: "images/day16.png",
    17: "images/day17.png", 
    18: "images/day18.png",
    19: "images/day19.png",
    20: "images/day20.png",
    21: "images/day21.png",
    22: "images/day22.png",
    23: "images/day23.png",
    24: "images/day24.png",
    25: "images/day25.png"
}

const TIMEZONE = 'Europe/Madrid';
const START_DATE = new Date('2025-12-01T00:00:00+01:00');

let openedDays = JSON.parse(localStorage.getItem('openedDays')) || [];
let currentDayToOpen = null;
let countdownIntervals = {};

function getMadridDate() {
    if (TEST_DATE) return new Date(TEST_DATE);
    return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

function getDaysSinceStart() {
    const now = getMadridDate();
    if (now < START_DATE) return 0;
    
    const diffTime = now - START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(diffDays, 25);
}

function getUnlockDate(day) {
    const unlockDate = new Date(START_DATE);
    unlockDate.setDate(unlockDate.getDate() + day - 1);
    return unlockDate;
}

function updateMiniCountdown(day) {
    const now = getMadridDate();
    const unlockDate = getUnlockDate(day);
    const diff = unlockDate - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

function createCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const unlockedDays = getDaysSinceStart();

    // Limpiar intervalos anteriores
    Object.values(countdownIntervals).forEach(interval => clearInterval(interval));
    countdownIntervals = {};

    for (let day = 1; day <= 25; day++) {
        const isUnlocked = day <= unlockedDays;
        const isOpened = openedDays.includes(day);

        const card = document.createElement('div');
        card.className = `day-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        let buttonText = isOpened ? 'Ver de nuevo' : 'Abrir';
        let buttonClass = isOpened ? 'opened' : '';
        if (!isUnlocked) {
            buttonText = 'Cerrado';
            buttonClass = 'locked';
        }

        const countdownHtml = !isUnlocked ? `
            <div class="countdown-mini" id="countdown-${day}">
                <div class="countdown-mini-unit">
                    <span class="countdown-mini-value" id="days-${day}">0</span>
                    <span class="countdown-mini-label">Días</span>
                </div>
                <div class="countdown-mini-unit">
                    <span class="countdown-mini-value" id="hours-${day}">0</span>
                    <span class="countdown-mini-label">Hrs</span>
                </div>
                <div class="countdown-mini-unit">
                    <span class="countdown-mini-value" id="min-${day}">0</span>
                    <span class="countdown-mini-label">Min</span>
                </div>
                <div class="countdown-mini-unit">
                    <span class="countdown-mini-value" id="sec-${day}">0</span>
                    <span class="countdown-mini-label">Sec</span>
                </div>
            </div>
        ` : '';
        
        card.innerHTML = `
            <div class="day-number">Día ${day}</div>
            <div class="gift-container">
                <div class="gift-icon">
                    ${isOpened
                        ? `<img src="images/RegaloRosaAbierto.png" alt="Regalo abierto" class="gift-img opened-img" />`
                        : `<img src="images/RegaloRosa.png" alt="Regalo cerrado" class="gift-img closed-img" />`
                    }
                </div>
            </div>
            ${countdownHtml}
            <button class="open-btn ${buttonClass}" ${!isUnlocked ? 'disabled' : ''} onclick="${isUnlocked ? `openDay(${day})` : ''}">${buttonText}</button>
        `;

        calendar.appendChild(card);

        // Iniciar countdown para días bloqueados
        if (!isUnlocked) {
            countdownIntervals[day] = setInterval(() => {
                const time = updateMiniCountdown(day);
                if (time) {
                    document.getElementById(`days-${day}`).textContent = time.days;
                    document.getElementById(`hours-${day}`).textContent = time.hours;
                    document.getElementById(`min-${day}`).textContent = time.minutes;
                    document.getElementById(`sec-${day}`).textContent = time.seconds;
                } else {
                    createCalendar(); // Recrear cuando se desbloquee
                }
            }, 1000);
            
            // Actualizar inmediatamente
            const time = updateMiniCountdown(day);
            if (time) {
                document.getElementById(`days-${day}`).textContent = time.days;
                document.getElementById(`hours-${day}`).textContent = time.hours;
                document.getElementById(`min-${day}`).textContent = time.minutes;
                document.getElementById(`sec-${day}`).textContent = time.seconds;
            }
        }
    }
}

function openDay(day) {
    currentDayToOpen = day;
    const isOpened = openedDays.includes(day);
    
    document.getElementById('modal-title').textContent = `DÍA ${day}`;
    document.getElementById('reward-title').textContent = `DÍA ${day}`;
    const rewardIconEl = document.getElementById('reward-icon');
    if (rewardIconEl) {
        // Prefer a per-day banner image from the banners object, fall back to built-in image
        const src = banners[day] || 'images/RegaloRosaAbierto.png';
        rewardIconEl.innerHTML = `<img src="${src}" onerror="this.onerror=null;this.src='images/RegaloRosaAbierto.png'" alt="Regalo día ${day}" class="reward-img" />`;
    }
    
    if (isOpened) {
        showReward(day);
    } else {
        document.getElementById('password-view').style.display = 'block';
        document.getElementById('reward-view').style.display = 'none';
        document.getElementById('password-input').value = '';
        document.getElementById('error-message').classList.remove('show');
    }
    
    document.getElementById('modal').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('password-input')?.focus();
    }, 100);
}

function checkPassword() {
    const day = currentDayToOpen;
    const inputPassword = document.getElementById('password-input').value.toLowerCase().trim();
    const correctPassword = passwords[day].toLowerCase();
    
    if (inputPassword === correctPassword) {
        if (!openedDays.includes(day)) {
            openedDays.push(day);
            localStorage.setItem('openedDays', JSON.stringify(openedDays));
            createCalendar();
        }
        showReward(day);
    } else {
        document.getElementById('error-message').classList.add('show');
        document.getElementById('password-input').value = '';
        document.getElementById('password-input').focus();
    }
}

function showReward(day) {
    const message = rewards[day] || `¡Feliz día ${day}! 🎉`;
    // Set reward image in modal (ensure it's shown when reward view opens)
    const rewardIconEl = document.getElementById('reward-icon');
    if (rewardIconEl) {
        const src = banners[day] || 'images/RegaloRosaAbierto.png';
        rewardIconEl.innerHTML = `<img src="${src}" onerror="this.onerror=null;this.src='images/RegaloRosaAbierto.png'" alt="Regalo día ${day}" class="reward-img opened" />`;
    }
    document.getElementById('modal-message').textContent = message;
    document.getElementById('password-view').style.display = 'none';
    document.getElementById('reward-view').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    currentDayToOpen = null;
}

document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
});

document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Inicializar
createCalendar();

// Verificar cada minuto si hay nuevos días desbloqueados
setInterval(() => {
    const newUnlockedDays = getDaysSinceStart();
    const currentCards = document.querySelectorAll('.day-card.unlocked').length;
    if (newUnlockedDays !== currentCards) {
        createCalendar();
    }
}, 60000);
