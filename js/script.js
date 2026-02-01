// ================================
// HAMBURGER MENU TOGGLE
// ================================
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navMenu.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);

      if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
});

// ================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================
document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        const navbarHeight = 70; // Height of fixed navbar
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// ================================
// NAVBAR SCROLL EFFECT
// ================================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }
  
  lastScrollTop = scrollTop;
});

// ================================
// ANIMATE ELEMENTS ON SCROLL
// ================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
  // Animate cards, experience items, etc.
  const animatedElements = document.querySelectorAll(
    '.card, .experience-item, .cert-card, .award-card, .opportunity-card, .value-item'
  );
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
});

// ================================
// PROFICIENCY BAR ANIMATION
// ================================
document.addEventListener('DOMContentLoaded', function() {
  const proficiencyBars = document.querySelectorAll('.proficiency-fill');
  
  const barObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
          bar.style.transition = 'width 1s ease-out';
          bar.style.width = width;
        }, 100);
        
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  proficiencyBars.forEach(bar => {
    barObserver.observe(bar);
  });
});

// ================================
// COPY EMAIL TO CLIPBOARD
// ================================
document.addEventListener('DOMContentLoaded', function() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  
  emailLinks.forEach(link => {
    link.addEventListener('contextmenu', function(e) {
      // Optional: Add custom context menu functionality
    });
  });
});

// ================================
// PRINT STYLES
// ================================
window.addEventListener('beforeprint', function() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
  }
});

// ================================
// LAZY LOAD IMAGES
// ================================
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading natively
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
});

// ================================
// FORM VALIDATION (for future contact forms)
// ================================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ================================
// KEYBOARD NAVIGATION ACCESSIBILITY
// ================================
document.addEventListener('DOMContentLoaded', function() {
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );
  
  // Add focus visible class for keyboard navigation
  focusableElements.forEach(element => {
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        element.classList.add('keyboard-focus');
      }
    });
    
    element.addEventListener('mousedown', function() {
      element.classList.remove('keyboard-focus');
    });
  });
});

// ================================
// DARK MODE TOGGLE (Optional - for future enhancement)
// ================================
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Check for saved dark mode preference
document.addEventListener('DOMContentLoaded', function() {
  const darkMode = localStorage.getItem('darkMode');
  
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});

// ================================
// CONSOLE MESSAGE
// ================================
console.log('%c👋 Hello! Thanks for visiting my portfolio!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cIf you\'re interested in working together, let\'s connect!', 'color: #64748b; font-size: 14px;');
console.log('%c📧 pranavkarnik6@gmail.com', 'color: #0ea5e9; font-size: 14px;');
