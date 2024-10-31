import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { useNavigation } from '@react-navigation/native'; // Hook de navegação

function CoursesHeader() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Adicionar Cursos Realizados</Text>
    </View>
  );
}

export default function AddCompletedCoursesScreen() {

  return (
    <View style={styles.container}>
      <CoursesHeader />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.instruction}>
          Bem-vindo a página de CURSOS REALIZADOS! Se você deseja adicionar os cursos que realizou, pode fazê-lo nesta seção.
        </Text>
        <Text style={styles.optionalText}>
          Esta etapa é opcional, mas enriquecerá a apresentação do seu projeto.
        </Text>
        <Text style={styles.note}>
          Você pode incluir detalhes como nome do curso, instituição, data de conclusão e mais.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 120,
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
  title: {
    fontSize: 24,
    color: '#000',
    marginLeft: 10,
    fontFamily: fonts.Bold,
  },
  backButton: {
  position: 'absolute',
  top: -80, 
  left: -5,
  zIndex: 11, // Prioridade do botão sobre o conteúdo
  padding: 20,
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  instruction: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
  },
  optionalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
  note: {
    fontSize: 14,
    color: '#000',
    marginTop: 20,
    fontFamily: fonts.Medium,
    textAlign: 'center',
  },
});
