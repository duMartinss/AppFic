import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import img1 from "../../assets/TI.png";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const App = () => {
  const navigation = useNavigation();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        console.log('Iniciando busca de cursos...');
        const response = await axios.get('http://10.0.2.2:3000/api/cursos/topico/Tecnologia');
        console.log('Resposta da API:', response.data);
        setCursos(response.data);
      } catch (error) {
        console.error('Erro detalhado:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const handleCoursePress = (course) => {
    navigation.navigate('COURSEDETAILS', { 
      courseName: course.nome, // Mudado de nome_curso para nome
      course: {
        id: course.id,
        nome: course.nome,
        descricao: course.descricao,
        duracao: course.duracao,
        dataInicio: course.dataInicio,
        dataFim: course.dataFim,
        preco: course.preco,
        requisitos: course.requisitos,
        programacao: course.programacao,
        perfilProfissional: course.perfilProfissional,
        topico: course.topico,
        imagem: course.imagem,
        status: course.status
      }
    });
  };

  const truncateDescription = (description) => {
    if (!description) return '';
    const words = description.split(" ");
    if (words.length > 20) {
      return words.slice(0, 20).join(" ") + "...";
    }
    return description;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}></View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tecnologia da Informação e Informática</Text>
            <Ionicons name="laptop-outline" size={50} color="#1E3A8A" style={styles.icon} />
          </View>
          <Text style={styles.description}>
            Os cursos do SENAI-SP nas áreas de Tecnologia da Informação e Informática abrangem: Técnico de Redes de Computadores, Desenvolvimento de Sistemas, Informática para Internet, entre outros.
          </Text>

          {cursos.length === 0 ? (
            <Text style={styles.noCourses}>Nenhum curso encontrado nesta área.</Text>
          ) : (
            cursos.map((curso) => (
              <TouchableOpacity 
                key={curso.id}
                style={styles.courseItem} 
                onPress={() => handleCoursePress(curso)}
              >
                <View style={styles.sideBar3}></View> 
                <Image 
                  source={curso.imagem ? { uri: curso.imagem} : img1} 
                  style={styles.courseImage} 
                />
                <View style={styles.courseTextContainer}>
                  <Text style={styles.courseTitle}>
                    {curso.nome}
                  </Text>
                  <Text style={styles.courseSubtitle}>
                    {truncateDescription(curso.descricao)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
    backgroundColor: '#1E3A8A', // Cor da barrinha azul
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180, // Altura da faixa
    backgroundColor: '#1E3A8A',
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
    zIndex: 2, // Eleve o zIndex para garantir que sobreponha o botãoombra
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
