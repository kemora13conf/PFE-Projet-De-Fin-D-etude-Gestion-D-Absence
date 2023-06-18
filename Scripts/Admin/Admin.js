import { loadData } from "../utils.js";
import ClassesList from "./Classes/ClassesList.js";
import EtudiantsList from "./Classes/EtudiantsList.js";
import Dashboard from "./Dashboard/Dashboard.js";
import Professors from "./Professors/Professors.js";
import Seances from "./Seances/Seances.js";
import Profile from "./profile/Profile.js";
import Setting from "./profile/Setting.js";
import Statistique from "./Statistique/Statistique.js";

let root = document.getElementById('root');
let alertContainer = document.querySelector('.alerts-container');
let popContainer = document.querySelector('.popup-container');

let header__title = document.getElementById('header-title');
let header__title__details = document.getElementById('header-title-details');
let today__date = document.getElementById('today-date');
let prof__name = document.getElementById('prof-name');
let prof__image = document.getElementById('prof-img');

let dashboardBtn =  document.getElementById('dashboard-btn');
let statistiqueBtn = document.getElementById('statistique-btn');
let profsBtn = document.getElementById('profs-btn');
let classesBtn = document.getElementById('classes-btn');
let seancesBtn = document.getElementById('seances-btn');
let profileBtn = document.getElementById('profile-btn');
let settingsBtn = document.getElementById('settings-btn');

function goTo(callback_func){
    if(root.children.length != 0){
        root.children[0].classList.add('remove-content')
        setTimeout(()=>{
            root.innerHTML = '';
            callback_func();
        }, 250)
    }
}

function updateUI(res, title, subTitle){
    if(res.code == 401) location.reload(); // the code 401 is returned when the user is not logged in
    let genderWord = res.gender == "Homme" ? "M" : "Mme";
    header__title.innerHTML = title;
    header__title__details.innerHTML = subTitle;
    prof__name.innerHTML = genderWord+". "+res.nom
    prof__image.setAttribute("src",`/Profile-pictures/Admins/${res.image}`)
    prof__image.setAttribute("alt",`${res.nom} ${res.prenom}`)
}

async function loadDashboard(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new Dashboard(res).render());
}
async function loadClassses(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new ClassesList(res).render());
}
async function loadStatistiques(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new Statistique().render());
}

async function loadProfessors(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new Professors().render());
}
async function loadSeances(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new Seances().render());
}

async function loadProfile(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new Profile(res).render());
}
async function loadSettings(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new Setting(res).render());
}

window.addEventListener('load',loadStatistiques);

dashboardBtn.addEventListener('click', ()=>{
    goTo(loadDashboard)
})
statistiqueBtn.addEventListener('click', ()=>{
    goTo(loadStatistiques)
})
classesBtn.addEventListener('click', ()=>{
    goTo(loadClassses)
})
profsBtn.addEventListener('click', ()=>{
    goTo(loadProfessors)
})
seancesBtn.addEventListener('click', ()=>{
    goTo(loadSeances)
})

profileBtn.addEventListener('click', ()=>{
    goTo(loadProfile)
})
settingsBtn.addEventListener('click', ()=>{
    goTo(loadSettings)
})



export {
    root,
    alertContainer,
    popContainer,
    goTo,
    updateUI,
    loadDashboard,
    loadSettings,
    header__title, 
    header__title__details, 
    today__date, 
    prof__name,
    dashboardBtn,
    statistiqueBtn,
    profsBtn,
    classesBtn,
    seancesBtn
}