import { FlatList, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Text, View, Alert } from "react-native"
import NotaEditor from "./src/componentes/NotaEditor"
import { Nota } from "./src/componentes/Nota"
import { useEffect, useState } from "react"
import { criaTabela, buscaNotas, populaBancoVestibular } from "./src/servicos/Notas"

export default function App() {

  useEffect(() => {
    criaTabela()
    mostraNotas()
  }, [])

  const [notas, setNotas] = useState([])
  const [notaSelecionada, setNotaSelecionada] = useState(null)

  async function mostraNotas() {
    try {
      const todasNotas = await buscaNotas()
      setNotas(todasNotas)
    } catch (error) {
      console.error("Erro ao buscar notas:", error)
      Alert.alert("Erro", "Erro ao carregar notas: " + error.message)
    }
  }

  function selecionaNota(nota) {
    setNotaSelecionada(nota)
  }

  async function populaBanco() {
    try {
      const quantidade = await populaBancoVestibular()
      Alert.alert("Sucesso", `${quantidade} resumos de vestibular foram adicionados ao banco!`)
      mostraNotas()
    } catch (error) {
      console.error("Erro ao popular banco:", error)
      Alert.alert("Erro", "Erro ao popular banco: " + error.message)
    }
  }

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Trabalho React Native</Text>
        <TouchableOpacity style={estilos.botaoPopular} onPress={populaBanco}>
          <Text style={estilos.botaoPopularTexto}>Popular Vestibular</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notas}
        renderItem={({item}) => <Nota item={item} onPress={selecionaNota}/>}
        keyExtractor={item => item.id.toString()}
        style={estilos.lista}
      />
      
      <NotaEditor 
        mostraNotas={mostraNotas}
        notaSelecionada={notaSelecionada}
        setNotaSelecionada={setNotaSelecionada}
      />
      <StatusBar/>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "stretch",
		justifyContent: "flex-start",
		backgroundColor: "#f5f5f5",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	titulo: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	botaoPopular: {
		backgroundColor: "#9B59B6",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 6,
	},
	botaoPopularTexto: {
		color: "#ffffff",
		fontSize: 12,
		fontWeight: "600",
	},
	lista: {
		flex: 1,
		paddingTop: 8,
	},
})

