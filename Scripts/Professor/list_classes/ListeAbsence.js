import { loadData, parseHour } from "../../utils.js";
import Alert from "../../Alert/Alert.js";
import { alertContainer } from "../Professor.js";

export default class ListeAbsence{
    constructor(data){
        this.data = data;
        this.toSendData = [];
        this.container = document.createElement("div");
        this.listHeader = document.createElement("div");
        this.listTitle = document.createElement("h2");
        this.filterForm = document.createElement("form");
        this.filterDates = document.createElement('div');
        this.choosedDate = document.createElement('div');
        this.datesList = document.createElement('div');
        this.searchForm = document.createElement('form');
        this.saveBtn = document.createElement('button');
        this.listContainer = document.createElement('div');
        this.list = document.createElement('table');
        this.listHead = document.createElement('thead');
        this.listBody = document.createElement('tbody');
    }
    renderUserData(user, htmlInpts, cmt){
        return {
            cne:user.cne,
            orderNb:user.orderNb,
            prenomEtudiant:user.prenom,
            nomEtudiant:user.nom,
            image: user.image,
            date: this.data.date,
            comment: cmt,
            htmlInpts: htmlInpts
        }
    }
    sortEtudiantList(data){
        let arr = data
        let isTrue = true;
        while(isTrue){
            isTrue = false;
            for(let i=0; i<data.length - 1; i++){
                if(
                    Number(arr[i].orderNb) > Number(data[i+1].orderNb)
                ){
                    let temp = arr[i];
                    arr[i] = arr[i+1];
                    arr[i+1] = temp;
                    isTrue = true;
                }
            }
        }
        return arr;
    }
    async handleResponse(res){
        let arr = [];
        await Promise.all(
                res.map(
                    async(item) => { 
                        // This loop get all the etudiant and render a dictionary holding necessry data
                        // for each one with inputs checked if the etudiant were absent
                        let [htmlInpts,commentContainer] = await this.parseDuree(item.cne);
                        let dict = this.renderUserData(item, htmlInpts, commentContainer)
                        arr.push(dict)
                    }))
        let sortedData = this.sortEtudiantList(arr); // Sort by order number the list of etudiants
        console.log(sortedData)
        sortedData.forEach(
            async(item) => {
                // This loop render a row in the table for each etudiant.
                let row = this.renderEtudiantRow(item);
                this.listBody.innerHTML += row;
            })
    }
    createListHeader(){
        this.listHeader.setAttribute('class', 'le-header');
        this.listTitle.setAttribute('class', 'list-title');
        this.listTitle.innerHTML = 'Liste des étudiants'

        this.filterForm.setAttribute('class', 'filter-date');
        this.filterDates.setAttribute('class', 'filter-dates');
        this.choosedDate.setAttribute('class', 'choosed-option');
        this.choosedDate.setAttribute('id', 'choosed-option');
        this.choosedDate.innerHTML = `<div class="the-date" data-value='all' >Tous les etudiant</div>
                                      <i class="fas fa-caret-down"></i>`
        this.datesList.setAttribute('class', 'options-list')
        this.datesList.setAttribute('id', 'options-list')
        this.datesList.innerHTML = `<div class="option" data-value='all'>Tous les etudiant</div>
                                    <div class="option" data-value='absents'>Seuls les absents</div>
                                    <div class="option" data-value='presents'>Seuls les presents</div>`
        let options = this.datesList.querySelectorAll('.option');
        function chooseDate(list,target,choosed){
            list.classList.toggle('show-options-list')
            options.forEach(element => {
                element.classList.remove('choosed');
                target.classList.add('choosed');
                choosed.children[0].dataset.value = target.dataset.value;
                choosed.children[0].innerHTML = target.innerHTML;
            });
        }
        options.forEach(element => element.addEventListener('click', async (e)=>{
            chooseDate(this.datesList,e.target, this.choosedDate)
            let filter = e.target.dataset.value;
            let [res] = await loadData(
                `/Professor/Inc/Api/Class.inc.php?codeClass=${this.data.codeClass}&codeSeance=${this.data.codeSeance}&filter=${filter}&date=${this.data.date}&hour=${this.data.heure}&duree=${this.data.duree}`
                );
            if(res.length != 0){
                this.listBody.innerHTML = '';
                this.handleResponse(res)
            }else this.listBody.innerHTML   =  `<tr><td colspan="${4+this.data.duree}">
                                                    Aucun Etudiant</td><td`;
        }))
        this.choosedDate.addEventListener('click', () => {
            this.datesList.classList.toggle('show-options-list')
        })

        this.filterDates.append(this.choosedDate,this.datesList)
        this.filterForm.appendChild(this.filterDates)

        this.searchForm.setAttribute('class', 'filter-search');
        this.searchForm.innerHTML = `<input type="search" id="search-box" name="search-text" placeholder="Recherche etudiant">
                                     <button type="submit name="submit"><i class="fas fa-search"></i></button>`;
        this.searchForm.addEventListener("submit", async event => {
            event.preventDefault();
            let text = event.srcElement[0].value;
            if(text.length != 0){
                if(text.indexOf(" ") == -1){ 
                    let firstName = text;
                    let [res] = await loadData(
                    `/Professor/Inc/Api/Class.inc.php?codeClass=${this.data.codeClass}&prenom=${firstName}`
                    );
                    if(res.length != 0){
                        this.handleResponse(res)
                    }else this.listBody.innerHTML   =  `<tr><td colspan="${4+this.data.duree}">
                                                        Aucun Etudiant</td><td`;
                }else{
                    let firstName = text.split(" ")[0];
                    let lastName = text.split(" ")[1];
                    let [res] = await loadData(
                    `/Professor/Inc/Api/Class.inc.php?codeClass=${this.data.codeClass}&prenom=${firstName}&nom=${lastName}` 
                    );
                    if(res.length != 0){
                        this.listBody.innerHTML = '';
                        this.handleResponse(res)
                    }else this.listBody.innerHTML   =  `<tr><td colspan="${4+this.data.duree}">
                                                        Aucun Etudiant</td><td`;
                }
            }else{
                let [res] = await loadData(
                `/Professor/Inc/Api/Class.inc.php?codeClass=${this.data.codeClass}`
                );
                if(res.length != 0){
                    this.listBody.innerHTML = '';
                    this.handleResponse(res)
                }else this.listBody.innerHTML   =  `<tr><td colspan="${4+this.data.duree}">
                                                    Aucun Etudiant</td><td`;
            }

        });


        this.saveBtn.setAttribute('class', 'list-save');
        this.saveBtn.innerHTML = 'Enregistrer'
        this.saveBtn.addEventListener('click',() => {
            this.toSendData = [];
            let hours = this.list.querySelectorAll('.hour');

            hours.forEach(item=>{
                let cne = item.children[0].dataset.id;
                let comment = this.list.querySelector(`#comment-${cne}`);
                let etudiant = {
                    cne: cne,
                    codeSeance: this.data.codeSeance,
                    date: this.data.date,
                    hour: item.children[0].value,
                    absent: item.children[0].checked,
                    comment: comment.value
                }
                this.toSendData.push(etudiant)
            })
            fetch('/Professor/Inc/Api/Absence.inc.php',{
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'data': this.toSendData})
            })
            .then(async req => {
                this.saveBtn.innerHTML= 'Enregistrer'
                let res = await req.json();
                // thrwo a successful alert
                alertContainer.appendChild(new Alert({
                    type: 'success',
                    msg_title: 'Success',
                    msg_text: res.message
                }, alertContainer).render())
                return res
            })
            .catch(err => {
                alertContainer.appendChild(new Alert({
                    type: 'warning',
                    msg_title: 'échoué',
                    msg_text: "Une erreur s'est produite. Veuillez réessayer"
                }, alertContainer).render())
            });
        });
        
        this.listHeader.append(this.listTitle, this.filterForm, this.searchForm, this.saveBtn)
    }
    async parseDuree(cne){
        let commentContainer = '';
        let htmlInpts = '';
        console.log(this.data)
        for(let i = this.data.heure; i<this.data.heure+this.data.duree; i++){
            let [res] = await loadData(`/Professor/Inc/Api/Absence.inc.php?isAbsent=yes&codeSeance=${this.data.codeSeance}&cne=${cne}&date=${this.data.date}&hour=${i}`);
            console.log(res)

            if(res && res.isAbsent){
                htmlInpts += `<td class="hour ${res.justification == '1'? 'justifier' : 'non-justifier'}"><input type="checkbox" data-id="${cne}" value="${i}" checked/></td>`;
                commentContainer = res.comment;
            }
            else{
                htmlInpts += `<td class="hour"><input type="checkbox" data-id="${cne}" value="${i}" /></td>`;
            }
        }
        return [htmlInpts,commentContainer];
    }
    renderEtudiantRow(user){
        let row = `<tr data-id='${user.cne}'>
                       <td class="orderNb">${user.orderNb}</td>
                       <td class="etudiant-name">
                           <div class="name-data">
                               <img src="../../Profile-pictures/Etudiants/${user.image}" alt="Adelghani El Mouak" />
                               <p>${user.prenomEtudiant} ${user.nomEtudiant}</p>
                           </div>
                       </td>
                       ${user.htmlInpts}
                       <td class="comment">
                            <input type="text" id='comment-${user.cne}' value='${user.comment}'
                                    name="comment" placeholder="Entrez votre commentaire ici ..." />
                        </td>
                    </tr>`
        return row;
    }
    async createList(){
        this.listContainer.setAttribute('class', 'etudiant-list-container')
        this.list.setAttribute('class', 'etudiant-list');
        let thead = `<tr>
                                        <td class="orderNb">N ordre</td>
                                        <td class="name">Non et Prenom</td>`
        for(
                let i =0;
                i < this.data.duree;
                i++
            ){
            thead += `<td class="hour${i}">${parseHour(this.data.heure + i)}</td>`;
        }
        thead += `<td class="comment">Commentaire</td>
                  </tr>`;
        this.listHead.innerHTML = thead;

        let [res] = await loadData(`/Professor/Inc/Api/Class.inc.php?codeClass=${this.data.codeClass}`);

        if(res.length != 0){
            this.handleResponse(res)
        }else this.listBody.innerHTML = `<tr><td colspan="${4+this.data.duree}">Aucun Etudiant</td><td`;

        
        this.list.append(this.listHead,this.listBody)
        this.listContainer.appendChild(this.list)
    }
    render(){
        this.createListHeader();
        this.createList();
        this.container.setAttribute('class', 'list-etudiants-container')
        this.container.append(this.listHeader, this.listContainer)
        return this.container;
    }
}