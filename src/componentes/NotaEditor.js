import { Picker } from "@react-native-picker/picker"
import React, { useState, useEffect } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from "react-native"
import { salvaNota, atualizaNota, deletaNota } from "../servicos/Notas"

export default function NotaEditor({mostraNotas, notaSelecionada, setNotaSelecionada}) {

  const [titulo, setTitulo] = useState("")
  const [categoria, setCategoria] = useState("Pessoal")
  const [texto, setTexto] = useState("")
  const [modalVisivel, setModalVisivel] = useState(false)

  // Atualiza os campos quando uma nota é selecionada para edição
  useEffect(() => {
    if (notaSelecionada) {
      setTitulo(notaSelecionada.titulo || "")
      setCategoria(notaSelecionada.categoria || "Pessoal")
      setTexto(notaSelecionada.texto || "")
      setModalVisivel(true)
    }
  }, [notaSelecionada])

  // Limpa os campos quando o modal é fechado
  const fechaModal = () => {
    setModalVisivel(false)
    setNotaSelecionada(null)
    setTitulo("")
    setCategoria("Pessoal")
    setTexto("")
  }

  async function salvaNotaHandler() {
    if (!titulo.trim() || !texto.trim()) {
      Alert.alert("Erro", "Título e conteúdo são obrigatórios!")
      return
    }

    try {
      if (notaSelecionada) {
        // Atualiza nota existente
        await atualizaNota(notaSelecionada.id, titulo, categoria, texto)
        Alert.alert("Sucesso", "Nota atualizada com sucesso!")
      } else {
        // Cria nova nota
        await salvaNota(titulo, categoria, texto)
        Alert.alert("Sucesso", "Nota criada com sucesso!")
      }
      
      fechaModal()
      mostraNotas()
    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar nota: " + error.message)
    }
  }

  async function deletaNotaHandler() {
    if (!notaSelecionada) {
      Alert.alert("Erro", "Nenhuma nota selecionada para deletar!")
      return
    }

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja deletar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deletaNota(notaSelecionada.id)
              Alert.alert("Sucesso", "Nota deletada com sucesso!")
              fechaModal()
              mostraNotas()
            } catch (error) {
              Alert.alert("Erro", "Erro ao deletar nota: " + error.message)
            }
          }
        }
      ]
    )
  }

  // Renderiza o seletor de categoria baseado na plataforma
  const renderCategoriaSelector = () => {
    if (Platform.OS === 'web') {
      return (
        <select 
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{
            fontSize: 18,
            marginBottom: 12,
            paddingHorizontal: 4,
            borderBottomWidth: 1,
            borderBottomColor: "#FF9A94",
            border: "1px solid #EEEEEE",
            borderRadius: 5,
            padding: 8
          }}
        >
          <option value="Pessoal">Pessoal</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Estudos">Estudos</option>
          <option value="Outros">Outros</option>
        </select>
      )
    }

    return (
      <View style={estilos.modalPicker}>
        <Picker
          selectedValue={categoria}
          onValueChange={novaCategoria => setCategoria(novaCategoria)}>
            <Picker.Item label="Pessoal" value="Pessoal"/>
            <Picker.Item label="Trabalho" value="Trabalho"/>
            <Picker.Item label="Estudos" value="Estudos"/>
            <Picker.Item label="Outros" value="Outros"/>
        </Picker>
      </View>
    )
  }

  return(
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={fechaModal}
      >
        <View style={estilos.centralizaModal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={estilos.modal}>
              <Text style={estilos.modalTitulo}>
                {notaSelecionada ? "Editar nota" : "Criar nota"}
              </Text>
              <Text style={estilos.modalSubTitulo}>Título da nota</Text>
              <TextInput 
                style={estilos.modalInput}
                onChangeText={novoTitulo => setTitulo(novoTitulo)}
                placeholder="Digite um título"
                value={titulo}/>
              <Text style={estilos.modalSubTitulo}>Categoria</Text>
              {renderCategoriaSelector()}
              <Text style={estilos.modalSubTitulo}>Conteúdo da nota</Text>
              <TextInput 
                style={estilos.modalInput}
                multiline={true}
                numberOfLines={3}
                onChangeText={novoTexto => setTexto(novoTexto)}
                placeholder="Digite aqui seu lembrete"
                value={texto}/>
              <View style={estilos.modalBotoes}>
                <TouchableOpacity style={estilos.modalBotaoSalvar} onPress={salvaNotaHandler}>
                  <Text style={estilos.modalBotaoTexto}>Salvar</Text>
                </TouchableOpacity>
                {notaSelecionada && (
                  <TouchableOpacity style={estilos.modalBotaoDeletar} onPress={deletaNotaHandler}>
                    <Text style={estilos.modalBotaoTexto}>Deletar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={estilos.modalBotaoCancelar} onPress={fechaModal}>
                  <Text style={estilos.modalBotaoTexto}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisivel(true)} style={estilos.adicionarMemo}>
        <Text style={estilos.adicionarMemoTexto}>+</Text>
      </TouchableOpacity>
    </>
  )
}

const estilos = StyleSheet.create({
  centralizaModal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  modal: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    marginTop: 8,
    marginHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 18,
  },
  modalInput: {
    fontSize: 18,
    marginBottom: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#FF9A94",
  },
  modalPicker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#EEEEEE",
    marginBottom: 12,
  },
  modalSubTitulo: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600"
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  modalBotaoSalvar: {
    backgroundColor: "#2ea805",
    borderRadius: 5,
    padding: 8,
    width: 80,
    alignItems: "center",
  },
  modalBotaoDeletar: {
    backgroundColor: "#d62a18",
    borderRadius: 5,
    padding: 8,
    width: 80,
    alignItems: "center",
  },
  modalBotaoCancelar: {
    backgroundColor: "#057fa8",
    borderRadius: 5,
    padding: 8,
    width: 80,
    alignItems: "center",
  },
  modalBotaoTexto: {
    color: "#FFFFFF",
  },
  adicionarMemo: {
    backgroundColor: "#54ba32",
    justifyContent: "center",
    height: 64,
    width: 64,
    margin: 16,
    alignItems: "center",
    borderRadius: 9999,
    position: "absolute",
    bottom: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  adicionarMemoTexto: {
    fontSize: 32,
    lineHeight: 40,
    color: "#FFFFFF",
  }
});
