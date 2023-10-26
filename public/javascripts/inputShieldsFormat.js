export const formatCnpj = (e) => {

    let valor = e.target.value;

    valor = valor.replace(/\D/g,"");
    valor = valor.replace(/^(\d{2})(\d)/,"$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/,".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/,"$1-$2");

    e.target.value = valor;
};

export const formatCPF = (e) => {

    let valor = e.target.value;

    valor = valor.replace(/\D/g,"");
    valor = valor.replace(/^(\d{3})(\d)/,"$1.$2");
    valor = valor.replace(/^(\d{3}).(\d{3})(\d)/,"$1.$2.$3");
    valor = valor.replace(/(\d{3})(\d)/,"$1-$2");

    e.target.value = valor;
};


export const formatNumber = (e) => {

    let value = e.target.value.replace(/\D/g, '');

    // Converte para número e formata como moeda
    const amount = Number(value) / 100;
    value = amount.toLocaleString('pt-BR', {minimumFractionDigits: 2});

    // Remove zeros extras à esquerda
    value = value.replace(/^0+(?=\d)/, '');

    // Define o valor formatado no campo de entrada
    e.target.value = value;
}

export const formatDate = (e) => {
    let valor = e.target.value;

    valor = valor.replace(/\D/g,"");
    valor = valor.replace(/^(\d{2})(\d)/,"$1/$2");
    valor = valor.replace(/^(\d{2})(\d{2})(\d)/,"$1/$2/$3");
    valor = valor.replace(/(\d{2})(\d)/,"$1/$2");

    e.target.value = valor;
}

export const formatPhone = (e) => {
    let valor = e.target.value;

    valor = valor.replace(/\D/g,'')
    valor = valor.replace(/(\d{2})(\d)/,"($1) $2")
    valor = valor.replace(/(\d)(\d{4})$/,"$1-$2")

    e.target.value = valor;
};