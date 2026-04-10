// ============================================
// ADMIN PANEL — CRUD Operations
// ============================================

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let isLoggedIn = false;
const COLORS = ['coral', 'sunflower', 'mint', 'ocean', 'grape', 'blush'];

// ── Toast Notifications ──────────────────────

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-mint' : type === 'error' ? 'bg-coral' : 'bg-ocean';
  toast.className = `toast px-5 py-3 rounded-xl ${bg} text-gray-900 font-medium text-sm shadow-lg`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Login ────────────────────────────────────

async function attemptLogin() {
  const password = document.getElementById('login-password').value;
  if (!password) return;

  try {
    const { data, error } = await db
      .from('profile')
      .select('admin_password')
      .eq('id', 1)
      .single();

    console.log('Login response:', { data, error });

    if (error) {
      showToast('Could not connect to database: ' + error.message, 'error');
      return;
    }

  if (data.admin_password === password) {
    isLoggedIn = true;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadProfileData();
    loadSkillsData();
  } else {
    document.getElementById('login-error').classList.remove('hidden');
  }
  } catch (err) {
    console.error('Login error:', err);
    showToast('Connection error: ' + err.message, 'error');
  }
}

// Enter key on password field
document.getElementById('login-password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') attemptLogin();
});

function logout() {
  isLoggedIn = false;
  document.getElementById('admin-dashboard').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-password').value = '';
}

// ── Tab Switching ────────────────────────────

function switchTab(tab) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('border-ocean', 'text-ocean');
    b.classList.add('border-transparent', 'text-gray-400');
  });
  document.getElementById(`tab-${tab}`).classList.remove('hidden');
  const btn = document.querySelector(`[data-tab="${tab}"]`);
  btn.classList.add('border-ocean', 'text-ocean');
  btn.classList.remove('border-transparent', 'text-gray-400');
}

// ── Load Profile Data ────────────────────────

async function loadProfileData() {
  const { data, error } = await db
    .from('profile')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) return;

  // Hero
  document.getElementById('edit-name').value = data.name || '';
  document.getElementById('edit-title').value = data.title || '';
  document.getElementById('edit-tagline').value = data.tagline || '';
  if (data.avatar_url) {
    document.getElementById('avatar-preview').innerHTML = `<img src="${data.avatar_url}" class="w-full h-full object-cover">`;
  }

  // About
  document.getElementById('edit-about-heading').value = data.about_heading || '';
  document.getElementById('edit-about-text1').value = data.about_text_1 || '';
  document.getElementById('edit-about-text2').value = data.about_text_2 || '';
  if (data.about_photo_url) {
    document.getElementById('about-photo-preview').innerHTML = `<img src="${data.about_photo_url}" class="w-full h-full object-cover rounded-xl">`;
  }

  // Badges
  document.getElementById('edit-badge1-emoji').value = data.badge_1_emoji || '';
  document.getElementById('edit-badge1-text').value = data.badge_1_text || '';
  setIconPreview('badge1-icon-preview', data.badge_1_icon_url, data.badge_1_emoji);
  document.getElementById('edit-badge2-emoji').value = data.badge_2_emoji || '';
  document.getElementById('edit-badge2-text').value = data.badge_2_text || '';
  setIconPreview('badge2-icon-preview', data.badge_2_icon_url, data.badge_2_emoji);

  // Stats
  document.getElementById('edit-stat1-emoji').value = data.stat_1_emoji || '';
  document.getElementById('edit-stat1-label').value = data.stat_1_label || '';
  setIconPreview('stat1-icon-preview', data.stat_1_icon_url, data.stat_1_emoji);
  document.getElementById('edit-stat2-emoji').value = data.stat_2_emoji || '';
  document.getElementById('edit-stat2-label').value = data.stat_2_label || '';
  setIconPreview('stat2-icon-preview', data.stat_2_icon_url, data.stat_2_emoji);
  document.getElementById('edit-stat3-emoji').value = data.stat_3_emoji || '';
  document.getElementById('edit-stat3-label').value = data.stat_3_label || '';
  setIconPreview('stat3-icon-preview', data.stat_3_icon_url, data.stat_3_emoji);

  // Contact
  document.getElementById('edit-email').value = data.email || '';
  document.getElementById('edit-linkedin').value = data.linkedin_url || '';
  document.getElementById('edit-github').value = data.github_url || '';
  setIconPreview('email-icon-preview', data.email_icon_url, null);
  setIconPreview('linkedin-icon-preview', data.linkedin_icon_url, null);
  setIconPreview('github-icon-preview', data.github_icon_url, null);

  // Footer
  document.getElementById('edit-footer').value = data.footer_text || '';
}

// ── Icon Preview Helpers ─────────────────────

function setIconPreview(previewId, iconUrl, emoji) {
  const el = document.getElementById(previewId);
  if (!el) return;
  if (iconUrl) {
    el.innerHTML = `<img src="${iconUrl}" class="w-full h-full object-contain">`;
  } else if (emoji) {
    el.textContent = emoji;
  }
}

function previewInlineIcon(input, previewId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" class="w-full h-full object-contain">`;
  };
  reader.readAsDataURL(file);
}

// ── Save Profile ─────────────────────────────

async function saveProfile() {
  const avatarFile = document.getElementById('avatar-upload').files[0];
  const aboutPhotoFile = document.getElementById('about-photo-upload').files[0];
  const badge1IconFile = document.getElementById('badge1-icon-upload').files[0];
  const badge2IconFile = document.getElementById('badge2-icon-upload').files[0];
  const stat1IconFile = document.getElementById('stat1-icon-upload').files[0];
  const stat2IconFile = document.getElementById('stat2-icon-upload').files[0];
  const stat3IconFile = document.getElementById('stat3-icon-upload').files[0];
  const emailIconFile = document.getElementById('email-icon-upload').files[0];
  const linkedinIconFile = document.getElementById('linkedin-icon-upload').files[0];
  const githubIconFile = document.getElementById('github-icon-upload').files[0];

  const updates = {
    name: document.getElementById('edit-name').value,
    title: document.getElementById('edit-title').value,
    tagline: document.getElementById('edit-tagline').value,
    about_heading: document.getElementById('edit-about-heading').value,
    about_text_1: document.getElementById('edit-about-text1').value,
    about_text_2: document.getElementById('edit-about-text2').value,
    email: document.getElementById('edit-email').value,
    linkedin_url: document.getElementById('edit-linkedin').value,
    github_url: document.getElementById('edit-github').value,
    badge_1_emoji: document.getElementById('edit-badge1-emoji').value,
    badge_1_text: document.getElementById('edit-badge1-text').value,
    badge_2_emoji: document.getElementById('edit-badge2-emoji').value,
    badge_2_text: document.getElementById('edit-badge2-text').value,
    stat_1_emoji: document.getElementById('edit-stat1-emoji').value,
    stat_1_label: document.getElementById('edit-stat1-label').value,
    stat_2_emoji: document.getElementById('edit-stat2-emoji').value,
    stat_2_label: document.getElementById('edit-stat2-label').value,
    stat_3_emoji: document.getElementById('edit-stat3-emoji').value,
    stat_3_label: document.getElementById('edit-stat3-label').value,
    footer_text: document.getElementById('edit-footer').value,
  };

  // Upload avatar if selected
  if (avatarFile) {
    const url = await uploadImage(avatarFile, 'avatar');
    if (url) updates.avatar_url = url;
  }

  // Upload about photo if selected
  if (aboutPhotoFile) {
    const url = await uploadImage(aboutPhotoFile, 'about-photo');
    if (url) updates.about_photo_url = url;
  }

  // Upload badge/stat icons if selected
  if (badge1IconFile) { const url = await uploadImage(badge1IconFile, 'badge1-icon'); if (url) updates.badge_1_icon_url = url; }
  if (badge2IconFile) { const url = await uploadImage(badge2IconFile, 'badge2-icon'); if (url) updates.badge_2_icon_url = url; }
  if (stat1IconFile) { const url = await uploadImage(stat1IconFile, 'stat1-icon'); if (url) updates.stat_1_icon_url = url; }
  if (stat2IconFile) { const url = await uploadImage(stat2IconFile, 'stat2-icon'); if (url) updates.stat_2_icon_url = url; }
  if (stat3IconFile) { const url = await uploadImage(stat3IconFile, 'stat3-icon'); if (url) updates.stat_3_icon_url = url; }
  if (emailIconFile) { const url = await uploadImage(emailIconFile, 'email-icon'); if (url) updates.email_icon_url = url; }
  if (linkedinIconFile) { const url = await uploadImage(linkedinIconFile, 'linkedin-icon'); if (url) updates.linkedin_icon_url = url; }
  if (githubIconFile) { const url = await uploadImage(githubIconFile, 'github-icon'); if (url) updates.github_icon_url = url; }

  const { error } = await db
    .from('profile')
    .update(updates)
    .eq('id', 1);

  if (error) {
    showToast('Failed to save: ' + error.message, 'error');
  } else {
    showToast('Saved successfully!');
  }
}

// ── Image Upload ─────────────────────────────

async function uploadImage(file, prefix) {
  if (file.size > 2 * 1024 * 1024) {
    showToast('File too large (max 2MB)', 'error');
    return null;
  }

  const ext = file.name.split('.').pop();
  const fileName = `${prefix}-${Date.now()}.${ext}`;

  const { data, error } = await db.storage
    .from('images')
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error('Upload error details:', JSON.stringify(error));
    showToast('Upload failed: ' + (error.message || error.error || JSON.stringify(error)), 'error');
    return null;
  }

  const { data: urlData } = db.storage
    .from('images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

function previewImage(input, previewId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById(previewId);
    const isRound = previewId === 'avatar-preview';
    preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover ${isRound ? 'rounded-full' : 'rounded-xl'}">`;
  };
  reader.readAsDataURL(file);
}

// ── Skills CRUD ──────────────────────────────

let skillsData = [];

async function loadSkillsData() {
  const { data, error } = await db
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return;
  skillsData = data || [];
  renderSkillsList();
}

function renderSkillsList() {
  const container = document.getElementById('skills-list');
  if (skillsData.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">No skills yet. Click "+ Add Skill" to get started.</p>';
    return;
  }

  container.innerHTML = skillsData.map((skill, index) => `
    <div class="p-5 rounded-2xl bg-gray-800/60 border border-gray-700/50 space-y-4" data-id="${skill.id}">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          ${skill.icon_url
            ? `<img src="${skill.icon_url}" class="w-8 h-8 object-contain rounded">`
            : `<span class="text-2xl">${skill.emoji || '?'}</span>`}
          <span class="font-display font-semibold">${skill.title || 'Untitled'}</span>
          <span class="px-2 py-0.5 text-xs rounded-full bg-${skill.color}/20 text-${skill.color}">${skill.color}</span>
        </div>
        <div class="flex gap-2">
          ${index > 0 ? `<button onclick="moveSkill('${skill.id}', -1)" class="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors" title="Move up">&#9650;</button>` : ''}
          ${index < skillsData.length - 1 ? `<button onclick="moveSkill('${skill.id}', 1)" class="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors" title="Move down">&#9660;</button>` : ''}
          <button onclick="toggleEditSkill('${skill.id}')" class="p-1.5 rounded-lg hover:bg-gray-700 text-ocean transition-colors" title="Edit">&#9998;</button>
          <button onclick="deleteSkill('${skill.id}')" class="p-1.5 rounded-lg hover:bg-gray-700 text-coral transition-colors" title="Delete">&#128465;</button>
        </div>
      </div>
      <div id="edit-skill-${skill.id}" class="hidden space-y-3">
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Emoji (or leave empty if using icon)</label>
            <input type="text" value="${skill.emoji || ''}" class="skill-emoji w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-ocean focus:outline-none text-lg" maxlength="4">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Custom Icon (overrides emoji)</label>
            <div class="flex items-center gap-2">
              <div class="skill-icon-preview w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden">
                ${skill.icon_url ? `<img src="${skill.icon_url}" class="w-full h-full object-contain">` : '<span class="text-gray-600 text-xs">none</span>'}
              </div>
              <div>
                <input type="file" accept="image/*" class="skill-icon-upload hidden" onchange="previewSkillIcon(this, '${skill.id}')">
                <button onclick="this.parentElement.querySelector('.skill-icon-upload').click()" class="px-2 py-1 text-xs rounded-lg bg-gray-900 border border-gray-700 hover:border-ocean transition-colors">Upload</button>
                ${skill.icon_url ? `<button onclick="clearSkillIcon('${skill.id}')" class="px-2 py-1 text-xs rounded-lg text-coral hover:bg-gray-700 transition-colors">Clear</button>` : ''}
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Color</label>
            <select class="skill-color w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-ocean focus:outline-none">
              ${COLORS.map(c => `<option value="${c}" ${skill.color === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Title</label>
          <input type="text" value="${skill.title || ''}" class="skill-title w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-ocean focus:outline-none">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Description</label>
          <textarea rows="2" class="skill-desc w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-ocean focus:outline-none resize-none">${skill.description || ''}</textarea>
        </div>
        <button onclick="saveSkill('${skill.id}')" class="px-4 py-2 text-sm rounded-lg bg-ocean/20 text-ocean hover:bg-ocean/30 transition-colors">
          Save Skill
        </button>
      </div>
    </div>
  `).join('');
}

function toggleEditSkill(id) {
  const el = document.getElementById(`edit-skill-${id}`);
  el.classList.toggle('hidden');
}

async function saveSkill(id) {
  const container = document.querySelector(`[data-id="${id}"]`);
  const iconFile = container.querySelector('.skill-icon-upload')?.files[0];

  const updates = {
    emoji: container.querySelector('.skill-emoji').value,
    title: container.querySelector('.skill-title').value,
    description: container.querySelector('.skill-desc').value,
    color: container.querySelector('.skill-color').value,
  };

  // Upload icon if selected
  if (iconFile) {
    const url = await uploadImage(iconFile, `skill-icon-${id}`);
    if (url) updates.icon_url = url;
  }

  const { error } = await db
    .from('skills')
    .update(updates)
    .eq('id', id);

  if (error) {
    showToast('Failed to save skill', 'error');
  } else {
    showToast('Skill updated!');
    loadSkillsData();
  }
}

async function addSkill() {
  const maxOrder = skillsData.length > 0
    ? Math.max(...skillsData.map(s => s.sort_order || 0))
    : 0;

  const { error } = await db
    .from('skills')
    .insert({
      emoji: '&#11088;',
      title: 'New Skill',
      description: 'Describe this skill...',
      color: COLORS[skillsData.length % COLORS.length],
      sort_order: maxOrder + 1,
    });

  if (error) {
    showToast('Failed to add skill', 'error');
  } else {
    showToast('Skill added!');
    loadSkillsData();
  }
}

async function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;

  const { error } = await db
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) {
    showToast('Failed to delete skill', 'error');
  } else {
    showToast('Skill deleted');
    loadSkillsData();
  }
}

function previewSkillIcon(input, skillId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const container = document.querySelector(`[data-id="${skillId}"]`);
    const preview = container.querySelector('.skill-icon-preview');
    preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-contain">`;
  };
  reader.readAsDataURL(file);
}

async function clearSkillIcon(id) {
  const { error } = await db
    .from('skills')
    .update({ icon_url: null })
    .eq('id', id);

  if (!error) {
    showToast('Icon cleared');
    loadSkillsData();
  }
}

async function moveSkill(id, direction) {
  const index = skillsData.findIndex(s => s.id === id);
  const swapIndex = index + direction;
  if (swapIndex < 0 || swapIndex >= skillsData.length) return;

  const current = skillsData[index];
  const swap = skillsData[swapIndex];

  await db.from('skills').update({ sort_order: swap.sort_order }).eq('id', current.id);
  await db.from('skills').update({ sort_order: current.sort_order }).eq('id', swap.id);

  loadSkillsData();
}
