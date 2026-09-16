import { calcularParcelamento } from './parcelamento'

describe('calcularParcelamento', () => {
  describe('sem juros (1x a 4x)', () => {
    it('retorna o valor total em parcela única quando for 1x', () => {
      const resultado = calcularParcelamento(1000, 1)

      expect(resultado).toEqual({ valorParcela: 1000, totalParcelas: 1 })
    })

    it('divide o valor sem juros quando for 4x', () => {
      const resultado = calcularParcelamento(1000, 4)

      expect(resultado).toEqual({ valorParcela: 250, totalParcelas: 4 })
    })
  })

  describe('com juros', () => {
    it('aplica 5% sobre o total quando for de 5x a 8x', () => {
      // 1000 + 5% = 1050
      expect(calcularParcelamento(1000, 5)).toEqual({ valorParcela: 210, totalParcelas: 5 })
      expect(calcularParcelamento(1000, 8)).toEqual({ valorParcela: 131.25, totalParcelas: 8 })
    })

    it('aplica 8% sobre o total quando for de 9x a 12x', () => {
      // 1000 + 8% = 1080
      expect(calcularParcelamento(1000, 9)).toEqual({ valorParcela: 120, totalParcelas: 9 })
      expect(calcularParcelamento(1000, 12)).toEqual({ valorParcela: 90, totalParcelas: 12 })
    })

    it('aplica 10% sobre o total quando for de 13x a 18x', () => {
      // 1000 + 10% = 1100
      expect(calcularParcelamento(1000, 13)).toEqual({ valorParcela: 84.62, totalParcelas: 13 })
      expect(calcularParcelamento(1000, 18)).toEqual({ valorParcela: 61.11, totalParcelas: 18 })
    })
  })
})
