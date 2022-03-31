var ativos = {};

function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
  }, {});
}

var input = document.getElementById('movimentacoes')
input.addEventListener('change', function() {
  readXlsxFile(input.files[0]).then(function(rows) {
    
    rows.shift();

    rows.map(row => {

      const ativo = row[3].split(" ")[0];
      const kind = row[2] ? row[2].toLowerCase() : "";
      const total = row[7];
      
      if(!ativos.hasOwnProperty(ativo)){
        ativos[ativo] = {'juros': 0,'dividendo': 0,'rendimento': 0,'leilao_fracao': 0}
      }
      
      addTransaction(ativo, kind, total);
    }) // map end

    ativos = sortObject(ativos);

    printResults();

  })
})

function addTransaction(ativo, kind, total){

  if(kind.includes("juros")){
    ativos[ativo].juros += total;
  }else if(kind.includes("dividendo") && !kind.includes("transf")){
    ativos[ativo].dividendo += total;
  }else if(kind.includes("rendimento")){
    ativos[ativo].rendimento += total;
  }else if(kind.includes("leil") && kind.includes("fra")){
    ativos[ativo].leilao_fracao += total;
  }

}

function printResults(){
  dom_insert_title("Relatório", 2)
  dom_insert_title("Dividendos", 3)
  let total_dividendos = dom_insert_table("dividendo")
  dom_insert_title("Juros", 3)
  let total_juros = dom_insert_table("juros")
  dom_insert_title("Rendimentos", 3)
  let total_rendimentos = dom_insert_table("rendimento")
  dom_insert_title("Leilão de Fração", 3)
  let total_leilao_fracao = dom_insert_table("leilao_fracao")

  let total_proventos = total_dividendos + total_juros + total_rendimentos + total_leilao_fracao;
  dom_insert_title("Total de proventos = R$" + total_proventos.toFixed(2).toString().replace('.',','), 4)
}


function dom_insert_title(text, level){
  var result = document.getElementById("print");
  const heading = document.createElement("h"+level);
  const textnode = document.createTextNode(text);
  heading.appendChild(textnode);
  result.appendChild(heading);
}

function dom_insert_table(kind){
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');
  let tfoot = document.createElement('tfoot');

  table.appendChild(thead);
  table.appendChild(tbody);
  table.appendChild(tfoot);

  // Adding the entire table to the body tag
  document.getElementById('print').appendChild(table);

  let heading_row = document.createElement('tr');
  let heading_1 = document.createElement('td');
  heading_1.innerHTML = "Código";
  let heading_2 = document.createElement('td');
  heading_2.innerHTML = "CNPJ";
  let heading_3 = document.createElement('td');
  heading_3.innerHTML = "R$";
  heading_row.appendChild(heading_1);
  heading_row.appendChild(heading_2);
  heading_row.appendChild(heading_3);
  thead.appendChild(heading_row);

  let total = 0;

  for (const [key, value] of Object.entries(ativos)) {
    if(value[kind] > 0){
      let row = document.createElement('tr');
      let row_data_1 = document.createElement('td');
      row_data_1.innerHTML = key;
      let row_data_2 = document.createElement('td');


      console.log(key);
      if(key.substr(4,1)=="3" && key.substr(5,1)){
        cnpj = "00000000000000";
      }else{
        cnpj = cnpjs[key.toString().substr(0,4)] ? cnpjs[key.toString().substr(0,4)].CNPJ.toString().padStart(14, '0') : "Não encontrado";
      }

      row_data_2.innerHTML = cnpj;
      let row_data_3 = document.createElement('td');
      total += value[kind];
      row_data_3.innerHTML = value[kind].toFixed(2).toString().replace('.',',');
      row.appendChild(row_data_1);
      row.appendChild(row_data_2);
      row.appendChild(row_data_3);
      tbody.appendChild(row);
    }
  }

  let footer_row = document.createElement('tr');
  let footer_1 = document.createElement('td');
  footer_1.innerHTML = "Total";
  let footer_2 = document.createElement('td');
  footer_2.innerHTML = "";
  let footer_3 = document.createElement('td');
  console.log(total.toFixed(2).toString());
  footer_3.innerHTML = total.toFixed(2).toString().replace('.',',');
  footer_row.appendChild(footer_1);
  footer_row.appendChild(footer_2);
  footer_row.appendChild(footer_3);
  tfoot.appendChild(footer_row);

  return total;

}