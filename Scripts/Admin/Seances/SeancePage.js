import { loadData } from "../../utils.js";



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
    }
    async getSeance(){
        const [res] = await loadData(`/Admin/Inc/Api/Seances.inc.php?seance=${this.id}`);
        this.seance = await res[0]
    }
    async getClasse(){
        const [res] = await loadData(`/Admin/Inc/Api/Classes.inc.php?etudiants=${this.seance.codeClass}`)
        this.classe = res;
    }
    async getAbsence(){
        let allAbsence = [];
        await Promise.all(
            this.classe
                .map(async etudiant => {
                    let etd = {
                        cne: etudiant.cne,
                        arr: []
                    }
                    for (let i = Number(this.seance.heure); i < Number(this.seance.heure) + Number(this.seance.duree); i++){
                        const [res] = await loadData(`/Admin/Inc/Api/Etudiants.inc.php?isAbsent=true&cne=${etudiant.cne}&codeSeance=${this.seance.codeSeance}&date=2023-06-16&hour=${i}`)
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
        await this.getAbsence();
    }

    async createHeader(){
        await this.init();

        console.log(this.seance, this.classe, this.absence);

        this.header.setAttribute('class', 'list-header');
        this.header.innerHTML = `
            <h1 class="list-header-title">${this.seance.nomMatiere}</h1>
        `
    }


    render(){

        this.createHeader();

        this.seancePage.setAttribute('class', 'seance-conatiner');

        this.listHolder.appendChild(this.list);
        this.seancePage.append(
            this.header,
            this.listHolder
        )
        return this.seancePage;
    }
}