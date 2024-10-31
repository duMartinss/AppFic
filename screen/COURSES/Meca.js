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
      <StatusBar backgroundColor="#FFD700" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
      {/* Faixa no topo */}
      <View style={styles.topBar}></View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        {/* Contêiner de conteúdo com borderRadius */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Mecatrônica, Sistemas de Automação, 
            Energia e Eletrônica</Text>
            {/* Ícone ao lado direito */}
            <Ionicons name="cog-outline" size={50} color="#FFD700" style={styles.icon} />
          </View>
          <Text style={styles.description}>
            Os cursos do SENAI-SP nas áreas de Mecatrônica, Sistemas de Automação, Energia e Eletrônica abrangem: Superior em Tecnologia de Mecatrônica Industrial, Conectividade Industrial 5G, Desvendando a Indústria 4.0, Fundamentos da Robótica Industrial, Automação e Controle, Energia Solar Fotovoltaica, Eletrônica Digital, entre outros.
          </Text>
            {/* Lista de Cursos */}

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Automação de Iluminação com Dispositivos Inteligentes')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Automação de Iluminação com Dispositivos Inteligentes</Text>
                <Text style={styles.courseSubtitle}>O curso de Aperfeiçoamento Profissional Automação Residencial com Dispositivos Inteligentes tem por objetivo o desenvolvimento de competências relativas a instalação...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Automação Residencial - Tecnologia e Aplicações de Dispositivos de Segurança e Conforto')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Automação Residencial - Tecnologia e Aplicações de Dispositivos de Segurança e Conforto</Text>
                <Text style={styles.courseSubtitle}>O curso de Aperfeiçoamento Profissional de Automação Residencial -Tecnologia e Aplicações de Dispositivos de Segurança e Conforto tem por objetivo desenvolver...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Comandos Elétricos')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Comandos Elétricos</Text>
                <Text style={styles.courseSubtitle}>O Curso de Aperfeiçoamento Profissional Comandos Elétricos tem por objetivo o desenvolvimento de competências relativas à montagem e manutenção de comandos elétricos...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Eletricista Instalador')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Eletricista Instalador</Text>
                <Text style={styles.courseSubtitle}>No curso Eletricista Instalador o aluno irá aprender interpretar circuitos e diagramas elétricos, planta baixa de instalações elétricas prediais e a montagem...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Eletrônica Digital')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Eletrônica Digital</Text>
                <Text style={styles.courseSubtitle}>O curso de Aperfeiçoamento Profissional de Eletrônica Digital tem por objetivo o desenvolvimento de competências relativas à montagem de circuitos eletrônicos digitais...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Eletropneumática')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Eletropneumática</Text>
                <Text style={styles.courseSubtitle}>O Curso de Aperfeiçoamento Profissional - Eletropneumática tem por objetivo o desenvolvimento de competências relativas à interpretar e elaborar e montar circuitos...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Instalação de Sistemas para Microgeração Fotovoltaica conectados à Rede')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Instalação de Sistemas para Microgeração Fotovoltaica conectados à Rede</Text>
                <Text style={styles.courseSubtitle}>O Curso de Aperfeiçoamento Profissional - Instalação de Sistemas para Microgeração Fotovoltaica conectados à rede - tem por objetivo o desenvolvimento de competênciass...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Inversores')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Inversores</Text>
                <Text style={styles.courseSubtitle}>O Curso de Aperfeiçoamento Profissional Inversores tem por objetivo o desenvolvimento de competências relativas à aquisição de conhecimentos, habilidades e atitudes...</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Montagem de Painéis Elétricos')}>
              <View style={styles.sideBar3}></View> 
              <Image source={img1} style={styles.courseImage} />
              <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle}>Montagem de Painéis Elétricos</Text>
                <Text style={styles.courseSubtitle}>O Curso de Montagem de Painéis Elétricos tem por objetivo o desenvolvimento de competências relativas à montagem de quadros de comando industriais por meio de instrumentos...</Text>
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
    backgroundColor: '#FFD700', // Cor da barrinha azul
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180, // Altura da faixa
    backgroundColor: '#FFD700',
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
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  titleContainer: {
    flexDirection: 'row', // Exibe o título e o ícone na mesma linha
    justifyContent: 'space-between', // Coloca o título à esquerda e o ícone à direita
    alignItems: 'center', // Centraliza verticalmente o título e o ícone
    paddingRight: 30, // Cria espaço entre o texto e a borda direita
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15, // Aumenta o espaçamento entre o título e a descrição
  },
  icon: {
    marginTop: -60, // Eleva o ícone para aproximá-lo ao centro da linha
    marginLeft: 40
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
