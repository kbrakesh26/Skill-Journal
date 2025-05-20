// Get references to form and skill list container

const form = document.getElementById('skill-form');
const skillList = document.getElementById('skill-list');

let editIndex = null;

let skills = JSON.parse(localStorage.getItem('skills')) || [];

// Function to render each skill card
function renderSkillCard(skill, index) {
  const skillCard = document.createElement('div');
  skillCard.classList.add('fade-in');
  skillCard.className = 'skill-card';
  skillCard.setAttribute('data-level', skill.level); // for filtering

  // Emoji badge for level
  const levelEmojiMap = {
    'Beginner': '🐣',
    'Intermediate': '🚀',
    'Advanced': '🧠'
  };

  const emoji = levelEmojiMap[skill.level] || '';

  // Build the card content
  skillCard.innerHTML = `
    <h3>${skill.name}</h3>
    <p><strong>Level:</strong> 
      <span class="level-badge ${skill.level.toLowerCase()}" title="Skill Level: ${skill.level}">
        ${emoji} ${skill.level}
      </span>
    </p>
    ${skill.notes ? `<p><strong>Notes:</strong> ${skill.notes}</p>` : ''}
    <p class="date-added">🗓️ Added on: ${skill.date}</p>
    <button class="edit-btn" data-index="${index}">Edit</button>
    <button class="delete-btn" data-index="${index}">Delete</button>
  `;


  // Add progress bar below level
  const progressWrapper = document.createElement('div');
  progressWrapper.className = 'progress-bar-wrapper';

  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');

  if (skill.level === 'Beginner') {
    progressBar.classList.add('progress-beginner');
  } else if (skill.level === 'Intermediate') {
    progressBar.classList.add('progress-intermediate');
  } else if (skill.level === 'Advanced') {
    progressBar.classList.add('progress-advanced');
  }

  progressWrapper.appendChild(progressBar);
  skillCard.appendChild(progressWrapper);

  // Append to skill list
  skillList.appendChild(skillCard);
}

function refreshSkillList() {
  skillList.innerHTML = '';
  skills.forEach((skill, index) => {
    renderSkillCard(skill, index);
  });
}

// Listening for form submission

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const skill = {
    name: document.getElementById('skill-name').value.trim(),
    level: document.getElementById('skill-level').value,
    notes: document.getElementById('skill-notes').value.trim(),
    date: new Date().toLocaleDateString()
  };

  if (editIndex !== null) {
    // Update existing skill
    skills[editIndex] = { ...skill, date: skills[editIndex].date }; // Keep original date
    editIndex = null;
    form.querySelector('button[type="submit"]').textContent = 'Add Skill';
  } else {
    // Add new skill
    skills.push(skill);
  }

  localStorage.setItem('skills', JSON.stringify(skills));
  refreshSkillList();
  form.reset();
});

// Filter functionality
const filterSelect = document.getElementById('filter');

// Search Functionality
const searchInput = document.getElementById('search');

// Listen to both filter and search inputs
filterSelect.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);

// Combined Function For Search And Level

function applyFilters() {
  const selectedLevel = filterSelect.value;
  const query = searchInput.value.toLowerCase();

  const allCards = document.querySelectorAll('.skill-card');

  allCards.forEach(card => {
    const cardLevel = card.getAttribute('data-level');
    const skillName = card.querySelector('h3').textContent.toLowerCase();

    const matchesLevel = selectedLevel === 'All' || cardLevel === selectedLevel;
    const matchesSearch = skillName.includes(query);

    if (matchesLevel && matchesSearch) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Load skills from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  skillList.innerHTML = '';
  skills.forEach((skill, index) => {
    renderSkillCard(skill, index);
  });
});

// Function to listen for delete and edit clicks

skillList.addEventListener('click', function (e) {

  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    skills.splice(index, 1);
    localStorage.setItem('skills', JSON.stringify(skills));
    refreshSkillList();
  }

  if (e.target.classList.contains('edit-btn')) {
    const index = e.target.getAttribute('data-index');
    const skillToEdit = skills[index];

    document.getElementById('skill-name').value = skillToEdit.name;
    document.getElementById('skill-level').value = skillToEdit.level;
    document.getElementById('skill-notes').value = skillToEdit.notes;

    editIndex = index; // Set the global variable
    form.querySelector('button[type="submit"]').textContent = 'Update Skill'; // Change button label

    // Scroll smoothly to the form section
    const formSection = document.getElementById('skill-form');
    const yOffset = -80; // Adjust this value as needed (like height of fixed header)
    const y = formSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }

});

