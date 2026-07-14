// ==============================
// Typing Animation (accessible)
// - respects prefers-reduced-motion
// - updates aria-live region
// ==============================

const words = [
  "Business Economics Student",
  "Traveler",
  "AI Enthusiast",
  "Technology Explorer",
  "Critical Thinker"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typing = document.getElementById("typing");

function typeEffect() {
  if (!typing) return;

  // respect reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    typing.textContent = words[0];
    return;
  }

  const currentWord = words[wordIndex];

  if (!deleting) {
    typing.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typing.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      wordIndex++;

      if (wordIndex >= words.length) {
        wordIndex = 0;
      }
    }
  }

  setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();


// ==============================
// Smooth Scroll (native fallback already used with CSS 'scroll-behavior')
// ==============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    // let the browser handle normal links
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior: 'smooth'});
  });
});


// ==============================
// IntersectionObserver: reveal on scroll
// ==============================

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

document.querySelectorAll('.card, .hero-content, .quote, .blog-card').forEach(el => {
  revealObserver.observe(el);
});


// ==============================
// Blog renderer (runs on /blog/ page if present)
// Fetches posts.json and injects cards into .blog-grid
// Sorted by date (newest first) and improved accessibility/focus
// ==============================

async function renderBlogList(){
  const grid = document.querySelector('.blog-grid');
  if (!grid) return;

  try{
    const res = await fetch('/posts.json');
    if (!res.ok) throw new Error('posts.json not found');
    const posts = await res.json();

    // sort by date descending
    posts.sort((a,b) => new Date(b.date) - new Date(a.date));

    posts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'blog-card';

      // accessible link with descriptive label
      const link = document.createElement('a');
      link.className = 'card-link';
      link.href = post.url;
      link.setAttribute('aria-label', `Read: ${post.title}`);

      link.innerHTML = `
        <div class="card-cover">
          <img src="${post.coverImage}" alt="${post.title} cover image" loading="lazy">
        </div>
        <div class="card-body">
          <div class="card-meta">${new Date(post.date).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}${post.location ? ' • ' + post.location : ''}</div>
          <h3 class="card-title">${post.title}</h3>
          <p class="card-excerpt">${post.excerpt}</p>
          <div class="card-tags">${(post.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        </div>
      `;

      card.appendChild(link);
      grid.appendChild(card);
      revealObserver.observe(card);
    });

  }catch(err){
    console.warn('Could not render blog list', err);
  }
}

renderBlogList();
