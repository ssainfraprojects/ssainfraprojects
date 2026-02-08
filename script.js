function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    // ⭐ NEW: Check if this is the homepage (index.html or root URL) ⭐
    const isHomepage = (window.location.pathname.split('/').pop() === 'index.html' || window.location.pathname.split('/').pop() === '');

    fetch('header.html') // Fetch the content of the header.html file
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header.html');
            }
            return response.text();
        })
        .then(html => {
            headerPlaceholder.innerHTML = html;
            
            // ⭐ NEW: Apply transparent-header class ONLY on the homepage ⭐
            if (isHomepage) {
                headerPlaceholder.classList.add('transparent-header');
            }
            
            setActiveNavLink();
        })
        .catch(error => console.error("Error loading header:", error));
}

// NEW: Load footer
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
    const currentPath = window.location.pathname.split('/').pop(); // e.g., 'services.html'

    // Map file names to the IDs we gave the links in header.html
    const navLinksMap = {
        'index.html': 'nav-home',
        'services.html': 'nav-services',
        'completed.html': 'nav-completed',
        'ongoing.html': 'nav-ongoing',
        'about.html': 'nav-about',
        'start-your-project.html': 'nav-home',
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

// NEW: Load and display featured projects on the homepage
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

      card.innerHTML = `
        <div class="project-image-placeholder" style="background-image: url('${getProjectHeroImageUrl(project)}');"></div>
        <div class="project-info">
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

          card.innerHTML = `
              <div class="project-image-placeholder ${project.category}" 
                   style="background-image: url('${getProjectHeroImageUrl(project)}');"></div>
              <div class="project-info">
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

          card.innerHTML = `
              <div class="ongoing-image" style="background-image: url('${getProjectHeroImageUrl(project)}');"></div>
              <div class="ongoing-details">
                  <h3>${project.title}</h3>
                  <p><strong>Location:</strong> ${project.location}</p>
                  <p><strong>Type:</strong> ${project.type}</p>
                  <p><strong>Status:</strong> ${project.status}</p>
                  <p><strong>Estimated Completion:</strong> ${project.completion}</p>
                  <p><strong>Progress (${project.progress}%):</strong></p>
                  <div class="progress-bar">
                      <div class="progress-bar-fill" style="width: ${project.progress}%;"></div>
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

  if (window.location.pathname.includes('completed.html')) {
      loadCompletedProjects();
  } else if (window.location.pathname.includes('ongoing.html')) {
      loadOngoingProjects();
  }
});
