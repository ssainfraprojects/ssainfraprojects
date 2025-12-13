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

// Run the loader when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();
});

// ...existing code for initSlideshow...
(async function initSlideshow() {
    const container = document.getElementById('slideshow-container');
    if (!container) return;
  
    const exts = ['jpg', 'png', 'webp'];
    const maxCheck = 100;
    const stopAfterMisses = 6;
    const images = [];
  
    function probeImage(url, timeout = 3000) {
      return new Promise(resolve => {
        const img = new Image();
        let settled = false;
        const timer = setTimeout(() => {
          if (!settled) { settled = true; resolve(false); }
        }, timeout);
        img.onload = () => { if (!settled) { settled = true; clearTimeout(timer); resolve(true); } };
        img.onerror = () => { if (!settled) { settled = true; clearTimeout(timer); resolve(false); } };
        img.src = url;
      });
    }
  
    let missCount = 0;
    for (let i = 1; i <= maxCheck; i++) {
      let foundThisIndex = false;
      for (const ext of exts) {
        const url = `/images/SlideShow/image${i}.${ext}`;
        // eslint-disable-next-line no-await-in-loop
        const ok = await probeImage(url, 2500);
        if (ok) {
          images.push(url);
          foundThisIndex = true;
          break;
        }
      }
      if (!foundThisIndex) {
        missCount++;
        if (missCount >= stopAfterMisses && i > 5) break;
      } else {
        missCount = 0;
      }
    }
  
    if (images.length === 0) {
      container.innerHTML = '<p>No slideshow images found in /images/SlideShow/</p>';
      return;
    }
  
    images.forEach((src, idx) => {
      const img = document.createElement('img');
      img.className = 'slide-image' + (idx === 0 ? ' active' : '');
      img.src = src;
      img.alt = `Slideshow image ${idx + 1}`;
      container.appendChild(img);
    });
  
    // basic slideshow cycle
    let current = 0;
    const slides = container.querySelectorAll('.slide-image');
    const intervalMs = 5000;
    
    // Ensure the first slide is visible when JS starts (though HTML/CSS should handle it)
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }

    setInterval(() => {
      // 1. Remove 'active' from the current slide (fades out)
      slides[current].classList.remove('active');
      
      // 2. Clear any lingering 'previous' or 'style' attributes from the failed sliding attempts
      slides[current].classList.remove('previous');
      slides[current].style.transition = '';
      slides[current].style.transform = '';

      // 3. Calculate the next slide index
      current = (current + 1) % slides.length;
      
      // 4. Add 'active' to the next slide (fades in)
      slides[current].classList.add('active');
      
    }, intervalMs);

  })();
