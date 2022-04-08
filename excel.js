async function extractExcelData(files) {
  const rows = await readXlsxFile(files[0]);
  rows.shift();
  return rows.map(parseRow).filter(filterDesiredKinds);
}

function parseRow(row) {
  const stock = row[3].split(" ")[0];
  const kind = row[2] ? row[2].toLowerCase() : "";
  const total = row[7];
  return { stock, kind, total };
}

function filterDesiredKinds(value) {
  const { kind } = value;
  return isJuros(kind) || isDividendo(kind) || isRendimento(kind) || isLeilaoFracao(kind);
}

function isJuros(kind) {
  return kind.includes("juros") && !isTransferido(kind);
}

function isDividendo(kind) {
  return kind.includes("dividendo") && !isTransferido(kind);
}

function isRendimento(kind) {
  return kind.includes("rendimento") && !isTransferido(kind);
}

function isLeilaoFracao(kind) {
  return kind.includes("leil") && kind.includes("fra");
}

function isTransferido(kind) {
  return kind.includes("transf");
}
