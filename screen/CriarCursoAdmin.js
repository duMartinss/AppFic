import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from "../utils/fonts";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

function CourseHeader({ cursoNome, setCursoNome, startDate, setStartDate, endDate, setEndDate, courseHours, setCourseHours, cursoStatusPag, setCursoStatusPag, formatDate, errors }) {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
                <Ionicons name="cloud-upload-outline" size={60} color="black" />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={[styles.textInput, { borderColor: errors.cursoNome ? colors.red : colors.mediumgray }]}
                        value={cursoNome}
                        onChangeText={setCursoNome}
                        placeholder="Nome do Curso..."
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.datesContainer}>
                    <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>Início</Text>
                        <TextInput
                            style={[styles.textInput, { borderColor: errors.startDate ? colors.red : colors.mediumgray }]}
                            value={startDate}
                            onChangeText={text => setStartDate(formatDate(text))}
                            placeholder="00/00/0000"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>Fim</Text>
                        <TextInput
                            style={[styles.textInput, { borderColor: errors.endDate ? colors.red : colors.mediumgray }]}
                            value={endDate}
                            onChangeText={text => setEndDate(formatDate(text))}
                            placeholder="00/00/0000"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.durationContainer}>
                        <Text style={styles.hoursLabel}>Duração</Text>
                        <TextInput
                            style={[styles.textInput, { borderColor: errors.courseHours ? colors.red : colors.mediumgray }]}
                            value={courseHours}
                            onChangeText={setCourseHours}
                            placeholder="00:00"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.textInputContainer}>
                        <Text style={styles.statusLabel}>Status</Text>
                        <TextInput
                            style={[styles.textInput, { borderColor: errors.cursoStatusPag ? colors.red : colors.mediumgray }]}
                            value={cursoStatusPag}
                            onChangeText={setCursoStatusPag}
                            placeholder="Pago/Grátis"
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default function CriarCursosScreen() {
    const navigation = useNavigation();
    const [cursoNome, setCursoNome] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [courseHours, setCourseHours] = useState('');
    const [cursoStatusPag, setCursoStatusPag] = useState('');
    const [descricaoCurso, setDescricaoCurso] = useState('');
    const [programacaoText, setProgramacaoText] = useState('');
    const [requisitosText, setRequisitosText] = useState('');
    const [perfilText, setPerfilText] = useState('');
    const [topicoCurso, setTopicoCurso] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [errors, setErrors] = useState({}); // Estado para controlar erros

    const formatDate = (text) => {
        const cleaned = text.replace(/\D/g, '');
        let formatted = '';

        if (cleaned.length <= 2) {
            formatted = cleaned;
        } else if (cleaned.length <= 4) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        } else {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        }

        return formatted;
    };

    const validateDates = () => {
        // Verifica se as datas não estão vazias
        if (!startDate || !endDate) {
            Alert.alert('Erro', 'Por favor, insira as datas de início e fim.');
            setErrors({ startDate: true, endDate: true });
            return false;
        }

        // Tenta criar objetos Date
        const start = new Date(startDate.split('/').reverse().join('-'));
        const end = new Date(endDate.split('/').reverse().join('-'));

        // Verifica se as datas são válidas
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            Alert.alert('Erro', 'Por favor, insira datas válidas.');
            setErrors({ startDate: true, endDate: true });
            return false;
        }

        // Verifica se a data de início é anterior à data de fim
        if (start > end) {
            Alert.alert('Erro', 'A data de início deve ser anterior à data de fim.');
            setErrors({ startDate: true, endDate: true });
            return false;
        }

        return true;
    };

    const handleCreateCourse = async () => {
        if (!cursoNome || !startDate || !endDate || !courseHours || !cursoStatusPag || !descricaoCurso || !programacaoText || !requisitosText || !perfilText || !selectedOption) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            setErrors({
                cursoNome: !cursoNome,
                startDate: !startDate,
                endDate: !endDate,
                courseHours: !courseHours,
                cursoStatusPag: !cursoStatusPag,
                descricaoCurso: !descricaoCurso,
                programacaoText: !programacaoText,
                requisitosText: !requisitosText,
                perfilText: !perfilText,
                selectedOption: !selectedOption,
            });
            return;
        }

        if (!validateDates()) return;

        const formattedStartDate = startDate.split('/').reverse().join('-');
        const formattedEndDate = endDate.split('/').reverse().join('-');
        const formattedHours = courseHours ? `${courseHours}:00` : null;

        const courseData = {
            nome_curso: cursoNome,
            status_curso: true,
            statusPag_curso: cursoStatusPag || null,
            horas_curso: formattedHours,
            imagem_curso: null,
            dataInicio_curso: formattedStartDate,
            dataFim_curso: formattedEndDate,
            descricao_curso: descricaoCurso || null,
            programacao_curso: programacaoText || null,
            requisitos_curso: requisitosText || null,
            perfil_curso: perfilText || null,
            topico_curso: selectedOption || null,
        };

        console.log("Dados do curso a serem enviados:", JSON.stringify(courseData, null, 2));
        // Verifique se algum campo está como undefined e substitua por null
        for (const key in courseData) {
            if (courseData[key] === undefined) {
                courseData[key] = null;
            }
        }

        try {
            const response = await axios.post('http://10.0.2.2:3000/api/curso', courseData);
            Alert.alert('Sucesso', response.data.message);
            setCursoNome('');
            setStartDate('');
            setEndDate('');
            setCourseHours('');
            setCursoStatusPag('');
            setDescricaoCurso('');
            setProgramacaoText('');
            setRequisitosText('');
            setPerfilText('');
            setTopicoCurso('');
        } catch (error) {
            console.error('Erro ao criar curso:', error);
            Alert.alert('Erro', error.response?.data?.message || 'Erro ao criar curso.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>

            <CourseHeader
                cursoNome={cursoNome}
                setCursoNome={setCursoNome}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                courseHours={courseHours}
                setCourseHours={setCourseHours}
                cursoStatusPag={cursoStatusPag}
                setCursoStatusPag={setCursoStatusPag}
                formatDate={formatDate}
                errors={errors}
            />

            <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollViewContent}
            >
                <TextInput
                    style={[styles.textInputDescription, { borderColor: errors.descricaoCurso ? colors.red : colors.mediumgray }]}
                    placeholder="Escreva a descrição do curso aqui..."
                    value={descricaoCurso}
                    onChangeText={setDescricaoCurso}
                    multiline={ true}
                />
                {errors.descricaoCurso && <Text style={styles.errorText}>*Preencha este campo</Text>}

                {/* Programação */}
                <TouchableOpacity style={styles.sectionButton}>
                    <Text style={styles.sectionText}>Programação</Text>
                    <TextInput
                        style={[styles.textInputContent, { borderColor: errors.programacaoText ? colors.red : colors.mediumgray }]}
                        placeholder="Escreva sobre a programação..."
                        value={programacaoText}
                        onChangeText={setProgramacaoText}
                        multiline={true}
                    />
                    {errors.programacaoText && <Text style={styles.errorText}>*Preencha este campo</Text>}
                </TouchableOpacity>

                {/* Requisitos */}
                <TouchableOpacity style={styles.sectionButton}>
                    <Text style={styles.sectionText}>Requisitos</Text>
                    <TextInput
                        style={[styles.textInputContent, { borderColor: errors.requisitosText ? colors.red : colors.mediumgray }]}
                        placeholder="Escreva sobre os requisitos..."
                        value={requisitosText}
                        onChangeText={setRequisitosText}
                        multiline={true}
                    />
                    {errors.requisitosText && <Text style={styles.errorText}>*Preencha este campo</Text>}
                </TouchableOpacity>

                {/* Perfil Profissional */}
                <TouchableOpacity style={styles.sectionButton}>
                    <Text style={styles.sectionText}>Perfil Profissional</Text>
                    <TextInput
                        style={[styles.textInputContent, { borderColor: errors.perfilText ? colors.red : colors.mediumgray }]}
                        placeholder="Escreva sobre o perfil profissional..."
                        value={perfilText}
                        onChangeText={setPerfilText}
                        multiline={true}
                    />
                    {errors.perfilText && <Text style={styles.errorText}>*Preencha este campo</Text>}
                </TouchableOpacity>

                <Text style={styles.sectionText}>Tópico curso</Text>
                <View style={[styles.selectionButton, { borderColor: errors.selectedOption ? colors.red : colors.mediumgray, borderWidth: 2 }]}>

                    <Picker
                        selectedValue={selectedOption}
                        onValueChange={(itemValue) => setSelectedOption(itemValue)}
                    >
                        <Picker.Item label="Selecione uma opção" value="" style={{ color: colors.gray, fontSize:14, }}  />
                        <Picker.Item label="Mecatrônica" value="Mecatrônica" />
                        <Picker.Item label="Fabricação Mecânica" value="Fabricação Mecânica" />
                        <Picker.Item label="Logística e Transporte" value="Logística e Transporte" />
                        <Picker.Item label="Automotiva" value="Automotiva" />
                        <Picker.Item label="Refrigeração e Climatização" value="Refrigeração e Climatização" />
                        <Picker.Item label="Meio Ambiente" value="Meio Ambiente" />
                        <Picker.Item label="Tecnologia" value="Tecnologia" />
                        <Picker.Item label="Administração e Gestão" value="Administração e Gestão" />
                        <Picker.Item label="Alimentos e Bebidas" value="Alimentos e Bebidas" />
                        <Picker.Item label="Construção Civil" value="Construção Civil" />
                        <Picker.Item label="Design de Moda" value="Design de Moda" />
                    </Picker>
                </View>
                {errors.selectedOption && <Text style={styles.errorText}>*Preencha este campo</Text>}

                <TouchableOpacity style={styles.createButton} onPress={handleCreateCourse}>
                    <Text style={styles.createButtonText}>Criar Curso</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    backButton: {
        marginRight: 10, // Espaço entre o botão de voltar e o ícone
        marginTop: 60, // Espaço entre o botão de voltar e o topo da tela
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.grayligth,
        borderRadius: 10,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: colors.black,
        top: 13,
    },
    iconContainer: {
        width: 100,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.Bold,
    },
    textInputContainer: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.mediumgray,
    },
    textInput: {
        fontSize: 16,
        paddingVertical: 5,
        color: colors.black,
        marginRight: 20,
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dateItem: {
        marginRight: 15,
    },
    dateLabel: {
        fontSize: 14,
        fontFamily: fonts.Bold,
        color: colors.red,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hoursLabel: {
        fontSize: 14,
        fontFamily: fonts.Bold,
        color: colors.red,
        top: -5,
    },
    statusLabel: {
        fontSize: 14,
        fontFamily: fonts.Bold,
        color: colors.red,
    },
    scrollViewContent: {
        paddingBottom: 70,
    },
 textInputDescription: {
        fontSize: 14,
        color: colors.black,
        padding: 10,
        borderColor: colors.lightgray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.grayligth,
        textAlignVertical: 'top',
        height: 150,
        marginBottom: 20,
    },
    textInputContent: {
        fontSize: 14,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colors.mediumgray,
        backgroundColor: colors.grayligth,
        marginBottom: 10,
    },
    selectionButton: {
        marginBottom: 20,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: colors.mediumgray,
        color: colors.mediumgray,
        backgroundColor: colors.grayligth,
    },
    sectionText: {
        fontSize: 14 ,
        color: colors.red,
        marginBottom: 10,
        fontFamily: fonts.Bold,
    },
    createButton: {
        backgroundColor: colors.darkred,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    createButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.Bold,
    },
    errorText: {
        color: colors.red,
        fontSize: 12,
        marginTop: -10,
        marginBottom:20,
        textAlign: 'right',
    },
});