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
      const kind = row[2].split(" ")[0].toLowerCase();
      const total = row[7];
      
      if(!ativos.hasOwnProperty(ativo)){
        ativos[ativo] = {'juros': 0,'dividendo': 0,'rendimento': 0}
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
  }else if(kind.includes("dividendo")){
    ativos[ativo].dividendo += total;
  }else if(kind.includes("rendimento")){
    ativos[ativo].rendimento += total;
  }

}

function printResults(){
  dom_insert_title("Relatório", 2)
  dom_insert_title("Dividendos", 3)
  dom_insert_table("dividendo")
  dom_insert_title("Juros", 3)
  dom_insert_table("juros")
  dom_insert_title("Rendimentos", 3)
  dom_insert_table("rendimento")
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

  table.appendChild(thead);
  table.appendChild(tbody);

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

  for (const [key, value] of Object.entries(ativos)) {
    if(value[kind] > 0){
      let row = document.createElement('tr');
      let row_data_1 = document.createElement('td');
      row_data_1.innerHTML = key;
      let row_data_2 = document.createElement('td');
      row_data_2.innerHTML = "Em breve";
      let row_data_3 = document.createElement('td');
      row_data_3.innerHTML = value[kind].toFixed(2).toString().replace('.',',');
      row.appendChild(row_data_1);
      row.appendChild(row_data_2);
      row.appendChild(row_data_3);
      tbody.appendChild(row);
    }
  }
}