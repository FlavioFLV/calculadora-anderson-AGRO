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
  try {
  } catch (error) {
    
  }
  
  try {
    await axios(options)
    .then(response => {
      
      console.log(response.data)
  
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
  } catch (error) {
    res.json(data.statusRequest)
  }
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

module.exports = router;