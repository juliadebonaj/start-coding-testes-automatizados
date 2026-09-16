import { montarFicha } from "./pokedex"


const { buscarPokemonMock } = vi.hoisted(() => ({ buscarPokemonMock: vi.fn() }))


vi.mock('./pokemon', async () => {
  
  return { buscarPokemon: buscarPokemonMock };
});

describe('montarFicha', () => {
    it('deve montar ficha do pokemon com todos os dados', async () => {
        // Arrange

       buscarPokemonMock.mockResolvedValue({
        id: 25,
        nome: 'pikachu',
        alturaMetros: 0.5,
        tipos: ['water', 'rock'],
       })

       //dummy
       const dummyName = 'pikachu'

        //Act
        const result = await montarFicha(dummyName)


        //Assert
        expect(result).toEqual({
            titulo: '#25 PIKACHU',
            tipoPrincipal: 'water',
            grande: false
        })
    })

    it('deve montar ficha do pokemon sem tipo', async () => {
        // Arrange

       buscarPokemonMock.mockResolvedValue({
        id: 1,
        nome: 'bulbasaur',
        alturaMetros: 0.8,
        tipos: [],
       })
       

        //Act
       
        const result = await montarFicha('bulbasaur')


        //Assert
        expect(result).toEqual({
            titulo: '#1 BULBASAUR',
            tipoPrincipal: 'desconhecido',
            grande: false
        })
    })

})