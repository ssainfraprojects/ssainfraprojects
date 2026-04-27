# SSA Infra Projects — Full Project Analysis

> **Domain:** [ssainfraprojects.com](https://ssainfraprojects.com)  
> **Type:** Static marketing website for a construction / infrastructure company  
> **Tech Stack:** Plain HTML5 · CSS3 · Vanilla JavaScript (no frameworks, no build tools)  
> **Hosting:** GitHub Pages (indicated by the `CNAME` file)

---

## 1. Project Overview

SSA Infra Projects is a construction and infrastructure company founded by **Mr. Sanjay G**, based in the Tamil Nadu region (Pongalur, Velampalayam, etc.). The website serves as a corporate portfolio to showcase completed and ongoing construction projects, list services, and accept project inquiries from potential clients.

**Tagline:** *"Building Excellence. Delivering Trust."*

---

## 2. File & Folder Structure

```
ssainfraprojects/
├── index.html                 # Homepage — hero, value props, featured projects, CTA
├── services.html              # Services listing (design, interior, cladding, glass, renovation)
├── completed.html             # Completed projects gallery with category filters
├── ongoing.html               # Ongoing projects with progress bars
├── projects-details.html      # Dynamic project detail page (query-param driven)
├── start-your-project.html    # Project inquiry form
├── about.html                 # Company story, mission, leadership team
├── header.html                # Shared header partial (loaded via JS fetch)
├── footer.html                # Shared footer partial (loaded via JS fetch)
├── projects.json              # Project data store (completed + ongoing)
├── script.js                  # All client-side logic (364 lines)
├── style.css                  # Global styles + responsive rules (607 lines)
├── CNAME                      # GitHub Pages custom domain → ssainfraprojects.com
└── images/
    ├── ssa-logo.png           # Company logo
    ├── SlideShow/
    │   └── image1.jpg         # Hero background image
    └── projects/
        ├── p05/               # 4BHK Villa – Velampalayam
        ├── p06/               # House Interior – Pongalur
        ├── p07/               # Project 07 – Unknown
        ├── p08/               # House Renovation – KG Garden
        ├── p09/               # Villa – VGV Garden
        └── p10/               # Gym Interior – Pongalur
```

---

## 3. Page-by-Page Breakdown

### 3.1 `index.html` — Homepage
| Section | Purpose |
|---|---|
| **Hero** | Full-viewport background image with headline, tagline, and CTA to portfolio |
| **SSA Difference** | Three value-proposition cards (Precision Engineering, Transparent Process, Timely Delivery) |
| **Featured Projects** | Dynamically loads the first 3 completed projects from `projects.json` |
| **Contact CTA** | Email link to request a quote |
| Testimonial (commented out) | Placeholder for future client testimonial |

### 3.2 `services.html` — Services
Lists company capabilities in two groups:
- **Design, Planning & Approvals:** Architectural drawings, plan approval & licensing
- **Building & Specialty Works:** Interior works, exterior cladding, toughened glass installation, renovation

### 3.3 `completed.html` — Completed Projects
- **Filter bar** with buttons: All, Residential, Commercial, Interior, Renovations
- **Dynamic grid** populated from `projects.json → completed[]`
- Each card links to `projects-details.html?id=<projectId>`

### 3.4 `ongoing.html` — Ongoing Projects
- Card layout with image, details, and a **visual progress bar**
- Fields: title, location, type, status, estimated completion, progress %

### 3.5 `projects-details.html` — Project Detail
- Reads `?id=` query parameter
- Fetches `projects.json`, finds the matching project
- Renders: hero image, info grid (year, area, duration, category), description, features list, image gallery

### 3.6 `start-your-project.html` — Inquiry Form
- Fields: name, email, phone, area (sq ft), construction type, location, message
- Client-side validation (email regex, phone format, required fields)
- Saves submissions to **`localStorage`** (no backend yet)

### 3.7 `about.html` — About Us
- Company mission and story
- Leadership: Mr. Sanjay G (Founder)
- Placeholder images (no photos loaded yet)

---

## 4. Data Architecture (`projects.json`)

```json
{
  "completed": [ ... ],   // 7 projects
  "ongoing":   [ ... ]    // 1 project (minimal data)
}
```

### Completed Project Schema
| Field | Type | Description |
|---|---|---|
| `id` | string | Unique slug, e.g. `"p10-gym-interior"` |
| `title` | string | Display name |
| `category` | string | `residential` / `commercial` / `interior` / `renovation` |
| `location` | string | City / area name |
| `description` | string | Short summary |
| `assetFolder` | string | Subfolder under `images/projects/` (e.g. `"p10"`) |
| `heroImage` | string | Filename or relative path for the card thumbnail |
| `details.year` | string | Completion year (currently empty) |
| `details.area` | string | Built-up area (currently empty) |
| `details.duration` | string | Build duration (currently empty) |
| `details.fullDescription` | string | Longer narrative |
| `details.features` | array | List of highlights (currently empty for all) |
| `details.gallery` | array | Image filenames for the detail page gallery |

### Portfolio at a Glance

| # | Project | Category | Location | Gallery Images |
|---|---|---|---|---|
| P10 | Gym Interior | Interior | Pongalur | 8 |
| P09 | Villa | Residential | VGV Garden | 11 |
| P08 | House Renovation | Renovation | KG Garden | 7 |
| P07 | Project 07 | Commercial | Unknown | 4 |
| P06 | House Interior | Interior | Pongalur | 6 |
| P05 | 4BHK Villa | Residential | Velampalayam | 2 |
| P04 | House (SlideShow) | Residential | Unknown | 0 (hero only) |

---

## 5. JavaScript Architecture (`script.js` — 364 lines)

All logic lives in a single file with no modules or bundler.

| Function | Purpose |
|---|---|
| `loadHeader()` | Fetches `header.html`, injects into DOM, applies transparent header on homepage |
| `loadFooter()` | Fetches `footer.html`, injects into DOM |
| `setActiveNavLink()` | Highlights current page link in navigation |
| `loadHomepageProjects()` | Fetches JSON, renders the first 3 completed projects on homepage |
| `loadCompletedProjects()` | Fetches JSON, renders all completed projects with category data attributes |
| `setupProjectFilter()` | Attaches click handlers to filter buttons for show/hide by category |
| `loadOngoingProjects()` | Fetches JSON, renders ongoing project cards with progress bars |
| `validateInquiryForm()` | Validates required fields, email format, phone format |
| `setupProjectInquiryForm()` | Handles form submission, saves inquiry to `localStorage` |
| `getProjectDetailsLink()` | Generates `projects-details.html?id=...` URL |
| `getProjectHeroImageUrl()` | Resolves hero image path from `assetFolder` + `heroImage` |
| `DOMContentLoaded` listener | Orchestrates page initialization |

### Page-specific loading logic (in DOMContentLoaded):
```
Always:        loadHeader() + loadFooter() + setupProjectInquiryForm()
index.html:    loadHomepageProjects()
completed.html: loadCompletedProjects()
ongoing.html:  loadOngoingProjects()
projects-details.html: loadProjectDetails() (inline <script>)
```

---

## 6. Styling Architecture (`style.css` — 607 lines)

### Design Tokens (CSS Custom Properties)
| Variable | Value | Usage |
|---|---|---|
| `--primary-color` | `#1F3044` | Dark navy — headers, text, footer bg |
| `--accent-color` | `#3a9ae8` | Blue — buttons, icons, highlights |
| `--light-bg` | `#F9F9F9` | Section backgrounds |
| `--text-dark` | `#333` | Body text |
| `--text-light` | `#fff` | Text on dark backgrounds |
| `--max-width` | `1200px` | Container width cap |

### Responsive Breakpoints
| Breakpoint | Adaptations |
|---|---|
| `≤ 900px` | Header stacks vertically, nav wraps, footer goes single-column, homepage header becomes solid-colored |
| `≤ 768px` | Form grid collapses to single column, about-page story sections stack |
| `≤ 600px` | Logo shrinks, hero heading scales down, project grid becomes 1-column |

### Key Visual Patterns
- **Transparent → Solid header** on homepage (uses `.transparent-header` class toggled by JS)
- **Sticky header** on inner pages (`position: sticky`)
- **Card hover effects** (`translateY(-5px)` + enhanced box-shadow)
- **Hero overlay** (40% black overlay on hero image for text readability)

---

## 7. External Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| Google Fonts (Poppins) | 300, 400, 600, 700 | Primary typeface |
| Font Awesome | 6.0.0-beta3 | Icons throughout the site |

No npm packages, no build process, no CSS preprocessor.

---

## 8. Deployment & Hosting

- **Platform:** GitHub Pages
- **Custom Domain:** `ssainfraprojects.com` (configured via `CNAME`)
- **Deployment:** Push to the repository's default branch; GitHub Pages serves files directly
- **No build step required** — all assets are production-ready as-is

---

## 9. Identified Gaps & Improvement Opportunities

### Data Completeness
- [ ] Most projects are missing `year`, `area`, `duration`, and `features` — detail pages show empty fields
- [ ] Ongoing projects have minimal data (no title, location, type, status, progress, completion date)
- [ ] Project P04 has no gallery images; P05 has only 2

### Functionality
- [ ] **No backend / email integration** — the inquiry form saves to `localStorage` only
- [ ] **No SEO meta tags** — missing `<meta name="description">`, Open Graph tags, structured data
- [ ] **No favicon** configured
- [ ] **No sitemap.xml** or `robots.txt` for search engine crawling
- [ ] **No 404 page** for broken links
- [ ] **No analytics** (Google Analytics / tag manager not present)

### Performance
- [ ] Images are not optimized (no WebP, no lazy loading, no srcset for responsive images)
- [ ] Only the hero image is preloaded; project gallery images could benefit from lazy loading
- [ ] Font Awesome full CSS loaded for only ~10 icons — consider a subset or SVG icons

### UX / Accessibility
- [ ] No hamburger/mobile menu — nav wraps but can be cramped on small screens
- [ ] No `alt` text strategy for project gallery images
- [ ] No `aria-label` on interactive elements (filter buttons, social links)
- [ ] No skip-to-content link
- [ ] Testimonial section is commented out — consider enabling or removing

### Code Organization
- [ ] Page-specific `<style>` blocks are inlined in HTML — could be consolidated into `style.css`
- [ ] `projects-details.html` has an inline `<script>` block — could be moved to `script.js`
- [ ] Header/footer are fetched via JS — limits SEO (search engines may not execute JS); consider static site generation or server-side includes

---

## 10. Local Development

No build tools required. Serve with any static file server:

```bash
# Python
cd e:\ssainfraprojects
python -m http.server 8000

# Node.js
npx serve .

# VS Code
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```

Then open `http://localhost:8000` (or the port shown by your server).

---

## 11. Contact Information (from footer)

- **Phone:** +91 824 851 0077
- **Email:** sanjayg@ssainfraprojects.com
- **Social:** LinkedIn, Instagram (links not yet configured)

---

## 12. Changelog — Issues Fixed (April 27, 2026)

### BUG: Navbar active state not highlighting the correct page
**File:** `script.js` — `setActiveNavLink()`  
**Problem:** The nav link map used full filenames (e.g. `'completed.html'`). If a server strips `.html` extensions or the URL format differs, `window.location.pathname.split('/').pop()` wouldn't match any key, causing the fallback `''` → `nav-home` to activate — making "Home" appear selected on every page.  
**Fix:** Strip `.html` from the extracted path before lookup. The map now uses extension-less keys (`'completed'`, `'services'`, etc.). Also added `'projects-details'` → `'nav-completed'` so project detail pages correctly highlight "Completed Projects" in the nav.

### BUG: Completed & Ongoing projects not loading (stuck on "Loading projects...")
**File:** `script.js` — `DOMContentLoaded` handler  
**Problem:** Page-specific loaders were triggered by `window.location.pathname.includes('completed.html')` — a fragile URL-string check that fails when the `.html` extension is absent.  
**Fix:** Replaced URL-based detection with DOM-element detection: `document.getElementById('completed-projects-grid')` and `document.getElementById('ongoing-projects-list')`. This works regardless of URL format, server config, or deployment platform.

### BUG: Ongoing projects rendering "undefined" for missing fields
**File:** `script.js` — `loadOngoingProjects()`  
**Problem:** The card template directly interpolated `project.title`, `project.location`, `project.type`, `project.status`, `project.completion`, and `project.progress` — all of which were missing from the ongoing project JSON entry, rendering "undefined" on screen.  
**Fix:** Added safe defaults for every field (`|| 'Not specified'`, `|| 0`, etc.) before feeding them into the template.

### DATA: Ongoing project entry had no usable data
**File:** `projects.json` — `ongoing[0]`  
**Problem:** The ongoing project only had `id`, `assetFolder`, and `heroImage`. Fields for title, category, location, type, status, completion, progress, and description were completely absent.  
**Fix:** Added all required fields: title ("Commercial Building"), category, location, type, status ("Under Construction"), completion ("2026"), progress (60%), and description.

### UI: Projects not visually differentiated by category
**Files:** `script.js`, `style.css`  
**Problem:** All project cards looked identical — no visual indicator to distinguish Residential from Commercial, Interior, or Renovation projects. The `category` class was applied to the image div but had no corresponding CSS rules.  
**Fix:**  
- Added color-coded **category badges** (pill-shaped labels) to every project card on both the homepage and completed-projects page.  
- Badge color scheme: Residential (green), Commercial (blue), Interior (orange), Renovation (red).  
- Removed the unused `${project.category}` class from the image `<div>`.  
- Added `.category-badge` CSS with per-category color classes to `style.css`.

### UI: Filter button & "no projects" styles only defined inline
**File:** `style.css`  
**Problem:** `.filter-btn`, `.project-filter`, and `.no-projects` styles were only in `<style>` blocks inside `completed.html` and `ongoing.html`, making them fragile and scattered.  
**Fix:** Added canonical styles for `.project-filter`, `.filter-btn`, `.filter-btn:hover`, `.filter-btn.active`, and `.no-projects` to `style.css`. Inline duplicates still work (same specificity) and can be removed later.

### TEXT: Typo — "Our Handwork" (index.html)
**File:** `index.html`  
**Problem:** Section heading read "Our Handwork: Signature Projects" — "Handwork" is not standard English.  
**Fix:** Corrected to "Our Handiwork: Signature Projects".

### TEXT: Duplicate word "quality" in hero subtitle (index.html)
**File:** `index.html`  
**Problem:** Subtitle read "Premium **quality** construction solutions, engineered for **quality** and delivered on time."  
**Fix:** Changed to "Premium construction solutions, engineered for **excellence** and delivered on time."

### TEXT: "Gym interior" title not capitalized (projects.json)
**File:** `projects.json` — project `p10-gym-interior`  
**Fix:** Changed `"Gym interior - Pongalur"` → `"Gym Interior - Pongalur"`.

### TEXT: "pickle ball" misspelling & inconsistent abbreviations (projects.json)
**File:** `projects.json` — `p10` fullDescription  
**Problem:** "pickle ball" (should be one word "Pickleball"), `Gf`/`Ff` inconsistent with `GF`/`FF` used elsewhere, "pongalur" not capitalized.  
**Fix:** Standardized to `"Pickleball"`, `"GF"` / `"FF"`, `"Pongalur"` and reformatted all fullDescription fields with pipe separators for readability.

### TEXT: "House - Slide Show" nonsensical project title (projects.json)
**File:** `projects.json` — project `p04-house`  
**Problem:** Title "House - Slide Show" was a dev artifact (the project's hero image comes from the SlideShow folder). Not a meaningful project name.  
**Fix:** Renamed to `"Residential House"`.

### TEXT: "Project 07 - Unknown" placeholder title & description (projects.json)
**File:** `projects.json` — project `p07-project-07-2`  
**Problem:** Title "Project 07 - Unknown", location "Unknown", description "Details of this project are not specified." — all placeholder text that should never appear on a live site.  
**Fix:** Renamed to `"Commercial Project - P07"`, location to `"Tamil Nadu"`, description to `"A commercial construction project."`.

### CODE: Development comment noise cleaned up (script.js)
**File:** `script.js`  
**Problem:** Comments like `// ⭐ NEW: ...⭐` and `// NEW: ...` scattered throughout — development artifacts not appropriate for production.  
**Fix:** Replaced with clean, professional comments.

### ENHANCEMENT: About Us page — replaced gray placeholders with professional images
**File:** `about.html`  
**Problem:** The story section and founder photo both rendered as flat gray rectangles (`background-color: #ddd` / `#ccc`) with a CSS rule `.story-image { background-image: none !important; }` actively hiding any image.  
**Fix:**  
- Removed the `!important` override that forced `background-image: none`.  
- Added an Unsplash construction-site photo for the mission story section (`mission-img` class).  
- Added an Unsplash professional portrait for Mr. Sanjay G's founder photo.  
- Added `role="img"` and `aria-label` to the story image div for accessibility.

### ENHANCEMENT: YouTube video player added to homepage
**Files:** `index.html`, `style.css`  
**Problem:** The homepage had no video content to showcase the company's work visually.  
**Fix:**  
- Added a new full-width "See Our Work in Action" section above the contact CTA on the homepage.  
- Embedded the provided YouTube video (`i_FsWlMlXLI`) in a responsive 16:9 wrapper with `loading="lazy"`.  
- Styled with the primary-color background, rounded corners, and box-shadow for a polished look.  
- The iframe uses `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"` and `allowfullscreen` for full YouTube player functionality.

---

### Summary of Files Modified
| File | Changes |
|---|---|
| `script.js` | Nav detection fix, DOM-based page loading, category badges, safe defaults for ongoing, comment cleanup |
| `style.css` | Added category badge styles, filter button styles, no-projects style, **video section styles** |
| `index.html` | Fixed "Handwork" typo, removed duplicate "quality", **added YouTube video section** |
| `about.html` | **Replaced placeholder images with Unsplash photos, added accessibility attributes** |
| `projects.json` | Fixed 6 text issues, completed ongoing project data |
| `PROJECT_ANALYSIS.md` | Added this changelog |

---

*Analysis generated on April 27, 2026  
Changelog updated on April 27, 2026*
