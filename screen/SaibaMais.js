import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from "../utils/fonts";

// Importe as imagens das trilhas
import trilha1 from '../assets/Tecnologia.png';
import trilha2 from '../assets/Mecatronica.png';
import trilha3 from '../assets/Automotiva.png';
import trilha4 from '../assets/Mecanica.png';

const windowWidth = Dimensions.get('window').width;
const boxSize = (windowWidth - 60) / 2; // Tamanho dos quadrados (2 por linha com margens)

export default function SaibaMaisScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId, courseCategory } = route.params;

  // Modifique a função handleTrilhaPress
  const handleTrilhaPress = (trilhaRoute, trilhaTitle) => {
    navigation.navigate('TRILHA', {
      trilhaTitle: trilhaTitle,
      courseId: courseId,
      courseCategory: courseCategory
    });
  };

  // Função para verificar se a trilha corresponde à categoria do curso
  const isTrilhaAtiva = (trilhaTitle) => {
    const mapping = {
      'Tecnologia': 'Tecnologia',
      'Eletricidade': 'Mecatrônica',
      'Automobilística': 'Automotiva',
      'MetalMecânica': 'Fabricação Mecânica'
    };
    return mapping[trilhaTitle] === courseCategory;
  };

  // Estilo condicional para a trilha
  const getTrilhaStyle = (trilhaTitle) => {
    return {
      ...styles.trilhaBox,
      ...(isTrilhaAtiva(trilhaTitle) && {
        borderWidth: 4,
        borderColor: '#AD0000',
      })
    };
  };

  // Estilo condicional para o título
  const getTrilhaTitleStyle = (trilhaTitle) => {
    return {
      ...styles.trilhaTitle,
      ...(isTrilhaAtiva(trilhaTitle) && {
        color: '#AD0000',
        fontFamily: fonts.Bold,
      })
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Trilhas de Aprendizagem</Text>
      
      <View style={styles.trilhasContainer}>
        <View style={styles.row}>
          <View style={styles.trilhaWrapper}>
            <TouchableOpacity
              style={getTrilhaStyle('Tecnologia')}
              onPress={() => handleTrilhaPress('TRILHA_TECNOLOGIA', 'Tecnologia')}
            >
              <Image source={trilha1} style={styles.trilhaImage} resizeMode="cover" />
            </TouchableOpacity>
            <Text style={getTrilhaTitleStyle('Tecnologia')}>Tecnologia</Text>
          </View>

          <View style={styles.trilhaWrapper}>
            <TouchableOpacity
              style={getTrilhaStyle('Eletricidade')}
              onPress={() => handleTrilhaPress('TRILHA_ELETRICIDADE', 'Eletricidade')}
            >
              <Image source={trilha2} style={styles.trilhaImage} resizeMode="cover" />
            </TouchableOpacity>
            <Text style={getTrilhaTitleStyle('Eletricidade')}>Eletricidade</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.trilhaWrapper}>
            <TouchableOpacity
              style={getTrilhaStyle('Automobilística')}
              onPress={() => handleTrilhaPress('TRILHA_AUTOMOBILISTICA', 'Automobilística')}
            >
              <Image source={trilha3} style={styles.trilhaImage} resizeMode="cover" />
            </TouchableOpacity>
            <Text style={getTrilhaTitleStyle('Automobilística')}>Automobilística</Text>
          </View>

          <View style={styles.trilhaWrapper}>
            <TouchableOpacity
              style={getTrilhaStyle('MetalMecânica')}
              onPress={() => handleTrilhaPress('TRILHA_METALMECANICA', 'MetalMecânica')}
            >
              <Image source={trilha4} style={styles.trilhaImage} resizeMode="cover" />
            </TouchableOpacity>
            <Text style={getTrilhaTitleStyle('MetalMecânica')}>MetalMecânica</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  backButton: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    marginTop: 40,
    color: '#AD0000',
    textAlign: 'center',
  },
  trilhasContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  trilhaWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  trilhaBox: {
    width: boxSize,
    height: boxSize,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderColor: 'black',
    borderWidth: 1
  },
  trilhaImage: {
    width: '100%',
    height: '100%',
  },
  trilhaTitle: {
    textAlign: 'center',
    fontFamily: fonts.Bold,
    fontSize: 14,
    color: '#000',
    marginTop: 8,
    resizeMode: 'contain'
  },
}); 