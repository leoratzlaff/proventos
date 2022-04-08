function filterDesiredKinds(value) {
  const { kind } = value;
  return isJuros(kind) || isDividendo(kind) || isRendimento(kind) || isLeilaoFracao(kind);
}

function isJuros(kind) {
  return kind.includes("juros");
}

function isDividendo(kind) {
  return kind.includes("dividendo") && !kind.includes("transf");
}

function isRendimento(kind) {
  return kind.includes("rendimento");
}

function isLeilaoFracao(kind) {
  return kind.includes("leil") && kind.includes("fra");
}
