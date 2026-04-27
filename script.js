function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    // Check if this is the homepage (index.html or root URL)
    const rawPath = window.location.pathname.split('/').pop();
    const isHomepage = (rawPath === 'index.html' || rawPath === '');

    fetch('header.html') // Fetch the content of the header.html file
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header.html');
            }
            return response.text();
        })
        .then(html => {
            headerPlaceholder.innerHTML = html;
            
            // Apply transparent-header class only on the homepage
            if (isHomepage) {
                headerPlaceholder.classList.add('transparent-header');
            }
            
            setActiveNavLink();
        })
        .catch(error => console.error("Error loading header:", error));
}

// Load footer
function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;

  fetch('footer.html')
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to load footer.html');
          }
          return response.text();
      })
      .then(html => {
          footerPlaceholder.innerHTML = html;
      })
      .catch(error => console.error("Error loading footer:", error));
}

// Function to dynamically set the 'active' class based on the current page
function setActiveNavLink() {
    const rawPath = window.location.pathname.split('/').pop();
    // Strip .html extension for robust matching (works with or without extension)
    const currentPath = rawPath.replace('.html', '');

    // Map page names (without .html) to the nav link IDs in header.html
    const navLinksMap = {
        'index': 'nav-home',
        'services': 'nav-services',
        'completed': 'nav-completed',
        'ongoing': 'nav-ongoing',
        'about': 'nav-about',
        'projects-details': 'nav-completed', // Detail page highlights "Completed Projects"
        'start-your-project': 'nav-home',
        '': 'nav-home' // Handles the root URL
    };

    const linkId = navLinksMap[currentPath] || navLinksMap[''];
    const activeLink = document.getElementById(linkId);

    if (activeLink) {
        // Remove 'active' from all links first (good practice)
        document.querySelectorAll('.main-nav ul li a').forEach(link => {
            link.classList.remove('active');
        });
        // Set the active class on the current page's link
        activeLink.classList.add('active');
    }
}

// Load and display featured projects on the homepage
async function loadHomepageProjects() {
  const grid = document.getElementById('homepage-projects-grid');
  if (!grid) return;

  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error('Failed to load projects');

    const data = await response.json();
    const projects = (data.completed || []).slice(0, 3);

    if (projects.length === 0) {
      grid.innerHTML = '<div class="no-projects">No projects available.</div>';
      return;
    }

    grid.innerHTML = '';

    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';

      const catLabel = (project.category || 'other').charAt(0).toUpperCase() + (project.category || 'other').slice(1);

      card.innerHTML = `
        <div class="project-image-placeholder" style="background-image: url('${getProjectHeroImageUrl(project)}');"></div>
        <div class="project-info">
          <span class="category-badge category-${project.category || 'other'}">${catLabel}</span>
          <h3>${project.title}</h3>
          <p>${project.location ? project.location : ''}</p>
          <a href="${getProjectDetailsLink(project)}">View Details <i class="fas fa-arrow-right"></i></a>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading homepage projects:', error);
    grid.innerHTML = '<div class="no-projects">Error loading projects.</div>';
  }
}

// Load and display completed projects
async function loadCompletedProjects() {
  const grid = document.getElementById('completed-projects-grid');
  if (!grid) return;

  try {
      const response = await fetch('projects.json');
      if (!response.ok) throw new Error('Failed to load projects');
      
      const data = await response.json();
      const projects = data.completed || [];

      if (projects.length === 0) {
          grid.innerHTML = '<div class="no-projects">No completed projects available.</div>';
          return;
      }

      // Clear loading message
      grid.innerHTML = '';

      // Create project cards
      projects.forEach(project => {
          const card = document.createElement('div');
          card.className = 'project-card';
          card.dataset.category = project.category;

          const catLabel = (project.category || 'other').charAt(0).toUpperCase() + (project.category || 'other').slice(1);

          card.innerHTML = `
              <div class="project-image-placeholder" 
                   style="background-image: url('${getProjectHeroImageUrl(project)}');"></div>
              <div class="project-info">
                  <span class="category-badge category-${project.category || 'other'}">${catLabel}</span>
                  <h3>${project.title}</h3>
                  <p>${project.description}, ${project.location}</p>
                  <a href="${getProjectDetailsLink(project)}">View Case Study <i class="fas fa-arrow-right"></i></a>
              </div>
          `;
          grid.appendChild(card);
      });

      // Setup filter functionality
      setupProjectFilter();

  } catch (error) {
      console.error('Error loading completed projects:', error);
      grid.innerHTML = '<div class="no-projects">Error loading projects. Please try again later.</div>';
  }
}

// Setup filter buttons for completed projects
function setupProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Update active button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          const filter = button.dataset.filter;

          // Filter projects
          projectCards.forEach(card => {
              if (filter === 'all' || card.dataset.category === filter) {
                  card.style.display = 'block';
              } else {
                  card.style.display = 'none';
              }
          });
      });
  });
}

// Load and display ongoing projects
async function loadOngoingProjects() {
  const list = document.getElementById('ongoing-projects-list');
  if (!list) return;

  try {
      const response = await fetch('projects.json');
      if (!response.ok) throw new Error('Failed to load projects');
      
      const data = await response.json();
      const projects = data.ongoing || [];

      if (projects.length === 0) {
          list.innerHTML = '<div class="no-projects">No ongoing projects at the moment.</div>';
          return;
      }

      // Clear loading message
      list.innerHTML = '';

      // Create project cards
      projects.forEach(project => {
          const card = document.createElement('div');
          card.className = 'ongoing-card';

          const title = project.title || 'Untitled Project';
          const location = project.location || 'Not specified';
          const type = project.type || 'Not specified';
          const status = project.status || 'In Progress';
          const completion = project.completion || 'TBD';
          const progress = project.progress || 0;

          card.innerHTML = `
              <div class="ongoing-image" style="background-image: url('${getProjectHeroImageUrl(project)}');"></div>
              <div class="ongoing-details">
                  <h3>${title}</h3>
                  <p><strong>Location:</strong> ${location}</p>
                  <p><strong>Type:</strong> ${type}</p>
                  <p><strong>Status:</strong> ${status}</p>
                  <p><strong>Estimated Completion:</strong> ${completion}</p>
                  <p><strong>Progress (${progress}%):</strong></p>
                  <div class="progress-bar">
                      <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                  </div>
              </div>
          `;
          list.appendChild(card);
      });

  } catch (error) {
      console.error('Error loading ongoing projects:', error);
      list.innerHTML = '<div class="no-projects">Error loading projects. Please try again later.</div>';
  }
}

function validateInquiryForm(form) {
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const phone = form.querySelector('#phone');
  const area = form.querySelector('#area');
  const type = form.querySelector('#type');

  const required = [name, email, phone, area, type];
  const missing = required.filter(el => !el || !String(el.value || '').trim());

  if (missing.length > 0) {
    return 'Please fill in all required fields.';
  }

  // Basic email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    return 'Please enter a valid email address.';
  }

  // Basic phone check (keeps it flexible for India/international)
  if (!/^[0-9+()\-\s]{7,}$/.test(phone.value.trim())) {
    return 'Please enter a valid phone number.';
  }

  return null;
}

function setupProjectInquiryForm() {
  const form = document.getElementById('project-inquiry-form');
  if (!form) return;

  const errorEl = document.getElementById('form-error');
  const successEl = document.getElementById('form-success');

  const setError = (msg) => {
    if (!errorEl) return;
    errorEl.textContent = msg || '';
    errorEl.style.display = msg ? 'block' : 'none';
  };

  const setSuccess = (msg) => {
    if (!successEl) return;
    successEl.textContent = msg || '';
    successEl.style.display = msg ? 'block' : 'none';
  };

  const value = (id) => {
    const el = form.querySelector('#' + id);
    return el ? String(el.value || '').trim() : '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    setSuccess('');

    const err = validateInquiryForm(form);
    if (err) {
      setError(err);
      return;
    }

    setError('');

    const inquiry = {
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      areaSqFt: value('area'),
      type: value('type'),
      location: value('location'),
      message: value('message'),
      createdAt: new Date().toISOString()
    };

    try {
      const key = 'ssa_inquiries';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(inquiry);
      localStorage.setItem(key, JSON.stringify(existing));

      form.reset();
      setSuccess('Thanks! Your inquiry has been saved. We’ll enable sending once the email setup is ready.');
    } catch (ex) {
      console.error('Failed to save inquiry:', ex);
      setError('Could not save your inquiry in this browser. Please try again.');
    }
  });
}

function getProjectDetailsLink(project) {
  const id = project && project.id ? encodeURIComponent(project.id) : '';
  return `projects-details.html?id=${id}`;
}

function getProjectHeroImageUrl(project) {
  if (!project) return '';

  // Allow absolute/legacy paths (e.g., slideshow) when heroImage already looks like a path
  const hero = project.heroImage || '';
  if (hero.includes('/') || hero.includes('\\')) {
    return hero;
  }

  if (project.assetFolder && hero) {
    return `images/projects/${project.assetFolder}/${hero}`;
  }

  return '';
}

// Initialize common layout + page-specific loaders
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();

  // Start Your Project form
  setupProjectInquiryForm();

  // Home page featured projects
  if (document.getElementById('homepage-projects-grid')) {
    loadHomepageProjects();
  }

  // DOM-based page detection — works regardless of URL format or server config
  if (document.getElementById('completed-projects-grid')) {
      loadCompletedProjects();
  }
  if (document.getElementById('ongoing-projects-list')) {
      loadOngoingProjects();
  }
});
