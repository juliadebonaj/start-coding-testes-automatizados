export type ResultadoParcelamento = {
  valorParcela: number
  totalParcelas: number
}

export function calcularParcelamento(
  valorCompra: number,
  numeroParcelas: number,
): ResultadoParcelamento {
  const total = valorCompra * (1 + obterJuros(numeroParcelas))
  const valorParcela = total / numeroParcelas

  return { valorParcela, totalParcelas: numeroParcelas }
}

function obterJuros(numeroParcelas: number): number {
  if (numeroParcelas >= 5 && numeroParcelas <= 8) return 0.05
  if (numeroParcelas >= 9 && numeroParcelas <= 12) return 0.08
  return 0
}
