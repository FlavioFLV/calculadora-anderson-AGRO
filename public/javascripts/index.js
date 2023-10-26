import { formatCnpj, formatCPF, formatDate, formatNumber } from "./inputShieldsFormat.js";

const cnpjShield = document.querySelector(".cnpj-shield input");
cnpjShield.addEventListener("input", formatCnpj)

const cpfShield = document.querySelector(".cpf-shield input");
cpfShield.addEventListener("input", formatCPF)

const dateShield = document.querySelector(".date-shield input");

const numberShield = document.querySelectorAll(".number-shield input");
numberShield.forEach(shield => {
    shield.addEventListener("input", formatNumber);
});

const porcentShield = document.querySelectorAll(".input-wrapper .porcent");
porcentShield.forEach(shield => {
    shield.addEventListener("input", formatNumber);
})

const inputs = document.querySelectorAll("input");
const tabMenuContainer = document.querySelectorAll("nav.tab-menu-container label")

tabMenuContainer.forEach(tab => {
    tab.addEventListener("click", () => {
        inputs.forEach(input => {
            cpfFound = false;
            cnpjFound = false;
            validateShieldsSecOne()
            input.value = "";
        })
        document.querySelectorAll(".tab-content span[class]")[0].textContent = "";
        document.querySelectorAll(".tab-content span[class]")[1].textContent = "";

        regime[0].disabled = true;
        regime[1].disabled = true;
        regime[0].checked = false;
        regime[1].checked = false;
    })
})

const buttonNextSection = document.querySelector(".button-next-section");
const statusBar = document.querySelectorAll(".status-bar .status");
const section = document.querySelectorAll("section");

buttonNextSection.addEventListener("click", (e) => {
    if (!buttonNextSection.hasAttribute("type")) {
        e.preventDefault();
        if (!buttonNextSection.hasAttribute("disabled")) {
            document.querySelector(".loader-box").classList.add("form");
            document.querySelector(".loader-box").classList.remove("hide");
            
            setTimeout(() => {
                document.querySelector(".loader-box").classList.add("hide");
            }, 1000)
            setTimeout(() => {
                section[0].classList.remove("current-section");
                section[1].classList.add("current-section");
                statusBar[0].classList.remove("current-section");
                statusBar[1].classList.add("current-section");
                
                statusBar[0].textContent = "Anterior"
                statusBar[1].textContent = "A T U A L"
            }, 1000);
        }
    }
})


let cnpjFound = false;
let cpfFound = false;
function validateShieldsSecOne() {
    if (cnpjFound || cpfFound){
        buttonNextSection.removeAttribute("disabled");
        statusBar[0].classList.remove("hide");
        statusBar[1].classList.remove("hide");
        
        document.querySelector(".cnpj-shield").classList.remove("error");
        document.querySelector(".cnpj-shield").classList.add("sucess");
    } else {
        buttonNextSection.setAttribute("disabled", "");
        statusBar[0].classList.add("hide");
        statusBar[1].classList.add("hide");
        
        document.querySelector(".cnpj-shield").classList.remove("sucess");
        document.querySelector(".cnpj-shield").classList.add("error")
    }
}


const submitButton = document.querySelector("button[type=submit]");
function validateShieldsSecTwo () {
    
    const inputWrapper = document.querySelectorAll(".section-two .input-wrapper");
    let inputsVisible = document.querySelectorAll(".section-two input:not(.hide)");
    let allFilled = true;

    inputsVisible.forEach((el, index) => {
        el.addEventListener("input", () => {
            if (el.value == "") {
                inputWrapper[index].classList.remove("sucess");
                inputWrapper[index].classList.add("error");
            } else {
                inputWrapper[index].classList.remove("error")
                inputWrapper[index].classList.add("sucess")
            }
        });

        inputsVisible.forEach(e => {
            if (e.value === "") {
                return allFilled = false;
            }
        });

    });
    
    submitButton.disabled = !allFilled;
};
    
const razaoSocial = document.querySelector(".search-cnpj .razao-social");
const nome = document.querySelector(".search-cpf .nome_PF");
const regime = document.querySelectorAll(".regime-content input[type=radio]");
const inputsSectionTwo = document.querySelectorAll(".section-two .input-wrapper");

function hideInputsSectionTwo(simples) {
    inputsSectionTwo.forEach((el, index) => {
        if (simples && index > 0) {
            el.classList.add("hide")
            document.querySelectorAll(".section-two input")[index].classList.add("hide")
        } else {
            el.classList.remove("hide")
            document.querySelectorAll(".section-two input")[index].classList.remove("hide")
        }
    });
}

const searchingCNPJ = document.querySelector(".search-cnpj .searching");
const searchingCPF = document.querySelector(".search-cpf .searching");
const razaoSocialModal = document.querySelector(".modal h2#razao-social");
const codCnaeList = document.querySelector(".modal .codeCnae-content div");

function loaderSearchingShow(search, doc) {
    if (doc == "cpf") {
        nome.textContent = ""
        if (search) {
            searchingCPF.classList.add("loading")
        } else {
            searchingCPF.classList.remove("loading")
        }
    }

    if (doc == "cnpj") {
        razaoSocial.textContent = ""
        if (search) {
            searchingCNPJ.classList.add("loading")
        } else {
            searchingCNPJ.classList.remove("loading")
        }
    }
}

let simples = false;
let dataCNPJ;

window.addEventListener("input", async (e) => {
    
    let validateYearBirthdate = dateShield.value;
    validateYearBirthdate = String(validateYearBirthdate).split("-")[0]

    if (cpfShield.value.length == 14 && validateYearBirthdate > 1000) {
        
        let cpf = cpfShield.value;
        let birthdate = dateShield.value;

        loaderSearchingShow(true, "cpf");

        await fetch(`/api/consulta-cpf?cpf=${cpf}&birthdate=${birthdate}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.code == 200) {
                    cpfFound = true;
                    validateShieldsSecOne()
                    loaderSearchingShow(false, "cpf");
                    nome.textContent = data.data[0].nome
                }
            })
    }
})

cnpjShield.addEventListener("input", async (e) => {
    let cnpj = e.target.value;
    if (e.target.value.length == 18) {
        cnpj = cnpj.replaceAll(".","").replace("/", "").replace("-", "");

        loaderSearchingShow(true, "cnpj");

        await fetch(`/api/consulta-cnpj?cnpj=${cnpj}`)
        .then(response => response.json())
        .then(data => {

            if (data.statusRequest == 200) {

                loaderSearchingShow(false, "cnpj");
                
                dataCNPJ = data;
                console.log(dataCNPJ);
    
                // console.log(data.validateCnae)
                let simples_nacional_situacao = dataCNPJ.simples_nacional_situacao;
                let validateCnae = dataCNPJ.validateCnae;
                if (!simples_nacional_situacao.includes("NÃO optante") && !validateCnae) {
                    razaoSocialModal.textContent = dataCNPJ.razao_social;
                    
                    codCnaeList.innerHTML = ""
                    dataCNPJ.atividade_economica_lista.forEach(item => {
                        codCnaeList.innerHTML += `<p id="codeCnae" class="item"><span>${item.substr(0, 10)}</span>${item.substr(11)}</p>`;
                    })
    
                    modal.classList.remove("hide");
                    
                    validateShieldsSecOne();
                    return;
                }
                
                cnpjFound = true;
                validateShieldsSecOne()
                
                const razao_social = dataCNPJ.razao_social;
                razaoSocial.textContent = razao_social;
                
                const razaoSocialHideen = document.querySelector("form #razao-social");
                razaoSocialHideen.value = razao_social;

                const calculoHidden = document.querySelector("form #calculo-simples");
                calculoHidden.value = data.calculo_monofasico;
                
                if (simples_nacional_situacao.includes("NÃO optante")) {
                    // regime[0].disabled = true;
                    regime[0].disabled = false;
                    regime[1].disabled = false;
                    regime[1].checked = true;
    
                    simples = false;
                    hideInputsSectionTwo(simples)
                    regimeCalculadoHidden.value = "lucro-presumido-real";
                } else {
                    // regime[1].disabled = true;
                    regime[1].disabled = false;
                    regime[0].disabled = false;
                    regime[0].checked = true;
                    
                    simples = true;
                    hideInputsSectionTwo(simples)
                    regimeCalculadoHidden.value = "simples-nacional";
                }
            } else if (data.statusRequest == "ENOTFOUND") {
                cnpjFound = false;
                
                loaderSearchingShow(false, "cnpj");
                razaoSocial.textContent = "Erro no servidor! Tente novamente.";
                validateShieldsSecOne();
            } else {
                cnpjFound = false;
                
                loaderSearchingShow(false, "cnpj");
                razaoSocial.textContent = "CNPJ NÃO ENCONTRADO!";
                validateShieldsSecOne();
            }

        })
        .catch(error => {
            console.log(error);
            cnpjFound = false;
            
            loaderSearchingShow(false, "cnpj");
            razaoSocial.textContent = "CNPJ NÃO ENCONTRADO!";
            validateShieldsSecOne();
        });

    } else {
        cnpjFound = false;
    
        regime.forEach(item => {
            item.disabled = true;
            item.checked = false;
        });
        
        validateShieldsSecOne();
        statusBar[0].classList.add("hide");
        statusBar[1].classList.add("hide");
        
        razaoSocial.textContent = "";
        buttonNextSection.removeAttribute("type");

        // Limpa os inputs da section-two
        inputsSecTwo.forEach(el => {
            el.value = "";
            validateShieldsSecTwo();
        })

    }
})

const regimeCalculadoHidden = document.querySelector("form #regime-da-empresa");

regime.forEach((option, index) => {
    option.addEventListener("change", () => {
        console.log(dataCNPJ.validateCnae);
        if (index == 0 && dataCNPJ.validateCnae) {
            cnpjFound = true;
            validateShieldsSecOne();

            hideInputsSectionTwo(true);
        } else if (index == 0 && !dataCNPJ.validateCnae) {
            cnpjFound = false;
            validateShieldsSecOne()

            razaoSocialModal.textContent = dataCNPJ.razao_social;
                
            codCnaeList.innerHTML = ""
            dataCNPJ.atividade_economica_lista.forEach(item => {
                codCnaeList.innerHTML += `<p id="codeCnae" class="item"><span>${item.substr(0, 10)}</span>${item.substr(11)}</p>`;
            })

            modal.classList.remove("hide");            
        } else if (index == 1) {
            cnpjFound = true;
            validateShieldsSecOne();

            hideInputsSectionTwo(false);
        }
    });
})

const inputsSecTwo = document.querySelectorAll(".section-two input");
inputsSecTwo.forEach(input => {
    input.addEventListener("input", validateShieldsSecTwo)
})

statusBar.forEach((el, index) => {
    el.addEventListener("click", () => {
        // if (!buttonNextSection.hasAttribute("disabled")) {
            // if (!el.classList.contains("current-section" && !buttonNextSection.hasAttribute("disabled"))) {
                document.querySelector(".loader-box").classList.add("form");
                document.querySelector(".loader-box").classList.remove("hide");
                setTimeout(() => {
                    document.querySelector(".loader-box").classList.add("hide");
                }, 1000);
                setTimeout(() => {
                    if (index == 1) {
                        section[0].classList.remove("current-section");
                        section[1].classList.add("current-section");
                        statusBar[0].classList.remove("current-section");
                        statusBar[1].classList.add("current-section");
                        
                        statusBar[0].textContent = "Anterior"
                        statusBar[1].textContent = "A T U A L"
                    } else {
                        section[1].classList.remove("current-section");
                        statusBar[1].classList.remove("current-section");
                        statusBar[0].classList.add("current-section");
                        section[0].classList.add("current-section");
                        
                        statusBar[0].textContent = "A T U A L"
                        statusBar[1].textContent = "Próximo"
                    };
                }, 1000);
            // };
        // };
    });
});

const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal .ph-x");

modalClose.addEventListener("click", () => {
    modal.classList.add("hide");
})


const modalEmoji = document.querySelector(".modal .codeCnae-content img");
const emojiList = [ "1f62b", "1f61f", "1f62d", "1f97a", "1f625", "1f627", "1f629", "1f632", "1f622" ];

modalEmoji.addEventListener("click", (e) => {
    let value = Number(e.target.id);
    let emojiPath = "";

    if (value + 1 == emojiList.length ) {
        e.target.setAttribute("id", 0)
        emojiPath = `images/${emojiList[0]}.gif`;
    } else {
        e.target.setAttribute("id", value + 1)
        emojiPath = `images/${emojiList[value + 1]}.gif`;
    }
    
    e.target.setAttribute("src", emojiPath)

})


submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    numberShield.forEach(shield => {
        shield.value = shield.value.replaceAll(".", "").replace(",", ".");
    })
    porcentShield.forEach(shield => {
        shield.value = shield.value.replace(",", ".");
    })
    
    document.querySelector("form").submit();
    
})