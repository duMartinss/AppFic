import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import img1 from "../assets/senai.png"; // Imagem padrão para todos os usuários
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const UserListScreen = () => {
  const [users, setUsers] = useState([]); // Estado para armazenar usuários
  const navigation = useNavigation(); // Hook para acessar a navegação

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/api/usuario'); // Rota que retorna a lista de usuários
        setUsers(response.data); // Armazena os usuários no estado
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers(); // Chama a função para buscar usuários
  }, []);

  const handleUserPress = (user) => {
    navigation.navigate('USERDETAILS', { user }); // Navega para a tela de detalhes do usuário
  };

  const handleEditPress = (user) => {
    // Navegar para a tela de edição com os dados do usuário
    navigation.navigate('EDITUSER', { user });
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const actualStatus = currentStatus === undefined ? 0 : currentStatus;
    const newStatus = actualStatus === 1 ? 0 : 1;

    console.log('Dados da requisição:', {
      userId,
      currentStatus: actualStatus,
      newStatus,
      url: `http://10.0.2.2:3000/api/usuario/status/${userId}`
    });

    try {
      const response = await axios.put(`http://10.0.2.2:3000/api/usuario/status/${userId}`, {
        status: newStatus
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta do servidor:', response.data);

      if (response.status === 200) {
        const updatedUsers = users.map(user => 
          user.id_user === userId ? { ...user, status: newStatus } : user
        );
        setUsers(updatedUsers);
        Alert.alert(
          "Sucesso", 
          `Usuário ${newStatus === 1 ? "ativado" : "desativado"} com sucesso.`
        );
      }
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Dados do erro:", error.response?.data);
      Alert.alert(
        "Erro", 
        "Não foi possível atualizar o status do usuário."
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#AD0000" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}></View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Lista de Usuários</Text>
            <Ionicons name="reader-outline" size={50} color="#AD0000" style={styles.icon} />
          </View>
          {/* Lista de Usuários */}
          {users.length > 0 ? (
            users.map((user) => (
              <View 
                key={user.id_user} 
                style={[
                  styles.userItem,
                  user.status === 0 && styles.inactiveUser
                ]}
              >
                <TouchableOpacity 
                  onPress={() => handleUserPress(user)} 
                  style={[
                    styles.userTouchable,
                    user.status === 0 && styles.inactiveContent
                  ]}
                >
                  <Image 
                    source={img1} 
                    style={[
                      styles.userImage,
                      user.status === 0 && styles.inactiveImage
                    ]} 
                  />
                  <View style={styles.userTextContainer}>
                    <Text style={[
                      styles.userName,
                      user.status === 0 && styles.inactiveText
                    ]}>
                      {user.nome_user}
                    </Text>
                    <Text style={[
                      styles.userEmail,
                      user.status === 0 && styles.inactiveText
                    ]}>
                      {user.email_user}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleUserStatus(user.id_user, user.status)}>
                  <Ionicons 
                    name={user.status === 1 ? "eye-outline" : "eye-off-outline"} 
                    size={25} 
                    color={colors.darkred} 
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noUsers}>Nenhum usuário encontrado.</Text>
          )}
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: colors.darkred,
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
    zIndex: 2,
    position: 'relative',
    shadowRadius: 4,
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
    color: colors.blackgray,
  },
  icon: {
    marginTop: -12,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Alinha os itens nas extremidades
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  userTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Faz com que o Touchable ocupe o espaço restante
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    resizeMode: 'contain',
  },
  userTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: colors.darkred,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: "#707070",
    marginTop: 5,
  },
  noUsers: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.blackgray,
  },
  inactiveUser: {
    opacity: 0.5, // Reduz a opacidade do item inteiro
    backgroundColor: '#f0f0f0', // Cor de fundo mais clara para usuários inativos
  },
  inactiveContent: {
    opacity: 0.7, // Reduz a opacidade do conteúdo
  },
  inactiveImage: {
    opacity: 0.5, // Reduz a opacidade da imagem
    borderColor: '#d0d0d0', // Borda mais clara
  },
  inactiveText: {
    color: '#999999', // Cor de texto mais clara para usuários inativos
  },
});

export default UserListScreen;
