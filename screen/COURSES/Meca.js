import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
        const response = await axios.get('http://10.0.2.2:3000/api/cursos/topico/Mecatrônica');
        
        // Converte o status_curso para número em todos os cursos
        const cursosFormatados = response.data.map(curso => ({
          ...curso,
          status_curso: Number(curso.status_curso)
        }));

        console.log('Cursos formatados:', cursosFormatados.map(c => ({
          nome: c.nome,
          status: c.status_curso
        })));

        setCursos(cursosFormatados);
      } catch (error) {
        console.error('Erro detalhado:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const handleCoursePress = (course) => {
    console.log('Status do curso clicado:', course.status_curso);
    
    // Converte para número e verifica
    if (Number(course.status_curso) === 0) {
      Alert.alert(
        "Curso Indisponível",
        "Este curso está temporariamente indisponível."
      );
      return;
    }

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
        status_curso: course.status_curso
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
      <StatusBar backgroundColor="#FFD700" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}></View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Mecatrônica, Sistemas de Automação, 
            Energia e Eletrônica</Text>
            <Ionicons name="cog-outline" size={50} color="#FFD700" style={styles.icon} />
          </View>
          <Text style={styles.description}>
            Os cursos do SENAI-SP nas áreas de Mecatrônica, Sistemas de Automação, Energia e Eletrônica abrangem: Superior em Tecnologia de Mecatrônica Industrial, Conectividade Industrial 5G, Desvendando a Indústria 4.0, Fundamentos da Robótica Industrial, Automação e Controle, Energia Solar Fotovoltaica, Eletrônica Digital, entre outros.
          </Text>
          <View style={styles.courseList}>
            {loading ? (
              <ActivityIndicator size="large" color="#FFD700" />
            ) : (
              cursos.map((course) => (
                <TouchableOpacity 
                  key={course.id} 
                  style={[
                    styles.courseItem,
                    course.status_curso === 0 && styles.inactiveCourseItem
                  ]} 
                  onPress={() => handleCoursePress(course)}
                  disabled={course.status_curso === 0}
                >
                  <View style={styles.sideBar3}></View>
                  <Image 
                    source={img1} 
                    style={[
                      styles.courseImage,
                      course.status_curso === 0 && styles.inactiveImage
                    ]} 
                  />
                  <View style={[
                    styles.courseTextContainer,
                    course.status_curso === 0 && styles.inactiveContent
                  ]}>
                    <Text style={[
                      styles.courseTitle,
                      course.status_curso === 0 && styles.inactiveText
                    ]}>{course.nome}</Text>
                    <Text style={[
                      styles.courseSubtitle,
                      course.status_curso === 0 && styles.inactiveText
                    ]}>{truncateDescription(course.descricao)}</Text>
                    {course.status_curso === 0 && (
                      <Text style={styles.inactiveText}>
                        Este curso está temporariamente indisponível.
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
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
    backgroundColor: '#FFD700',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#FFD700',
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
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  icon: {
    marginTop: -60,
    marginLeft: 40
  },
  description: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
    fontFamily: fonts.SemiBold
  },
  courseList: {
    marginTop: 20,
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
  inactiveImage: {
    opacity: 0.5,
  },
  inactiveContent: {
    opacity: 0.5,
  },
  inactiveText: {
    color: '#999',
  },
});

export default App;
