import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation, useRoute } from '@react-navigation/native'; // Hook de navegação

function CourseHeader({ course }) {
  const navigation = useNavigation();

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para formatar as horas
  const formatHours = (hoursString) => {
    if (!hoursString) return '';
    // Pega apenas os números antes do primeiro ':'
    return hoursString.split(':')[0];
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>
      <Image source={{ uri: course.imagem }} style={styles.courseImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.courseTitle}>{course.nome}</Text>
        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Início</Text>
            <Text style={styles.dateValue}>{formatDate(course.dataInicio)}</Text>
            <Text style={styles.hours}>{formatHours(course.duracao)}h</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Fim</Text>
            <Text style={styles.dateValue}>{formatDate(course.dataFim)}</Text>
            <Text style={styles.paid}>{course.preco}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function CourseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  console.log('Route params:', route.params);
  
  const { courseName } = route.params;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProgramacaoOpen, setProgramacaoOpen] = useState(false);
  const [isRequisitosOpen, setRequisitosOpen] = useState(false);
  const [isPerfilOpen, setPerfilOpen] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseName) {
        setLoading(false);
        return;
      }

      try {
        console.log('Iniciando busca do curso');
        console.log('URL:', 'http://10.0.2.2:3000/api/cursos/buscar');
        console.log('Dados:', { nome: courseName });

        const response = await axios({
          method: 'post',
          url: 'http://10.0.2.2:3000/api/cursos/buscar',
          data: { nome: courseName },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Resposta recebida:', response.data);
        
        if (response.data) {
          setCourse(response.data);
        }
      } catch (error) {
        console.error('Erro na requisição:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        
        Alert.alert(
          'Erro',
          'Não foi possível carregar os detalhes do curso.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseName]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Curso não encontrado.</Text>
      </View>
    );
  }

  // Função atualizada para verificar o tópico do curso
  const temTrilhaDisponivel = (topicoCurso) => {
    const topicosComTrilha = [
      'Tecnologia',
      'Mecatrônica',
      'Automotiva',
      'Fabricação Mecânica'
    ];
    
    // Adiciona um log para debug
    console.log('Tópico do curso:', topicoCurso);
    console.log('Tópicos disponíveis:', topicosComTrilha);
    console.log('Tem trilha?', topicosComTrilha.includes(topicoCurso));
    
    return topicosComTrilha.includes(topicoCurso);
  };

  return (
    <View style={styles.container}>
      <CourseHeader course={course} />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.courseDescription}>{course.descricao}</Text>

        <TouchableOpacity style={styles.sectionButton} onPress={() => setProgramacaoOpen(!isProgramacaoOpen)}>
          <Text style={styles.sectionText}>Programação</Text>
          <Ionicons name={isProgramacaoOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isProgramacaoOpen && (
          <View style={styles.content}>
            <Text style={styles.content2}>{course.programacao}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.sectionButton} onPress={() => setRequisitosOpen(!isRequisitosOpen)}>
          <Text style={styles.sectionText}>Requisitos</Text>
          <Ionicons name={isRequisitosOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isRequisitosOpen && (
          <View style={styles.content}>
            <Text style={styles.content2}>{course.requisitos}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.sectionButton} onPress={() => setPerfilOpen(!isPerfilOpen)}>
          <Text style={styles.sectionText}>Perfil Profissional</Text>
          <Ionicons name={isPerfilOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isPerfilOpen && (
          <View style={styles.content}>
            <Text style={styles.content2}>{course.perfilProfissional}</Text>
          </View>
        )}

        {/* Verifica o tópico do curso */}
        {temTrilhaDisponivel(course.topico_curso) && (
          <TouchableOpacity 
            style={styles.saibaMaisButton}
            onPress={() => navigation.navigate('SAIBAMAIS', { 
              courseId: course.id,
              courseCategory: course.topico_curso
            })}
          >
            <Text style={styles.saibaMaisText}>Saiba Mais</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingTop: 90,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    courseImage: {
      width: 135,
      height: 100,
      borderRadius: 10,
    },
    infoContainer: {
      flex: 1,
      marginLeft: 20,
      fontFamily: fonts.Bold
    },
    courseTitle: {
      fontSize: 18,
      color: '#000',
      marginBottom: 10,
      fontFamily: fonts.Bold,
    },
    datesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      
    },
    dateItem: {
      marginRight: 15,
      alignItems: 'left',
    },
    dateLabel: {
      fontSize: 12,
      color: '#888',
      fontFamily: fonts.Bold,
    },
    dateValue: {
      fontSize: 12,
      fontFamily: fonts.Bold,
      color: '#000',
    },
    detailsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: 5,
    },
    hours: {
      fontSize: 12,
      color: '#000',
      fontFamily: fonts.Bold,
      marginTop: 5,
    },
    paid: {
      fontSize: 12,
      color: 'red',
      fontFamily: fonts.Bold,
      marginTop: 5,
    },
    courseDescription: {
      fontSize: 14,
      color: '#000',
      marginBottom: 20,
      fontFamily: fonts.SemiBold,
    },
    sectionButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
      marginVertical: 5,
  
    },
    sectionText: {
      fontSize: 16,
      fontFamily: fonts.Bold,
      color: 'red',
    },
    content: {
      padding: 15,
      backgroundColor: '#f9f9f9',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      marginBottom: 10,
      fontFamily: fonts.Bold
    },
    content2: {
      fontFamily: fonts.Medium
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    backButton: {
    position: 'absolute',
    top: -65, 
    left: -20,
    zIndex: 11, // Prioridade do botão sobre o conteúdo
    padding: 20,
    },
    highlight: {
      color: colors.red,
      fontWeight: fonts.Bold,
    },
    saibaMaisButton: {
      backgroundColor: '#AD0000',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
    },
    saibaMaisText: {
      color: '#FFF',
      fontSize: 16,
      fontFamily: fonts.Bold,
      textTransform: 'uppercase',
    },
  });