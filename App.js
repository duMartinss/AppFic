import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Switch, TextInput, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screen/HomeScreen';
import LoginScreen from './screen/LoginScreen';
import SignupScreen from './screen/SignupSceen.js';
import userDetailsScreen from './screen/userDetailsScreen.js';
import Home2Screen from './screen/Home2Screen';
import SearchScreen from './screen/SearchScreen';
import AccountScreen from './screen/AccountScreen';
import CursosRealizados from './screen/CursosRealizados';
import EditarCurso from './screen/EditarCursoAdmin.js';
import Certificado from './screen/Certificado';
import Admin from './screen/AdminScreen.js';
import CriarCurso from './screen/CriarCursoAdmin.js';
import ListaUsuario from './screen/ListaUsuario.js';
import ListaCurso from './screen/ListaCurso.js';
import CourseDetails from './screen/courseDetails.js';
import SaibaMaisScreen from './screen/SaibaMais.js';
import EditarCursoAdmin from './screen/EditarCursoAdmin.js';
import TrilhaVisualizerScreen from './screen/TrilhaVisualizerScreen.js';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import { Linking } from 'react-native';
import { ThemeProvider, useTheme } from './screen/ThemeContext'; 
import Modal from 'react-native-modal';

// Importações de cursos...
import Tecnologia from './screen/COURSES/Tecnologia';
import Administracao from './screen/COURSES/Administracao';
import Alimentos from './screen/COURSES/Alimentos';
import Ambiente from './screen/COURSES/Ambiente.js';
import Automotiva from './screen/COURSES/Automotiva';
import Construcao from './screen/COURSES/Construcao';
import Design from './screen/COURSES/Design';
import Fabricacao from './screen/COURSES/Fabricacao';
import Logistica from './screen/COURSES/Logistica';
import Meca from './screen/COURSES/Meca';
import Refrigeracao from './screen/COURSES/Refrigeracao';
import { fonts } from './utils/fonts.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// Função para carregar fontes personalizadas
const loadFonts = () => {
  return Font.loadAsync({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  });
};

// Função principal com as abas de navegação
function MainTabs() {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const translateX = useState(new Animated.Value(240))[0]; // Para animação do menu
  const [isModalVisible, setModalVisible] = useState(false); // Para controle do modal de admin
  const [password, setPassword] = useState(''); // Armazena a senha do admin
  const [attempts, setAttempts] = useState(0); // Tentativas de senha
  const [isLockedOut, setIsLockedOut] = useState(false); // Controle de bloqueio
  const [lockoutTime, setLockoutTime] = useState(null); // Tempo de bloqueio
  const navigation = useNavigation();

  // Função para abrir/fechar o menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.timing(translateX, {
      toValue: menuOpen ? 240 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Função para gerenciar a submissão da senha
  const handlePasswordSubmit = () => {
    if (isLockedOut) {
      Alert.alert('Bloqueado', `Você está bloqueado por ${lockoutTime} segundos. Tente novamente mais tarde.`);
      return;
    }

    const currentPassword = password;
    setPassword(''); // Limpa o campo

    if (currentPassword === 'admin') { // Verifica a senha do admin
      navigation.navigate('ADMIN');
      setModalVisible(false);
      setAttempts(0); // Reseta tentativas após sucesso
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      Alert.alert('Senha incorreta', 'Tente novamente.');

      if (newAttempts >= 4) {
        setIsLockedOut(true);
        setLockoutTime(60); // Bloqueio por 60 segundos
      }
    }
  };

  // Efeito para gerenciar o tempo de bloqueio
  useEffect(() => {
    let timer;
    if (isLockedOut && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prevTime => {
          if (prevTime <= 1) {
            setIsLockedOut(false);
            setAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut, lockoutTime]);

  // Função para navegar conforme o item do menu pressionado
  const handleCoursePress = (courseName) => {
    switch (courseName) {
      case 'Account':
        navigation.navigate('ACCOUNT');
        break;
      case 'Cursos Realizados':
        navigation.navigate('CURSOSREALIZADOS');
        break;
      case 'Certificado':
        navigation.navigate('CERTIFICADO');
        break;
      case 'Admin':
        setModalVisible(true);
        break;
      case 'Logout':
        Alert.alert(
          'Confirmação',
          'Tem certeza que deseja sair?',
          [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            {
              text: 'Sair',
              onPress: () => {
                navigation.navigate('HOME');
                // Aqui você pode adicionar qualquer lógica adicional de logout
                // como limpar tokens de autenticação, dados do usuário, etc.
              },
              style: 'destructive'
            }
          ],
          { cancelable: true }
        );
        break;
      default:
        console.log("Curso não encontrado");
        break;
    }
  };

  const currentTheme = isDarkTheme ? styles.dark : styles.light;

  return (
    <View style={[{ flex: 1 }, currentTheme]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'HOME':
                iconName = 'home-outline';
                break;
              case 'PESQUISA':
                iconName = 'search-outline';
                break;
              default:
                iconName = 'circle';
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'darkred',
          tabBarInactiveTintColor: 'black',
        })}>
        <Tab.Screen name="HOME" component={Home2Screen} options={{ headerShown: false }} />
        <Tab.Screen name="PESQUISA" component={SearchScreen} options={{ headerShown: false }} />
      </Tab.Navigator>

      {/* Menu lateral animado */}
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX }] }]}>
        <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
          <Ionicons name="close-outline" size={30} color="#BF4B4B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleCoursePress('Account')}>
          <Ionicons name="person-outline" size={30} color="#BF4B4B" />
          <Text style={styles.menuText}>Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleCoursePress('Cursos Realizados')}>
          <Ionicons name="book-outline" size={30} color="#BF4B4B" />
          <Text style={styles.menuText}>Cursos realizados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleCoursePress('Certificado')}>
          <Ionicons name="ribbon-outline" size={30} color="#BF4B4B" />
          <Text style={styles.menuText}>Certificado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleCoursePress('Admin')}>
          <Ionicons name="shield-checkmark-outline" size={30} color="#BF4B4B" />
          <Text style={styles.menuText}>Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleCoursePress('Logout')}>
          <Ionicons name="exit-outline" size={30} color="#BF4B4B" style={{ marginLeft: 4 }} />
          <Text style={{ color: '#79747E', fontSize: 18, marginLeft: 8, fontFamily: fonts.Bold }}>Logout</Text>
        </TouchableOpacity>

        {/* Ícones de redes sociais */}
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/senaisp.sjriopreto/')}>
            <Ionicons name="logo-facebook" size={35} color="#BF4B4B" style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/senairiopreto/')}>
            <Ionicons name="logo-instagram" size={35} color="#BF4B4B" style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=551133220050')}>
            <Ionicons name="logo-whatsapp" size={35} color="#BF4B4B" style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <TouchableOpacity onPress={toggleMenu} style={styles.menuBar}>
        <Ionicons name={menuOpen ? "" : "caret-back-outline"} size={20} color="white" />
      </TouchableOpacity>

      {/* Modal para autenticação */}
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => { 
            setModalVisible(false); 
            setPassword(''); // Limpa a senha ao fechar o modal
          }} style={styles.closeModalButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Acesso Admin</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordSubmit}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// Componente principal do aplicativo
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Carrega fontes no início
  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HOME" component={HomeScreen} />
          <Stack.Screen name="LOGIN" component={LoginScreen} />
          <Stack.Screen name="SIGNUP" component={SignupScreen} />
          <Stack.Screen name="MAIN" component={MainTabs} />
          <Stack.Screen name="ACCOUNT" component={AccountScreen} />
          <Stack.Screen name="CURSOSREALIZADOS" component={CursosRealizados} />
          <Stack.Screen name="USERDETAILS" component={userDetailsScreen} />
          <Stack.Screen name="COURSEDETAILS" component={CourseDetails} />
          <Stack.Screen name="CERTIFICADO" component={Certificado} />
          <Stack.Screen name="ADMIN" component={Admin} />
          <Stack.Screen name="EDITARCURSOADMIN" component={EditarCursoAdmin} />
          <Stack.Screen name="LISTA" component={ListaUsuario} />
          <Stack.Screen name="LISTACURSO" component={ListaCurso} />
          <Stack.Screen name="EDITARCURSO" component={EditarCurso} />
          <Stack.Screen name="CRIAR" component={CriarCurso} />
          <Stack.Screen name="TECNOLOGIA" component={Tecnologia} />
          <Stack.Screen name="ADMNISTRACAO" component={Administracao} />
          <Stack.Screen name="ALIMENTOS" component={Alimentos} />
          <Stack.Screen name="AMBIENTE" component={Ambiente} />
          <Stack.Screen name="AUTOMOTIVA" component={Automotiva} />
          <Stack.Screen name="CONSTRUCAO" component={Construcao} />
          <Stack.Screen name="DESIGN" component={Design} />
          <Stack.Screen name="FABRICACAO" component={Fabricacao} />
          <Stack.Screen name="LOGISTICA" component={Logistica} />
          <Stack.Screen name="MECA" component={Meca} />
          <Stack.Screen name="REFRIGERACAO" component={Refrigeracao} />
          <Stack.Screen name="SAIBAMAIS" component={SaibaMaisScreen} />
          <Stack.Screen name="TRILHA" component={TrilhaVisualizerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
// Estilos do aplicativo
const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 240,
    backgroundColor: '#F3F3F3',
    paddingTop: 50,
    paddingLeft: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 20,
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  socialIconsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'right',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  menuText: {
    color: '#79747E',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: fonts.Bold,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginRight: 10,
  },
  menuBar: {
    position: 'absolute',
    top: '40%',
    right: 0,
    backgroundColor: '#C8102E',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 8,
    zIndex: 11,
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'darkred',
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  light: {
    backgroundColor: '#fff',
    color: '#000',
  },
  dark: {
    backgroundColor: '#000',
    color: '#fff',
  },
});

