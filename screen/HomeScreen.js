import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // Importa componentes do React Native
import React from "react"; // Importa React para criar componentes funcionais
import { colors } from "../utils/colors"; // Importa o objeto de cores personalizado
import { fonts } from "../utils/fonts"; // Importa o objeto de fontes personalizado
import { useNavigation } from "@react-navigation/native"; // Importa o hook para navegação

const HomeScreen = () => { // Define o componente funcional HomeScreen
  const navigation = useNavigation(); // Usa o hook para acessar o objeto de navegação

  const handleLogin = () => { // Função que navega para a tela de login
    navigation.navigate("LOGIN"); // Navega para a tela de login
  };

  const handleSignup = () => { // Função que navega para a tela de cadastro
    navigation.navigate("SIGNUP"); // Navega para a tela de cadastro
  };

  return ( // Retorna a interface da tela
    <View style={styles.container}> 
      <Image source={require("../assets/LogoFC.png")} style={styles.bannerImage} /> 
      <Text style={styles.title}> 
        Desenvolva sua carreira com <Text style={styles.highlight}>ESINA</Text>
      </Text>
      <Text style={styles.subTitle}> 
        Explore o pioneiro aplicativo de cursos do ESINA e descubra a excelência em educação técnica.
      </Text>
      <View style={styles.buttonContainer}> 
        <TouchableOpacity
          style={[styles.loginButtonWrapper, { backgroundColor: colors.darkred }]} // Botão de login estilizado com cor de fundo
          onPress={handleLogin} // Aciona a função de navegação para a tela de login
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButtonWrapper} // Botão de cadastro sem cor de fundo personalizada
          onPress={handleSignup} // Aciona a função de navegação para a tela de cadastro
        >
          <Text style={styles.signupButtonText}>Cadastre-se</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen; // Exporta o componente para ser usado em outros arquivos

const styles = StyleSheet.create({ // Define os estilos da tela
  container: { // Estilo do contêiner principal
    flex: 1, // Ocupa todo o espaço disponível
    backgroundColor: colors.white, // Define o fundo branco
    alignItems: "center", // Centraliza os itens horizontalmente
  },
  bannerImage: { // Estilo da imagem de banner
    marginVertical: 20, // Margem vertical ao redor da imagem
    height: 280, // Altura da imagem
    width: 290, // Largura da imagem
    resizeMode: "contain", // Ajusta a imagem para caber dentro das dimensões sem cortar
    marginVertical: 70 // Margem vertical adicional
  },
  title: { // Estilo do título
    fontSize: 33, // Tamanho da fonte do título
    fontFamily: fonts.Bold, // Usa a fonte Bold importada
    paddingHorizontal: 0, // Sem preenchimento horizontal
    textAlign: "center", // Centraliza o texto
    color: colors.primary, // Cor primária para o texto
    marginTop: -20, // Margem superior negativa para ajustar a posição
  },
  subTitle: { // Estilo do subtítulo
    fontSize: 18, // Tamanho da fonte do subtítulo
    paddingHorizontal: 20, // Preenchimento horizontal
    textAlign: "center", // Centraliza o texto
    color: colors.secondary, // Cor secundária para o texto
    fontFamily: fonts.Medium, // Usa a fonte Medium importada
    marginVertical: 20, // Margem vertical ao redor do subtítulo
  },
  buttonContainer: { // Contêiner para os botões
    marginTop: 20, // Margem superior para afastar os botões do conteúdo anterior
    flexDirection: "row", // Organiza os botões em uma linha
    borderWidth: 2, // Define a largura da borda
    borderColor: colors.black, // Cor da borda
    width: "80%", // Largura do contêiner de botões
    height: 60, // Altura do contêiner de botões
    borderRadius: 100, // Bordas arredondadas
  },
  loginButtonWrapper: { // Estilo para os botões de login e cadastro
    justifyContent: "center", // Centraliza o conteúdo verticalmente
    alignItems: "center", // Centraliza o conteúdo horizontalmente
    width: "50%", // Cada botão ocupa metade da largura do contêiner
    borderRadius: 98, // Bordas arredondadas
  },
  loginButtonText: { // Estilo do texto do botão de login
    color: colors.white, // Texto branco
    fontSize: 18, // Tamanho da fonte do texto
    fontFamily: fonts.SemiBold, // Usa a fonte SemiBold importada
  },
  signupButtonText: { // Estilo do texto do botão de cadastro
    fontSize: 18, // Tamanho da fonte do texto
    fontFamily: fonts.SemiBold, // Usa a fonte SemiBold importada
  },
  highlight: { // Estilo para destacar parte do texto
    color: colors.red, // Cor vermelha para o destaque
  }
});
