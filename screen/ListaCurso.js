import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import img1 from "../assets/senai.png"; // Imagem padrão para os cursos
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const CourseListScreen = () => {
  const [courses, setCourses] = useState([]); // Estado para armazenar os cursos
  const navigation = useNavigation(); // Hook para acessar a navegação

  useFocusEffect(
    React.useCallback(() => {
      const fetchCourses = async () => {
        try {
          const response = await axios.get('http://10.90.235.163:3000/api/cursos'); // Rota que retorna a lista de cursos
          setCourses(response.data); // Armazena os cursos no estado
        } catch (error) {
          console.error("Erro ao buscar cursos:", error);
        }
      };

      fetchCourses(); // Chama a função para buscar cursos
    }, [])
  );

  const handleCoursePress = (course) => {
    navigation.navigate('EDITARCURSOADMIN', {
      courseName: course.nome_curso,
      course: {
        id_curso: course.id_curso,
        nome: course.nome_curso,
        imagem: course.imagem_curso,
        dataInicio: course.dataInicio_curso,
        dataFim: course.dataFim_curso,
        duracao: course.horas_curso,
        preco: course.statusPag_curso,
        descricao: course.descricao_curso,
        programacao: course.programacao_curso,
        requisitos: course.requisitos_curso,
        perfilProfissional: course.perfil_curso,
        topico_curso: course.topico_curso,
        status_curso: Number(course.status_curso)
      }
    });
  };

  // Função para limitar a descrição a 200 palavras
  const truncateDescription = (description) => {
    const words = description.split(" "); // Separa a descrição em palavras
    if (words.length > 20) {
      return words.slice(0, 20).join(" ") + "..."; // Retorna as primeiras 200 palavras com "..." no final
    }
    return description; // Retorna a descrição completa se tiver menos de 200 palavras
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#AD0000" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}></View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Lista de Cursos</Text>
            <Ionicons name="reader-outline" size={50} color="#AD0000" style={styles.icon} />
          </View>
          {/* Lista de Cursos */}
          {courses.length > 0 ? (
            courses.map((course) => (
              <TouchableOpacity 
                key={course.id_curso} 
                style={[
                  styles.courseItem,
                  Number(course.status_curso) === 0 && styles.inactiveCourseItem
                ]} 
                onPress={() => handleCoursePress(course)}
                activeOpacity={0.7} // Adiciona feedback visual ao toque
              >
                <Image source={img1} style={styles.courseImage} />
                <View style={styles.courseTextContainer}>
                  <Text style={styles.courseName}>{course.nome_curso}</Text>
                  <Text style={styles.courseDescription}>
                    {truncateDescription(course.descricao_curso)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noCourses}>Nenhum curso encontrado.</Text>
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: colors.darkred,
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
    color: colors.blackgray
  },
  icon: {
    marginTop: -12,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
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
  courseName: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: colors.darkred,
  },
  courseDescription: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: "#707070",
    marginTop: 5,
  },
  noCourses: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.blackgray,
  },
  courseInfoContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 15,
  },
  courseInfo: {
    fontSize: 14,
    color: colors.darkred,
  },
  inactiveCourseItem: {
    opacity: 0.5,
  },
  inactiveImage: {
    opacity: 0.5,
  },
  inactiveContent: {
    opacity: 0.5,
  },
  inactiveText: {
    opacity: 0.5,
  },
});

export default CourseListScreen;
