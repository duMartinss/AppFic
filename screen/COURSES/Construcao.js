import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity, Modal, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importa o Ionicons
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import img1 from "../../assets/senai.png";
import { useNavigation } from '@react-navigation/native'; // Hook de navegação

const App = () => {
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const [selectedImage, setSelectedImage] = useState(null); // Estado para armazenar a imagem selecionada
    const navigation = useNavigation(); // Hook de navegação

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCoursePress = (courseName) => {
    console.log('Curso selecionado:', courseName);
    navigation.navigate('COURSEDETAILS', { 
      courseName: courseName
    });
  };

  return (
    <View style={styles.container}>
      {/* Configura o estilo da barra de status */}
      <StatusBar backgroundColor="#795548" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
      {/* Faixa no topo */}
      <View style={styles.topBar}></View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        {/* Contêiner de conteúdo com borderRadius */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Construção Civil e Design de Mobilário </Text>
            {/* Ícone ao lado direito */}
            <Ionicons name="hammer-outline" size={50} color="#795548" style={styles.icon} />
          </View>
          <Text style={styles.description}>
            Os cursos do SENAI-SP nas áreas de Construção Civil e Design Mobiliário abrangem: Construção Pesada, Edificações, Instalações, entre outros.
          </Text>
            {/* Lista de Cursos */}

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Desvendando o BIM')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Desvendando o BIM</Text>
                <Text style={styles.courseSubtitle}>O Curso de Aperfeiçoamento Profissional Desvendando o BIM tem por objetivo apresentar a metodologia BIM, sua influência, requisitos e...</Text>
              </View>
            </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    backButton: {
    position: 'absolute',
    top: 40, 
    left: 10,
    zIndex: 1, // Prioridade do botão sobre o conteúdo
    padding: 20,
  },
  sideBar3: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#795548', // Cor da barrinha azul
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180, // Altura da faixa
    backgroundColor: '#795548',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0, // Prioridade abaixo do botão de voltar, mas sobre o conteúdo
    paddingTop: 40,
  },
  contentContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    marginTop: 120, // Ajustado para estar sobre a faixa
    marginHorizontal: 0,
    zIndex: 2, // Eleve o zIndex para garantir que sobreponha o botão
    position: 'relative', // Mantém o fluxo natural, mas acima do botãoombra
    shadowRadius: 4, // Raio da sombra
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  titleContainer: {
    flexDirection: 'row', // Exibe o título e o ícone na mesma linha
    justifyContent: 'space-between', // Coloca o título à esquerda e o ícone à direita
    alignItems: 'center', // Centraliza verticalmente o título e o ícone
    paddingRight: 10, // Cria espaço entre o texto e a borda direita
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15, // Aumenta o espaçamento entre o título e a descrição
  },
  icon: {
    marginTop: -12, // Eleva o ícone para aproximá-lo ao centro da linha
  },
  description: {
    fontSize: 12, // Aumenta um pouco o tamanho do texto
    color: '#333',
    marginTop: 10, // Espaço adicional entre o título e a descrição
    fontFamily: fonts.SemiBold
  },
  

  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },


  courseImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    resizeMode: 'contain',
  },
  courseTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  courseTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: "#E30613",
  },
  courseSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: "#9B9B9B",
    marginTop: 5,
  },
});

export default App;
