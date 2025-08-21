// Variables globales
let currentSlide = 0;
const totalSlides = 9;

// Elementos del DOM
const slidesContainer = document.getElementById('slidesContainer');
const currentSlideSpan = document.getElementById('current-slide');
const totalSlidesSpan = document.getElementById('total-slides');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateSlideDisplay();
    updateNavigation();
    
    // Event listeners para teclado
    document.addEventListener('keydown', handleKeyPress);
    
    // Event listeners para touch/swipe en móviles
    let startX = 0;
    let endX = 0;
    
    slidesContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    slidesContainer.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    // Event listener para scroll horizontal
    document.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            if (e.deltaX > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }
    }, { passive: false });
});

// Función para ir a la siguiente slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlideDisplay();
        updateNavigation();
    }
}

// Función para ir a la slide anterior
function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlideDisplay();
        updateNavigation();
    }
}

// Función para ir a una slide específica
function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateSlideDisplay();
        updateNavigation();
    }
}

// Actualizar la visualización de las slides
function updateSlideDisplay() {
    const translateX = -currentSlide * 100;
    slidesContainer.style.transform = `translateX(${translateX}vw)`;
    
    // Actualizar contador
    currentSlideSpan.textContent = currentSlide + 1;
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Actualizar clases activas en las slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}

// Actualizar navegación (habilitar/deshabilitar botones)
function updateNavigation() {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

// Manejar teclas del teclado
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ': // Barra espaciadora
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
        case 'Escape':
            // Salir de pantalla completa si está activa
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
        case 'f':
        case 'F':
            // Entrar/salir de pantalla completa
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            break;
    }
    
    // Navegación con números (1-9)
    const num = parseInt(e.key);
    if (num >= 1 && num <= totalSlides) {
        e.preventDefault();
        goToSlide(num - 1);
    }
}

// Manejar swipe en dispositivos móviles
function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe izquierda - siguiente slide
            nextSlide();
        } else {
            // Swipe derecha - slide anterior
            previousSlide();
        }
    }
}

// Función para entrar en modo presentación (pantalla completa)
function enterPresentationMode() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

// Auto-avance (opcional - descomentear si se desea)
/*
let autoAdvanceTimer;
const autoAdvanceDelay = 30000; // 30 segundos

function startAutoAdvance() {
    autoAdvanceTimer = setInterval(() => {
        if (currentSlide < totalSlides - 1) {
            nextSlide();
        } else {
            stopAutoAdvance();
        }
    }, autoAdvanceDelay);
}

function stopAutoAdvance() {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
}

// Pausar auto-avance cuando el usuario interactúa
document.addEventListener('click', stopAutoAdvance);
document.addEventListener('keydown', stopAutoAdvance);
document.addEventListener('touchstart', stopAutoAdvance);
*/

// Funciones de utilidad para el presentador
function showSlideNotes() {
    // Esta función podría mostrar notas del presentador en una ventana separada
    console.log('Notas de la slide actual:', currentSlide + 1);
}

// Información de ayuda para el presentador
function showHelp() {
    const helpText = `
    CONTROLES DE PRESENTACIÓN:
    
    Navegación:
    • Flechas ← → : Navegar entre slides
    • Barra espaciadora: Siguiente slide
    • Números 1-9: Ir a slide específica
    • Home: Primera slide
    • End: Última slide
    
    Presentación:
    • F: Pantalla completa
    • Escape: Salir de pantalla completa
    
    Móvil/Tablet:
    • Deslizar izquierda/derecha
    • Tocar indicadores laterales
    `;
    
    alert(helpText);
}

// Mostrar ayuda con Ctrl+H
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        showHelp();
    }
});

// Función para exportar/imprimir (opcional)
function printSlides() {
    window.print();
}

// Inicializar tooltips para los controles
function initTooltips() {
    const tooltips = {
        '.prev-btn': 'Slide anterior (←)',
        '.next-btn': 'Siguiente slide (→ o espacio)',
        '.indicator': 'Ir a slide'
    };
    
    Object.entries(tooltips).forEach(([selector, text]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.title = text;
        });
    });
}

// Llamar a initTooltips cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initTooltips);