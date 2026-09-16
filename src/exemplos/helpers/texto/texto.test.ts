import { capitalize, contarVogais, inverterTexto, isPalindromo } from "./texto";

describe("inverterTexto", () => {
    it('deve inverter meu nome', () => {
        //Arrange
        const nome = 'bruno cabral';

        //Act
        const result = inverterTexto(nome)

        //Assert
        expect(result).toBe('larbac onurb')
    });
    it('deve limpar e inverter', () => {
        //Arrange
        const nome = 'Gregorio Pontim';

        //Act
        const result = inverterTexto(nome)

        //Assert
        expect(result).toBe('mitnoP oirogerG')
    })
})


describe('contarVogais', () => {
    it('deve contar as vogais de uma frase', () => {
        //Arrange
        const frase = 'A vingança nunca é plena, mata a alma e a envenena'

        //Act
        const result = contarVogais(frase)

        //Assert
        expect(result).toBe(20)
    })
    
})

describe('function -> capitalize', () => {
    it('deve fazer o capitalize', () => {
        //Arrange
        const palavra = "deus"

        //Act
        const result = capitalize(palavra);

        //Assert
        expect(result).toBe('Deus')
    })
    it('deve fazer o capitalize', () => {
        //Arrange
        const palavra = "deus é amor"

        //Act
        const result = capitalize(palavra);

        //Assert
        expect(result).toBe('Deus é amor')
    })

    // ===== Caso extra =====
    it('deve retornar string vazia quando o texto é vazio', () => {
        //Arrange
        const palavra = ""

        //Act
        const result = capitalize(palavra);

        //Assert
        expect(result).toBe('')
    })
})

describe('function -> isPalindromo', () => {
    it('deve verificar se o nome é um palindromo', () => {
        //Arrange
        const name = 'Bruno';

        //Act
        const result = isPalindromo(name);

        expect(result).toBeFalsy()
    })

    it('deve verificar se a frase curta é um palindromo', () => {
        const frase = 'A grama é aaamarga'

        const result = isPalindromo(frase);

        expect(result).toBeTruthy()
    })

     it('deve verificar se a frase longa é um palindromo', () => {
        const frase = 'A grama é amarga'

        const result = isPalindromo(frase);

        expect(result).toBeTruthy()
    });
})