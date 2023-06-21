import {loadData} from '../../utils.js'
export default class Home {
    constructor(res) {
        this.res = res;
        this.home = document.createElement("div");
    }

    seance(seance){
        console.log(seance)
        return `
            <div class="home__content__seance ${seance.justification == '1' ? 'Justifier' : 'Non-justifier'}">
                <div class="home__content__seance__header">
                    <h3 class="home__content__seance__header__title">Mathématique</h3> 
                    <h4 class="home__content__seance__header__sub">M. ${seance.seance.nomProf}</h4>
                </div>
                <div class="home__content__seance__body">
                    <div class="home__content__seance__body__date">
                        <h5 class="home__content__seance__body__date__title">Date</h5>
                        <h6 class="home__content__seance__body__date__sub">${seance.date}</h6>
                    </div>
                    <div class="home__content__seance__body__time">
                        <h5 class="home__content__seance__body__time__title">Heure</h5> 
                        <h6 class="home__content__seance__body__time__sub">${seance.seance.period}</h6>
                    </div>
                    <div class="home__content__seance__body__status">
                        <h5 class="home__content__seance__body__status__title">Status</h5>
                        <h6 class="home__content__seance__body__status__sub">${seance.justification == '1' ? 'Justifier' : 'Non-justifier'}</h6>
                    </div>
                </div>
            </div>
        `
    }
    
    async render() {
        const [res] = await loadData("/Etudiant/Inc/Api/AllAbsentedSeances.inc.php?part&max=10");
        let all = '';
        res.forEach(item => {
            console.log(item)
            all += this.seance(item)
        })

        this.home.setAttribute("class", "home");
        this.home.innerHTML = `
            <div class="home__header">
                <div class="home__header__title">
                    <h1 class="home__header__title__main">Bonjour ${this.res.nom} ${this.res.prenom}</h1>
                    <h2 class="home__header__title__sub">Vos absences</h2>
                </div>
            </div>
            <div class="home__content">
                ${all}
            </div>
        `;
        return this.home;
    }
}