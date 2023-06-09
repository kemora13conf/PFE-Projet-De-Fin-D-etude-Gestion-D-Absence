import Profile from "../Etudiant/profile/Profile";
import Setting from "./profile/Setting.js";
import { loadData } from "../utils.js";

let root = document.getElementById('root');
let alertContainer = document.querySelector('.alerts-container');

let header__title = document.getElementById('header-title');
let header__title__details = document.getElementById('header-title-details');
let today__date = document.getElementById('today-date');
let prof__name = document.getElementById('prof-name');
let prof__image = document.getElementById('prof-img');

let statistiqueBtn = document.getElementById('statistique-btn');
let parametreBtn = document.getElementById('parametre-btn');
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
    prof__name.innerHTML = genderWord+". "+res.nom
    prof__image.setAttribute("src",`/Profile-pictures/Etudiants/${res.image}`)
    prof__image.setAttribute("alt",`${res.nom} ${res.prenom}`)
}

async function loadProfile(){
    let [res,req] = await loadData('/Etudiant/Inc/Api/CurrentUser.inc.php');
    console.log(res);
    updateUI(res, "Profile", "Votre informations");
    root.appendChild(new Profile(res).render());
}

async function loadSettings(){
    let [res,req] = await loadData('/Etudiant/Inc/Api/CurrentUser.inc.php');
    updateUI(res, "Paramètres", "Changer votre informations");
    root.appendChild(new Setting(res).render());
}

addEventListener('load', loadProfile );

profileBtn.addEventListener('click', () =>{
    goTo(loadProfile);
})

parametreBtn.addEventListener('click', () => {
    goTo(loadSettings)
})

export {
    root,
    goTo,
    alertContainer,
    updateUI,
    loadSettings,
    header__title, 
    header__title__details, 
    today__date, 
    prof__name
}