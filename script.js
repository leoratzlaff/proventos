const input = document.getElementById('movimentacoes')
input.addEventListener('change', async function () {
  const data = await extractExcelData(input.files);
  const stocks = data.reduce(createStocksObject, {});
  addTotal(stocks);
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

function addTotal(stocks) {
  const sum = values => values.reduce((acc, value) => acc + value);
  const kindObjects = Object.values(stocks);
  const allValues = kindObjects.flatMap(obj => Object.values(obj));
  stocks['total'] = sum(allValues)
}
