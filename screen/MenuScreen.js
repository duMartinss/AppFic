import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar se o menu está aberto

  // Função para alternar o menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={styles.container}>
      {/* Conteúdo da tela principal */}
      <View style={styles.content}>
        {/* O conteúdo principal da tela vai aqui */}
      </View>

      {/* Menu lateral, agora posicionado à direita */}
      {menuOpen && (
        <Animated.View style={styles.drawerContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={30} color="white" />
            <Text style={styles.menuText}>Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="book-outline" size={30} color="white" />
            <Text style={styles.menuText}>Cursos realizados</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="ribbon-outline" size={30} color="white" />
            <Text style={styles.menuText}>Certificado</Text>
          </TouchableOpacity>

          {/* Botão para fechar o menu */}
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Ionicons name="close-outline" size={30} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Cor do conteúdo principal
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 60, // Mantém o rodapé visível
    right: 0, // Alterado para posicionar o menu na direita
    width: 240,
    backgroundColor: '#C8102E', // Cor vermelha do menu
    paddingTop: 50,
    paddingLeft: 20,
    zIndex: 10, // Garante que o menu esteja acima do conteúdo principal
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10, // Mantém o botão de fechar na parte superior direita do menu
  },
});