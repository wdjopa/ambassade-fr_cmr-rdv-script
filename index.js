window.alert_activated = true
window.cnt2 = 0

// Desired days is the list
let desired_days = ["1911",
    "2011",
    "2111",
    "2211",
    "2311",
    "2411",
    "2511",
    "2611",
    "2711",
    "2811",
    "2911",
    "3011",
    "0112",
    "0212",
    "0312",
    "0412",
    "0512",
    "0612",
    "0712",
    "0812",
    "0912",
    "1012",
]


function clearAllInterval() {
    for (let i = 0; i <= 9999; i++)
        clearInterval(i)
}

function notify_me(available_date = "UNKNOW") {
    let message = "🚨🚨🚨 ALERTE RDV Disponible le : " + available_date + " Lien : https://pastel.diplomatie.gouv.fr/rdvinternet/html-4.02.00/frameset/frameset.html?lcid=1&sgid=318&suid=1"
    // ADD A WEBSERVICE TO SEND AN EMAIL OR A TEXT MESSAGE HERE
    fetch("https://dashboard.genuka.com/api/2021-05/notify/telegram/355?message=" + message)
}


async function get_horaires() {
    // J'ai obtenu pp.idPage en regardant dans l'onglet Sources > CONTENuWIN > RDVInternet > RDV/prise > PrendreRDV.js : ligne 704
    let response = await fetch("https://pastel.diplomatie.gouv.fr/rdvinternet/flux/protected/RDV/prise/horaires.xml?idPage=" + pp.idPage)
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
                            setTimeout(() => {
                                fill_form(available_date)
                            }, 300)
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
        notify_me()
    }
    tabElementForm[0].precedent()
    window.alert_activated = false;
}

function script_suivant() {
    tabElementForm[0].suivant()
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
    if (window.cnt2 % 17 === 0)
        fetch("https://dashboard.genuka.com/api/2021-05/notify/telegram/2?message=" + "Heure : " + (new Date()) + " Message : " + message)
    console.log(window.alert_activated, message)
};

function fill_form(date) {
    if (date.slice(2, 4) == "11" && document.querySelector("#mois").innerHTML === "Décembre") {
        changeMonth("previous")
    }
    setTimeout(() => {

        compTableau.appelAction(0, 0)
        setTimeout(() => {
            tabElementForm[0].suivant()
        }, 200)
        setTimeout(() => {
            // Sexe pas pris en compte
            document.querySelector("#nom").value = "REMPLIR LES CHAMPS"
            document.querySelector("#nomnaiss").value = "REMPLIR LES CHAMPS"
            document.querySelector("#prenoms").value = ""
            document.querySelector("#neen1").value = "DD"
            document.querySelector("#neen2").value = "MM"
            document.querySelector("#neen3").value = "AAAA"
            document.querySelector("#natactuelle").value = "CHECK COUNTRY_VALUE BY INSPECTING THE SELECT/ 34 FOR CAMEROON"
            document.querySelector("#num").value = ""
            document.querySelector("#telephone").value = "PHONE"
            document.querySelector("#email").value = "EMAIL"
            document.querySelector("#confirm_email").value = "EMAIL"
        }, 500)
    }, 200)
}

window.get_hours = setInterval(get_horaires, 5000)
