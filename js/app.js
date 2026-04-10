// ============================================
// LANDING PAGE — Dynamic Content Loader
// ============================================

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Color map for skill cards
const colorMap = {
  coral:     { bg: 'bg-coral/20',     border: 'hover:border-coral/50',     iconBg: 'bg-coral/20',     statBg: 'bg-coral/10',     statBorder: 'border-coral/20', text: 'text-coral' },
  sunflower: { bg: 'bg-sunflower/20', border: 'hover:border-sunflower/50', iconBg: 'bg-sunflower/20', statBg: 'bg-sunflower/10', statBorder: 'border-sunflower/20', text: 'text-sunflower' },
  mint:      { bg: 'bg-mint/20',      border: 'hover:border-mint/50',      iconBg: 'bg-mint/20',      statBg: 'bg-mint/10',      statBorder: 'border-mint/20', text: 'text-mint' },
  ocean:     { bg: 'bg-ocean/20',     border: 'hover:border-ocean/50',     iconBg: 'bg-ocean/20',     statBg: 'bg-ocean/10',     statBorder: 'border-ocean/20', text: 'text-ocean' },
  grape:     { bg: 'bg-grape/20',     border: 'hover:border-grape/50',     iconBg: 'bg-grape/20',     statBg: 'bg-grape/10',     statBorder: 'border-grape/20', text: 'text-grape' },
  blush:     { bg: 'bg-blush/20',     border: 'hover:border-blush/50',     iconBg: 'bg-blush/20',     statBg: 'bg-blush/10',     statBorder: 'border-blush/20', text: 'text-blush' },
};

async function loadProfile() {
  const { data, error } = await db
    .from('profile')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.warn('Could not load profile from Supabase, using defaults.');
    return;
  }

  // Hero section
  const nameEl = document.getElementById('profile-name');
  const titleEl = document.getElementById('profile-title');
  const taglineEl = document.getElementById('profile-tagline');
  const avatarEl = document.getElementById('profile-avatar');

  if (nameEl) nameEl.textContent = data.name;
  if (titleEl) titleEl.textContent = data.title;
  if (taglineEl) taglineEl.textContent = data.tagline;
  if (avatarEl && data.avatar_url) {
    avatarEl.innerHTML = `<img src="${data.avatar_url}" alt="${data.name}" class="w-full h-full object-cover rounded-full">`;
  }

  // About section
  const aboutHeading = document.getElementById('about-heading');
  const aboutText1 = document.getElementById('about-text-1');
  const aboutText2 = document.getElementById('about-text-2');
  const aboutPhoto = document.getElementById('about-photo');

  if (aboutHeading) aboutHeading.textContent = data.about_heading;
  if (aboutText1) aboutText1.textContent = data.about_text_1;
  if (aboutText2) aboutText2.textContent = data.about_text_2;
  if (aboutPhoto && data.about_photo_url) {
    aboutPhoto.innerHTML = `<img src="${data.about_photo_url}" alt="About photo" class="w-full h-full object-cover rounded-3xl">`;
  }

  // Floating badges
  const badge1 = document.getElementById('badge-1');
  const badge2 = document.getElementById('badge-2');
  if (badge1) {
    badge1.querySelector('.badge-emoji').innerHTML = data.badge_1_icon_url
      ? `<img src="${data.badge_1_icon_url}" class="w-5 h-5 inline object-contain">`
      : (data.badge_1_emoji || '');
    badge1.querySelector('.badge-text').textContent = data.badge_1_text || '';
  }
  if (badge2) {
    badge2.querySelector('.badge-emoji').innerHTML = data.badge_2_icon_url
      ? `<img src="${data.badge_2_icon_url}" class="w-5 h-5 inline object-contain">`
      : (data.badge_2_emoji || '');
    badge2.querySelector('.badge-text').textContent = data.badge_2_text || '';
  }

  // Quick stats
  function setStatIcon(id, iconUrl, emoji) {
    const el = document.getElementById(id);
    if (!el) return;
    if (iconUrl) {
      el.innerHTML = `<img src="${iconUrl}" class="w-8 h-8 inline object-contain">`;
    } else if (emoji) {
      el.textContent = emoji;
    }
  }
  setStatIcon('stat-1-emoji', data.stat_1_icon_url, data.stat_1_emoji);
  setStatIcon('stat-2-emoji', data.stat_2_icon_url, data.stat_2_emoji);
  setStatIcon('stat-3-emoji', data.stat_3_icon_url, data.stat_3_emoji);
  const s1l = document.getElementById('stat-1-label');
  const s2l = document.getElementById('stat-2-label');
  const s3l = document.getElementById('stat-3-label');
  if (s1l && data.stat_1_label) s1l.textContent = data.stat_1_label;
  if (s2l && data.stat_2_label) s2l.textContent = data.stat_2_label;
  if (s3l && data.stat_3_label) s3l.textContent = data.stat_3_label;

  // Contact links
  const emailLink = document.getElementById('contact-email');
  const linkedinLink = document.getElementById('contact-linkedin');
  const githubLink = document.getElementById('contact-github');

  if (emailLink && data.email) emailLink.href = `mailto:${data.email}`;
  if (linkedinLink && data.linkedin_url) linkedinLink.href = data.linkedin_url;
  if (githubLink && data.github_url) githubLink.href = data.github_url;

  // Page title
  document.title = `${data.name} — ${data.title}`;
}

async function loadSkills() {
  const { data, error } = await db
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    console.warn('Could not load skills from Supabase, using defaults.');
    return;
  }

  const container = document.getElementById('skills-grid');
  if (!container) return;

  container.innerHTML = '';

  data.forEach(skill => {
    const colors = colorMap[skill.color] || colorMap.ocean;
    const card = document.createElement('div');
    card.className = `reveal skill-card transition-all duration-300 p-6 rounded-3xl bg-gray-800/60 border border-gray-700/50 ${colors.border} group cursor-default`;
    card.innerHTML = `
      <div class="w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">${skill.icon_url ? `<img src="${skill.icon_url}" class="w-8 h-8 object-contain">` : skill.emoji}</div>
      <h3 class="font-display font-bold text-lg mb-2">${skill.title}</h3>
      <p class="text-gray-400 text-sm leading-relaxed">${skill.description}</p>
    `;
    container.appendChild(card);
  });

  // Re-observe new elements for scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Load everything on page ready
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadSkills();
});
