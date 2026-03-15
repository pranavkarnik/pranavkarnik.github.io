const EMAIL_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
`;

const LINK_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
`;

const LINKEDIN_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
  </svg>
`;

const LARGE_LINKEDIN_ICON = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolvePath(basePath, path) {
  if (basePath === '.' || basePath === '') {
    return path;
  }

  return `${basePath}/${path}`.replace(/\/\.\//g, '/');
}

async function fetchSiteData(basePath, pageKey, commonFile, pageFile) {
  const commonUrl = resolvePath(basePath, commonFile);
  const pageUrl = resolvePath(basePath, pageFile);

  const [commonResponse, pageResponse] = await Promise.all([
    fetch(commonUrl),
    fetch(pageUrl)
  ]);

  if (!commonResponse.ok) {
    throw new Error(`Failed to load common site content: ${commonResponse.status}`);
  }

  if (!pageResponse.ok) {
    throw new Error(`Failed to load page content for ${pageKey}: ${pageResponse.status}`);
  }

  const [commonData, pageData] = await Promise.all([
    commonResponse.json(),
    pageResponse.json()
  ]);

  return {
    ...commonData,
    [pageKey === 'index' ? 'home' : pageKey]: pageData
  };
}

function renderNav(globalData, pageKey, basePath) {
  const navItems = globalData.nav
    .map((item) => {
      const activeClass = item.key === pageKey ? ' class="active"' : '';
      return `<li><a href="${escapeHtml(resolvePath(basePath, item.path))}"${activeClass}>${escapeHtml(item.label)}</a></li>`;
    })
    .join('');

  return `
    <div class="nav-container">
      <a href="${escapeHtml(resolvePath(basePath, 'index.html'))}" class="nav-logo"></a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </button>
      <ul class="nav-menu" id="navMenu">
        ${navItems}
      </ul>
    </div>
  `;
}

function renderFooter(footerData) {
  return `
    <div class="container">
      <p>${escapeHtml(footerData.copyright)}</p>
      <p class="footer-subtitle">${escapeHtml(footerData.subtitle)}</p>
    </div>
  `;
}

function renderPageHeader(headerData) {
  const headerClass = headerData.theme === 'gradient' ? 'page-header gradient-header' : 'page-header';

  return `
    <div class="${headerClass}">
      <div class="container">
        <h1>${escapeHtml(headerData.title)}</h1>
        <p class="subtitle">${escapeHtml(headerData.subtitle)}</p>
      </div>
    </div>
  `;
}

function renderHomePage(data) {
  const buildCards = data.home.builds.items
    .map((item) => `
      <div class="card">
        <div class="card-icon">${escapeHtml(item.icon)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>
    `)
    .join('');

  const philosophyItems = data.home.philosophy.items
    .map((item) => `
      <li>
        <span class="bullet">→</span>
        ${escapeHtml(item)}
      </li>
    `)
    .join('');

  const currentFocusItems = data.home.currentFocus.achievements
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `
    <header class="hero">
      <div class="hero-content">
        <div class="profile-section">
          <img src="${escapeHtml(data.global.profileImage.src)}" alt="${escapeHtml(data.global.profileImage.alt)}" class="profile-pic">
          <div class="profile-info">
            <h1>${escapeHtml(data.global.name)}</h1>
            <p class="role">${escapeHtml(data.home.hero.role)}</p>
            <p class="tagline">${escapeHtml(data.home.hero.tagline)}</p>
            <p class="location">${escapeHtml(data.home.hero.location)}</p>
            <div class="links">
              <a href="mailto:${escapeHtml(data.global.email)}" class="btn-primary">
                ${EMAIL_ICON}
                Email
              </a>
              <a href="${escapeHtml(data.global.linkedin)}" target="_blank" class="btn-secondary" rel="noreferrer">
                ${LINKEDIN_ICON}
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="section-light">
        <div class="container">
          <h2>${escapeHtml(data.home.about.title)}</h2>
          <p class="lead">${escapeHtml(data.home.about.lead)}</p>
          <p>${escapeHtml(data.home.about.body)}</p>
        </div>
      </section>

      <section class="section-dark">
        <div class="container">
          <h2>${escapeHtml(data.home.builds.title)}</h2>
          <div class="grid">
            ${buildCards}
          </div>
        </div>
      </section>

      <section class="section-light">
        <div class="container">
          <h2>${escapeHtml(data.home.philosophy.title)}</h2>
          <ul class="philosophy-list">
            ${philosophyItems}
          </ul>
        </div>
      </section>

      <section class="section-dark">
        <div class="container">
          <h2>${escapeHtml(data.home.currentFocus.title)}</h2>
          <div class="current-role">
            <h3>${escapeHtml(data.home.currentFocus.company)}</h3>
            <p class="time">${escapeHtml(data.home.currentFocus.time)}</p>
            <ul class="achievements">
              ${currentFocusItems}
            </ul>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderExperiencePage(data) {
  const experiences = data.experience.items
    .map((item) => {
      const achievements = item.achievements
        .map((achievement) => `
          <li><strong>${escapeHtml(achievement.label)}:</strong> ${escapeHtml(achievement.text)}</li>
        `)
        .join('');

      return `
        <div class="experience-item">
          <div class="experience-header">
            <div>
              <h2>${escapeHtml(item.company)}</h2>
              <h3>${escapeHtml(item.role)}</h3>
            </div>
            <div class="experience-date">
              <span class="time-badge">${escapeHtml(item.date)}</span>
              <span class="location-badge">${escapeHtml(item.location)}</span>
            </div>
          </div>
          <div class="experience-content">
            <h4>${escapeHtml(item.heading)}</h4>
            <ul class="achievements">
              ${achievements}
            </ul>
            <p><strong>Technologies:</strong> ${escapeHtml(item.technologies)}</p>
          </div>
        </div>
      `;
    })
    .join('');

  const timelineItems = data.experience.timeline.items
    .map((item) => `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h4>${escapeHtml(item.period)}</h4>
          <p><strong>Focus:</strong> ${escapeHtml(item.focus)}</p>
        </div>
      </div>
    `)
    .join('');

  return `
    ${renderPageHeader(data.experience.header)}
    <main>
      <section class="section-light">
        <div class="container">
          ${experiences}
          <div class="experience-summary">
            <h3>${escapeHtml(data.experience.timeline.title)}</h3>
            <div class="timeline">
              ${timelineItems}
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderCertificationsPage(data) {
  const certifications = data.certifications.certifications
    .map((item) => {
      const skills = item.skills
        .map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
        .join('');

      return `
        <div class="cert-card featured">
          <div class="cert-header">
            <div class="cert-icon">
              <img src="${escapeHtml(item.image)}" height="75" width="75" alt="${escapeHtml(item.title)}">
            </div>
            <div>
              <h3>${escapeHtml(item.title)}</h3>
              <p class="cert-issuer">${escapeHtml(item.issuer)}</p>
            </div>
          </div>
          <div class="cert-details">
            <div class="cert-meta">
              <span class="cert-badge">${escapeHtml(item.verifiedLabel)}</span>
              <span class="cert-year">${escapeHtml(item.year)}</span>
            </div>
            <p class="cert-description">${escapeHtml(item.description)}</p>
            <div class="cert-skills">${skills}</div>
            <div style="margin-top: 1rem;">
              <a href="${escapeHtml(item.credentialUrl)}" target="_blank" class="btn-primary" rel="noreferrer">
                ${LINK_ICON}
                View Credential
              </a>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const awards = data.certifications.awards
    .map((item) => `
      <div class="award-card">
        <div class="award-icon">${escapeHtml(item.icon)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="award-company">${escapeHtml(item.company)}</p>
        <p class="award-description">${escapeHtml(item.description)}</p>
        <div class="award-meta">
          <span class="award-badge">${escapeHtml(item.badge)}</span>
        </div>
      </div>
    `)
    .join('');

  const learningItems = data.certifications.learning.items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return `
    ${renderPageHeader(data.certifications.header)}
    <main>
      <section class="section-light">
        <div class="container">
          <div class="cert-section">
            <h2>${escapeHtml(data.certifications.certificationsTitle)}</h2>
            ${certifications}
          </div>

          <div class="cert-section">
            <h2>${escapeHtml(data.certifications.awardsTitle)}</h2>
            <div class="awards-grid">
              ${awards}
            </div>
          </div>

          <div class="cert-section">
            <h2>${escapeHtml(data.certifications.learning.title)}</h2>
            <div class="learning-card">
              <p>${escapeHtml(data.certifications.learning.intro)}</p>
              <div class="learning-areas">
                <h4>${escapeHtml(data.certifications.learning.focusTitle)}</h4>
                <ul class="learning-list">
                  ${learningItems}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderTechItems(items) {
  return items
    .map((item) => `
      <div class="tech-item ${escapeHtml(item.className)}">
        <span class="tech-name">${escapeHtml(item.name)}</span>
        <span class="tech-level">${escapeHtml(item.level)}</span>
        ${item.version ? `<span class="tech-version">${escapeHtml(item.version)}</span>` : ''}
      </div>
    `)
    .join('');
}

function renderLanguagesPage(data) {
  const spokenLanguages = data.languages.spokenLanguages.items
    .map((item) => `
      <div class="language-card">
        <div class="language-flag">${escapeHtml(item.flag)}</div>
        <h3>${escapeHtml(item.name)}</h3>
        <div class="proficiency-bar">
          <div class="proficiency-fill" style="width: ${escapeHtml(item.width)}"></div>
        </div>
        <p class="proficiency-level">${escapeHtml(item.level)}</p>
      </div>
    `)
    .join('');

  const frameworkSections = data.languages.frameworkSections
    .map((section) => `
      <div class="tech-category">
        <h3>${escapeHtml(section.title)}</h3>
        <div class="tech-grid">
          ${renderTechItems(section.items)}
        </div>
      </div>
    `)
    .join('');

  const architectureItems = data.languages.architecture.items
    .map((item) => `
      <div class="arch-item">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.description)}</p>
      </div>
    `)
    .join('');

  const toolCategories = data.languages.tools.items
    .map((item) => {
      const points = item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
      return `
        <div class="tool-category">
          <h4>${escapeHtml(item.title)}</h4>
          <ul>${points}</ul>
        </div>
      `;
    })
    .join('');

  return `
    ${renderPageHeader(data.languages.header)}
    <main>
      <section class="section-light">
        <div class="container">
          <div class="skills-section">
            <h2>${escapeHtml(data.languages.spokenLanguages.title)}</h2>
            <div class="language-grid">
              ${spokenLanguages}
            </div>
          </div>

          <div class="skills-section">
            <h2>${escapeHtml(data.languages.programmingLanguages.title)}</h2>
            <div class="tech-category">
              <div class="tech-grid">
                ${renderTechItems(data.languages.programmingLanguages.items)}
              </div>
            </div>
          </div>

          <div class="skills-section">
            <h2>🔧 Frameworks & Technologies</h2>
            ${frameworkSections}
          </div>

          <div class="skills-section">
            <h2>${escapeHtml(data.languages.architecture.title)}</h2>
            <div class="architecture-skills">
              ${architectureItems}
            </div>
          </div>

          <div class="skills-section">
            <h2>${escapeHtml(data.languages.tools.title)}</h2>
            <div class="tools-grid">
              ${toolCategories}
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderOpportunityCards(cards) {
  return cards
    .map((card) => {
      const items = card.items
        .map((item) => {
          const [label, ...rest] = item.split(' - ');
          if (rest.length === 0) {
            return `<li>${escapeHtml(item)}</li>`;
          }

          return `<li><strong>${escapeHtml(label)}</strong> - ${escapeHtml(rest.join(' - '))}</li>`;
        })
        .join('');

      return `
        <div class="opportunity-card${card.featured ? ' featured' : ''}">
          <div class="opp-card-heading">
            <div class="opp-icon">${escapeHtml(card.icon)}</div>
            <h2>${escapeHtml(card.title)}</h2>
          </div>
          <p class="opp-highlight">${escapeHtml(card.highlight)}</p>
          <div class="opp-details">
            <h4>${escapeHtml(card.heading)}</h4>
            <ul>
              ${items}
            </ul>
            ${card.badgeTitle ? `
              <div class="visa-badge">
                <strong>${escapeHtml(card.badgeTitle)}</strong>
                <p>${escapeHtml(card.badgeText)}</p>
              </div>
            ` : ''}
            ${card.note ? `
              <p class="note">
                <strong>Note:</strong> ${escapeHtml(card.note)}
              </p>
            ` : ''}
          </div>
        </div>
      `;
    })
    .join('');
}

function renderLookingFor(items) {
  return items
    .map((item) => {
      const points = item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
      return `
        <div class="looking-item">
          <h3>${escapeHtml(item.title)}</h3>
          <ul>
            ${points}
          </ul>
        </div>
      `;
    })
    .join('');
}

function renderOpportunitiesPage(data) {
  const valueItems = data.opportunities.value.items
    .map((item) => `
      <div class="value-item">
        <div class="value-icon">${escapeHtml(item.icon)}</div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.description)}</p>
      </div>
    `)
    .join('');

  const locationItems = data.opportunities.locationFlexibility.items
    .map((item) => `
      <div class="relocation-item">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.text)}</p>
      </div>
    `)
    .join('');

  return `
    ${renderPageHeader(data.opportunities.header)}
    <main>
      <section class="section-light">
        <div class="container">
          <div class="opportunity-intro">
            <p class="lead">${escapeHtml(data.opportunities.intro)}</p>
          </div>

          <div class="opportunity-grid">
            ${renderOpportunityCards(data.opportunities.cards)}
          </div>

          <div class="what-looking-for">
            <h2>${escapeHtml(data.opportunities.lookingFor.title)}</h2>
            <div class="looking-grid">
              ${renderLookingFor(data.opportunities.lookingFor.items)}
            </div>
          </div>

          <div class="value-proposition">
            <h2>${escapeHtml(data.opportunities.value.title)}</h2>
            <div class="value-grid">
              ${valueItems}
            </div>
          </div>

          <div class="relocation-info">
            <h2>${escapeHtml(data.opportunities.locationFlexibility.title)}</h2>
            <div class="relocation-content">
              <p>${escapeHtml(data.opportunities.locationFlexibility.intro)}</p>
              <div class="relocation-details">
                ${locationItems}
              </div>
            </div>
          </div>

          <div class="contact-cta">
            <h2>${escapeHtml(data.opportunities.contact.title)}</h2>
            <p>${escapeHtml(data.opportunities.contact.body)}</p>
            <div class="cta-buttons">
              <a href="mailto:${escapeHtml(data.global.email)}" class="btn-primary large">
                ${EMAIL_ICON.replace('width="16"', 'width="20"').replace('height="16"', 'height="20"')}
                Email Me
              </a>
              <a href="${escapeHtml(data.global.linkedin)}" target="_blank" class="btn-primary large" rel="noreferrer">
                ${LARGE_LINKEDIN_ICON}
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderPageContent(data, pageKey) {
  switch (pageKey) {
    case 'index':
      return renderHomePage(data);
    case 'experience':
      return renderExperiencePage(data);
    case 'certifications':
      return renderCertificationsPage(data);
    case 'languages':
      return renderLanguagesPage(data);
    case 'opportunities':
      return renderOpportunitiesPage(data);
    default:
      return `
        <main>
          <section class="section-light">
            <div class="container">
              <h1>Content unavailable</h1>
              <p>The requested page configuration could not be found.</p>
            </div>
          </section>
        </main>
      `;
  }
}

function renderSite(data, pageKey, basePath) {
  const navRoot = document.getElementById('site-nav');
  const pageRoot = document.getElementById('page-content');
  const footerRoot = document.getElementById('site-footer');

  if (!navRoot || !pageRoot || !footerRoot) {
    throw new Error('Missing page shell placeholders.');
  }

  navRoot.innerHTML = renderNav(data.global, pageKey, basePath);
  pageRoot.innerHTML = renderPageContent(data, pageKey);
  footerRoot.innerHTML = renderFooter(data.global.footer);
}

function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (!hamburger || !navMenu) {
    return;
  }

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach((link) => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  document.addEventListener('click', function(event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href');

      if (targetId !== '#' && document.querySelector(targetId)) {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);
        const navbarHeight = 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');

  if (!navbar) {
    return;
  }

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    navbar.style.boxShadow = scrollTop > 100
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  });
}

function initAnimations() {
  const animatedElements = document.querySelectorAll(
    '.card, .experience-item, .cert-card, .award-card, .opportunity-card, .value-item'
  );

  if (animatedElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

function initProficiencyBars() {
  const proficiencyBars = document.querySelectorAll('.proficiency-fill');

  if (proficiencyBars.length === 0) {
    return;
  }

  const barObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry) => {
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

  proficiencyBars.forEach((bar) => {
    barObserver.observe(bar);
  });
}

function initPrintHandler() {
  window.addEventListener('beforeprint', function() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
}

function initLazyLoadImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if (images.length === 0) {
    return;
  }

  if ('loading' in HTMLImageElement.prototype) {
    images.forEach((img) => {
      img.src = img.dataset.src || img.src;
    });
    return;
  }

  const imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function initKeyboardNavigation() {
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((element) => {
    element.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') {
        element.classList.add('keyboard-focus');
      }
    });

    element.addEventListener('mousedown', function() {
      element.classList.remove('keyboard-focus');
    });
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }
}

function logConsoleMessage(globalData) {
  console.log('%cHello! Thanks for visiting my portfolio.', 'color: #2563eb; font-size: 16px; font-weight: bold;');
  console.log('%cIf you\'re interested in working together, let\'s connect.', 'color: #64748b; font-size: 14px;');
  console.log(`%c${globalData.email}`, 'color: #0ea5e9; font-size: 14px;');
}

function renderErrorState(message) {
  const pageRoot = document.getElementById('page-content');

  if (!pageRoot) {
    return;
  }

  pageRoot.innerHTML = `
    <main>
      <section class="section-light">
        <div class="container">
          <h1>Unable to load content</h1>
          <p>${escapeHtml(message)}</p>
        </div>
      </section>
    </main>
  `;
}

async function initPage(config) {
  const {
    pageKey,
    basePath,
    commonFile,
    pageFile
  } = config;

  try {
    const siteData = await fetchSiteData(basePath, pageKey, commonFile, pageFile);
    renderSite(siteData, pageKey, basePath);
    initHamburgerMenu();
    initSmoothScroll();
    initNavbarScroll();
    initAnimations();
    initProficiencyBars();
    initPrintHandler();
    initLazyLoadImages();
    initKeyboardNavigation();
    initDarkMode();
    logConsoleMessage(siteData.global);

    window.toggleDarkMode = toggleDarkMode;
    window.validateEmail = validateEmail;
  } catch (error) {
    console.error(error);
    renderErrorState('Start this site through a local server or GitHub Pages so the JSON content can be fetched correctly.');
  }
}

window.PortfolioSite = {
  initPage
};
