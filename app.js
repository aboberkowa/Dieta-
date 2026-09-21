const STORAGE_KEY = 'moje-menu-pwa-v1';
const CHECKS_KEY = 'moje-menu-shopping-checks-v1';

function loadMeals(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(Array.isArray(saved) && saved.length === 21) return saved;
  }catch(e){}
  return structuredClone(DEFAULT_MEALS);
}

let meals = loadMeals();
let shoppingChecks = {};
try{ shoppingChecks = JSON.parse(localStorage.getItem(CHECKS_KEY)) || {}; }catch(e){}

const weekGrid = document.getElementById('weekGrid');
const recipeList = document.getElementById('recipeList');
const shoppingList = document.getElementById('shoppingList');
const useUpList = document.getElementById('useUpList');
const recipeDialog = document.getElementById('recipeDialog');
const recipeSearch = document.getElementById('recipeSearch');

function mealByCode(code){ return meals.find(m => m.code === code); }

function renderWeek(){
  const days = [...new Set(meals.map(m => m.day))];
  weekGrid.innerHTML = days.map(day => {
    const dayMeals = meals.filter(m => m.day === day).sort((a,b)=>a.slot-b.slot);
    return `<article class="day-card"><div class="day-title">${day}</div>${dayMeals.map(m => `
      <div class="meal-row">
        <span class="meal-code">${m.code}</span>
        <div>
          <div class="meal-name">${m.name}</div>
          <div class="meal-sub">Posiłek ${m.slot} • ${m.time}</div>
        </div>
        <button class="details-btn" data-code="${m.code}">Przepis</button>
      </div>`).join('')}</article>`;
  }).join('');
}

function renderRecipes(filter=''){
  const q = filter.trim().toLowerCase();
  const filtered = meals.filter(m => !q || m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q));
  recipeList.innerHTML = filtered.map(m => `
    <article class="recipe-card">
      <span class="meal-code">${m.code}</span>
      <div><div class="meal-name">${m.name}</div><div class="meal-sub">${m.day} • ${m.type}</div></div>
      <button class="details-btn" data-code="${m.code}">Otwórz</button>
    </article>`).join('') || '<p class="muted">Brak wyników.</p>';
}

function openRecipe(code){
  const m = mealByCode(code); if(!m) return;
  document.getElementById('dialogCode').textContent = m.code;
  document.getElementById('dialogTitle').textContent = m.name;
  document.getElementById('dialogMeta').textContent = `${m.day} • Posiłek ${m.slot} • ${m.time}`;
  document.getElementById('dialogBody').innerHTML = `
    <div class="tagline">${m.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <h4>Składniki</h4>
    <ul>${m.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
    <h4>Przygotowanie</h4>
    <ol>${m.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    ${m.note ? `<div class="note"><strong>Wskazówka:</strong> ${m.note}</div>` : ''}
  `;
  recipeDialog.showModal();
}

function renderShopping(){
  shoppingList.innerHTML = Object.entries(SHOPPING_GROUPS).map(([group,items])=>`
    <section class="shopping-group"><h3>${group}</h3>${items.map(([name,qty])=>{
      const key = `${group}::${name}`;
      const checked = !!shoppingChecks[key];
      return `<label class="check-row ${checked?'checked':''}"><input type="checkbox" data-shop-key="${encodeURIComponent(key)}" ${checked?'checked':''}><span class="item-text">${name}<span class="qty">${qty}</span></span></label>`;
    }).join('')}</section>`).join('');
}

function renderUseUp(){
  useUpList.innerHTML = USE_UP.map(x=>`<article class="useup-card"><h3>${x.name}</h3><p>${x.text}</p></article>`).join('');
}

function switchView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  document.querySelector(`.tab[data-view="${name}"]`).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-code]');
  if(btn) openRecipe(btn.dataset.code);

  const tab = e.target.closest('.tab[data-view]');
  if(tab) switchView(tab.dataset.view);
});

recipeSearch.addEventListener('input', e => renderRecipes(e.target.value));

shoppingList.addEventListener('change', e => {
  const input = e.target.closest('input[data-shop-key]');
  if(!input) return;
  const key = decodeURIComponent(input.dataset.shopKey);
  shoppingChecks[key] = input.checked;
  localStorage.setItem(CHECKS_KEY, JSON.stringify(shoppingChecks));
  input.closest('.check-row').classList.toggle('checked', input.checked);
});

document.getElementById('clearChecksBtn').addEventListener('click', ()=>{
  shoppingChecks = {};
  localStorage.removeItem(CHECKS_KEY);
  renderShopping();
});

document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(confirm('Przywrócić domyślne dane i odznaczyć listę zakupów?')){
    meals = structuredClone(DEFAULT_MEALS);
    shoppingChecks = {};
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CHECKS_KEY);
    renderWeek(); renderRecipes(); renderShopping(); renderUseUp();
  }
});

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

renderWeek();
renderRecipes();
renderShopping();
renderUseUp();
