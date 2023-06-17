export default class Profile{
    constructor(data){
        this.data = data;
        this.profile = document.createElement("div");
        console.log(this.data);
    }
    async configCard(){
        this.profile.setAttribute("class", "profile");

        this.profile.innerHTML = `
            <div class="profile--card">
                <div class="profile--image-div">
                    <img src="/Profile-pictures/Admins/${this.data.image}" />
                </div>
                <div class="profile--role-gender">
                    <div class="profile--role">Administrateur</div>
                    <p class="profile--gender">${this.data.gender}</p>
                </div>
                <div class="profile--info">
                    <div class="profile--name-number">
                        <div class="profile--name">${this.data.prenom + " " + this.data.nom}</div>
                        <div class="profile--number">${this.data.telephone}</div>
                    </div>
                    <div class="profile--email">${this.data.email}</div>
                </div>
            </div>
        `
    }
    render(){
        this.configCard();
        return this.profile;
    }
}