import Alert from "../Alert/Alert.js";
import { loadData } from "../utils.js";
import ClassesList from "./Classes/ClassesList.js";
import EtudiantsList from "./Classes/EtudiantsList.js";
import Dashboard from "./Dashboard/Dashboard.js";
import Professors from "./Professors/Professors.js";
import Seances from "./Seances/Seances.js";
import SeancePage from "./Seances/SeancePage.js";

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
    prof__image.setAttribute("src",`/Profile-pictures/Teachers/${res.image}`)
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
async function loadEtudiants(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(new EtudiantsList().render());
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

async function loadSeancePage(){
    let [res] = await loadData('/Admin/Inc/Api/CurrentUser.inc.php');
    updateUI(res,'Dashboard',`Admin: ${res.nom} ${res.prenom}`)
    root.appendChild(await new SeancePage(28).render());
}


window.addEventListener('load', loadSeancePage);

dashboardBtn.addEventListener('click', ()=>{
    goTo(loadDashboard)
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


export {
    root,
    alertContainer,
    popContainer,
    goTo,
    updateUI,
    loadDashboard,
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