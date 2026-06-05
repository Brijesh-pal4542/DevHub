//main box changer...
const dashboard=document.querySelector(".main-box-dashboard");
const github=document.querySelector(".main-box-github");
const notes=document.querySelector(".main-box-notes");
const pomodoro=document.querySelector(".main-box-pomodoro");
const goals=document.querySelector(".main-box-goals");

document.querySelector("#menu-dashboard").addEventListener("click",()=>{
    github.classList.add("hidden");
    notes.classList.add("hidden");
    pomodoro.classList.add("hidden");
    goals.classList.add("hidden");
    dashboard.classList.remove("hidden");
    updateRecentNotes();
});
document.querySelector("#menu-github").addEventListener("click",()=>{
    dashboard.classList.add("hidden");
    notes.classList.add("hidden");
    pomodoro.classList.add("hidden");
    goals.classList.add("hidden");
    github.classList.remove("hidden");
});
document.querySelector("#menu-notes").addEventListener("click",()=>{
    dashboard.classList.add("hidden");
    github.classList.add("hidden");
    pomodoro.classList.add("hidden");
    goals.classList.add("hidden");
    notes.classList.remove("hidden");
});
document.querySelector("#menu-pomodoro").addEventListener("click",()=>{
    dashboard.classList.add("hidden");
    github.classList.add("hidden");
    notes.classList.add("hidden");
    goals.classList.add("hidden");
    pomodoro.classList.remove("hidden");
});
document.querySelector("#menu-daily-goals").addEventListener("click",()=>{
    dashboard.classList.add("hidden");
    github.classList.add("hidden");
    notes.classList.add("hidden");
    pomodoro.classList.add("hidden");
    goals.classList.remove("hidden");
});

//github profile finder...
const searchBtn = document.querySelector('.search-box button');
const usernameInput = document.querySelector('.search-box input');
const profilePic = document.querySelector('.profile-pic');
const profileName = document.querySelector('.profile-detail h3');
const repo = document.querySelector('#repos');
const follower = document.querySelector('#follower');
const following = document.querySelector('#following');
const userLocation = document.getElementById('loc');
const bio = document.getElementById('bio');
const gists = document.getElementById('gists');
const joiningDate = document.getElementById('joining-date');
const repo1 = document.querySelector('#repo1');
const repo2 = document.querySelector('#repo2');
const repo3 = document.querySelector('#repo3');
searchBtn.addEventListener('click', searchGithub);
usernameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchGithub();
    }
});
async function searchGithub() {
    const username = usernameInput.value.trim();
    if (username === '') {
        alert('Please enter a username');
        return;
    }
    try {
        const url = `https://api.github.com/users/${username}`;
        const url_repo=`https://api.github.com/users/${username}/repos`;
        const response = await fetch(url);
        const response_repo = await fetch(url_repo);
        if (!response.ok && !response_repo.ok) {
            if (response.status === 404) {
                alert('User or repo not found!');
            } else {
                alert('Error fetching data from GitHub.');
            }
            return;
        }
        const data = await response.json();
        const data_repo = await response_repo.json();
        updateProfile(data,data_repo);
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please check your internet connection.');
    }
}
function updateProfile(user,user_repo) {
    profilePic.style.backgroundImage = `url('${user.avatar_url}')`;
    profileName.innerText = user.name || user.login;
    bio.innerText = user.bio || 'Bio not available';
    userLocation.innerText = user.location || 'Location not available';
    const date = new Date(user.created_at);
    joiningDate.innerText = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
    repo.innerText = user.public_repos;
    follower.innerText = user.followers;
    following.innerText = user.following;
    gists.innerText = user.public_gists;
    repo1.innerText=user_repo[0].name;
    repo1.href=`https://github.com/${user.login}/${user_repo[0].name}`;
    repo2.innerText=user_repo[1].name;
    repo2.href=`https://github.com/${user.login}/${user_repo[1].name}`;
    repo3.innerText=user_repo[2].name;
    repo3.href=`https://github.com/${user.login}/${user_repo[2].name}`;
}

//notes section localstorage logic...
function saveNotes() {
    const notes = [];
    document.querySelectorAll('#notes .card').forEach(card => {
        notes.push({
            title: card.querySelector('h2').innerText,
            content: card.querySelector('p').innerText
        });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        const h2 = document.createElement('h2');
        h2.contentEditable = true;
        h2.innerText = note.title;
        const p = document.createElement('p');
        p.contentEditable = true;
        p.innerText = note.content;
        h2.addEventListener('input', saveNotes);
        p.addEventListener('input', saveNotes);
        cardDiv.appendChild(h2);
        cardDiv.appendChild(p);
        container.appendChild(cardDiv);
    });
    updateNotesCount();
    updateRecentNotes();
}

//notes main-box logic...
const container = document.querySelector('#notes');
const addBtn = document.getElementById('add-note');
const deleteBtn = document.getElementById('delete-note');
function updateNotesCount() {
    const totalNotes = container.querySelectorAll('.card').length;
    document.getElementById('notes-created').textContent = totalNotes;
}
addBtn.onclick = function() {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    const h2 = document.createElement('h2');
    h2.contentEditable = true;
    h2.innerText = 'New Note';
    const p = document.createElement('p');
    p.contentEditable = true;
    p.innerText = 'Type your note here...';
    h2.addEventListener('input', saveNotes);
    p.addEventListener('input', saveNotes);
    cardDiv.appendChild(h2);
    cardDiv.appendChild(p);
    container.appendChild(cardDiv);
    updateNotesCount();
    updateRecentNotes();
    saveNotes();
};
deleteBtn.onclick = function() {
    const cards = container.querySelectorAll('.card');
    if (cards.length > 0) {
        cards[0].remove();
        updateNotesCount();
        saveNotes();
        updateRecentNotes();
    } else {
        alert('No notes to delete!');
    }
};
updateNotesCount();

//pomodoro logic...
const timerDisplay = document.querySelector('.timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const stopBtn = document.getElementById('stop');
let timeLeft = 25 * 60;
let timerInterval = null;
let isRunning = false;
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayMin = minutes < 10 ? `0${minutes}` : minutes;
    const displaySec = seconds < 10 ? `0${seconds}` : seconds;
    timerDisplay.textContent = `${displayMin}:${displaySec}`;
}
startBtn.addEventListener('click', () => {
    if (isRunning) return; 
    if (timeLeft === 0) return;
    isRunning = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            alert("Pomodoro Complete! Take a break.");
        }
    }, 1000);
});
pauseBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
});
stopBtn.addEventListener('click', () => {
clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay();
});

//goals local storage logic...
function saveGoals() {
    const goals = [];
    document.querySelectorAll('.goal-item').forEach(goal => {
        goals.push({
            text: goal.querySelector('label').textContent,
            completed: goal.querySelector('input').checked
        });
    });
    localStorage.setItem('goals', JSON.stringify(goals));
}
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.forEach(goal => {
        createGoal(goal.text, goal.completed);
    });
    updateCompletedGoals();
}
//goals main-box logic...
const goalInput = document.querySelector('#goal-input');
const addButton = document.querySelector('#add-goal');
const goalsContainer = document.querySelector('.goals');
const goalsDashboard = document.querySelector('#goals-dashboard');
function createGoal(goalText, completed = false) {
    const uniqueId = 'goal-' + Date.now() + Math.random();
    const newGoalDiv = document.createElement('div');
    newGoalDiv.className = 'goal-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = uniqueId;
    checkbox.checked = completed;
    const label = document.createElement('label');
    label.htmlFor = uniqueId;
    label.textContent = goalText;
    checkbox.addEventListener('change', () => {
        updateCompletedGoals();
        saveGoals();
    });
    const removeButton = document.createElement('button');
    removeButton.textContent = '-';
    removeButton.className = 'remove-goal';
    removeButton.addEventListener('click', function() {
        goalsContainer.removeChild(newGoalDiv);
        updateCompletedGoals();
        saveGoals();
    });
    newGoalDiv.appendChild(checkbox);
    newGoalDiv.appendChild(label);
    newGoalDiv.appendChild(removeButton);
    goalsContainer.appendChild(newGoalDiv);
}
function addGoal() {
    const goalText = goalInput.value.trim();
    if(goalText === ''){
        alert('Please enter a goal!');
        return;
    }
    createGoal(goalText);
    goalInput.value = '';
    updateCompletedGoals();
    saveGoals();
}
addButton.addEventListener('click', addGoal);
goalInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addGoal();
    }
});

//dashboard logic...
function updateCompletedGoals() {
    const totalGoals = document.querySelectorAll('.goal-item input[type="checkbox"]').length;
    const completedGoals = document.querySelectorAll('.goal-item input[type="checkbox"]:checked').length;
    document.getElementById('goals-completed').textContent =`${completedGoals}/${totalGoals}`;
    document.getElementById('todays-goals').textContent =`${completedGoals}/${totalGoals} Completed`;
    saveGoals();
}
function updateNotesCount() {
    const totalNotes = container.querySelectorAll('.card').length;
    document.getElementById('notes-created').textContent = totalNotes;
}
function updateRecentNotes() {
    const notesContainer = document.querySelector('#notes');
    const recentNotesContainer = document.querySelector('#recent-notes');
    const notes = notesContainer.querySelectorAll('.card');
    recentNotesContainer.innerHTML = '';
    const recentNotes = Array.from(notes).slice(-5).reverse();
    recentNotes.forEach(note => {
        const title = note.querySelector('h2').innerText;
        const content = note.querySelector('p').innerText;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h5>${title}</h5>
            <p>${content.substring(0, 100)}...</p>
        `;
        recentNotesContainer.appendChild(card);
    });
}
loadNotes();
loadGoals();
updateCompletedGoals();
updateRecentNotes();