import Alert from "./Alert/Alert.js";
const  alertContainer = document.getElementById("alerts-container");

alertContainer.appendChild(new Alert({
    type: 'success',
    msg_title: 'Success',
    msg_text: "L'email été envoyer avec succes"
}, alertContainer).render())