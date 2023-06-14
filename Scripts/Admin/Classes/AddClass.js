import Alert from "../../Alert/Alert.js";
import { alertContainer, popContainer } from "../../Admin/Admin.js";
import { loadData } from "../../utils.js";

export default class AddClasse {
    constructor(list){
        this.list = list;
        this.form = document.createElement('form');
    }
    isEmpty(data){
        if(data == "") return true;
        return false;
    }
    async renderListRow(classe){
        let [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php?getTotal=${classe.codeClasse}`);
        return `
            <tr>
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
    }
    closePopup(form){
        popContainer.classList.add('close-popup');
        setTimeout(() => {
            popContainer.removeChild(this.form);
            popContainer.classList.remove('close-popup');
            popContainer.classList.remove('open-popup');
        }, 500)
    }
    configElements(){
        this.form.setAttribute('class', 'add-classe-form');
        this.form.innerHTML = `
            <i class="fas fa-close"></i>
            <div class="form-group">
                <label for="name">Nom du classe</label>
                <input type="text" id="name" placeholder="ex: MCW" />
            </div>
            <div class="form-group">
                <label for="name">Niveau du classe</label>
                <input type="Number" max='2' min='1' id="level" placeholder="ex: 1-2" />
            </div>
            <div class="form-group">
                <button type="submit">Ajouter</button>
            </div>
        `
        const close = this.form.querySelector('.fa-close');
        close.addEventListener('click', ()=>{
            this.closePopup(this.form)
        });
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            let name = this.form.querySelector('#name').value;
            let level = this.form.querySelector('#level').value;

            if(this.isEmpty(name) || this.isEmpty(level)) return;
            
            let formData = new FormData();
            formData.append('submit', JSON.stringify({
                name: name,
                level: level,
            }));

            fetch(
                "/Admin/Inc/Api/Classes.inc.php",
                {
                    method: 'POST',
                    body: formData,
                }
            )
            .then(res => res.json())
            .then(res => {
                this.closePopup(this.form);
                alertContainer.appendChild(new Alert({
                    type: 'success',
                    msg_title: 'Success',
                    msg_text: res.message
                }, alertContainer).render())
                this.createListe();
            })
            .catch(err => {
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'échoué',
                    msg_text: "Une erreur s'est produite. Veuillez réessayer"
                }, alertContainer).render())
            })
        })
    }
    render(){
        this.configElements();
        return this.form;
    }
}