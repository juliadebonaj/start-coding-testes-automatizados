# Parcelamento de compra (TDD)

Função `calcularParcelamento` construída com TDD (Vitest + TypeScript), seguindo o ciclo RED → GREEN → REFACTOR.

## Regras de juros

| Parcelas   | Juros sobre o total |
|------------|---------------------|
| 1x a 4x    | Sem juros           |
| 5x a 8x    | 5%                  |
| 9x a 12x   | 8%                  |
| 13x a 18x  | 10%                 |

- O juro é aplicado uma única vez sobre o valor total; só depois é dividido pelas parcelas.
- O valor da parcela é arredondado para 2 casas decimais.
- Parcelas: inteiro entre 1 e 18 (fora disso, lança erro).
- Valor da compra: maior que zero (senão, lança erro).

## Retorno

```ts
type ResultadoParcelamento = {
  valorParcela: number   // valor de cada parcela (arredondado)
  totalParcelas: number  // número de parcelas
  valorTotal: number     // total da compra já com juros (extra)
  parcelas: number[]     // parcelas que somam exatamente o total; a 1a absorve a diferença (extra)
}
```

## Como rodar

Requer Node >= 20.12 (o projeto usa Vitest 4).

```bash
npm install
npx vitest run src/exercicios/TDD   # roda uma vez
npx vitest src/exercicios/TDD       # modo watch
```

## Arquivos

- `parcelamento.ts` — tipo + função
- `parcelamento.test.ts` — testes (faixas, limites com `it.each`, arredondamento, validações e desafios extras)
