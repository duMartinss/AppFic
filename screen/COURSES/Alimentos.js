import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import img1 from "../../assets/senai.png";
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
        const response = await axios.get('http://10.0.2.2:3000/api/cursos/topico/Alimentos e Bebidas');
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
      courseName: course.nome,
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#808000" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}></View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Alimentos e Bebidas</Text>
            <Ionicons name="nutrition-outline" size={50} color="#808000" style={styles.icon} />
          </View>
          <Text style={styles.description}>
            Os cursos do SENAI-SP nas áreas de Alimentos e Bebidas abrangem: Panificação, Salgadeiro, Confeitaria e Chocolates, Produção Industrial, Gastronomia, Produção de Cerveja Artesanal e Rotulagem de Alimentos, entre outros.
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#808000" />
          ) : (
            cursos.map(course => (
              <TouchableOpacity key={course.id} style={styles.courseItem} onPress={() => handleCoursePress(course)}>
                <View style={styles.sideBar3}></View>
                <Image source={img1} style={styles.courseImage} />
                <View style={styles.courseTextContainer}>
                  <Text style={styles.courseTitle}>{course.nome}</Text>
                  <Text style={styles.courseSubtitle}>{truncateDescription(course.descricao)}</Text>
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
    zIndex: 1,
    padding: 20,
  },
  sideBar3: {
    position: 'absolute',
    left: 0,
    height: '60%',
    width: 5,
    backgroundColor: '#808000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#808000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    paddingTop: 40,
  },
  contentContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    marginTop: 120,
    marginHorizontal: 0,
    zIndex: 2,
    position: 'relative',
    shadowRadius: 4,
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  icon: {
    marginTop: -12,
  },
  description: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
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
