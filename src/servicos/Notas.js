import { db } from "./SQLite"

export function criaTabela() {
  db.transaction((transaction) => {
    transaction.executeSql("CREATE TABLE IF NOT EXISTS " + 
      "Notas " +
      "(id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, categoria TEXT, texto TEXT);")
  })
}

export function buscaNotas() {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        "SELECT * FROM Notas ORDER BY id DESC;",
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      )
    })
  })
}

export function salvaNota(titulo, categoria, texto) {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        "INSERT INTO Notas (titulo, categoria, texto) VALUES (?, ?, ?);",
        [titulo, categoria, texto],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      )
    })
  })
}

export function atualizaNota(id, titulo, categoria, texto) {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        "UPDATE Notas SET titulo = ?, categoria = ?, texto = ? WHERE id = ?;",
        [titulo, categoria, texto, id],
        (_, { rowsAffected }) => resolve(rowsAffected),
        (_, error) => reject(error)
      )
    })
  })
}

export function deletaNota(id) {
  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        "DELETE FROM Notas WHERE id = ?;",
        [id],
        (_, { rowsAffected }) => resolve(rowsAffected),
        (_, error) => reject(error)
      )
    })
  })
}

export function populaBancoVestibular() {
  const resumosVestibular = [
    {
      titulo: "Literatura - Modernismo",
      categoria: "Estudos",
      texto: "O Modernismo brasileiro (1922-1945) foi um movimento literário que rompeu com as tradições anteriores. Principais autores: Mário de Andrade, Oswald de Andrade, Manuel Bandeira. Características: liberdade formal, linguagem coloquial, nacionalismo crítico."
    },
    {
      titulo: "História - Revolução Industrial",
      categoria: "Estudos", 
      texto: "A Revolução Industrial (1760-1840) transformou a produção de mercadorias com a introdução de máquinas. Principais mudanças: produção em larga escala, urbanização, surgimento do proletariado, capitalismo industrial."
    },
    {
      titulo: "Geografia - Clima Brasileiro",
      categoria: "Estudos",
      texto: "O Brasil possui 6 tipos climáticos principais: equatorial (Norte), tropical (Nordeste), tropical de altitude (Sudeste), subtropical (Sul), semiárido (Sertão) e tropical úmido (Litoral). Fatores: latitude, altitude, continentalidade."
    },
    {
      titulo: "Matemática - Funções",
      categoria: "Estudos",
      texto: "Função é uma relação entre dois conjuntos onde cada elemento do primeiro conjunto se relaciona com apenas um elemento do segundo. Tipos: afim (y=ax+b), quadrática (y=ax²+bx+c), exponencial (y=a^x), logarítmica (y=log_a(x))."
    },
    {
      titulo: "Física - Mecânica",
      categoria: "Estudos",
      texto: "Mecânica estuda o movimento dos corpos. Leis de Newton: 1ª (inércia), 2ª (F=ma), 3ª (ação e reação). Energia cinética: Ec=mv²/2. Energia potencial gravitacional: Ep=mgh. Conservação de energia: Ec+Ep=constante."
    },
    {
      titulo: "Química - Tabela Periódica",
      categoria: "Estudos",
      texto: "A tabela periódica organiza os elementos químicos por número atômico crescente. Períodos: linhas horizontais (1-7). Famílias: colunas verticais (1-18). Metais: lado esquerdo. Não-metais: lado direito. Gases nobres: família 18."
    },
    {
      titulo: "Biologia - Célula",
      categoria: "Estudos",
      texto: "A célula é a unidade básica da vida. Tipos: procariótica (bactérias) e eucariótica (animais, plantas, fungos). Organelas principais: núcleo (DNA), mitocôndrias (energia), retículo endoplasmático (síntese), complexo de Golgi (secreção)."
    },
    {
      titulo: "Filosofia - Ética",
      categoria: "Estudos",
      texto: "Ética estuda os valores morais e a conduta humana. Principais teorias: utilitarismo (maior felicidade), deontologia (dever), virtude (caráter). Kant: 'Age de modo que tua máxima possa valer como lei universal'."
    }
  ]

  return new Promise((resolve, reject) => {
    db.transaction((transaction) => {
      // Limpa a tabela primeiro
      transaction.executeSql("DELETE FROM Notas;", [], 
        () => {
          // Insere os resumos
          resumosVestibular.forEach((resumo, index) => {
            transaction.executeSql(
              "INSERT INTO Notas (titulo, categoria, texto) VALUES (?, ?, ?);",
              [resumo.titulo, resumo.categoria, resumo.texto],
              () => {
                if (index === resumosVestibular.length - 1) {
                  resolve(resumosVestibular.length)
                }
              },
              (_, error) => reject(error)
            )
          })
        },
        (_, error) => reject(error)
      )
    })
  })
}
