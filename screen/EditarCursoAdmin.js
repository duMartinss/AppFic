import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

function CourseHeader({ course, onEditPress, toggleCourseStatus }) {
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatHours = (hoursString) => {
    if (!hoursString) return '';
    return hoursString.split(':')[0];
  };

  useEffect(() => {
    console.log('Status do curso no Header:', course.status_curso);
  }, [course.status_curso]);

  return (
    <View style={[
      styles.headerContainer,
      course.status_curso === 0 && styles.inactiveContainer
    ]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>
      <Image 
        source={{ uri: course.imagem }} 
        style={[
          styles.courseImage,
          course.status_curso === 0 && styles.inactiveImage
        ]} 
      />
      <View style={[
        styles.infoContainer,
        course.status_curso === 0 && styles.inactiveContent
      ]}>
        <Text style={[
          styles.courseTitle,
          course.status_curso === 0 && styles.inactiveText
        ]}>{course.nome}</Text>
        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={[
              styles.dateLabel,
              course.status_curso === 0 && styles.inactiveText
            ]}>Início</Text>
            <Text style={[
              styles.dateValue,
              course.status_curso === 0 && styles.inactiveText
            ]}>{formatDate(course.dataInicio)}</Text>
            <Text style={[
              styles.hours,
              course.status_curso === 0 && styles.inactiveText
            ]}>{formatHours(course.duracao)}h</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={[
              styles.dateLabel,
              course.status_curso === 0 && styles.inactiveText
            ]}>Fim</Text>
            <Text style={[
              styles.dateValue,
              course.status_curso === 0 && styles.inactiveText
            ]}>{formatDate(course.dataFim)}</Text>
            <Text style={[
              styles.paid,
              course.status_curso === 0 && styles.inactiveText
            ]}>{course.preco}</Text>
          </View>
        </View>
      </View>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          onPress={() => toggleCourseStatus(course.id_curso, course.status_curso)}
          style={styles.iconButton}
        >
          <Ionicons 
            name={course.status_curso === 1 ? "eye-outline" : "eye-off-outline"} 
            size={24} 
            color={colors.darkred} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onEditPress} style={styles.iconButton}>
          <Ionicons name="pencil-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CourseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { courseName } = route.params;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProgramacaoOpen, setProgramacaoOpen] = useState(false);
  const [isRequisitosOpen, setRequisitosOpen] = useState(false);
  const [isPerfilOpen, setPerfilOpen] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedCourse, setEditedCourse] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const formatDateToDisplay = (dateString) => {
    if (!dateString) return '';
    
    // Converte a string da data para objeto Date
    const date = new Date(dateString);
    
    // Formata para DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseName) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://10.90.235.163:3000/api/cursos/buscar', { nome: courseName });
        
        if (response.data) {
          // Pega o status do banco
          const statusFromDB = Number(response.data.status_curso);
          console.log('Status do curso carregado do DB:', statusFromDB);
          
          // Pega o status da navegação, se existir
          const courseFromNav = route.params?.course;
          const statusFromNav = courseFromNav ? Number(courseFromNav.status_curso) : null;
          console.log('Status da navegação:', statusFromNav);

          // Usa o status da navegação se disponível, senão usa o do banco
          const finalStatus = statusFromNav !== null ? statusFromNav : statusFromDB;
          console.log('Status final escolhido:', finalStatus);
          
          const formattedCourse = {
            ...response.data,
            id_curso: response.data.id,
            status_curso: finalStatus // Usa o status final decidido
          };

          setCourse(formattedCourse);
          setEditedCourse({
            ...formattedCourse,
            dataInicio: formatDateToDisplay(formattedCourse.dataInicio),
            dataFim: formatDateToDisplay(formattedCourse.dataFim)
          });
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do curso.');
      } finally {
        setLoading(false);
      }
    };

    const courseFromNavigation = route.params?.course;
    if (courseFromNavigation) {
      console.log('Status do curso da navegação:', courseFromNavigation.status_curso);
      setCourse(courseFromNavigation);
      setEditedCourse({
        ...courseFromNavigation,
        dataInicio: formatDateToDisplay(courseFromNavigation.dataInicio),
        dataFim: formatDateToDisplay(courseFromNavigation.dataFim)
      });
    }

    fetchCourseDetails();
  }, [courseName, route.params?.course]);

  useEffect(() => {
    if (course) {
      setEditedCourse({
        nome: course.nome,
        dataInicio: formatDateToDisplay(course.dataInicio),
        dataFim: formatDateToDisplay(course.dataFim),
        duracao: course.duracao,
        preco: course.preco,
        descricao: course.descricao,
        programacao: course.programacao,
        requisitos: course.requisitos,
        perfilProfissional: course.perfilProfissional,
        topico_curso: course.topico_curso
      });
    }
  }, [course]);

  // Função para converter data do formato DD/MM/YYYY para YYYY-MM-DD
  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    
    // Separa dia, mês e ano
    const [day, month, year] = dateString.split('/');
    
    // Retorna no formato YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };

  const handleSaveEdits = async () => {
    try {
      if (!course.id_curso) {
        console.error('ID do curso não encontrado');
        Alert.alert('Erro', 'ID do curso não encontrado');
        return;
      }

      const formattedDuration = formatDurationForAPI(editedCourse.duracao);
      console.log('Duração formatada:', formattedDuration);

      const formattedCourse = {
        nome: editedCourse.nome,
        dataInicio: formatDateForAPI(editedCourse.dataInicio),
        dataFim: formatDateForAPI(editedCourse.dataFim),
        duracao: formattedDuration,
        status: editedCourse.preco,
        descricao: editedCourse.descricao,
        programacao: editedCourse.programacao,
        requisitos: editedCourse.requisitos,
        perfilProfissional: editedCourse.perfilProfissional,
        topico_curso: editedCourse.topico_curso
      };

      const response = await axios.put(
        `http://10.90.235.163:3000/api/cursos/editar/${course.id}`,
        formattedCourse
      );

      if (response.status === 200) {
        setCourse({
          ...course,
          nome: editedCourse.nome,
          dataInicio: formatDateForAPI(editedCourse.dataInicio),
          dataFim: formatDateForAPI(editedCourse.dataFim),
          duracao: editedCourse.duracao,
          preco: editedCourse.preco,
          descricao: editedCourse.descricao,
          programacao: editedCourse.programacao,
          requisitos: editedCourse.requisitos,
          perfilProfissional: editedCourse.perfilProfissional,
          topico_curso: editedCourse.topico_curso
        });
        setEditModalVisible(false);
        Alert.alert('Sucesso', 'Curso atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const handleSave = async () => {
    try {
      if (!course.id_curso) {
        Alert.alert('Erro', 'ID do curso não encontrado');
        return;
      }

      const response = await axios.put(
        `http://10.90.235.163:3000/api/cursos/editar/${course.id}`,
        {
          nome: editedCourse.nome,
          dataInicio: formatDateForAPI(editedCourse.dataInicio),
          dataFim: formatDateForAPI(editedCourse.dataFim),
          duracao: editedCourse.duracao,
          status: editedCourse.preco,
          descricao: editedCourse.descricao,
          programacao: editedCourse.programacao,
          requisitos: editedCourse.requisitos,
          perfilProfissional: editedCourse.perfilProfissional,
          topico_curso: editedCourse.topico_curso
        }
      );

      if (response.status === 200) {
        setCourse({
          ...course,
          ...editedCourse,
        });
        setModalVisible(false);
        Alert.alert('Sucesso', 'Curso atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  // Função toggleCourseStatus atualizada
  const toggleCourseStatus = async (courseId, currentStatus) => {
    try {
      if (!courseId) {
        console.error('ID do curso não encontrado');
        Alert.alert('Erro', 'ID do curso não encontrado');
        return;
      }

      const currentStatusNumber = Number(currentStatus);
      const newStatus = currentStatusNumber === 0 ? 1 : 0;

      const response = await axios.put(`http://10.90.235.163:3000/api/cursos/status/${courseId}`, {
        status: newStatus
      });

      if (response.status === 200) {
        setCourse(prevCourse => ({
          ...prevCourse,
          status_curso: newStatus
        }));

        Alert.alert(
          "Sucesso", 
          `Curso ${newStatus === 1 ? "ativado" : "desativado"} com sucesso.`
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status do curso:", error.response?.data || error.message);
      Alert.alert(
        "Erro", 
        "Não foi possível atualizar o status do curso."
      );
    }
  };

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

  const temTrilhaDisponivel = (topicoCurso) => {
    const topicosComTrilha = ['Tecnologia', 'Mecatrônica', 'Automotiva', 'Fabricação Mecânica'];
    return topicosComTrilha.includes(topicoCurso);
  };

  // Função para formatar a duração (para exibição)
  const formatDuration = (duration) => {
    if (!duration) return '';
    // Se a duração vier como "40:00", pega só o "40"
    return duration.split(':')[0];
  };

  // Função para formatar a duração para o banco de dados
  const formatDurationForAPI = (duration) => {
    if (!duration) return '00:00';
    
    // Garante que o valor é uma string e remove espaços
    const cleanDuration = duration.toString().trim();
    
    // Se já estiver no formato HH:MM, retorna como está
    if (cleanDuration.includes(':')) return cleanDuration;
    
    // Caso contrário, adiciona os minutos
    return `${cleanDuration.padStart(2, '0')}:00`;
  };

  return (
    <View style={styles.container}>
      <CourseHeader 
        course={course} 
        onEditPress={() => setEditModalVisible(true)}
        toggleCourseStatus={toggleCourseStatus}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.courseDescription}>{course.descricao}</Text>
        
        {/* Conteúdo Expandível */}
        <TouchableOpacity style={styles.sectionButton} onPress={() => setProgramacaoOpen(!isProgramacaoOpen)}>
          <Text style={styles.sectionText}>Programação</Text>
          <Ionicons name={isProgramacaoOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isProgramacaoOpen && <View style={styles.content}><Text style={styles.content2}>{course.programacao}</Text></View>}
        
        <TouchableOpacity style={styles.sectionButton} onPress={() => setRequisitosOpen(!isRequisitosOpen)}>
          <Text style={styles.sectionText}>Requisitos</Text>
          <Ionicons name={isRequisitosOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isRequisitosOpen && <View style={styles.content}><Text style={styles.content2}>{course.requisitos}</Text></View>}
        
        <TouchableOpacity style={styles.sectionButton} onPress={() => setPerfilOpen(!isPerfilOpen)}>
          <Text style={styles.sectionText}>Perfil Profissional</Text>
          <Ionicons name={isPerfilOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isPerfilOpen && <View style={styles.content}><Text style={styles.content2}>{course.perfilProfissional}</Text></View>}

        {temTrilhaDisponivel(course.topico_curso) && (
          <TouchableOpacity style={styles.saibaMaisButton} onPress={() => navigation.navigate('SAIBAMAIS', { courseId: course.id_curso, courseCategory: course.topico_curso })}>
            <Text style={styles.saibaMaisText}>Saiba Mais</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal de Edição */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Editar informações</Text>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.label}>Nome do Curso</Text>
        <TextInput
          style={styles.input}
          value={editedCourse.nome}
          onChangeText={(text) => setEditedCourse({ ...editedCourse, nome: text })}
          placeholder="Nome do curso"
        />
        <View style={styles.inputRow}>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Início</Text>
            <TextInput
              style={styles.halfInput}
              value={editedCourse.dataInicio}
              onChangeText={(text) => setEditedCourse({ ...editedCourse, dataInicio: text })}
              placeholder="00/00/0000"
            />
          </View>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Fim</Text>
            <TextInput
              style={styles.halfInput}
              value={editedCourse.dataFim}
              onChangeText={(text) => setEditedCourse({ ...editedCourse, dataFim: text })}
              placeholder="00/00/0000"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Carga Horária</Text>
            <TextInput
              style={styles.halfInput}
              value={formatDuration(editedCourse.duracao)}
              onChangeText={(text) => {
                // Remove qualquer caractere que não seja número
                const numericValue = text.replace(/[^0-9]/g, '');
                setEditedCourse({ ...editedCourse, duracao: numericValue });
              }}
              placeholder="00:00H"
            />
          </View>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Status</Text>
            <TextInput
              style={styles.halfInput}
              value={editedCourse.status}
              onChangeText={(text) => setEditedCourse({ ...editedCourse, status: text })}
              placeholder="Gratuito/Pago"
            />
          </View>
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={editedCourse.descricao}
          onChangeText={(text) => setEditedCourse({ ...editedCourse, descricao: text })}
          placeholder="Edite a descrição.."
        />

        <Text style={styles.label}>Programação</Text>
        <TextInput
          style={styles.input}
          value={editedCourse.programacao}
          onChangeText={(text) => setEditedCourse({ ...editedCourse, programacao: text })}
          placeholder="Edite a programação..."
        />

        <Text style={styles.label}>Requisitos</Text>
        <TextInput
          style={styles.input}
          value={editedCourse.requisitos}
          onChangeText={(text) => setEditedCourse({ ...editedCourse, requisitos: text })}
          placeholder="Edite os requisitos..."
        />

        <Text style={styles.label}>Perfil Profissional</Text>
        <TextInput
          style={styles.input}
          value={editedCourse.perfilProfissional}
          onChangeText={(text) => setEditedCourse({ ...editedCourse, perfilProfissional: text })}
          placeholder="Edite o perfil profissional..."
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdits}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  </View>
</Modal>
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
    zIndex: 11,
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

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: colors.red,
    marginBottom: 3,
    fontFamily: fonts.Bold,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: colors.mediumgray,
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    fontSize: 13,
    color: '#000',
    width: '100%',
    minHeight: 40,
  },
  halfInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: colors.mediumgray,
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    fontSize: 13,
    color: '#000',
    width: '100%',
    height: 35,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: colors.mediumgray,
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#000',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: colors.darkred,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: fonts.Bold,
  },
  cancelButton: {
    backgroundColor: 'darkgray',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fonts.Bold,
  },
  selectionButton2: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.mediumgray,
    color: colors.mediumgray,
    backgroundColor: colors.grayligth,
},
  headerButtons: {
    position: 'absolute',
    top: -50,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 11,
  },
  iconButton: {
    padding: 10,
    marginLeft: 5,
  },
  inactiveContainer: {
    opacity: 0.7,
  },
  inactiveImage: {
    opacity: 0.5,
  },
  inactiveContent: {
    opacity: 0.7,
  },
  inactiveText: {
    color: '#999999',
  },
});
