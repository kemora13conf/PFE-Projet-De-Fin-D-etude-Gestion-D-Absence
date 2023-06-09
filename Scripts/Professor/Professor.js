import { loadData } from "../utils.js";
import ListClasses from "./list_classes/Classes_container.js";
import Setting from "./profile/Setting.js";
import Seances from "./Seances/Seances.js";
import Statistique from "./Statistique/Statistique.js";
import Alert from "../Alert/Alert.js";
import Profile from "./profile/Profile.js";

let root = document.getElementById('root');
let alertContainer = document.querySelector('.alerts-container');

let header__title = document.getElementById('header-title');
let header__title__details = document.getElementById('header-title-details');
let today__date = document.getElementById('today-date');
let prof__name = document.getElementById('prof-name');
let prof__image = document.getElementById('prof-img');

let listBtn =  document.getElementById('liste-classes-btn');
let statistiqueBtn = document.getElementById('statistique-btn');
let parametreBtn = document.getElementById('parametre-btn');
let seanceBtn = document.getElementById('seance-btn');
let profileBtn = document.getElementById('profile-btn');

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
    prof__name.innerHTML = genderWord+". "+res.nomProf
    prof__image.setAttribute("src",`/Profile-pictures/Teachers/${res.image}`)
    prof__image.setAttribute("alt",`${res.nomProf} ${res.prenomProf}`)
}
async function loadClassesList(){
    let [res,req] = await loadData('/Professor/Inc/Api/CurrentUser.inc.php');
    updateUI(res, "Liste d'absence", "Classes");
    root.appendChild(new ListClasses(res).render());
}

async function loadStatistiques(){
    let [res,req] = await loadData('/Professor/Inc/Api/CurrentUser.inc.php');
    updateUI(res, "Statistiques", "Les statistiques d'absences");
    root.appendChild(new Statistique(res).render());
}

async function loadSettings(){
    let [res,req] = await loadData('/Professor/Inc/Api/CurrentUser.inc.php');
    updateUI(res, "Paramètres", "Changer votre informations");
    root.appendChild(new Setting(res).render());
}

async function loadSeances(){
    let [res,req] = await loadData('/Professor/Inc/Api/CurrentUser.inc.php');
    updateUI(res, "Séances", "Gérer votre séances");
    root.appendChild(new Seances(res).render());
}

async function loadProfile(){
    let [res,req] = await loadData('/Professor/Inc/Api/CurrentUser.inc.php');
    updateUI(res, "Profile", "Votre informations");
    root.appendChild(new Profile(res).render());
}

window.addEventListener('load', () =>{
    // loadClassesList();
    loadStatistiques();
    // loadSettings();
    // loadSeances();
    // loadProfile();
})

listBtn.addEventListener('click', () =>{
    goTo(loadClassesList)
})
statistiqueBtn.addEventListener('click', () =>{
    goTo(loadStatistiques)
})
parametreBtn.addEventListener('click', () => {
    goTo(loadSettings)
})
seanceBtn.addEventListener('click', () => {
    goTo(loadSeances)
})
profileBtn.addEventListener('click', () =>{
    goTo(loadProfile);
})

export {
    root,
    alertContainer,
    goTo,
    updateUI,
    loadSettings, 
    header__title, 
    header__title__details, 
    today__date, 
    prof__name
}