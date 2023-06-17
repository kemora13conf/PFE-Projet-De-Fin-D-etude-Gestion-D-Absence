import { loadData, parseHour } from "../../utils.js";
import { alertContainer } from "../Admin.js";
import Alert from "../../Alert/Alert.js";


export default class SeancePage{
    constructor(id){
        this.id = id;
        this.seance = undefined;
        this.classe = undefined;
        this.absence = undefined;
        this.seancePage = document.createElement('div');
        this.header = document.createElement('div');
        this.listHolder = document.createElement('div');
        this.list = document.createElement('table');
        this.currentDate = (() => {
            // Create a new Date object
            const currentDate = new Date();

            // Extract the year, month, and day from the Date object
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            // Create the formatted date string
            return `${year}-${month}-${day}`;
        })();
    }
    async getSeance(){
        const [res] = await loadData(`/Admin/Inc/Api/Seances.inc.php?seance=${this.id}`);
        console.log(res);
        this.seance = await res[0]
    }
    async getClasse(){
        const [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php?etudiants=${this.seance.codeClass}`)
        this.classe = res;
    }
    async getAbsence(date){
        let allAbsence = [];
        await Promise.all(
            this.classe
                .map(async etudiant => {
                    let etd = {
                        cne: etudiant.cne,
                        arr: []
                    }
                    for (let i = Number(this.seance.heure); i < Number(this.seance.heure) + Number(this.seance.duree); i++){
                        const [res] = await loadData(`/Admin/Inc/Api/Etudiants.inc.php?isAbsent=true&cne=${etudiant.cne}&codeSeance=${this.seance.codeSeance}&date=${date}&hour=${i}`)
                        etd.arr.push(res);
                    }
                    allAbsence.push(etd);
                })
        )
        this.absence = allAbsence
    }

    async init(){
        await this.getSeance();
        await this.getClasse();
        await this.getAbsence(this.currentDate);
    }

    async createHeader(){
        await this.init();

        console.log(this.seance, this.classe, this.absence);

        this.header.setAttribute('class', 'seance-header');
        this.header.innerHTML = `
            <h1 class="list-header-title">${this.seance.nomMatiere}</h1>
            <div class="flex">
                <div class="seance-detail">
                    <span class="small-text">Ensigner par : <h3>${this.seance.nomProf} ${this.seance.prenomProf}</h3></span> 
                    <span class="small-text">À : <h3>${this.seance.nomClass}</h3></span> 
                </div>
                <div class="seance-date-div">
                    <input type="date" class="seance-date" id="seance-date" />
                </div>
            </div>
        `
        const date = this.header.querySelector('#seance-date')
        date.value = this.currentDate;
        date.addEventListener('change', async ()=>{
            this.currentDate = date.value;
            await this.getAbsence(date.value)
            await this.createList();
        })
    }

    renderUserData(user, htmlInpts, cmt){
        return {
            cne:user.cne,
            orderNb:user.orderNb,
            prenomEtudiant:user.prenom,
            nomEtudiant:user.nom,
            date: this.currentDate,
            image: user.image,
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
    parseToggleButtons(data){
        let commentContainer = '';
        let htmlInpts = '';
        
        for(let i = Number(this.seance.heure); i<Number(this.seance.heure)+Number(this.seance.duree); i++){
            if(data.arr[i - Number(this.seance.heure)].isAbsent){
                
                htmlInpts += `<td class="hour" data-state='enabled'>
                                <input 
                                    type="checkbox" 
                                    data-id="${data.cne}" 
                                    value="${i}" 
                                    ${data.arr[i - Number(this.seance.heure)].justification == '1'? 'checked' : ''} />
                                <div class="toggle-btn ${data.arr[i - Number(this.seance.heure)].justification == '1'? 'toggle-btn-activated' : ''}">
                                    <div class="inner-circle"></div>
                                </div>
                            </td>`;
                if(data.arr[i - Number(this.seance.heure)].comment != '')
                    commentContainer = data.arr[i - Number(this.seance.heure)].comment;
            }
            else{
                htmlInpts += `<td class="hour hour-disbaled">
                                <input 
                                    type="checkbox" 
                                    data-id="${data.cne}" 
                                    value="${i}" disabled />
                                <div class="toggle-btn ${data.arr[i - Number(this.seance.heure)].justification == '1'? 'toggle-btn-activated' : ''}">
                                    <div class="inner-circle"></div>
                                </div>
                            </td>`;
            }
        }
        return [htmlInpts,commentContainer];
    }

    handleResponse(res){
        let arr = [];
        res.map((item) => { 
            // This loop get all the etudiant and render a dictionary holding necessry data
            // for each one with inputs checked if the etudiant were absent
            this.absence.forEach(element => {
                if(element.cne == item.cne){
                    let [htmlInpts,commentContainer] = this.parseToggleButtons(element);
                    let dict = this.renderUserData(item, htmlInpts, commentContainer)
                    arr.push(dict)
                }
            });
        })
        let sortedData = this.sortEtudiantList(arr); // Sort by order number the list of etudiants
        sortedData.forEach(
            (item) => {
                // This loop render a row in the table for each etudiant.
                let row = this.renderEtudiantRow(item);
                this.list.innerHTML += row;
            })
        
        // In here all the user column are within list
        // so we trigger the eventlistener on the toggle btns
        let trToggleBtns= this.list.querySelectorAll('.hour');
        trToggleBtns.forEach(tr => {
            const inpt = tr.children[0];
            const btn = tr.children[1];
            btn.addEventListener('click', ()=>{
                inpt.click();
            })
            inpt.addEventListener('change', async ()=>{
                const formData = new FormData();
                const postedData = {
                    codeSeance: this.id,
                    date: this.currentDate,
                    hour: inpt.value,
                    cne: inpt.dataset.id
                };
                if(inpt.checked){
                    formData.append('justify',JSON.stringify(postedData));
                    // send a request to justify the absent in that seance
                    await fetch(
                        '/Admin/Inc/Api/Absence.inc.php',
                        {
                            method: 'POST',
                            body: formData
                        }
                    )
                    .then(res => res.json())
                    .then(res => console.log(res))
                    .catch(err => {
                        alertContainer.appendChild(new Alert({
                            type: 'success',
                            msg_title: 'Success',
                            msg_text: res.message
                        }, alertContainer).render())
                    });
                }else{
                    formData.append('un-justify',JSON.stringify(postedData));
                    // send a request to justify the absent in that seance
                    await fetch(
                        '/Admin/Inc/Api/Absence.inc.php',
                        {
                            method: 'POST',
                            body: formData
                        }
                    )
                    .then(res => res.json())
                    .then(res => console.log(res))
                    .catch(err => {
                        alertContainer.appendChild(new Alert({
                            type: 'success',
                            msg_title: 'Success',
                            msg_text: res.message
                        }, alertContainer).render())
                    });
                }
                btn.classList.toggle('toggle-btn-activated');
            });

        })
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
                            ${user.comment ? user.comment : "########"}
                        </td>
                    </tr>`
        return row;
    }
    async createList(){
        this.list.innerHTML = '';
        let thead = `<thead>
                        <tr>
                            <th class="orderNb">#</th>
                            <th class="name">Non et Prenom</th>`
        for(
                let i = Number(this.seance.heure);
                i < Number(this.seance.heure) + Number(this.seance.duree);
                i++
            ){
            thead += `<th class="hour${i}">${parseHour(i)}</th>`;
        }
        thead += `<th class="comment">Commentaire</th>
                  </tr>
                  </thead`;
        this.list.innerHTML = thead;

        if(this.classe.length != 0){
            this.handleResponse(this.classe)
        }else this.list.innerHTML = `<tr><td colspan="${4+this.data.duree}">Aucun Etudiant</td><td`;

    }


    async render(){
        await this.createHeader();
        await this.createList();
        this.seancePage.setAttribute('class', 'seance-container');
        this.listHolder.setAttribute('class', 'list-holder');
        this.list.setAttribute('class', 'seance-etudiant-list');

        this.listHolder.appendChild(this.list);
        this.seancePage.append(
            this.header,
            this.listHolder
        )
        return this.seancePage;
    }
}