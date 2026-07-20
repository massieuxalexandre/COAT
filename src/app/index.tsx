// 1. Les imports : On va chercher les "briques" visuelles chez React Native
import { StyleSheet, Text, View } from 'react-native';

// 2. Le Composant Principal
// En React, un écran est une simple fonction qui retourne du visuel.
export default function IndexScreen() {
  
  // 3. Le rendu (Le "return")
  // Ici, on retourne du JSX (un mélange de HTML et de JavaScript)
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Hello World !</Text>
      <Text style={styles.sousTitre}>Notre réveil infernal commence ici.</Text>
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

