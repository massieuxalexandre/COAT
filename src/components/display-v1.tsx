import { StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>COAT</Text>
      <Text style={styles.sousTitre}>Heure</Text>
    </View>
  );
}

// 4. Les Styles (comme du CSS, mais en JavaScript)
const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend toute la hauteur de l'écran
    backgroundColor: 'pink', // Fond rouge agressif !
    alignItems: 'center', // Centre horizontalement
    justifyContent: 'center', // Centre verticalement
  },
  titre: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  sousTitre: {
    fontSize: 20,
    color: 'white',
    marginTop: 10,
  }
});