import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Clock(){

const [time, setTime]=useState(new Date());
useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date());
    },1000);
    return () => clearInterval(timer);
}, []);

const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    // On retourne la chaîne formatée
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(time)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20, // Un peu d'espace en haut et en bas
    alignItems: 'center',
  },
  timeText: {
    fontSize: 60, // Un gros texte bien lisible
    fontWeight: 'bold',
    color: '#000', // Noir ou blanc selon ton fond
    fontVariant: ['tabular-nums'], // Garde les chiffres de taille fixe pour que l'heure ne "danse" pas
  },
});