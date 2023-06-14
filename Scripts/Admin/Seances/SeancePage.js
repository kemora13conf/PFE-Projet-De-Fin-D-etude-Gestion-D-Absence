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

    async init(){
        await this.getSeance();
    }

    async createHeader(){
        
        await this.init();

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