import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/colors"; // Supondo que você tenha um arquivo colors.js
import { fonts } from "../utils/fonts"; // Supondo que você tenha um arquivo fonts.js
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    navigation.navigate("RESETPASSWORD");
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.90.235.163:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data.user?.id_user;
        await AsyncStorage.setItem('userId', userId.toString());
        
        // Puxar os dados do usuário para a próxima tela
        const userData = {
          id: userId,
          nome: data.user?.nome_user,
          email: data.user?.email_user,
          telefone: data.user?.telefone_user,
          nascimento: data.user?.nascimento_user,
          cep: data.user?.cep_user,
          cidade: data.user?.cidade_user,
          estado: data.user?.estado_user
        };

        navigation.navigate('MAIN', { userData });
      } else {
        Alert.alert("Erro", data.message || "Erro desconhecido.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.line1}><Text style={styles.highlight}>E</Text>nsinar</Text>
        <Text style={styles.line2}><Text style={styles.highlight}>S</Text>onhe hoje</Text>
        <Text style={styles.line3}><Text style={styles.highlight}>I</Text>nove a cada dia</Text>
        <Text style={styles.line4}><Text style={styles.highlight}>N</Text>unca pare</Text>
        <Text style={styles.line5}><Text style={styles.highlight}>A</Text>tingir</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="SeuEmail@.com"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Senha"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
            <Ionicons name={secureEntry ? "eye" : "eye-off"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
  <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
</TouchableOpacity>
        <TouchableOpacity 
          style={styles.loginButtonWrapper} 
          onPress={handleLogin} 
          disabled={loading}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Não tem conta?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  textContainer: {
    marginVertical: 5,
  },
  formContainer: {
    marginVertical: 30,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    borderColor: colors.darkred,
    borderWidth: 2,
    borderStyle: "solid",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  loginButtonWrapper: {
    backgroundColor: colors.darkred,
    borderRadius: 100,
    marginTop: 10,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.Bold,
  },
  line1: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    marginLeft: 0,
    paddingTop: '0.5%',
  },
  line2: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    marginLeft: 20,
    paddingTop: '0.5%',
  },
  line3: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    marginLeft: 40,
    paddingTop: '0.5%',
  },
  line4: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    marginLeft: 20,
    paddingTop: '0.5%',
  },
  line5: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    marginLeft: 0,
    paddingTop: '1%',
  },
  highlight: {
    color: colors.red,
    fontSize: 35,
    fontFamily: fonts.Bold,
  },
});
