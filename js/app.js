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

  // Contact links — only show if URL/email is provided
  const contactContainer = document.getElementById('contact-links');
  if (contactContainer) {
    const defaultEmailSvg = '<svg class="w-5 h-5 text-coral group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>';
    const defaultLinkedinSvg = '<svg class="w-5 h-5 text-ocean group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>';
    const defaultGithubSvg = '<svg class="w-5 h-5 text-gray-300 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';

    const links = [];
    if (data.email) {
      const icon = data.email_icon_url ? `<img src="${data.email_icon_url}" class="w-5 h-5 object-contain group-hover:scale-110 transition-transform">` : defaultEmailSvg;
      links.push(`<a href="mailto:${data.email}" class="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-800/60 border border-gray-700/50 hover:border-coral/50 transition-all duration-300 hover:-translate-y-1 group">${icon}<span class="text-sm font-medium text-gray-300">Email</span></a>`);
    }
    if (data.linkedin_url) {
      const icon = data.linkedin_icon_url ? `<img src="${data.linkedin_icon_url}" class="w-5 h-5 object-contain group-hover:scale-110 transition-transform">` : defaultLinkedinSvg;
      links.push(`<a href="${data.linkedin_url}" target="_blank" class="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-800/60 border border-gray-700/50 hover:border-ocean/50 transition-all duration-300 hover:-translate-y-1 group">${icon}<span class="text-sm font-medium text-gray-300">LinkedIn</span></a>`);
    }
    if (data.github_url) {
      const icon = data.github_icon_url ? `<img src="${data.github_icon_url}" class="w-5 h-5 object-contain group-hover:scale-110 transition-transform">` : defaultGithubSvg;
      links.push(`<a href="${data.github_url}" target="_blank" class="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gray-800/60 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-300 hover:-translate-y-1 group">${icon}<span class="text-sm font-medium text-gray-300">GitHub</span></a>`);
    }
    contactContainer.innerHTML = links.join('');
  }

  // Footer
  const footerEl = document.getElementById('footer-text');
  if (footerEl && data.footer_text) footerEl.textContent = data.footer_text;

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
