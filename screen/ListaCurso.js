import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

// Imagem padrão caso o curso não tenha uma imagem específica
import img1 from "../assets/logoEsina.png"; 

// Defina o mapeamento das imagens de cursos
const courseImages = {
  "Refrigeração e Climatização": require("../assets/Refrigeracao.jpg"),

  "Tecnologia": require("../assets/TI.png"),

  "Administração e Gestão": require("../assets/Management.png"),

  "Alimentos e Bebidas": require("../assets/Foods.png"),

  "Meio Ambiente": require("../assets/Environmnetal.png"),

  "Automotiva": require("../assets/Automotive.png"),

  "Construção Civil": require("../assets/Construction.png"),

  "Design de Moda": require("../assets/Fashion.png"),

  "Fabricação Mecânica": require("../assets/Industry.png"),

  "Logística e Transporte": require("../assets/Logistic.png"),

  "Mecatrônica": require("../assets/Mechatronic.png"),
  
};

const CourseListScreen = () => {
  const [courses, setCourses] = useState([]); // Estado para armazenar os cursos
  const navigation = useNavigation(); // Hook para acessar a navegação

  useFocusEffect(
    React.useCallback(() => {
      const fetchCourses = async () => {
        try {
          const response = await axios.get('http://10.0.2.2:3000/api/cursos');
          console.log(response.data); // Verifique a estrutura dos dados
          setCourses(response.data);
        } catch (error) {
          console.error("Erro ao buscar cursos:", error);
        }
      };
  
      fetchCourses();
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
        categoria: course.categoria,
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
            courses.map((course) => {
              // Usa a categoria do curso como o "tópico"
              const normalizedCategory = course.categoria || ''; // Protege contra undefined
              console.log("Categoria do curso:", course.categoria); // Verifique a categoria real
              console.log("Categoria normalizada:", normalizedCategory); // Verifique a categoria normalizada

              // Verifica se a categoria do curso corresponde a uma imagem específica
              const courseImage = courseImages[normalizedCategory] || img1; // Usa a imagem padrão se não houver imagem associada

              return (
                <TouchableOpacity 
                  key={course.id_curso} 
                  style={[
                    styles.courseItem,
                    Number(course.status_curso) === 0 && styles.inactiveCourseItem
                  ]}
                  onPress={() => handleCoursePress(course)}
                  activeOpacity={0.7} // Feedback visual ao toque
                >
                  <Image source={courseImage} style={styles.courseImage} />
                  <View style={styles.courseTextContainer}>
                    <Text style={styles.courseName}>{course.nome_curso}</Text>
                    <Text style={styles.courseDescription}>
                      {truncateDescription(course.descricao_curso)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
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
  inactiveCourseItem: {
    opacity: 0.5,
  },
});

export default CourseListScreen;
