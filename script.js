const HEADING_LEVEL = {
  ONE: 'h1',
  TWO: 'h2',
  THREE: 'h3',
  FOUR: 'h4'
}

let input = document.getElementById('movimentacoes')
input.addEventListener('change', async function () {
  const data = await extractExcelData(input.files);
  const stocks = data.reduce(createStocksObject, {});
  addReportToDocument(stocks);
});

function createStocksObject(stocks, excelData) {
  const { stock, kind, total } = excelData;
  if (stocks[kind] && stocks[kind][stock]) {
    stocks[kind][stock] += total
  } else {
    stocks[kind] =  {...stocks[kind], ...{ [stock]: total }};
  }
  return stocks;
}

function addReportToDocument(stocks) {
  clearContent();
  domInsertTitle("Relatório", HEADING_LEVEL.TWO);
  const totalDividendos = domInsertTable('Dividendos', stocks['dividendo']);
  const totalJuros = domInsertTable('Juros', stocks['juros sobre capital próprio']);
  const totalRendimentos = domInsertTable('Rendimento', stocks['rendimento']);
  const totalLeilaoFracao = domInsertTable('Leilão de Fração', stocks['leilão de fração']);
  const total = totalDividendos + totalJuros + totalRendimentos + totalLeilaoFracao;
  domInsertTitle(`Total de proventos = R$${total.toFixed(2).toString().replace('.', ',')}`, HEADING_LEVEL.FOUR);
}

function clearContent() {
  document.getElementById('print').innerHTML = '';
}

function domInsertTitle(title, headingLevel) {
  const element = document.getElementById("print");
  const heading = document.createElement(headingLevel);
  const textnode = document.createTextNode(title);
  heading.appendChild(textnode);
  element.appendChild(heading);
}

function domInsertTable(title, content) {
  domInsertTitle(title, HEADING_LEVEL.THREE);
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const tfoot = document.createElement('tfoot');

  table.appendChild(thead);
  table.appendChild(tbody);
  table.appendChild(tfoot);

  document.getElementById('print').appendChild(table);

  const headingRow = document.createElement('tr');
  const headingCode = document.createElement('td');
  const headingCnpj = document.createElement('td');
  const headingCurrency = document.createElement('td');
  headingCode.innerHTML = "Código";
  headingCnpj.innerHTML = "CNPJ";
  headingCurrency.innerHTML = "R$";
  headingRow.appendChild(headingCode);
  headingRow.appendChild(headingCnpj);
  headingRow.appendChild(headingCurrency);
  thead.appendChild(headingRow);

  let total = 0;

  for (const [key, value] of Object.entries(content)) {
    let row = document.createElement('tr');
    let rowCode = document.createElement('td');
    let rowCnpj = document.createElement('td');
    let rowValue = document.createElement('td');
    
    if (key.substr(4, 1) == "3" && key.substr(5, 1)) {
      cnpj = "00000000000000";
    } else {
      cnpj = cnpjs[key.toString().substr(0, 4)] ? cnpjs[key.toString().substr(0, 4)].CNPJ.toString().padStart(14, '0') : "Não encontrado";
    }
    
    rowCode.innerHTML = key;
    rowCnpj.innerHTML = cnpj;
    rowValue.innerHTML = value.toFixed(2).toString().replace('.', ',');
    row.appendChild(rowCode);
    row.appendChild(rowCnpj);
    row.appendChild(rowValue);
    tbody.appendChild(row);
    total += value;
  }

  const footerRow = document.createElement('tr');
  const footerTotal = document.createElement('td');
  const footerSpacing = document.createElement('td');
  const footerTotalValue = document.createElement('td');
  footerTotal.innerHTML = "Total";
  footerSpacing.innerHTML = "";
  footerTotalValue.innerHTML = total.toFixed(2).toString().replace('.', ',');
  footerRow.appendChild(footerTotal);
  footerRow.appendChild(footerSpacing);
  footerRow.appendChild(footerTotalValue);
  tfoot.appendChild(footerRow);

  return total;
}