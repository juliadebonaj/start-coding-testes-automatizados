export function calcularIMC (peso: number, altura: number): number {
  const imc = (peso / (altura * altura)).toFixed(2)
  return Number(imc)
}

const indice = {
  abaixo_do_peso: 18.5,
  peso_normal: 25,
  sobrepeso: 30,
}

export function classificarIMC (imc: number) {
  if (imc < indice.abaixo_do_peso) return 'Abaixo do peso'
  if (imc < indice.peso_normal) return 'Peso normal'
  if (imc < indice.sobrepeso) return 'Sobrepeso'
  return 'Obesidade'
}