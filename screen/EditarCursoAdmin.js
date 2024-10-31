import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as Font from 'expo-font';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const loadFonts = () => {
  return Font.loadAsync({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });
};

function CourseHeader() {
  const [courseTitle, setCourseTitle] = useState('Administração da Manutenção');
  const [startDate, setStartDate] = useState('04/11/2024');
  const [endDate, setEndDate] = useState('05/12/2024');
  const [courseHours, setCourseHours] = useState('60h');
  const [coursePrice, setCoursePrice] = useState('Pago');


  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={pickImage}>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.courseTitle}
          value={courseTitle}
          onChangeText={setCourseTitle}
          placeholder="Nome do Curso"
          placeholderTextColor={colors.mediumgray}
        />
        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Início</Text>
            <TextInput
              style={styles.dateValue}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="00/00/0000"
              placeholderTextColor={colors.mediumgray}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Fim</Text>
            <TextInput
              style={styles.dateValue}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="00/00/0000"
              placeholderTextColor={colors.mediumgray}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <TextInput
            style={styles.hours}
            value={courseHours}
            onChangeText={setCourseHours}
            placeholder="Horas"
            placeholderTextColor={colors.mediumgray}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.paid}
            value={coursePrice}
            onChangeText={setCoursePrice}
            placeholder="Pago/Gratis"
            placeholderTextColor={colors.red}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.editIconButton}>
        <Ionicons name="pencil-outline" size={24} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
}

export default function CourseScreen() {
  const [isProgramacaoOpen, setProgramacaoOpen] = useState(false);
  const [isRequisitosOpen, setRequisitosOpen] = useState(false);
  const [isPerfilOpen, setPerfilOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingProgramacao, setIsEditingProgramacao] = useState(false);
  const [isEditingRequisitos, setIsEditingRequisitos] = useState(false);
  const [isEditingPerfil, setIsEditingPerfil] = useState(false);
  const [courseDescription, setCourseDescription] = useState(
    'O Curso de Aperfeiçoamento Profissional Administração da Manutenção tem por objetivo o desenvolvimento de competências relativas ao planejamento, programação, controle e gestão das pessoas que trabalham na manutenção de máquinas e equipamentos industriais.'
  );
  const [programacaoText, setProgramacaoText] = useState(
    'ADMINISTRAÇÃO DA MANUTENÇÃO\nManutenção: Definição, Falhas, Defeitos e Indicadores de desempenho;\nMétodos de manutenção: Corretiva, Preventiva e Preditiva;\nPlanejamento da manutenção: Modelos administrativos, arranjo físico (leiaute), ferramentas de planejamento, controlar custos e parada de máquina.\nSuprimentos da manutenção: Estoque de sobressalentes e armazenagem.\nQualidade: Sistemas e normas ISO 9000 e ISO 14000, gerenciar resíduo, controlar poluição e compreender as legislações ambientais aplicadas, 5s e ferramentas da qualidade.'
  );
  const [requisitosText, setRequisitosText] = useState(
    'O aluno deverá, no início do curso, ter no mínimo 16 anos de idade.\nO aluno deverá ter concluído o Nível Fundamental.\nTer concluído o curso de qualificação profissional Mecânico Auxiliar de Manutenção ou comprovar conhecimentos e experiências anteriores referentes a essa qualificação, adquiridos em outros cursos, no trabalho ou em outros meios informais.'
  );
  const [perfilText, setPerfilText] = useState(
    'ADMINISTRAÇÃO DA MANUTENÇÃO\nManutenção: Definição, Falhas, Defeitos e Indicadores de desempenho;\nMétodos de manutenção: Corretiva, Preventiva e Preditiva;\nPlanejamento da manutenção: Modelos administrativos, arranjo físico (leiaute), ferramentas de planejamento, controlar custos e parada de máquina.\nSuprimentos da manutenção: Estoque de sobressalentes e armazenagem.\nQualidade: Sistemas e normas ISO 9000 e ISO 14000, gerenciar resíduo, controlar poluição e compreender as legislações ambientais aplicadas, 5s e ferramentas da qualidade.'
  );

  return (
    <View style={styles.container}>
      <CourseHeader />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {isEditingDescription ? (
          <TextInput
            style={styles.courseDescription}
            value={courseDescription}
            onChangeText={setCourseDescription}
            multiline
            placeholder="Descrição do Curso"
            placeholderTextColor={colors.mediumgray}
            onBlur={() => setIsEditingDescription(false)}
          />
        ) : (
          <Text style={styles.courseDescription}>
            {courseDescription}
          </Text>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditingDescription(!isEditingDescription)}
        >
          <Text style={styles.editButtonText}>
            {isEditingDescription ? 'Salvar' : 'Editar Descrição'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionButton}
          onPress={() => setProgramacaoOpen(!isProgramacaoOpen)}
        >
          <Text style={styles.sectionText}>Programação</Text>
          <Ionicons name={isProgramacaoOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isProgramacaoOpen && (
          <View style={styles.content}>
            {isEditingProgramacao ? (
              <TextInput
                style={styles.contentText}
                value={programacaoText}
                onChangeText={setProgramacaoText}
                multiline
                placeholder="Programação"
                placeholderTextColor={colors.mediumgray}
                onBlur={() => setIsEditingProgramacao(false)}
              />
            ) : (
              <Text style={styles.contentText}>
                {programacaoText}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingProgramacao(!isEditingProgramacao)}
            >
              <Text style={styles.editButtonText}>
                {isEditingProgramacao ? 'Salvar' : 'Editar Programação'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.sectionButton}
          onPress={() => setRequisitosOpen(!isRequisitosOpen)}
        >
          <Text style={styles.sectionText}>Requisitos</Text>
          <Ionicons name={isRequisitosOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isRequisitosOpen && (
          <View style={styles.content}>
            {isEditingRequisitos ? (
              <TextInput
                style={styles.contentText}
                value={requisitosText}
                onChangeText={setRequisitosText}
                multiline
                placeholder="Requisitos"
                placeholderTextColor={colors.mediumgray}
                onBlur={() => setIsEditingRequisitos(false)}
              />
            ) : (
              <Text style={styles.contentText}>
                {requisitosText}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingRequisitos(!isEditingRequisitos)}
            >
              <Text style={styles.editButtonText}>
                {isEditingRequisitos ? 'Salvar' : 'Editar Requisitos'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.sectionButton}
          onPress={() => setPerfilOpen(!isPerfilOpen)}
        >
          <Text style={styles.sectionText}>Perfil Profissional</Text>
          <Ionicons name={isPerfilOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="black" />
        </TouchableOpacity>
        {isPerfilOpen && (
          <View style={styles.content}>
            {isEditingPerfil ? (
              <TextInput
                style={styles.contentText}
                value={perfilText}
                onChangeText={setPerfilText}
                multiline
                placeholder="Perfil Profissional"
                placeholderTextColor={colors.mediumgray}
                onBlur={() => setIsEditingPerfil(false)}
              />
            ) : (
              <Text style={styles.contentText}>
                {perfilText}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingPerfil(!isEditingPerfil)}
            >
              <Text style={styles.editButtonText}>
                {isEditingPerfil ? 'Salvar' : 'Editar Perfil Profissional'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="home-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="book-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="grid-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 25,
    top: 150,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 35,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    bottom: 50,
  },
  courseImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    color: colors.mediumgray,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hours: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    marginRight: 15,
  },
  paid: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.red,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  courseDescription: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.red,
    paddingBottom: 10,
  },
  editButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.red,
    borderRadius: 7,
    alignSelf: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  sectionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.red,
  },
  content: {
    padding: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightgray,
    borderRadius: 10,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 15,
    color: colors.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconButton: {
    padding: 10,
  },
  editIconButton: {
    position: 'absolute',
    right: 15,
  },
});