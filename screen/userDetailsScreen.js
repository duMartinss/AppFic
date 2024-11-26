import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import userImage from '../assets/user.png'
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const UserDetailScreen = () => {
  const route = useRoute();
  const { user } = route.params; 
  const navigation = useNavigation();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user.nome_user);
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState(user.email_user);
  const [phone, setPhone] = useState(user.telefone_user);
  const [profileImage, setProfileImage] = useState(userImage);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Função para converter a data para o formato 'YYYY-MM-DD' para o banco de dados
  const formatDateForDatabase = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  // Função para formatar a data para exibição
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Alterado para DD/MM/YYYY
  };

  // Função para calcular a idade
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObject = new Date(birthDate);
    let age = today.getFullYear() - birthDateObject.getFullYear();
    const month = today.getMonth() - birthDateObject.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDateObject.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = async () => { 
    const formattedBirthDate = formatDateForDatabase(birthDate);
    const age = calculateAge(formattedBirthDate);

    // Validação da idade mínima
    if (age < 14) {
      Alert.alert("Erro", "Você deve ter pelo menos 14 anos para se cadastrar.");
      return; // Não prosseguir com a atualização se a idade for menor que 14
    }

    try {
        const response = await axios.put(`http://10.0.2.2:3000/api/usuario/${user.id_user}`, {
            nome_user: name,
            nascimento_user: formattedBirthDate,
            email_user: email,
            telefone_user: phone
        });
        
        console.log('Resposta do servidor:', response.data);

        if (response.status === 200) {
            Alert.alert("Sucesso", "Informações atualizadas com sucesso.");
            user.nome_user = name;
            user.nascimento_user = birthDate;
            user.email_user = email;
            user.telefone_user = phone;
            setModalVisible(false);
        }
    } catch (error) {
        console.error("Erro ao atualizar informações:", error);
        Alert.alert("Erro", "Não foi possível atualizar as informações.");
    }
  };

  useEffect(() => {
    setName(user.nome_user);
    setBirthDate(formatDateForDisplay(user.nascimento_user)); // Formate aqui
 setEmail(user.email_user);
    setPhone(user.telefone_user);
  }, [user]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.perfilContainer}>

            <Image source={profileImage} style={styles.perfilImage} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.infoText}>{name || 'Não disponível'}</Text>

          <Text style={styles.label}>Nascimento</Text>
          <Text style={styles.infoText}>{birthDate || 'Não disponível'}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.infoText}>{email || 'Não disponível'}</Text>

          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.infoText}>{phone || ' Não disponível'}</Text>

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
            <Ionicons name="pencil-outline" size={25} color="#AD0000" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Informações</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de Nascimento"
              value={birthDate}
              onChangeText={text => {
                const cleaned = text.replace(/\D/g, '');
                let formatted = '';

                if (cleaned.length <= 2) {
                    formatted = cleaned;
                } else if (cleaned.length <= 4) {
                    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                } else {
                    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                }

                setBirthDate(formatted);
            }}
            keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={phone}
              onChangeText={text => {
                const cleaned = text.replace(/\D/g, '');
                let formatted = '';

                if (cleaned.length <= 2) {
                    formatted = cleaned;
                } else if (cleaned.length <= 6) {
                    formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
                } else if (cleaned.length <= 10) {
                    formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
                } else {
                    formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 12)}`;
                }

                setPhone(formatted);
            }}
            keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingVertical: 90,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  perfilContainer: {
    marginBottom: 20,
  },
  perfilImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  userInfo: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    padding: 30,
    borderRadius: 10,
    marginVertical: 20,
  },
  label: {
    color: '#AD0000',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 11,
    padding: 20,
  },
  editButton: {
    marginTop: -15,
    alignSelf: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#AD0000',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
});

export default UserDetailScreen;