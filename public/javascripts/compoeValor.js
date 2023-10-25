function compoeValor(tag) {
    setTimeout(() => {
        let tagCredito = tag;
        let credito = Number(tagCredito.textContent).toFixed(2);
        let interval = credito / 100;
        let timer = 0;
    
        tagCredito.innerHTML = 0;
    
        let compoe = setInterval(() => {
            if (timer.toFixed(2) == credito) {
                clearInterval(compoe);
            } else {
                timer += interval;
                tagCredito.innerHTML = timer.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }          
        }, 10);

    }, 1500);
};

compoeValor(document.querySelectorAll(".result-item p")[0]);
compoeValor(document.querySelectorAll(".result-item p")[1]);