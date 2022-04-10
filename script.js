const input = document.getElementById('movimentacoes')
input.addEventListener('change', async function () {
  const data = await extractExcelData(input.files);
  const stocks = data.reduce(createStocksObject, {});
  const sortedStocks = sort(stocks)
  addTotal(sortedStocks);
  addReportToDocument(sortedStocks);
});

function createStocksObject(stocks, excelData) {
  const { stock, kind, total } = excelData;
  if (stocks[kind] && stocks[kind][stock]) {
    stocks[kind][stock] += total
  } else {
    stocks[kind] = { ...stocks[kind], ...{ [stock]: total } };
  }
  return stocks;
}

function addTotal(stocks) {
  const sum = values => values.reduce((acc, value) => acc + value);
  const kindObjects = Object.values(stocks);
  const allValues = kindObjects.flatMap(Object.values);
  stocks['total'] = sum(allValues)
}

function sort(stocks) {
  const sortedStocks = {};
  const kinds = Object.keys(stocks);
  kinds.forEach(kind => sortedStocks[kind] = sortByKey(stocks[kind]));
  return sortedStocks;
}

function sortByKey(object) {
  return Object.keys(object).sort().reduce(function (result, key) {
    result[key] = object[key];
    return result;
  }, {});
}