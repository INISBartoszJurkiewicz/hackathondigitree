// ===========================================
// COUNTDOWN TIMER
// ===========================================
const targetDate = new Date('2026-02-20T08:00:00');

const countdown = () => {
  const el = document.getElementById('countdown');
  if (!el) return;
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    el.textContent = 'Startujemy teraz';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

setInterval(countdown, 1000);
countdown();

// ===========================================
// TWO-STEP REGISTRATION FLOW
// ===========================================
const registrationCards = document.querySelectorAll('.registration-card');
const cardsStep = document.getElementById('registration-cards');
const formStep = document.getElementById('registration-form-step');
const backButton = document.getElementById('back-to-cards');
const selectedCardContainer = document.getElementById('selected-card-container');
const allFormFields = document.querySelectorAll('[data-field]');

// Store selected type
let selectedType = null;

// Show form step with selected card
const showFormStep = (type) => {
  selectedType = type;

  // Get the clicked card and clone it
  const originalCard = document.querySelector(`.registration-card[data-type="${type}"]`);
  const clonedCard = originalCard.cloneNode(true);

  // Add active state to cloned card
  clonedCard.classList.add('active');

  // Clear and populate the selected card container  
  selectedCardContainer.innerHTML = '';
  selectedCardContainer.appendChild(clonedCard);

  // Show/hide relevant form fields
  allFormFields.forEach(field => {
    const fieldTypes = field.dataset.field.split(' ');
    if (fieldTypes.includes(type)) {
      field.classList.remove('hidden');
    } else {
      field.classList.add('hidden');
    }
  });

  // Switch steps with animation
  cardsStep.classList.remove('active');
  setTimeout(() => {
    formStep.classList.add('active');
  }, 50);
};

// Show cards step (back)
const showCardsStep = () => {
  formStep.classList.remove('active');
  setTimeout(() => {
    cardsStep.classList.add('active');
  }, 50);
  selectedType = null;
  selectedCardContainer.innerHTML = '';
};

// Add click handlers to registration cards
registrationCards.forEach(card => {
  card.addEventListener('click', () => {
    showFormStep(card.dataset.type);
  });
});

// Back button handler
if (backButton) {
  backButton.addEventListener('click', showCardsStep);
}

// ===========================================
// ORIGIN BUTTON EFFECT - Mouse Tracking
// ===========================================
const initOriginButtons = () => {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mouse-x', `${x}%`);
      btn.style.setProperty('--mouse-y', `${y}%`);
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--mouse-x', '50%');
      btn.style.setProperty('--mouse-y', '50%');
    });
  });
};

initOriginButtons();

// ===========================================
// CARD HOVER EFFECTS - Mouse Tracking
// ===========================================
const initCardHoverEffects = () => {
  const cards = document.querySelectorAll('.registration-card, .segment');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
};

initCardHoverEffects();

// ===========================================
// 3D FLIP CARD TILT EFFECT
// ===========================================
const initFlipCardTilt = () => {
  const flipCards = document.querySelectorAll('.flip-card[data-tilt]');

  flipCards.forEach(card => {
    const inner = card.querySelector('.flip-card__inner');
    const front = card.querySelector('.flip-card__front');
    const back = card.querySelector('.flip-card__back');

    let isFlipped = false;
    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) return; // Throttle with rAF

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate tilt based on mouse position relative to center
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Convert to rotation angles (max ±15 degrees)
        const rotateX = (mouseY / (rect.height / 2)) * -8;
        const rotateY = (mouseX / (rect.width / 2)) * 8;

        // Apply tilt + flip if needed (vertical flip = rotateX)
        const flipRotation = isFlipped ? 180 : 0;
        inner.style.transform = `rotateX(${flipRotation + rotateX}deg) rotateY(${rotateY}deg)`;

        // Move border glow to follow cursor
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', `${percentX}%`);
        card.style.setProperty('--glow-y', `${percentY}%`);

        rafId = null;
      });
    };

    const handleMouseEnter = () => {
      card.classList.add('is-tilting');
      isFlipped = true;
    };

    const handleMouseLeave = () => {
      card.classList.remove('is-tilting');
      isFlipped = false;
      // Reset to original position with smooth transition
      inner.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)';

      // Reset transition after animation
      setTimeout(() => {
        if (!card.classList.contains('is-tilting')) {
          inner.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
      }, 500);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
};

initFlipCardTilt();

// ===========================================
// FAQ ACCORDION
// ===========================================
const accordionItems = document.querySelectorAll('.accordion__item');
accordionItems.forEach(item => {
  const trigger = item.querySelector('.accordion__trigger');
  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    accordionItems.forEach(i => i.classList.remove('is-open'));
    if (!isOpen) item.classList.add('is-open');
  });
});

// ===========================================
// REVEAL ANIMATIONS
// ===========================================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.2 });
for (const el of reveals) observer.observe(el);

// ===========================================
// ROTATING LOGO
// ===========================================
const rotatingLogo = document.querySelector('.hero__logo');
let latestScroll = window.scrollY;
let ticking = false;
const baseRotation = -50;
const rotX = 18;
const rotY = -22;
const scale = 1.1;

const updateLogoRotation = () => {
  if (!rotatingLogo) return;
  const rotationZ = baseRotation + latestScroll * 0.03;
  rotatingLogo.style.transform = `translateY(-50%) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotationZ}deg) scale(${scale})`;
  ticking = false;
};

window.addEventListener('scroll', () => {
  latestScroll = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateLogoRotation);
    ticking = true;
  }
});

updateLogoRotation();

// ===========================================
// GSAP STACKING PAGES ANIMATION
// ===========================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const pages = document.querySelectorAll('.stacking-page');

  pages.forEach((page, index) => {
    // Skip the last page - nothing covers it
    if (index === pages.length - 1) return;

    gsap.to(page, {
      scale: 0.9,
      filter: 'blur(6px)',
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: pages[index + 1],
        start: 'top bottom',
        end: 'top top',
        scrub: 0.5,
      }
    });
  });
} else {
  console.warn('GSAP or ScrollTrigger not found. Stacking effects disabled.');
}

// ===========================================
// NESTED PARALLAX LOGIC
// ===========================================
const updateStackingOffsets = () => {
  const sections = document.querySelectorAll('.stacking-page');
  const winHeight = window.innerHeight;

  sections.forEach(section => {
    // Reset height to auto first to get true content height
    section.style.minHeight = '100vh';

    // Multiply by 1.4 as requested to give "more time" for internal scrolling
    const contentHeight = section.scrollHeight * 1.4;

    // Calculate negative offset:
    // If content is taller than viewport (e.g. 1500px vs 1000px),
    // we want to stick at Top = -(1500 - 1000) = -500px.
    // This allows the section to scroll until its bottom aligns with viewport bottom.
    // Then it sticks, and the next section covers it.
    let offset = 0;
    if (contentHeight > winHeight) {
      offset = -(contentHeight - winHeight);
    }

    section.style.setProperty('--stack-top', `${offset}px`);
  });
};

// Run on load, resize, and periodically (for dynamic content)
window.addEventListener('load', updateStackingOffsets);
window.addEventListener('resize', () => {
  requestAnimationFrame(updateStackingOffsets);
});

// Create ResizeObserver for dynamic content changes
const resizeObserver = new ResizeObserver(() => {
  requestAnimationFrame(updateStackingOffsets);
});

document.querySelectorAll('.stacking-page').forEach(el => {
  resizeObserver.observe(el);
});

// Initial call
updateStackingOffsets();

// ===========================================
// FORM SUBMISSION HANDLER
// ===========================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKQ0gr3pXqvV3_A1r3Rg75aft0PDDhA3cMgn7mLPW-8eK_wFGCP5pb-qGTmSWET99I/exec"; // <--- WKLEJ TUTAJ LINK DO SWOJEGO SKRYPTU

const registrationForm = document.getElementById('registrationForm');
const successModal = document.getElementById('successModal');
const submitBtn = registrationForm ? registrationForm.querySelector('button[type="submit"]') : null;

// Modal functions
window.closeModal = () => {
  if (successModal) successModal.classList.remove('active');
  showCardsStep(); // Return to start
};

const showModal = () => {
  if (successModal) successModal.classList.add('active');
};

if (registrationForm) {
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedType) {
      alert("Wybierz typ zgłoszenia!");
      return;
    }

    if (SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
      alert("Skonfiguruj poprawnie adres URL skryptu w pliku script.js!");
      console.error("Missing Script URL");
      return;
    }

    // Visual feedback
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn__text">Wysyłanie...</span>';
    submitBtn.classList.add('loading'); // Optional styling hook
    submitBtn.disabled = true;

    const formData = new FormData(registrationForm);
    const data = {
      type: selectedType,
      name: formData.get('name'),
      email: formData.get('email'),
      honeypot: formData.get('confirm_email_address') // Honeypot field
    };

    // Add specific fields based on type
    if (selectedType === 'team') {
      data.teamMembers = formData.get('teamMembers');
      data.idea = formData.get('ideaTeam');
      data.segment = formData.get('segmentTeam');
    } else if (selectedType === 'individual') {
      data.idea = formData.get('ideaIndividual');
      data.segment = formData.get('segmentIndividual');
    } else if (selectedType === 'creator') {
      data.skills = formData.get('skills');
    }

    console.log("Sending data:", data);

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script Web App
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        // With no-cors, we get an opaque response, so we assume success if it didn't throw
        console.log("Request sent");
        showModal();
        registrationForm.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie.');
      })
      .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      });
  });
}

// ===========================================
// PRIZES SECTION LOGIC
// ===========================================
const initPrizesRotation = () => {
  const listItems = document.querySelectorAll('.prize-item');
  const images = document.querySelectorAll('.prizes-visual__image');

  if (listItems.length === 0 || images.length === 0) return;

  let currentIndex = 0;
  let currentTween = null;
  const ROTATION_DURATION = 10; // 10 seconds

  // Function to switch to a specific prize
  const setActivePrize = (index) => {
    // Kill existing animation
    if (currentTween) currentTween.kill();

    // Wrap index logic
    if (index >= listItems.length) index = 0;
    if (index < 0) index = listItems.length - 1;

    currentIndex = index;

    // 1. Reset all items and bars
    listItems.forEach(item => {
      item.classList.remove('active');
      gsap.set(item.querySelector('.bar'), { height: '0%' });
    });
    images.forEach(img => img.classList.remove('active'));

    // 2. Activate current item
    const activeItem = listItems[index];
    activeItem.classList.add('active');

    // Activate image
    const imgId = `prize-img-${index}`;
    const activeImg = document.getElementById(imgId);
    if (activeImg) activeImg.classList.add('active');

    // 3. Start GSAP animation for the bar
    // We animate height from 0% to 100% over 10 seconds (linear)
    const bar = activeItem.querySelector('.bar');
    currentTween = gsap.to(bar, {
      height: '100%',
      duration: ROTATION_DURATION,
      ease: 'none', // Linear filling
      onComplete: () => {
        setActivePrize(currentIndex + 1);
      }
    });
  };

  // Interaction: Click to switch manually
  listItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'));
      // Prevent clicking the same active item from resetting the timer if we don't want that behavior, 
      // BUT usually user clicking means "I want to see this now", and restarting timer is fine.
      // Let's restart.
      setActivePrize(index);
    });

    // Interaction: Hover to Pause
    // We only care if we hover the ACTIVE item, but simpler to just pause/resume currentTween 
    // if the hovered item IS the active one.
    item.addEventListener('mouseenter', () => {
      if (item.classList.contains('active') && currentTween) {
        currentTween.pause();
      }
    });

    item.addEventListener('mouseleave', () => {
      if (item.classList.contains('active') && currentTween) {
        currentTween.play();
      }
    });
  });

  // Start the first one
  setActivePrize(0);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPrizesRotation);
} else {
  initPrizesRotation();
}
