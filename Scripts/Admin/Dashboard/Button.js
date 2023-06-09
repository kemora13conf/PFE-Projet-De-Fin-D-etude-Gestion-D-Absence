import { wichHourNow } from "../../utils.js";
import {root, goTo, header__title__details} from '../Admin.js'

export default class Button{
    constructor(data, actionBtn){
        this.data = data;
        this.actionBtn = actionBtn;
        this.card =  document.createElement('div');
    }
    configCard(){
        this.card.setAttribute('class', 'button');
        this.card.innerHTML = `<div class="button-icon" >
                                    <i class="${this.data.icon}"></i>
                                </div>
                                <h2 class="button-subtitle">Listes des</h2>
                                <h1 class="button-title">${this.data.title}</h1>
                                `
        this.card.addEventListener('click', () => {
            this.actionBtn.click();
        })
    }
    render(){
        this.configCard();
        return this.card
    }
}