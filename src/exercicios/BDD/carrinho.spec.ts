import {
    adicionarItem,
    aplicarCupom,
    calcularDesconto,
    calcularFrete,
    calcularSubtotal,
    calcularTotal,
    Carrinho,
    criarCarrinho,
    Cupom,
    Item,
} from "./carrinho"

describe('function -> criarCarrinho()', () => {
    it('Deve retornar um carrinho novo', () => {
        //Arrange


        //Act
        const carrinho = criarCarrinho();
        console.log('------>', carrinho)

        //Assert
        expect(carrinho).toStrictEqual({ itens: []})
    })
})

describe('function -> adicionarItem(carrinho, item)', () => {
    
    it('deve retornar carrinho sem cupom e novo item', () => {
        //Arrange
        const carrinho: Carrinho = {
            itens:  [
                {nome: 'Sabao', precoEmCentavos:3200, quantidade: 2}
            ]
        }
        const item:Item = {
            nome: 'detergente',
            precoEmCentavos: 1200,
            quantidade: 3
        } 

        console.log(item)


        //Act
        const novoCarrinho = adicionarItem(carrinho, item)

        //Assert
        expect(novoCarrinho).toStrictEqual({
            itens: [
                { nome: 'Sabao', precoEmCentavos:3200, quantidade: 2 },
                { nome: 'detergente', precoEmCentavos: 1200, quantidade: 3 } 
            ]
        })
    })
    
    it('deve lançar um erro caso quantidade vazia', () => {
        //Arrange
        const carrinho: Carrinho = {
            itens:  [
                {nome: 'Sabao', precoEmCentavos:3200, quantidade: 2}
            ]
        }
        const item:Item = {
            nome: 'detergente',
            precoEmCentavos: 1200,
            quantidade: 0
        } 

        console.log(item)


        //Assert
        expect(() => adicionarItem(carrinho, item)).toThrow('Quantidade deve ser maior que zero')
    })

})

// ===== Casos extras =====

describe('function -> calcularSubtotal(carrinho)', () => {
    it('deve somar preço x quantidade de todos os itens', () => {
        //Arrange
        const carrinho: Carrinho = {
            itens: [
                { nome: 'Sabao', precoEmCentavos: 3200, quantidade: 2 },
                { nome: 'Detergente', precoEmCentavos: 1200, quantidade: 3 },
            ],
        }

        //Act
        const subtotal = calcularSubtotal(carrinho)

        //Assert
        expect(subtotal).toBe(3200 * 2 + 1200 * 3)
    })

    it('deve retornar 0 para carrinho vazio', () => {
        expect(calcularSubtotal(criarCarrinho())).toBe(0)
    })
})

describe('function -> aplicarCupom(carrinho, cupom, agora)', () => {
    it('deve anexar o cupom ao carrinho quando válido', () => {
        //Arrange
        const carrinho = criarCarrinho()
        const cupom: Cupom = { tipo: 'percentual', percentual: 10 }

        //Act
        const resultado = aplicarCupom(carrinho, cupom)

        //Assert
        expect(resultado.cupom).toStrictEqual(cupom)
    })

    it('deve manter o cupom quando ainda dentro da validade', () => {
        //Arrange
        const carrinho = criarCarrinho()
        const cupom: Cupom = {
            tipo: 'fixo',
            valorEmCentavos: 500,
            validoAte: new Date('2030-01-01'),
        }
        const agora = new Date('2029-12-31')

        //Act
        const resultado = aplicarCupom(carrinho, cupom, agora)

        //Assert
        expect(resultado.cupom).toStrictEqual(cupom)
    })

    it('deve lançar erro quando o cupom está expirado', () => {
        //Arrange
        const carrinho = criarCarrinho()
        const cupom: Cupom = {
            tipo: 'percentual',
            percentual: 10,
            validoAte: new Date('2020-01-01'),
        }
        const agora = new Date('2026-01-01')

        //Act & Assert
        expect(() => aplicarCupom(carrinho, cupom, agora)).toThrow('Cupom expirado')
    })
})

describe('function -> calcularDesconto(carrinho)', () => {
    it('deve retornar 0 quando não há cupom', () => {
        //Arrange
        const carrinho: Carrinho = {
            itens: [{ nome: 'Sabao', precoEmCentavos: 3200, quantidade: 2 }],
        }

        //Assert
        expect(calcularDesconto(carrinho)).toBe(0)
    })

    it('deve calcular desconto percentual arredondado', () => {
        //Arrange - subtotal 6400, 10% = 640
        const carrinho: Carrinho = {
            itens: [{ nome: 'Sabao', precoEmCentavos: 3200, quantidade: 2 }],
            cupom: { tipo: 'percentual', percentual: 10 },
        }

        //Assert
        expect(calcularDesconto(carrinho)).toBe(640)
    })

    it('deve calcular desconto fixo limitado ao subtotal', () => {
        //Arrange - subtotal 6400, cupom fixo de 10000 → limita a 6400
        const carrinho: Carrinho = {
            itens: [{ nome: 'Sabao', precoEmCentavos: 3200, quantidade: 2 }],
            cupom: { tipo: 'fixo', valorEmCentavos: 10000 },
        }

        //Assert
        expect(calcularDesconto(carrinho)).toBe(6400)
    })

    it('deve aplicar desconto fixo quando menor que o subtotal', () => {
        //Arrange - subtotal 6400, cupom fixo de 500
        const carrinho: Carrinho = {
            itens: [{ nome: 'Sabao', precoEmCentavos: 3200, quantidade: 2 }],
            cupom: { tipo: 'fixo', valorEmCentavos: 500 },
        }

        //Assert
        expect(calcularDesconto(carrinho)).toBe(500)
    })
})

describe('function -> calcularFrete(carrinho)', () => {
    it('deve retornar 0 para carrinho vazio', () => {
        expect(calcularFrete(criarCarrinho())).toBe(0)
    })

    it('deve cobrar frete quando valor dos produtos abaixo do mínimo', () => {
        //Arrange - subtotal 6400 < 20000
        const carrinho: Carrinho = {
            itens: [{ nome: 'Sabao', precoEmCentavos: 3200, quantidade: 2 }],
        }

        //Assert
        expect(calcularFrete(carrinho)).toBe(1500)
    })

    it('deve dar frete grátis quando atinge o valor mínimo', () => {
        //Arrange - subtotal 20000 == mínimo
        const carrinho: Carrinho = {
            itens: [{ nome: 'TV', precoEmCentavos: 20000, quantidade: 1 }],
        }

        //Assert
        expect(calcularFrete(carrinho)).toBe(0)
    })

    it('deve considerar o desconto ao decidir o frete grátis', () => {
        //Arrange - subtotal 21000, desconto fixo 2000 → 19000 < 20000, cobra frete
        const carrinho: Carrinho = {
            itens: [{ nome: 'TV', precoEmCentavos: 21000, quantidade: 1 }],
            cupom: { tipo: 'fixo', valorEmCentavos: 2000 },
        }

        //Assert
        expect(calcularFrete(carrinho)).toBe(1500)
    })
})

describe('function -> calcularTotal(carrinho)', () => {
    it('deve somar subtotal - desconto + frete', () => {
        //Arrange - subtotal 6400, desconto 10% = 640, frete 1500
        const carrinho: Carrinho = {
            itens: [{ nome: 'Sabao', precoEmCentavos: 3200, quantidade: 2 }],
            cupom: { tipo: 'percentual', percentual: 10 },
        }

        //Act
        const total = calcularTotal(carrinho)

        //Assert
        expect(total).toBe(6400 - 640 + 1500)
    })

    it('deve zerar frete quando total dos produtos atinge o mínimo', () => {
        //Arrange - subtotal 25000, sem cupom → frete grátis
        const carrinho: Carrinho = {
            itens: [{ nome: 'TV', precoEmCentavos: 25000, quantidade: 1 }],
        }

        //Act
        const total = calcularTotal(carrinho)

        //Assert
        expect(total).toBe(25000)
    })

    it('deve retornar 0 para carrinho vazio', () => {
        expect(calcularTotal(criarCarrinho())).toBe(0)
    })
})