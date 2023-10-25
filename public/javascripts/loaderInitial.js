window.addEventListener("load", () => {

    const loaderBox = document.querySelector(".loader-box");
    let loaderInterval = setTimeout(() => {
        loaderBox.classList.add("hide");
        window.scroll(0,0);
    }, 1500)
})