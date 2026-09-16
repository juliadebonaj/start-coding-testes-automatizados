export type ResultadoParcelamento = {
  valorParcela: number
  totalParcelas: number
}

export function calcularParcelamento(
  valorCompra: number,
  numeroParcelas: number,
): ResultadoParcelamento {
  if (valorCompra <= 0) {
    throw new Error('Valor da compra deve ser maior que zero')
  }

  if (!Number.isInteger(numeroParcelas) || numeroParcelas < 1 || numeroParcelas > 18) {
    throw new Error('Número de parcelas deve ser um inteiro entre 1 e 18')
  }

  const total = valorCompra * (1 + obterJuros(numeroParcelas))
  const valorParcela = arredondar(total / numeroParcelas)

  return { valorParcela, totalParcelas: numeroParcelas }
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100
}

function obterJuros(numeroParcelas: number): number {
  if (numeroParcelas >= 5 && numeroParcelas <= 8) return 0.05
  if (numeroParcelas >= 9 && numeroParcelas <= 12) return 0.08
  if (numeroParcelas >= 13 && numeroParcelas <= 18) return 0.1
  return 0
}
