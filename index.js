window.alert_activated = true
window.cnt2 = 0

// Desired days is the list
// FORMAT : DDMMYYYY 
let desired_days = [
    "01022022",
    "02022022",
    "03022022",
    "04022022",
    "05022022",
    "06022022",
    "07022022",
    "08022022",
    "09022022",
    "10022022",
    "11022022",
    "12022022",
    "13022022",
    "14022022",
    "15022022",
    "16022022",
    "17022022",
    "18022022",
    "19022022",
    "20022022",
    "21022022",
    "22022022",
]


// TO RECEIVE NOTIFICATIONS
function notifyMe(message) {
    
 // ADD A WEBSERVICE TO SEND AN EMAIL OR A TEXT MESSAGE HERE (Login to webhook and replace your URL)
    fetch("https://webhook.site/e373216e-7701-4c56-812a-66dbcb910f5a?message=" + message, { mode: "no-cors" });
    
}

function clearAllInterval() {
    for (let i = 0; i <= 9999; i++)
        clearInterval(i)
}

function notify_me(available_date = "UNKNOW") {
    let message = "🚨🚨🚨 ALERTE RDV Disponible le : " + available_date + " Lien : https://pastel.diplomatie.gouv.fr/rdvinternet/html-4.02.00/frameset/frameset.html?lcid=1&sgid=318&suid=1"
   notifyMe(message)
    const notification = new Notification("🚨🚨🚨 ALERTE RDV Disponible", { body: message });
}


async function get_horaires() {
    // J'ai obtenu pp.idPage en regardant dans l'onglet Sources > CONTENuWIN > RDVInternet > RDV/prise > PrendreRDV.js : ligne 704
    let response = await fetch("https://pastel.diplomatie.gouv.fr/rdvinternet/flux/protected/RDV/prise/horaires.xml?idPage=" + parent.parent.idPage)
    response = await response.text()
    // console.log(response)
    const parser = new DOMParser();
    const xmlDOM = parser.parseFromString(response, "text/xml");
    try {
        const horaire_list = xmlDOM.getElementsByTagName("HORAIRES")[0].childNodes
        console.log(JSON.stringify(
            {
                date: (new Date()).toISOString(),
                horaires: [...horaire_list].map((h, i) => {
                    let hour = parser.parseFromString(h.outerHTML, "text/xml").getElementsByTagName("D")[0].childNodes[0].nodeValue
                    return hour
                })
            }
        ))
        if (horaire_list.length > 0) {
            let available_dates = [...horaire_list].map(h => parser.parseFromString(h.outerHTML, "text/xml").getElementsByTagName("D")[0].childNodes[0].nodeValue)
            available_dates.map(available_date => {

                if (desired_days.includes(available_date)) {

                    setTimeout(() => {
                        script_precedent()
                        setTimeout(() => {
                            script_suivant()
                        }, 300)
                    }, 500)



                    clearInterval(window.get_hours)
                    clearInterval(window.notify_all)
                    window.cnt = 0
                    window.notify_all = setInterval(() => {
                        notify_me(available_dates.join(", "))
                        window.cnt++
                        if (window.cnt >= 30 * 3) {
                            clearInterval(window.notify_all)
                            window.get_hours = setInterval(get_horaires, 5000)
                        }
                    }, 2000)
                }
            })

        } else {
            //     console.log("Aucun RDV disponible")
        }

    } catch (error) {
        console.log(error)
    }
}

function script_precedent() {
    if (!window.alert_activated && document.querySelector) {
   //     notify_me()
    }
    // document.querySelector("#boutonPrecedent").click()
    window.alert_activated = false;
}

function script_suivant() {
    // document.querySelector("#boutonSuivant").click()
}

window.orchestration = () => {
    setTimeout(() => {
        script_precedent()
        setTimeout(script_suivant, 300)
    }, 500)

}

window.alert = function (message) {
    window.alert_activated = true;
    console.log("Heure : " + (new Date()) + " Message : " + message)
    window.cnt2++
    if (window.cnt2 % 17 === 0){
        const notification = new Notification("Heure : " + (new Date()) , { body: message });
            notifyMe( "Heure : " + new Date() + " Message : " + message)
    }
    console.log(window.alert_activated, message)
};

function fill_form(date) {
    if (date.slice(2, 4) == "11" && document.querySelector("#mois").innerHTML === "Décembre") {
        changeMonth("previous")
    }
    setTimeout(() => {

        compTableau.appelAction(0, 0)
        setTimeout(() => {
            // document.querySelector("#boutonSuivant").click()
        }, 200)
        setTimeout(() => {
            // Sexe pas pris en compte
            // document.querySelector("#nom").value = "REMPLIR LES CHAMPS"
            // document.querySelector("#nomnaiss").value = "REMPLIR LES CHAMPS"
            // document.querySelector("#prenoms").value = ""
            // document.querySelector("#neen1").value = "DD"
            // document.querySelector("#neen2").value = "MM"
            // document.querySelector("#neen3").value = "AAAA"
            // document.querySelector("#natactuelle").value = "CHECK COUNTRY_VALUE BY INSPECTING THE SELECT/ 34 FOR CAMEROON"
            // document.querySelector("#num").value = ""
            // document.querySelector("#telephone").value = "PHONE"
            // document.querySelector("#email").value = "EMAIL"
            // document.querySelector("#confirm_email").value = "EMAIL"
        }, 500)
    }, 200)
}

window.get_hours = setInterval(get_horaires, 5000)
