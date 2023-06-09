import { loadData } from "../../utils.js";
import { alertContainer, popContainer, goTo } from "../Admin.js";
import Alert from "../../Alert/Alert.js";
import AddClasse from "./AddClass.js";
import EtudiantsList from "./EtudiantsList.js";

export default class ClassesList{
    constructor(data){
        this.data = data;
        this.listContainer = document.createElement("div");
        this.listHead = document.createElement("div");
        this.listHolder = document.createElement("div");
        this.list = document.createElement("table");
    }
    async renderListRow(classe){
        let [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php?getTotal=${classe.codeClasse}`);
        return `
            <tr class="classe-row" data-id="${classe.codeClasse}">
                <td>${classe.niveauClasse}-${classe.nomClasse}</td>
                <td>${classe.niveauClasse == 2? "2éme années" : "1er années"}</td>
                <td>${res.total}</td>
                <td><i class="fas fa-trash delete-classe" data-id="${classe.codeClasse}"></i></td>
            </tr>
        `
    }

    async createListe(){
        let [res] = await loadData('/Admin/Inc/Api/Classes.inc.php');
        this.list.innerHTML = '';
        this.list.innerHTML = `
            <thead>
                <tr>
                    <td>Nom du classe</td>
                    <td>Niveau du classe</td>
                    <td>Totale des etudiants</td>
                    <td>Action</td>
                </tr>
            </thead>
        `
        await Promise.all(
            res.map(async classe => {
                let row = await this.renderListRow(classe)
                this.list.innerHTML += row;
            })
        )
        const deleteBtns = this.list.querySelectorAll('.delete-classe');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                let [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php?delete=${btn.dataset.id}`);
                if(res && res.code==200){
                    this.createListe();
                    alertContainer.appendChild(new Alert({
                        type: 'success',
                        msg_title: 'Success',
                        msg_text: res.message
                    }, alertContainer).render())
                }
            })
        })
        let rows = this.list.querySelectorAll('.classe-row');
        rows.forEach(item=>{
            item.addEventListener('dblclick', async ()=>{
                let [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php?classe=${item.dataset.id}`);
                goTo(()=>{
                    root.appendChild(new EtudiantsList(res.classe).render());
                })
            })
        })
    }

    async configElements(){
        this.listContainer.setAttribute("class", "list-container");
        this.listHead.setAttribute("class", "list-head");
        this.listHolder.setAttribute("class", "list-holder");
        this.list.setAttribute("class", "main-list");

        this.listHead.innerHTML = `
            <h3 class="list-title">Listes des classes</h3>
            <button class="list-btn list-add-btn" id="list-add-btn">
                Ajouter un classe
                <i class="fas fa-plus"></i>
            </button>
        `;
        this.createListe();

        this.listHead.querySelector(".list-add-btn").addEventListener("click",() => {
            popContainer.appendChild(new AddClasse(this.list).render())
            popContainer.classList.add("open-popup");
        })

        this.listHolder.appendChild(this.list);
        this.listContainer.append(
            this.listHead,
            this.listHolder
        );
    }

    render(){
        this.configElements();
        return this.listContainer;
    }
}