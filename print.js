const HEADING_LEVEL = {
  ONE: 'h1',
  TWO: 'h2',
  THREE: 'h3',
  FOUR: 'h4'
}

function addReportToDocument(stocks) {
  clearContent();
  domInsertTitle("Relatório", HEADING_LEVEL.TWO);
  domInsertTable('Dividendos', stocks['dividendo']);
  domInsertTable('Juros', stocks['juros sobre capital próprio']);
  domInsertTable('Rendimento', stocks['rendimento']);
  domInsertTable('Leilão de Fração', stocks['leilão de fração']);
  domInsertTitle(`Total de proventos = R$${toBrlCurrencyFormat(stocks['total'])}`, HEADING_LEVEL.FOUR);
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

    rowCode.innerHTML = key;
    rowCnpj.innerHTML = findCnpj(key);
    rowValue.innerHTML = toBrlCurrencyFormat(value)
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
  footerTotalValue.innerHTML = toBrlCurrencyFormat(total)
  footerRow.appendChild(footerTotal);
  footerRow.appendChild(footerSpacing);
  footerRow.appendChild(footerTotalValue);
  tfoot.appendChild(footerRow);
}

function toBrlCurrencyFormat(value) {
  return value.toFixed(2).toString().replace('.', ',');
}