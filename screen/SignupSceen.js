import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Modal,
    ScrollView,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
    const navigation = useNavigation();
    const [secureEntry, setSecureEntry] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Estados para os inputs
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');

    // Adicione o estado de erros no início do componente
    const [errors, setErrors] = useState({
    nome: false,
    email: false,
    senha: false,
    dataNascimento: false,
    telefone: false,
    cep: false
});

    // Adicione esses estados no início do componente
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLogin = () => {
        navigation.navigate("LOGIN");
    };

    const handleSignup = async () => {

        
        // Verificação da força da senha
        if (passwordStrength <= 25) {
            Alert.alert(
                "Senha fraca", 
                "Por favor, escolha uma senha mais forte que inclua:\n\n" +
                "- Mínimo de 8 caracteres\n" +
                "- Letras maiúsculas\n" +
                "- Números\n" +
                "- Caracteres especiais"
            );
            return;
        }

        // Verificação se o nome contém apenas letras e espaços
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(nome)) {
            Alert.alert("Atenção", "O nome deve conter apenas letras e espaços.");
            return;
        }

        if (!isChecked) {
            Alert.alert("Atenção", "Você deve aceitar os termos da LGPD.");
            return;
        }

        if (!nome || !email || !senha || !dataNascimento || !telefone || !cep) {
            Alert.alert("Atenção", "Todos os campos são obrigatórios.");
            return;
        }

        // Converte a data de nascimento para o formato YYYY-MM-DD
        const [day, month, year] = dataNascimento.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        try {
            // Obtenha a cidade e o estado com base no CEP
            const responseCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dataCep = await responseCep.json();

            if (dataCep.erro) {
                Alert.alert("Erro", "CEP inválido.");
                return;
            }

            const cidade = dataCep.localidade;
            const estado = dataCep.uf;

            const response = await fetch('http://10.0.2.2:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    nascimento: formattedDate,
                    telefone,
                    cep,
                    cidade,
                    estado,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setShowSuccess(true);
                // Limpa os campos
                setNome('');
                setEmail('');
                setSenha('');
                setDataNascimento('');
                setTelefone('');
                setCep('');
                setIsChecked(false);

                // Aguarda 3 segundos e chama handleLogin
                setTimeout(() => {
                    setShowSuccess(false);
                    handleLogin(); // Usa a função handleLogin existente
                }, 3000);
            } else {
                Alert.alert("Erro", result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível realizar o cadastro.");
        }
    };

    // Função simplificada para verificar a força da senha
    const checkPasswordStrength = (password) => {
        let strength = 0;

        // Comprimento mínimo (8 caracteres)
        if (password.length >= 8) strength += 25;
        
        // Letras maiúsculas
        if (/[A-Z]/.test(password)) strength += 25;
        
        // Números
        if (/[0-9]/.test(password)) strength += 25;
        
        // Caracteres especiais
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

        setPasswordStrength(strength);
        return strength; // Retorna o valor para uso em outras funções
    };

    // Função para determinar a cor da barra
    const getStrengthColor = (strength) => {
        if (strength <= 25) return '#FF4444';
        if (strength <= 50) return '#FFBB33';
        if (strength <= 75) return '#00C851';
        return '#007E33';
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
                <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.textContainer}>
                    <Text style={styles.headingText}>Cadastre-se e </Text>
                    <Text style={styles.headingText}>
                        conquiste seu futuro <Text style={styles.highlight}>aqui</Text>!
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    {/* Nome */}
                    <View style={styles.inputContainer}>
                        <Icon name="user" size={30} color={colors.secondary} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nome"
                            placeholderTextColor={colors.secondary}
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="SeuEmail@.com"
                            placeholderTextColor={colors.secondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Senha */}
                    <View>
                        <View style={styles.inputContainer}>
                            <Icon name="lock" size={30} color={colors.secondary} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Senha"
                                placeholderTextColor={colors.secondary}
                                secureTextEntry={secureEntry}
                                value={senha}
                                onChangeText={(text) => {
                                    setSenha(text);
                                    checkPasswordStrength(text);
                                }}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setSecureEntry((prev) => !prev);
                                }}
                            >
                                <Ionicons name={secureEntry ? "eye" : "eye-off"} size={20} color={colors.secondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Barra de força da senha - só aparece quando o input está focado */}
                        {isPasswordFocused && (
                            <View style={styles.strengthBarContainer}>
                                <View 
                                    style={[
                                        styles.strengthBar, 
                                        { 
                                            width: `${passwordStrength}%`,
                                            backgroundColor: getStrengthColor(passwordStrength)
                                        }
                                    ]} 
                                />
                            </View>
                        )}
                    </View>

                    {/* Data de Nascimento */}
                    <View style={styles.inputContainer}>
                        <Icon name="calendar" size={30} color={colors.secondary} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Data de Nascimento (DD/MM/AAAA)"
                            placeholderTextColor={colors.secondary}
                            value={dataNascimento}
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

                                setDataNascimento(formatted);
                            }}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Telefone */}
                    <View style={styles.inputContainer}>
    <Icon name="phone" size={30} color={colors.secondary} />
    <TextInput
        style={styles.textInput}
        placeholder="(XX) XXXXX-XXXX"
        placeholderTextColor={colors.secondary}
        value={telefone}
        onChangeText={text => {
            const cleaned = text.replace(/\D/g, '').slice(0, 11); // Limita a 11 dígitos
            let formatted = '';
        
            if (cleaned.length <= 2) {
                formatted = cleaned; // Apenas DDD
            } else if (cleaned.length <= 6) {
                formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`; // DDD + 4 dígitos
            } else {
                formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`; // DDD + 5 dígitos
            }
        
            setTelefone(formatted);
        }}
        keyboardType="phone-pad"
        maxLength={15} // Permite a máscara completa
    />
</View>

                    {/* CEP */}
                    <View style={styles.inputContainer}>
                        <Icon name="map" size={30} color={colors.secondary} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="CEP"
                            placeholderTextColor={colors.secondary}
                            value={cep}
                            onChangeText={async (text) => {
                                const cleaned = text.replace(/\D/g, '').slice(0, 8);
                                setCep(cleaned);

                                if (cleaned.length === 8) {
                                    try {
                                        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
                                        const data = await response.json();
                                        if (data.erro) {
                                            Alert.alert("Erro", "CEP inválido ou não encontrado.");
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        Alert.alert("Erro", "Não foi possível conectar ao servidor.");
                                    }
                                }
                            }}
                            keyboardType="numeric"
                            maxLength={8}
                        />
                    </View>

                    {/* Checkbox */}
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity onPress={() => setIsChecked((prev) => !prev)}>
                            <View style={[styles.checkbox, isChecked && styles.checked]}>
                                {isChecked && <Ionicons name="checkmark" size={20} color="white" />}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.checkboxText}>
                            Eu li e concordo com os{" "}
                            <Text
                                style={styles.linkText}
                                onPress={() => setModalVisible(true)}
                            >
                                Termos de Uso e {"  "} Política de Privacidade.
                            </Text>
                        </Text>
                    </View>

                    {/* Botão de Cadastro */}
                    <TouchableOpacity
                        style={styles.loginButtonWrapper}
                        onPress={handleSignup}
                    >
                        <Text style={styles.loginText}>Registre-se</Text>
                    </TouchableOpacity>

                    {/* Link para Login */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.accountText}>Já tem conta!</Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text style={styles.signupText}>Faça o login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Modal de Termos e Políticas */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Termos de Uso e Política de Privacidade</Text>
                        <ScrollView style={styles.scrollView}>
    <Text style={styles.modalText}>
    <Text style={styles.modalSectionTitle}>Termos de Uso</Text>{"\n"}
        {"\n"}<Text style={styles.modalSectionTitle}>1. Aceitação dos Termos</Text>{"\n"}
        Ao acessar e usar o aplicativo <Text style={styles.boldText}>ENSINA CONNECT</Text>, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concorda com qualquer parte destes termos, não deve usar nosso aplicativo.

        {"\n\n"}<Text style={styles.modalSectionTitle}>2. Uso do Aplicativo</Text>{"\n"}
        Você concorda em usar o <Text style={styles.boldText}>ENSINA CONNECT</Text> apenas para fins legais e de acordo com os termos aqui estabelecidos. É proibido usar o aplicativo de qualquer maneira que possa danificar, desativar ou prejudicar o aplicativo ou interferir no uso de qualquer outra parte.

        {"\n\n"}<Text style={styles.modalSectionTitle}>3. Propriedade Intelectual</Text>{"\n"}
        Todo o conteúdo do <Text style={styles.boldText}>ENSINA CONNECT</Text> (textos, gráficos, logotipos, ícones, imagens e software) é de propriedade exclusiva da <Text style={styles.boldText}>ENSINA CONNECT</Text> ou de seus licenciadores, protegido por leis de direitos autorais e propriedade intelectual.

        {"\n\n"}<Text style={styles.modalSectionTitle}>4. Limitação de Responsabilidade</Text>{"\n"}
        A <Text style={styles.boldText}>ENSINA CONNECT</Text> não se responsabiliza por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou da incapacidade de uso do aplicativo.

        {"\n\n"}<Text style={styles.modalSectionTitle}>5. Alterações nos Termos</Text>{"\n"}
        A <Text style={styles.boldText}>ENSINA CONNECT</Text> reserva-se o direito de modificar estes termos a qualquer momento. Alterações serão publicadas no aplicativo e entrarão em vigor imediatamente após a publicação.

        {"\n\n"}<Text style={styles.modalSectionTitle}>Política de Privacidade</Text>{"\n"}{"\n"}
        <Text style={styles.modalSectionTitle}>1. Coleta de Informações</Text>{"\n"}
        A <Text style={styles.boldText}>ENSINA CONNECT</Text> coleta informações pessoais que você nos fornece diretamente, como nome e e-mail, além de dados de uso e informações do dispositivo.

        {"\n\n"}<Text style={styles.modalSectionTitle}>2. Uso das Informações</Text>{"\n"}
        As informações coletadas são utilizadas para fornecer, manter e melhorar nossos serviços, e para comunicação sobre atualizações e promoções.
        {"\n"}
        {"\n\n"}<Text style={styles.modalSectionTitle}>3. Compartilhamento de Informações</Text>{"\n"}
        A <Text style={styles.boldText}>ENSINA CONNECT</Text> não compartilha suas informações pessoais com terceiros, exceto quando necessário para cumprir a lei ou proteger nossos direitos.

        {"\n\n"}<Text style={styles.modalSectionTitle}>4. Segurança das Informações</Text>{"\n"}
        Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.

        {"\n\n"}<Text style={styles.modalSectionTitle}>5. Alterações na Política de Privacidade</Text>{"\n"}
        Esta política de privacidade pode ser atualizada periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova política no aplicativo.

        {"\n\n"}<Text style={styles.modalSectionTitle}>6. Contato</Text>{"\n"}
        Se você tiver alguma dúvida sobre esta política, entre em contato conosco pelo e-mail: <Text style={styles.boldText}>suporte@ensinaconnect.com</Text>
    </Text>
</ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: colors.gray,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    scrollContainer: {
        paddingBottom: 20, // Para espaçamento no final do scroll
    },
    textContainer: {
        marginVertical: 10,
    },
    headingText: {
        fontSize: 28,
        color: colors.primary,
        fontFamily: fonts.SemiBold,
    },
    formContainer: {
        marginTop: 20,
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
    loginButtonWrapper: {
        backgroundColor: colors.darkred,
        borderRadius: 100,
        marginTop: 20,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: colors.lightGray,
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
    highlight: {
        color: colors.red,
        fontSize: 28,
        fontFamily: fonts.Bold,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderColor: colors.secondary,
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checked: {
        backgroundColor: colors.darkred,
    },
    checkboxText: {
        fontFamily: fonts.Regular,
        color: colors.secondary,
    },
    linkText: {
        color: colors.red,
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: '80%',
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    scrollView: {
        maxHeight: '80%',
    },
    closeButton: {
        alignSelf: "flex-end",
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: fonts.Bold,
        marginBottom: 30,
        textAlign: 'center', // Centraliza o título
    },
    modalSectionTitle: {
        fontFamily: fonts.Bold,
        fontSize: 15,
        paddingVertical: 10,
        color: colors.red,
        textAlign: 'left', // Centraliza o título da seção
    },
    modalText: {
        fontSize: 13,
        color: colors.primary,
        fontFamily: fonts.Medium,
        textAlign: 'left', // Centraliza o texto do modal
    },
    boldText: {
        fontFamily: fonts.Bold,
    },
    passwordStrengthContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    strengthBarContainer: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 15,
        marginHorizontal: 10,
    },
    strengthBar: {
        height: '100%',
        borderRadius: 2,
        transition: 'width 0.3s ease-in-out',
    },
    passwordFeedback: {
        marginLeft: 10,
        color: colors.secondary,
        fontFamily: fonts.Medium,
    },
});
