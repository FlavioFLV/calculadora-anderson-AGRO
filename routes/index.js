var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Calculadora' });
});

// const rapidapiKey = 'b0df82f0e7msh4853cea242367ffp1c8a9bjsn2278f2de348d';
router.get('/api/consulta-cnpj', async function(req, res, next) {
  let cnpj = req.query.cnpj;
  // cnpj = cnpj.replaceAll(".","").replace("/", "").replace("-", "");
  
  const codigoCnaeList = require("../db/cnae");
  let validateCnae = false;
  
  const args = {
    "cnpj":    cnpj,
    "origem":  "web",
    "token":   "XJMtUuZXcSEmSlm_Rfj7W1ZsEzvj4rreJsbGZNAt",
    "timeout": 300
  };
  
  const options = {
    method: 'POST',
    url: 'https://api.infosimples.com/api/v2/consultas/receita-federal/unificada-pj',
    data: args
  };
  
  const data = new Object();
  await axios(options)
  .then(response => {
    
    console.log(response.data)
    console.log(":::::::::::::::::::", response.data.code)

    data.statusRequest = response.data.code;
    if (data.statusRequest == 200) {

      response.data.data[1].atividade_economica_secundaria_lista.unshift(response.data.data[1].atividade_economica)
      data.atividade_economica_lista = response.data.data[1].atividade_economica_secundaria_lista;
      data.simples_nacional_situacao = response.data.data[0].simples_nacional_situacao;
      data.cnpj = response.data.data[1].cnpj;
      data.razao_social = response.data.data[1].razao_social;
      data.statusRequest = response.data.code;
  
      outerLoop: for (i = 0; i < data.atividade_economica_lista.length; i++) {
        for (j = 0; j < codigoCnaeList.length; j++) {
  
          if (data.atividade_economica_lista[i].substr(0, 10) == codigoCnaeList[j].cod) {
            console.log("ENCONTREI", codigoCnaeList[j].calculo)
            validateCnae = true;          
            data.validateCnae = validateCnae;
            data.calculo_monofasico = codigoCnaeList[j].calculo
  
            res.json(data);
            
            break outerLoop;
          } 
        }
      }
  
      if (!validateCnae) {
        data.validateCnae = validateCnae;
        console.log("Optante", "seguimento " + data.validateCnae)
        res.json(data);
      }
      return;
    }
    res.json(data.statusRequest)
  })


  /* :::::::::::: TESTES  ::::::::::: */

  // const consulta = [
  //   {
  //     code: 200,
  //     cnpj: "63019772000608",
  //     atividade_economica: "85.20-1-00 - Ensino médio",
  //     atividade_economica_lista: [
  //       "47.72-5-00 - Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica*",
  //     ],
  //     razao_social: "ASSOCIACAO EDUCACIONAL IRMAS SALESIANAS DE SAO PAULO",
  //     simples_nacional_situacao: "NÃO optante pelo Simples Nacional",
  //   },
  //   {
  //     code: 200,
  //     cnpj: "19205336000119",
  //     atividade_economica: "69.20-6-01 - Atividades de contabilidade",
  //     atividade_economica_lista: [
  //       "55.71-7-03 - Preparação de documentos e serviços especializados de apoio administrativo não especificados anteriormente*",
  //       "85.99-6-04 - Treinamento em desenvolvimento profissional e gerencial*",
  //       "55.11-7-00 - Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica*",
  //       "47.72-5-00 - Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica*",
  //     ],
  //     razao_social: "ARTE FISCAL CONSULTORIA TRIBUTARIA LTDA",
  //     simples_nacional_situacao: "Optante pelo Simples Nacional desde 06/11/2013",
  //   }
  // ]

  // const data = new Object();
  // const codigoCnaeList = require("../db/cnae");
  // let validateCnae = false;

  // consulta.forEach(item => {
  //   if (item['cnpj'] == cnpj) {
      
  //     item.atividade_economica_lista.unshift(item.atividade_economica);
  //     data.atividade_economica_lista = item.atividade_economica_lista;
  //     data.cnpj = item.cnpj;
  //     data.razao_social = item.razao_social;
  //     data.simples_nacional_situacao = item.simples_nacional_situacao;
  //     data.statusRequest = item.code;
      
  //     outerLoop: for (i = 0; i < data.atividade_economica_lista.length; i++) {
  //       for (j = 0; j < codigoCnaeList.length; j++) {

  //         if (data.atividade_economica_lista[i].substr(0, 10) == codigoCnaeList[j].cod) {
            
  //           validateCnae = true;
  //           data.validateCnae = validateCnae;
  //           data.calculo_monofasico = codigoCnaeList[j].calculo
            
  //           res.json(data);
            
  //           break outerLoop;
  //         }
  //       }
  //     }

  //     if (!validateCnae) {
  //       data.validateCnae = validateCnae;
  //       res.json(data);
  //     }

  //   }
  // })
  
  /* :::::::::::::::::::::::::::::::::: */
})

// router.post('/contato', async function(req, res, next) {
router.post('/resultado', async function(req, res) {
  const data = req.body;
  
  const insumosMensal = Number(data.vlrFatMensal) * 0.0925
  const insumosAnual = insumosMensal * 12

  console.log(insumosMensal)
  console.log(insumosAnual)
  
  res.status(200).render("result", {
    title: 'Calculadora | Resultado',
    calculo: {
      insumosMensal,
      insumosAnual,
    }
  })

})


const dataFilePath = path.join(__dirname, '../db/data.json');
let dataArray = []; // Array para armazenar os objetos de dados

// Carregar dados do arquivo data.json para o array de dados
function saveDataToFile() {
  fs.writeFile(dataFilePath, JSON.stringify(dataArray), (err) => {
    if (err) {
      console.error(err);
    }
  });
  // console.log("SALVO: ", dataArray)
}

fs.readFile(dataFilePath, 'utf8', (err, data) => {
  if (!err && data) {
    dataArray = JSON.parse(data);
    // console.log("READ FILE", dataArray)
  }
});

// router.post('/resultado', function(req, res, next) {
router.post('/contact', function(req, res, next) {
  const contact = req.body;

  // console.log(req.session.calculo.total)
  // console.log(req.session.calculo.total60)

  const saveData = { ...contact, ...req.session.calculo.data, credito_mensal: req.session.calculo.total, credito_5_anos: req.session.calculo.total60  };
    
  dataArray.push(saveData);
  saveDataToFile();
  console.log("NOVO ARRAY:", dataArray)
  
  let renderResult = req.session.calculo.faturamentoBruto > 4800000 ? "result_SimplesExcedente" : "result";
  
  res.status(200).render(renderResult, {
    title: 'Calculadora',
    calculo: {
      total: req.session.calculo.total,
      total60: req.session.calculo.total60
    }
  })
});

router.get("/cadastro", function(req, res, next) {
  res.render("read", {
    title: 'Calculadora',
    data: dataArray
  })
})


module.exports = router;