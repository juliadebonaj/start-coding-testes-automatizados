export type ResultadoParcelamento = {
  valorParcela: number
  totalParcelas: number
}

export function calcularParcelamento(
  valorCompra: number,
  numeroParcelas: number,
): ResultadoParcelamento {
  const valorParcela = valorCompra / numeroParcelas

  return { valorParcela, totalParcelas: numeroParcelas }
}
