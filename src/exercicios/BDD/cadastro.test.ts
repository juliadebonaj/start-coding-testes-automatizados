import { cadastrarCliente, NovoCliente } from "./cadastro"

function responseFactory(body: unknown, { ok = true, status = 200 } = {}) {
    return {
        ok,
        status,
        json: async () => body
    } as unknown as Response
}

function fetchMocked(response: Response) {
    const fetchMock = vi.fn(async () => response)
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

function fetchRejeitado(erro: Error) {
    const fetchMock = vi.fn(async () => {
        throw erro
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

describe('function -> cadastrarCliente', () => {

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('deve retornar endereço valido', async () => {
        // Arrange
        const responseMock = responseFactory({
            cep: '11111-221',
            logradouro: 'Rua da paz',
            bairro: 'Bairro de cima',
            localidade: 'Porto Alegre',
            uf: 'RS'
        })
        fetchMocked(responseMock)

        const cliente: NovoCliente = {
            cep: '17206438',
            nome: 'Bruno'
        }

        // Act
        const result = await cadastrarCliente(cliente)

        // Assert
        expect(result).toStrictEqual({
            nome: 'Bruno',
            endereco: {
                cep: '11111221',
                logradouro: 'Rua da paz',
                bairro: 'Bairro de cima',
                cidade: 'Porto Alegre',
                uf: 'RS'
            }
        })
    })

    it('deve retornar erro da API', async () => {
        // Arrange
        const responseMock = responseFactory({
            cep: '11111-221',
            logradouro: 'Rua da paz',
            bairro: 'Bairro de cima',
            localidade: 'Porto Alegre',
            uf: 'RS'
        }, { ok: false, status: 500 })
        fetchMocked(responseMock)

        const cliente: NovoCliente = {
            nome: 'John',
            cep: '11111221'
        }

        // Act & Assert
        await expect(cadastrarCliente(cliente)).rejects.toThrow(
            'Não foi possível consultar o CEP agora, tente novamente'
        )
    })

    // ===== Casos extras =====

    it('deve lançar erro quando o CEP tem formato inválido', async () => {
        // Arrange
        const fetchMock = fetchMocked(responseFactory({}))

        const cliente: NovoCliente = {
            nome: 'Maria',
            cep: '123'
        }

        // Act & Assert
        await expect(cadastrarCliente(cliente)).rejects.toThrow('CEP inválido')
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('deve lançar erro quando o CEP não é encontrado', async () => {
        // Arrange
        const responseMock = responseFactory({ erro: true })
        fetchMocked(responseMock)

        const cliente: NovoCliente = {
            nome: 'Ana',
            cep: '99999999'
        }

        // Act & Assert
        await expect(cadastrarCliente(cliente)).rejects.toThrow('CEP não encontrado')
    })

    it('deve lançar erro amigável quando o fetch falha (rede)', async () => {
        // Arrange
        fetchRejeitado(new Error('network down'))

        const cliente: NovoCliente = {
            nome: 'Carlos',
            cep: '11111221'
        }

        // Act & Assert
        await expect(cadastrarCliente(cliente)).rejects.toThrow(
            'Não foi possível consultar o CEP agora, tente novamente'
        )
    })

    it('deve aceitar CEP com hífen e remover ao consultar', async () => {
        // Arrange
        const responseMock = responseFactory({
            cep: '90000-000',
            logradouro: 'Av Central',
            bairro: 'Centro',
            localidade: 'Porto Alegre',
            uf: 'RS'
        })
        const fetchMock = fetchMocked(responseMock)

        const cliente: NovoCliente = {
            nome: 'Bruno',
            cep: '90000-000'
        }

        // Act
        const result = await cadastrarCliente(cliente)

        // Assert
        expect(fetchMock).toHaveBeenCalledWith('https://viacep.com.br/ws/90000000/json/')
        expect(result.endereco.cep).toBe('90000000')
    })
})
