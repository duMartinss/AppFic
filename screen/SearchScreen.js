import React, { useState, useEffect } from "react"; // Importa React e hooks
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from "react-native"; // Importa componentes do React Native
import Feather from "react-native-vector-icons/Feather"; // Importa ícones
import * as Fonts from 'expo-font'; // Importa a biblioteca para carregar fontes
import img1 from "../assets/senai.png"; // Imagem do curso
import { useNavigation } from '@react-navigation/native'; // Adicione este import no topo
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

// Componente principal
export default function BuscaScreen() {
  // Estado local
  const [selectedCategory, setSelectedCategory] = useState("Todos"); // Categoria selecionada
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca
  const [courses, setCourses] = useState([]); // Lista de cursos
  const [filteredCourses, setFilteredCourses] = useState([]); // Cursos filtrados
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const navigation = useNavigation(); // Adicione esta linha no início do componente

  // Lista de categorias de cursos
  const categories = [
    "Todos",
    "Administração e Gestão",
    "Alimentos e Bebidas",
    "Meio Ambiente",
    "Automotiva",
    "Construção Civil",
    "Design de Moda",
    "Fabricação Mecânica",
    "Logística e Transporte",
    "Mecatrônica",
    "Refrigeração e Climatização",
    "Tecnologia",
  ];

  // useEffect para buscar cursos ao montar o componente
  useEffect(() => {
    fetchCourses();
  }, []);

  // useEffect para filtrar cursos sempre que a categoria ou o termo de busca mudar
  useEffect(() => {
    filterCourses();
  }, [selectedCategory, searchTerm]);

  // Adicione um novo useEffect para atualizar os cursos periodicamente
  useEffect(() => {
    // Atualiza os cursos a cada vez que a tela recebe foco
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCourses();
    });

    return unsubscribe;
  }, [navigation]);

  // Função para buscar cursos da API
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://4.228.217.151:3000/api/cursos'); // Faz a requisição à API
      const data = await response.json(); // Converte a resposta para JSON
      
      console.log('Cursos atualizados:', data); // Debug
      
      setCourses(data); // Atualiza a lista de cursos
      setFilteredCourses(data); // Inicialmente, todos os cursos são filtrados
    } catch (error) { 
      console.error("Erro ao buscar cursos:", error); // Log de erro
    } finally {
      setLoading(false); // Define o estado de carregamento como falso
    }
  };

  // Função para buscar cursos por categoria
  const fetchCoursesByCategory = async () => {
    try {
      const response = await fetch(`http://4.228.217.151:3000/api/cursos/topico`); // Requisição para a API com a categoria
      const data = await response.json(); // Converte a resposta para JSON
      setCourses(data); // Atualiza a lista de cursos
      setFilteredCourses(data); // Filtra cursos pela nova categoria
    } catch (error) {
      console.error("Erro ao buscar cursos por categoria:", error); // Log de erro
    }
  };

  // Função atualizada para filtrar cursos com base em múltiplos critérios
  const filterCourses = () => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    const results = courses.filter(course => {
      // Verifica a categoria
      const matchesCategory = selectedCategory === "Todos" || course.categoria === selectedCategory;
      
      // Se não houver termo de busca, retorna apenas o filtro por categoria
      if (!searchTermLower) return matchesCategory;
      
      // Converte os valores para string e lowercase para comparação
      const nome = course.nome_curso?.toLowerCase() || '';
      const descricao = course.descricao_curso?.toLowerCase() || '';
      const horas = course.horas_curso?.toString().toLowerCase() || '';
      const dataInicio = new Date(course.dataInicio_curso)
        .toLocaleDateString('pt-BR')
        .toLowerCase();
      const dataFim = new Date(course.dataFim_curso)
        .toLocaleDateString('pt-BR')
        .toLowerCase();
      const status = course.statusPag_curso?.toLowerCase() || '';
      
      // Verifica se o termo de busca está presente em qualquer um dos campos
      const matchesSearch = 
        nome.includes(searchTermLower) ||
        descricao.includes(searchTermLower) ||
        horas.includes(searchTermLower) ||
        dataInicio.includes(searchTermLower) ||
        dataFim.includes(searchTermLower) ||
        // Verifica termos específicos para status de pagamento
        (searchTermLower === 'pago' && status === 'pago') ||
        (searchTermLower === 'gratuito' && status === 'gratuito') ||
        (searchTermLower === 'grátis' && status === 'gratuito') ||
        (searchTermLower === 'gratis' && status === 'gratuito');

      // Retorna verdadeiro se a categoria corresponde E qualquer um dos campos de busca corresponde
      return matchesCategory && matchesSearch;
    });
    
    setFilteredCourses(results);
  };

 // Função para limitar a descrição a 20 palavras
const truncateDescription = (description) => {
  if (!description) return ""; // Retorna uma string vazia se a descrição estiver indefinida

  const words = description.split(" "); // Separa a descrição em palavras
  if (words.length > 20) {
    return words.slice(0, 20).join(" ") + "..."; // Retorna as primeiras 20 palavras com "..." no final
  }
  return description; // Retorna a descrição completa se tiver 20 palavras ou menos
};

  // Adicione esta função para lidar com o clique no curso
  const handleCoursePress = (course) => {
    // Se o curso estiver inativo, não permite a navegação
    if (course.status_curso === 0) {
      Alert.alert(
        "Curso Indisponível",
        "Este curso está temporariamente indisponível."
      );
      return;
    }

    // Se estiver ativo, permite a navegação
    navigation.navigate('COURSEDETAILS', {
      courseName: course.nome_curso,
      courseId: course.id_curso
    });
  };

  // Exibição de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#800020" />
        <Text style={styles.loadingText}>Carregando cursos...</Text>
      </View>
    );
  }

  // Renderização do componente
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* Barra de busca */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            placeholder="Busque por nome, data, horas, pago/gratuito..."
            placeholderTextColor="#ccc"
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm} // Atualiza o estado do termo de busca
          />
        </View>

        {/* Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.activeCategory]} // Estilo ativo para a categoria selecionada
              onPress={() => {
                setSelectedCategory(category); // Atualiza a categoria selecionada
                if (category === "Todos") {
                  fetchCourses(); // Busca todos os cursos
                } else {
                  fetchCoursesByCategory(category); // Busca cursos pela categoria
                }
              }}
            >
              <Text
                style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de cursos filtrados */}
        <ScrollView contentContainerStyle={styles.courseList} showsVerticalScrollIndicator={false}>
          {filteredCourses.length === 0 ? (
            <Text style={styles.noResults}>Nenhum curso encontrado.</Text> // Mensagem caso nenhum curso seja encontrado
          ) : (
            filteredCourses.map(course => (
              <TouchableOpacity 
                key={course.id_curso} 
                style={[
                  styles.courseItem,
                  course.status_curso === 0 && styles.inactiveCourseItem
                ]}
                onPress={() => handleCoursePress(course)}
                disabled={course.status_curso === 0} // Desabilita o toque quando inativo
              >
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
                  ]}>
                    {truncateDescription(course.nome_curso)}
                  </Text> 
                  <Text style={[
                    styles.courseSubtitle,
                    course.status_curso === 0 && styles.inactiveText
                  ]}>
                    {truncateDescription(course.descricao_curso)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#800020',
  },
  mainContent: {
    flex: 1,
    paddingTop: 40,
    marginHorizontal: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 45,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#AD0000',
    marginRight: 10,
    height: 30,
    marginBottom: 5,
  },
  activeCategory: {
    backgroundColor: '#AD0000',
    borderColor: '#AD0000',
  },
  categoryText: {
    color: '#AD0000',
    fontFamily: 'Poppins-Light',
  },
  categoryTextActive: {
    color: '#fff',
  },
  courseList: {
    paddingBottom: 40,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 150,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    resizeMode: 'contain',
  },
  courseTextContainer: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "#E30613",
  },
  courseSubtitle: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 3,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9B9B9B',
  },
  inactiveCourseItem: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
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
  inactiveLabel: {
    color: colors.darkred,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 5,
    fontFamily: fonts.Regular,
  },
});
