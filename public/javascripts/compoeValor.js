function compoeValor(tag) {

    const divParaObservar = document.querySelector('.loader-box');

    // Configuração do MutationObserver
    const config = { attributes: true, attributeFilter: ['class'] };
    
    // Função de callback que será acionada quando ocorrer uma mutação
    const callback = function(mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // Verifica se a classe "hide" foi adicionada à div
          if (divParaObservar.classList.contains('hide')) {
            // Execute o código desejado aqui
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
          }
        }
      }
    };
    
    // Cria a instância do MutationObserver com a função de callback
    const observer = new MutationObserver(callback);
    
    // Inicia a observação da div alvo
    observer.observe(divParaObservar, config);

};

compoeValor(document.querySelectorAll(".result-item p")[0]);
compoeValor(document.querySelectorAll(".result-item p")[1]);