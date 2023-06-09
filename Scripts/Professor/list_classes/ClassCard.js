import { wichHourNow } from "../../utils.js";
import ListeAbsence from "./ListeAbsence.js";
import {root, goTo, header__title__details} from '../Professor.js'

export default class ClassCard{
    constructor(seance, seanceDate){
        this.seance = seance;
        this.seanceDate = seanceDate;
        this.card =  document.createElement('div');
    }
    configCard(){
        this.card.setAttribute('class', 'card');
        let img = this.seance.nomClass.toLowerCase() + '-1.png';
        this.card.innerHTML = `<div class="branch-img" >
                                <img src="../../Images/branch-images/${img}" />
                                </div>
                                <h4 class="class-periode">${this.seance.period}</h4>
                                <h2 class="class-level">${this.seance.niveauClass}</h2>
                                <h3 class="class-name">${this.seance.nomClass}</h3>
                                <h4 class="class-total">${this.seance.total} Etudiants</h4>
                                `
        if(this.seance.heure == wichHourNow()) this.card.innerHTML += '<span class="this"></span>'
        
        this.card.addEventListener('click', () => {
            goTo(()=>{
                header__title__details.innerHTML = "Etudiants";
                const list =  new ListeAbsence({
                                                    codeClass: this.seance.codeClass,
                                                    codeSeance: this.seance.codeSeance,
                                                    date: this.seanceDate,
                                                    duree: Number(this.seance.duree),
                                                    heure: Number(this.seance.heure)
                                                });
                root.appendChild(list.render());
            })
        })
    }
    render(){
        this.configCard();
        return this.card
    }
}