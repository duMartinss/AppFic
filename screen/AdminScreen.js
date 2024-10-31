import React from 'react'; // Importa React
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'; // Importa componentes do React Native
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importa ícones da biblioteca Ionicons
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import { colors } from "../utils/colors"; // Importa cores personalizadas (não utilizado no código atual)
import { fonts } from "../utils/fonts"; // Importa fontes personalizadas (não utilizado no código atual)

// Componente principal da tela de administração
export default function AdminScreen() {
    const navigation = useNavigation(); // Inicializa o hook de navegação

    // Função que lida com a navegação ao pressionar os botões
    const handleCoursePress = (courseName) => {
        console.log(`${courseName} clicado!`); // Log para depuração
        switch (courseName) {
            case 'Usuario':
                navigation.navigate('LISTA'); // Navega para a tela de lista de usuários
                break;
            case 'Cursos':
                navigation.navigate('LISTACURSO'); // Navega para a tela de lista de cursos
                break;
            case 'Criar Cursos':
                navigation.navigate('CRIAR'); // Navega para a tela de criação de cursos
                break;
            default:
                console.log("Curso não encontrado"); // Log se o curso não for reconhecido
                break;
        }
    };

    // Renderização do componente
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../assets/admin.png')} // Imagem do ícone do administrador
                        style={styles.icon}
                    />
                </View>

                <Text style={styles.title}>Área Administrativa</Text>
                <Text style={styles.subtitle}>Gerenciar</Text>

                <TouchableOpacity style={styles.button} onPress={() => handleCoursePress('Usuario')}>
                    <Text style={styles.buttonText}>USUÁRIO</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleCoursePress('Cursos')}>
                    <Text style={styles.buttonText}>CURSOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleCoursePress('Criar Cursos')}>
                    <Text style={styles.buttonText}>CRIAR CURSOS</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Estilos do componente
const styles = StyleSheet.create({
    container: {
        flex: 1, // Permite que o contêiner ocupe todo o espaço disponível
        backgroundColor: '#fff', // Cor de fundo branca
        justifyContent: 'flex-end', // Alinha conteúdo na parte inferior
    },
    backButton: {
        position: 'absolute', // Posiciona o botão de voltar
        top: 40, // Distância do topo
        left: 0, // Distância da esquerda
        zIndex: 11, // Prioridade do botão sobre o conteúdo
        padding: 20, // Preenchimento interno
    },
    content: {
        flex: 1, // O conteúdo ocupa todo o espaço restante
        justifyContent: 'center', // Centraliza o conteúdo
        alignItems: 'center', // Alinha os itens no centro
        backgroundColor: 'white', // Cor de fundo branca
    },
    icon: {
        width: 200, // Largura da imagem do ícone
        height: 200, // Altura da imagem do ícone
        resizeMode: 'contain', // Mantém a proporção da imagem
    },
    title: {
        fontSize: 24, // Tamanho da fonte do título
        fontWeight: 'bold', // Texto em negrito
        color: '#000', // Cor do texto
    },
    subtitle: {
        fontSize: 18, // Tamanho da fonte do subtítulo
        fontWeight: 'bold', // Texto em negrito
        color: '#AD0000', // Cor do subtítulo
        marginBottom: 20, // Margem inferior
    },
    button: {
        width: '80%', // Largura do botão
        padding: 15, // Preenchimento interno do botão
        fontWeight: 'bold', // Texto em negrito
        backgroundColor: '#fff', // Cor de fundo do botão
        borderColor: '#AD0000', // Cor da borda do botão
        borderWidth: 3, // Largura da borda do botão
        borderRadius: 50, // Bordas arredondadas
        marginVertical: 10, // Margem vertical entre os botões
        alignItems: 'center', // Centraliza o texto do botão
    },
    buttonText: {
        color: '#000', // Cor do texto do botão
        fontWeight: 'bold', // Texto em negrito
        fontSize: 16, // Tamanho da fonte do texto do botão
    },
    footer: {
        flexDirection: 'row', // Alinha itens na horizontal
        justifyContent: 'space-around', // Espaço entre os itens
        alignItems: 'center', // Alinha itens verticalmente no centro
        backgroundColor: '#f8f8f8', // Cor de fundo do rodapé
        paddingVertical: 10, // Preenchimento vertical
        borderTopWidth: 1, // Largura da borda superior
        borderColor: '#ccc', // Cor da borda superior
        height: 60, // Altura do rodapé
    },
    iconButton: {
        alignItems: 'center', // Centraliza os ícones do botão
    },
});
