
export default class Alert{
    constructor(msg,parent) {
        this.msg = msg;
        this.parent = parent;
        this.message = document.createElement("div");
        this.msg_img = document.createElement("img");
        this.content = document.createElement("div")
        this.h3 = document.createElement("h3");
        this.msg_text = document.createElement("p");
        this.close = document.createElement("div");
        this.span = document.createElement("span");
        this.progress = document.createElement("div");

    }

    createMessageAttributes(){
        this.message.setAttribute("class", `alert alert-${this.msg.type}`);
        this.content.setAttribute("class", "alert-content");
        this.h3.setAttribute("class", "alert-title");
        this.h3.innerHTML = this.msg.msg_title;
        this.msg_img.setAttribute("src", "/Images/Alerts/" + this.msg.type + ".png");
        this.msg_text.setAttribute("class", "alert-text");
        this.msg_text.innerHTML = this.msg.msg_text
        this.close.setAttribute("class", "close");
        this.progress.setAttribute("class", "progress");

        let closeMessage = () => {
            this.message.classList.add('closed-alert');
            setTimeout(() => {
                if(this.parent.hasChildNodes(this.message)){
                    this.parent.removeChild(this.message);
                }
            }, 700)
        }

        this.close.addEventListener("click", closeMessage)
        this.progress.addEventListener("animationend", closeMessage)

    }

    appendingMessage(){
        this.content.append(this.h3, this.msg_text);
        this.close.appendChild(this.span);
        this.message
            .append(
                this.msg_img, 
                this.content, 
                this.close, 
                this.progress
                )
    }

    render(){
        this.createMessageAttributes();
        this.appendingMessage();
        return this.message;
    }
}