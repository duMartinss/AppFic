import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const RecuperarSenhaScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [etapa, setEtapa] = useState(1); // 1: email, 2: código, 3: nova senha
  const [loading, setLoading] = useState(false);

  const solicitarCodigo = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu email.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://4.228.217.151:3000/api/recuperar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Sucesso', 'Código enviado para seu email.');
        setEtapa(2);
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar o código.');
    } finally {
      setLoading(false);
    }
  };

  const verificarCodigo = async () => {
    if (!codigo) {
      Alert.alert('Erro', 'Por favor, insira o código recebido.');
      return;
    }

    // Em um cenário real, você pode querer validar o código aqui
    setEtapa(3);
  };

  const redefinirSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://4.228.217.151:3000/api/redefinir-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          codigo,
          novaSenha 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Sucesso', 'Senha atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('LOGIN') }
        ]);
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Recuperar Senha</Text>

      {etapa === 1 && (
        <>
          <Text style={styles.subtitle}>
            Digite seu email para receber o código de recuperação
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={solicitarCodigo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Enviar Código</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {etapa === 2 && (
        <>
          <Text style={styles.subtitle}>
            Digite o código recebido no seu email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Código de 6 dígitos"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={verificarCodigo}
          >
            <Text style={styles.buttonText}>Verificar Código</Text>
          </TouchableOpacity>
        </>
      )}

      {etapa === 3 && (
        <>
          <Text style={styles.subtitle}>
            Digite sua nova senha
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirme a nova senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={redefinirSenha}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Redefinir Senha</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
});

export default RecuperarSenhaScreen;