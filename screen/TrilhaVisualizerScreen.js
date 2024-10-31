import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageZoom from 'react-native-image-pan-zoom';
import { Image } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TrilhaVisualizerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { trilhaImage, trilhaTitle } = route.params;

  // Função para obter a imagem correta baseada no título da trilha
  const getTrilhaImage = (title) => {
    switch (title) {
      case 'Tecnologia':
        return require('../assets/Tecnologia.png');
      case 'Eletricidade':
        return require('../assets/Mecatronica.png');
      case 'Automobilística':
        return require('../assets/Automotiva.png');
      case 'MetalMecânica':
        return require('../assets/Mecanica.png');
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      <ImageZoom
        cropWidth={windowWidth}
        cropHeight={windowHeight}
        imageWidth={windowWidth}
        imageHeight={windowHeight}
        enableSwipeDown={true}
        onSwipeDown={() => navigation.goBack()}
        minScale={1}
        maxScale={3}
      >
        <Image
          source={getTrilhaImage(trilhaTitle)}
          style={styles.image}
        />
      </ImageZoom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  image: {
    width: windowWidth,
    height: windowHeight,
  },
}); 