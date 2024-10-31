import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importa o Ionicons
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import img1 from "../../assets/senai.png";

const App = () => {
  const navigation = useNavigation(); // Hook de navegação

  const handleCoursePress = (courseName) => {
    console.log('Curso selecionado:', courseName);
    navigation.navigate('COURSEDETAILS', { 
      courseName: courseName
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#800020" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}></View>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Administração e Gestão</Text>
            <Ionicons name="bar-chart-outline" size={50} color="#800020" style={styles.icon} />
          </View>
          <Text style={styles.description}>
            Os cursos do SENAI-SP nas áreas de Administração e Gestão abrangem: Auxiliar Administrativo, Assistente de Recursos Humanos, Assistente Financeiro, Gestão de Pessoas e Liderança, Gestão em Engenharia de Produção, entre outros.
          </Text>
          
          {/* Lista de Cursos */}
          <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Alinhamento Estratégico Aplicado à Gestão')}>
            <View style={styles.sideBar3}></View> 
            <Image source={img1} style={styles.courseImage} />
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>Alinhamento Estratégico Aplicado à Gestão</Text>
              <Text style={styles.courseSubtitle}>O curso de Aperfeiçoamento Profissional de Alinhamento Estratégico Aplicado à Gestão tem por objetivo...</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Competência Transversal - Finanças Pessoais')}>
            <View style={styles.sideBar3}></View> 
            <Image source={img1} style={styles.courseImage} />
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>Competência Transversal - Finanças Pessoais</Text>
              <Text style={styles.courseSubtitle}>Tornar o estudante apto a identificar a importância do equilíbrio financeiro para...</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Competência Transversal - Fundamentos de Logística')}>
            <View style={styles.sideBar3}></View> 
            <Image source={img1} style={styles.courseImage} />
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>Competência Transversal - Fundamentos de Logística</Text>
              <Text style={styles.courseSubtitle}>Conhecer as questões fundamentais da logística, seu histórico, conceitos, e de como utilizar melhor...</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress('Competência Transversal - Propriedade Intelectual')}>
            <View style={styles.sideBar3}></View> 
            <Image source={img1} style={styles.courseImage} />
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>Competência Transversal - Propriedade Intelectual</Text>
              <Text style={styles.courseSubtitle}>Compreender aspectos ligados à propriedade intelectual, bem como, os benefícios da proteção dos produtos...</Text>
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
    zIndex: 1, 
    padding: 20,
  },
  sideBar3: {
    position: 'absolute',
    left: 0,
    height: '60%',
    width: 5,
    backgroundColor: '#800020',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#800020',
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
    fontWeight: 'bold',
    color: "#E30613",
  },
  courseSubtitle: {
    fontSize: 13,
    color: "#9B9B9B",
    marginTop: 5,
  },
});

export default App;
