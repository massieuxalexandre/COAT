import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Clock from '../components/Clock';
export default function IndexScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [heureSelectionnee, setHeureSelectionnee] = useState(new Date());
  const [alarmes, setAlarmes] = useState<Date[]>([]);
  const validerAlarme = () => {
    setAlarmes([...alarmes, heureSelectionnee]);
    setModalVisible(false);
  };
  
  return (
    <View style={styles.container}>

      {/* 1. Titre et Sous-titre */}
      <Text style={styles.titre}>COAT</Text>
      <Text style={styles.sousTitre}>Clock Of All Time</Text>

      {/* 2. Ton composant Horloge s'insère ici */}
      <Clock />

      {/* 3. Bouton Ajouter */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Ajouter une alarme</Text>
      </TouchableOpacity>

      {/* 4. La zone pour la liste des alarmes */}
      <View style={styles.listContainer}>
        {alarmes.length === 0 ? (
          <Text style={styles.placeholderText}>Aucune alarme programmée</Text>
        ) : (
          
          alarmes.map((alarme, index) => (
            <View key={index} style={styles.alarmeCard}>
              <Text style={styles.alarmeTime}>
                {/* On formate l'heure pour qu'elle s'affiche sous forme 08:30 */}
                {alarme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))
        )}

      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        {/* Un fond semi-transparent pour assombrir l'arrière-plan */}
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir l'heure</Text>
            
            <DateTimePicker value={heureSelectionnee} mode="time" display="spinner"  
              onChange={(event, date) => {
                // Met à jour la variable à chaque fois qu'on tourne la roue
                if (date) setHeureSelectionnee(date);
              }}
            />

            <View style={styles.modalButtons}>
              <Button title="Annuler" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Sauvegarder" onPress={validerAlarme} />
            </View>
          </View>
        </View>
      </Modal>



    </View>
  );
}

// 4. Les Styles (comme du CSS, mais en JavaScript)
const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend toute la hauteur de l'écran
    backgroundColor: '#F5F5F5',
    paddingTop: 80, 
    paddingHorizontal: 20, 
  },
  titre: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  sousTitre: {
    fontSize: 20,
    color: '#666',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007AFF', // Le bleu iOS classique
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1, // Prend tout l'espace restant
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Aligne le menu en bas de l'écran
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fond noir un peu transparent
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingBottom: 40, // De la marge pour la barre de l'iPhone en bas
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row', // Met les boutons côte à côte
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  alarmeCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  alarmeTime: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000',
  }
});