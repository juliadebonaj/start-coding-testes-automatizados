import { calcularParcelamento } from './parcelamento'

describe('calcularParcelamento', () => {
  describe('sem juros (1x a 4x)', () => {
    it('retorna o valor total em parcela única quando for 1x', () => {
      const resultado = calcularParcelamento(1000, 1)

      expect(resultado).toEqual({ valorParcela: 1000, totalParcelas: 1, valorTotal: 1000 })
    })

    it('divide o valor sem juros quando for 4x', () => {
      const resultado = calcularParcelamento(1000, 4)

      expect(resultado).toEqual({ valorParcela: 250, totalParcelas: 4, valorTotal: 1000 })
    })
  })

  describe('com juros', () => {
    it('aplica 5% sobre o total quando for de 5x a 8x', () => {
      // 1000 + 5% = 1050
      expect(calcularParcelamento(1000, 5)).toEqual({ valorParcela: 210, totalParcelas: 5, valorTotal: 1050 })
      expect(calcularParcelamento(1000, 8)).toEqual({ valorParcela: 131.25, totalParcelas: 8, valorTotal: 1050 })
    })

    it('aplica 8% sobre o total quando for de 9x a 12x', () => {
      // 1000 + 8% = 1080
      expect(calcularParcelamento(1000, 9)).toEqual({ valorParcela: 120, totalParcelas: 9, valorTotal: 1080 })
      expect(calcularParcelamento(1000, 12)).toEqual({ valorParcela: 90, totalParcelas: 12, valorTotal: 1080 })
    })

    it('aplica 10% sobre o total quando for de 13x a 18x', () => {
      // 1000 + 10% = 1100
      expect(calcularParcelamento(1000, 13)).toEqual({ valorParcela: 84.62, totalParcelas: 13, valorTotal: 1100 })
      expect(calcularParcelamento(1000, 18)).toEqual({ valorParcela: 61.11, totalParcelas: 18, valorTotal: 1100 })
    })

    it.each([
      { parcelas: 4, totalComJuros: 1000 },
      { parcelas: 5, totalComJuros: 1050 },
      { parcelas: 8, totalComJuros: 1050 },
      { parcelas: 9, totalComJuros: 1080 },
      { parcelas: 12, totalComJuros: 1080 },
      { parcelas: 13, totalComJuros: 1100 },
    ])(
      'aplica a faixa correta no limite de $parcelas x (total $totalComJuros)',
      ({ parcelas, totalComJuros }) => {
        const esperado = Math.round((totalComJuros / parcelas) * 100) / 100
        expect(calcularParcelamento(1000, parcelas).valorParcela).toBe(esperado)
      },
    )
  })

  describe('arredondamento', () => {
    it('arredonda o valor da parcela para 2 casas decimais', () => {
      // 100 / 3 = 33.333... -> 33.33
      expect(calcularParcelamento(100, 3)).toEqual({ valorParcela: 33.33, totalParcelas: 3, valorTotal: 100 })
    })
  })

  describe('validações', () => {
    const ERRO_PARCELAS = 'Número de parcelas deve ser um inteiro entre 1 e 18'
    const ERRO_VALOR = 'Valor da compra deve ser maior que zero'

    it('lança erro quando o número de parcelas for menor que 1', () => {
      expect(() => calcularParcelamento(1000, 0)).toThrow(ERRO_PARCELAS)
    })

    it('lança erro quando o número de parcelas for maior que 18', () => {
      expect(() => calcularParcelamento(1000, 19)).toThrow(ERRO_PARCELAS)
    })

    it('lança erro quando o número de parcelas não for inteiro', () => {
      expect(() => calcularParcelamento(1000, 2.5)).toThrow(ERRO_PARCELAS)
    })

    it('lança erro quando o valor da compra for zero ou negativo', () => {
      expect(() => calcularParcelamento(0, 3)).toThrow(ERRO_VALOR)
      expect(() => calcularParcelamento(-50, 3)).toThrow(ERRO_VALOR)
    })
  })

  describe('extra: valorTotal', () => {
    it('retorna o valor total da compra já com juros', () => {
      expect(calcularParcelamento(1000, 1).valorTotal).toBe(1000)
      expect(calcularParcelamento(1000, 5).valorTotal).toBe(1050)
      expect(calcularParcelamento(1000, 9).valorTotal).toBe(1080)
      expect(calcularParcelamento(1000, 13).valorTotal).toBe(1100)
    })
  })

  describe('extra: soma das parcelas fecha com o total', () => {
    it('retorna a lista de parcelas que soma exatamente o total', () => {
      const { parcelas } = calcularParcelamento(100, 3)
      const soma = parcelas.reduce((a, b) => a + b, 0)

      expect(parcelas).toEqual([33.34, 33.33, 33.33])
      expect(Math.round(soma * 100) / 100).toBe(100)
    })

    it('ajusta a primeira parcela quando há sobra de arredondamento com juros', () => {
      // 1000 em 13x -> total 1100, 84.62*13 = 1100.06, diferença -0.06 na 1a
      const { parcelas, valorTotal } = calcularParcelamento(1000, 13)
      const soma = Math.round(parcelas.reduce((a, b) => a + b, 0) * 100) / 100

      expect(parcelas[0]).toBe(84.56)
      expect(parcelas.slice(1).every((p) => p === 84.62)).toBe(true)
      expect(soma).toBe(valorTotal)
    })

    it('mantém parcela única igual ao total', () => {
      expect(calcularParcelamento(1000, 1).parcelas).toEqual([1000])
    })
  })
})
