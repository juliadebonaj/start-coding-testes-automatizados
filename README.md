# Start Coding — Testes Automatizados

Projeto de estudos de testes automatizados com **Vitest + TypeScript**, cobrindo as duas
abordagens trabalhadas no curso: **BDD** e **TDD**.

## Entregas

- **As entregas finais estão em BDD** (`src/exercicios/BDD`) — exercícios de escrita de testes
  guiados por comportamento sobre funções já existentes.
- **O projeto final é o TDD** (`src/exercicios/TDD`) — função construída do zero pelo ciclo
  RED → GREEN → REFACTOR.

## Estrutura

```
src/
├── exemplos/            # exemplos de apoio vistos em aula (helpers e mocks)
│   ├── helpers/         # calculadora, imc, texto
│   └── mocks/api/       # exemplo de mock de API (pokedex)
└── exercicios/
    ├── BDD/             # entregas finais (behavior-driven)
    └── TDD/             # projeto final (test-driven) — ver TDD/README.md
```

## BDD — entregas finais (`src/exercicios/BDD`)

Foco em descrever o **comportamento esperado** das funções (Arrange / Act / Assert), incluindo
casos de sucesso, de erro e limites.

### 1. Cadastro de cliente por CEP — `cadastro.ts` / `cadastro.test.ts`
Função `cadastrarCliente` que valida o CEP e busca o endereço na API do ViaCEP.
O que foi feito nos testes:
- **Mock do `fetch` global** (via `vi.stubGlobal`) com uma `responseFactory` para simular
  respostas da API sem chamar a rede.
- Cenários cobertos:
  - endereço válido retornado e mapeado (`localidade` → `cidade`, CEP sem hífen);
  - erro da API (status não-ok → mensagem amigável);
  - CEP com formato inválido (falha antes do fetch — `fetch` não é chamado);
  - CEP não encontrado (resposta `{ erro: true }`);
  - falha de rede (fetch rejeitado → mensagem amigável);
  - CEP com hífen normalizado antes da consulta.

### 2. Carrinho de compras — `carrinho.ts` / `carrinho.spec.ts`
Conjunto de funções puras de e-commerce (valores em centavos).
O que foi feito nos testes:
- `criarCarrinho` / `adicionarItem` (inclui erro para quantidade ≤ 0, imutabilidade);
- `calcularSubtotal` (preço × quantidade; vazio = 0);
- `aplicarCupom` (percentual e fixo; validade; erro para cupom expirado);
- `calcularDesconto` (percentual arredondado; fixo limitado ao subtotal);
- `calcularFrete` (frete grátis a partir do mínimo; desconto considerado na decisão);
- `calcularTotal` (subtotal − desconto + frete).

## TDD — projeto final (`src/exercicios/TDD`)

Função `calcularParcelamento` construída **pelo ciclo TDD** (RED → GREEN → REFACTOR).
Detalhes completos das regras de juros e retorno em [`src/exercicios/TDD/README.md`](src/exercicios/TDD/README.md).

Resumo:
- Juros por faixa de parcelas (1–4x sem juros; 5–8x 5%; 9–12x 8%; 13–18x 10%), aplicados uma
  única vez sobre o total antes de dividir.
- Validações: parcelas inteiras entre 1 e 18; valor da compra > 0 (senão, lança erro).
- Distribuição das parcelas de forma que a soma bata exatamente com o total (a 1ª parcela
  absorve a diferença de arredondamento).
- Testes cobrindo cada faixa, limites (com `it.each`), arredondamento e validações.

## Como rodar

Requer Node >= 20.12 (o projeto usa Vitest 4).

```bash
npm install

# todos os testes (watch)
npm test

# rodar uma vez
npx vitest run

# com cobertura
npm run test:cov

# apenas uma parte
npx vitest run src/exercicios/BDD
npx vitest run src/exercicios/TDD
```
