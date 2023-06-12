import { classesBtn, profsBtn, settingsBtn } from '../Admin.js';
import Button from "./Button.js";
export default class Dashboard{
    constructor(currentUser){
        this.currentUser = currentUser;
        this.dashboard = document.createElement('div');
        this.head = document.createElement('div');
        this.buttons = document.createElement('div');
    }

    configElements(){
        this.dashboard.setAttribute('class', 'dashboard');
        this.head.setAttribute('class', 'head');
        let genderWord = this.currentUser.gender == "Homme" ? "M" : "Mme";
        this.head.innerHTML = `<h1>BIENVENUE ${genderWord+". "+this.currentUser.nom}</h1>`;
        this.head.innerHTML += `<div class="time-now">${new Date().getHours()+" : "+(new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes())}</div>`
        
        this.buttons.setAttribute('class', 'buttons');
        this.buttons.append(
            new Button({icon:'fas fa-users-line',title:"Classes"}, classesBtn).render(),
            new Button({icon:'fas fa-users',title:"Professeurs"}, profsBtn).render(),
            new Button({icon:'fas fa-user-graduate',title:"Etudiant"}, profsBtn).render(),
            new Button({icon:'fas fa-school',title:"Seances"}, settingsBtn).render()
        )
        
        this.dashboard.append(
            this.head,
            this.buttons,
        )

    }
    render(){
        this.configElements();
        return this.dashboard
    }
}