import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native'; // Importa o hook para navegação
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";
import img7 from "../assets/img7.png";

const { width } = Dimensions.get('window'); // Obtém a largura da tela

export default function App() {
  const navigation = useNavigation(); // Hook para acessar a navegação

  // Função para lidar com o clique nas caixas dos cursos
  const handleCoursePress = (courseName) => {
    console.log(`${courseName} clicado!`);
    
    // Navega para diferentes telas com base no curso clicado
    switch (courseName) {
      case 'Pesquisar Todos':
        navigation.navigate('PESQUISA'); // Navega para a tela de pesquisa de cursos
        break;
      case 'Alimentos e Bebidas':
        navigation.navigate('ALIMENTOS'); // Navega para a tela de Alimentos e Bebidas
        break;
      case 'Design de Moda, Têxtil, Vestuário, Calçados e Joalheria':
        navigation.navigate('DESIGN'); // Navega para a tela de Design de Moda
        break;
      case 'Mecatrônica, Sistemas de Automação, Energia e Eletrônica':
        navigation.navigate('MECA'); // Navega para a tela de Mecatrônica
        break;
      case 'Automotiva':
        navigation.navigate('AUTOMOTIVA'); // Navega para a tela de Automotiva
        break;
      case 'Tecnologia da Informação e Informática':
        navigation.navigate('TECNOLOGIA'); // Navega para a tela de TI
        break;
      case 'Meio Ambiente, Saúde e Segurança do Trabalho':
        navigation.navigate('AMBIENTE'); // Navega para a tela de Meio Ambiente
        break;
      case 'Logística e Transporte':
        navigation.navigate('LOGISTICA'); // Navega para a tela de Logística
        break;
      case 'Construção Civil e Design Mobiliário':
        navigation.navigate('CONSTRUCAO'); // Navega para a tela de Construção Civil
        break;
      case 'Fabricação Mecânica e Mecânica Industrial':
        navigation.navigate('FABRICACAO'); // Navega para a tela de Mecânica Industrial
        break;
      case 'Refrigeração e Climatização':
        navigation.navigate('REFRIGERACAO'); // Navega para a tela de Refrigeração
        break;
      case 'Administração e Gestão':
        navigation.navigate('ADMNISTRACAO'); // Navega para a tela de Administração
        break;
      default:
        console.log("Curso não encontrado");
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Conteúdo Rolável */}
      <ScrollView
        contentContainerStyle={[styles.scrollContainer]}
        showsVerticalScrollIndicator={false}
      >
        {/* Carrossel */}
        <View style={styles.carouselWrapper}>
          <View style={styles.carouselContainer}>
            <Swiper
              style={styles.wrapper}
              showsButtons={false} // Não mostra botões de navegação
              autoplay={true} // Ativa o autoplay
              autoplayTimeout={5} // Tempo entre as trocas de imagem
              showsPagination={false} // Não mostra a página de indicadores
            >
              <View style={styles.slide}>
                <Image source={img1} style={styles.carouselImage} />
              </View>
              <View style={styles.slide}>
                <Image source={img2} style={styles.carouselImage} />
              </View>
              <View style={styles.slide}>
                <Image source={img3} style={styles.carouselImage} /> 
              </View>
              <View style={styles.slide}>
                <Image source={img4} style={styles.carouselImage} />
              </View>
              <View style={styles.slide}>
                <Image source={img5} style={styles.carouselImage} />
              </View>
              <View style={styles.slide}>
                <Image source={img6} style={styles.carouselImage} />
              </View>
              <View style={styles.slide}>
                <Image source={img7} style={styles.carouselImage} />
              </View>
            </Swiper>
          </View>
        </View>

        {/* Título "Cursos" */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Cursos</Text>
        </View>

        {/* Containers dos Cursos */}
        <View style={styles.courseContainer}>
          <TouchableOpacity style={styles.courseBox2} onPress={() => handleCoursePress('Pesquisar Todos')}>
            <View style={styles.sideBar2}></View> 
            <Ionicons name="search" size={40} color="#fff" style={styles.icon} />
            <Text style={styles.courseText2}>Pesquisar Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Alimentos e Bebidas')}>
            <View style={styles.sideBar3}></View> 
            <Ionicons name="nutrition-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Alimentos e Bebidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Design de Moda, Têxtil, Vestuário, Calçados e Joalheria')}>
            <View style={styles.sideBar4}></View> 
            <Ionicons name="shirt-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Design de Moda, Têxtil, Vestuário, Calçados e Joalheria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Mecatrônica, Sistemas de Automação, Energia e Eletrônica')}>
            <View style={styles.sideBar5}></View> 
            <Ionicons name="cog-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Mecatrônica, Sistemas de Automação, Energia e Eletrônica</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Automotiva')}>
            <View style={styles.sideBar6}></View>
            <Ionicons name="speedometer-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Automotiva</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Tecnologia da Informação e Informática')}>
            <View style={styles.sideBar7}></View> 
            <Ionicons name="laptop-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Tecnologia da Informação e Informática</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Meio Ambiente, Saúde e Segurança do Trabalho')}>
            <View style={styles.sideBar8}></View> 
            <Ionicons name="leaf-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Meio Ambiente, Saúde e Segurança do Trabalho</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Logística e Transporte')}>
            <View style={styles.sideBar9}></View> 
            <Ionicons name="cube-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Logística e Transporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Construção Civil e Design Mobiliário')}>
            <View style={styles.sideBar10}></View> 
            <Ionicons name="hammer-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Construção Civil e Design Mobiliário</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Fabricação Mecânica e Mecânica Industrial')}>
            <View style={styles.sideBar11}></View> 
            <Ionicons name="construct-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Fabricação Mecânica e Mecânica Industrial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Refrigeração e Climatização')}>
            <View style={styles.sideBar12}></View> 
            <Ionicons name="thermometer-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Refrigeração e Climatização</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseBox} onPress={() => handleCoursePress('Administração e Gestão')}>
            <View style={styles.sideBar13}></View> 
            <Ionicons name="bar-chart-outline" size={40} color="#000" style={styles.icon} />
            <Text style={styles.courseText}>Administração e Gestão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  carouselWrapper: {
    alignItems: 'center',
    marginVertical: 90,
  },
  carouselContainer: {
    height: 200,
    width: width * 0.95,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1 ,
  },
  wrapper: {},
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: -40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  courseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 90,
  },
  courseBox: {
    width: '48%', // Largura de 48% para criar dois containers por linha
    height: 130,
    borderRadius: 15,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center', // Centraliza os itens verticalmente
    alignItems: 'center', // Centraliza os itens horizontalmente
    marginBottom: 15,
    position: 'relative', // Necessário para a barrinha lateral
    borderWidth: 1,
    padding: 10, // Adiciona algum espaçamento interno
  },
  courseBox2: {
    width: '48%', // Largura de 48% para criar dois containers por linha
    height: 130,
    borderRadius: 15,
    backgroundColor: 'darkred',
    justifyContent: 'center', // Centraliza os itens verticalmente
    alignItems: 'center', // Centraliza os itens horizontalmente
    marginBottom: 15,
    position: 'relative', // Necessário para a barrinha lateral
    borderWidth: 1,
    padding: 10, // Adiciona algum espaçamento interno
  },
  sideBar2: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: 'white', // Cor da barrinha azul
  },
  sideBar3: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#808000', // Cor da barrinha azul
  },
  sideBar4: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#FF1493', // Cor da barrinha azul
  },
  sideBar5: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#FFD700', // Cor da barrinha azul
  },
  sideBar6: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#C0C0C0', // Cor da barrinha azul
  },
  sideBar7: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#1E3A8A', // Cor da barrinha azul
  },
  sideBar8: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#28A745', // Cor da barrinha azul
  },
  sideBar9: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#FD7E14', // Cor da barrinha azul
  },
  sideBar10: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#795548', // Cor da barrinha azul
  },
  sideBar11: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#495057', // Cor da barrinha azul
  },
  sideBar12: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#17A2B8', // Cor da barrinha azul
  },
  sideBar13: {
    position: 'absolute',
    left: 0,
    height: '60%', // Ajusta a altura da barrinha para 100% do container
    width: 5,
    backgroundColor: '#800020', // Cor da barrinha azul
  },
  icon: {
    position: 'absolute',
    left: 10, // Ajusta a posição do ícone a partir da esquerda
    top: '50%', // Centraliza verticalmente o ícone
    transform: [{ translateY: -12 }], // Ajusta a posição do ícone para o centro vertical
  },
  courseText: {
    marginLeft: 50, // Espaço para o ícone à esquerda do texto
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  courseText2: {
    marginLeft: 50, // Espaço para o ícone à esquerda do texto
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff'
  },
});
