import { formatPhone } from "./inputShieldsFormat.js";

const phoneShield = document.querySelector(".input-wrapper #phone");
phoneShield.addEventListener("input", formatPhone)

const nameShield = document.querySelector(".input-wrapper #name");
const emailShield = document.querySelector(".input-wrapper #email");

const buttonSubmit = document.querySelector("button[type='submit'");
const inputWrapper = document.querySelectorAll(".input-wrapper");

nameShield.addEventListener("blur", () => {
    if (!nameShield.value.includes(" ")) {
        inputWrapper[0].classList.remove("sucess");
        inputWrapper[0].classList.add("error");
    } else {
        inputWrapper[0].classList.remove("error");
        inputWrapper[0].classList.add("sucess");
    }
})
emailShield.addEventListener("blur", () => {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailShield.value)) {
        inputWrapper[1].classList.remove("sucess");
        inputWrapper[1].classList.add("error");
    } else {
        inputWrapper[1].classList.remove("error");
        inputWrapper[1].classList.add("sucess");
    }
})
phoneShield.addEventListener("blur", () => {
    if (phoneShield.value.length < 14) {
        inputWrapper[2].classList.remove("sucess");
        inputWrapper[2].classList.add("error");
    } else {
        inputWrapper[2].classList.remove("error");
        inputWrapper[2].classList.add("sucess");
    }
})

buttonSubmit.addEventListener("click", () => {

    if (!nameShield.value.includes(" ")) {
        nameShield.setCustomValidity("Informe seu nome completo!");
    } else {
        nameShield.setCustomValidity("");
    };

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailShield.value)) {
        emailShield.setCustomValidity("E-mail informado é inválido!");
    } else {
        emailShield.setCustomValidity("");
    };
    
    if (phoneShield.value.length < 14) {
        phoneShield.setCustomValidity("Número de telefone informado é inválido!");
    } else {
        phoneShield.setCustomValidity("");
    };
})