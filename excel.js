async function extractExcelData(files) {
  const rows = await readXlsxFile(files[0]);
  rows.shift();
  const data = rows.map(parseRow);
  data.filter(filterDesiredKinds);
  return data;
}

function parseRow(row) {
  const stock = row[3].split(" ")[0];
  const kind = row[2] ? row[2].toLowerCase() : "";
  const total = row[7];
  return { stock, kind, total };
}
