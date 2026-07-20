import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Button, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Clock from '../components/Clock';

interface AlarmeData {
  id : string;
  name : string;
  time : Date;
  isActive : boolean;
  idSon : number;
  snooze : number;
}

export default function IndexScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const [heureSelect, setHeureSelect] = useState(new Date());
  const [nameSelect, setNameSelect] = useState("Alarme");
  const [sonSelect, setSonSelect] = useState(1);
  const [snoozeSelect, setSnoozeSelect] = useState(5);

  const [alarmes, setAlarmes] = useState<AlarmeData[]>([]);
  const validerAlarme = () => {
    const nouvelleAlarme: AlarmeData = {
      id: Math.random().toString(),
      name: nameSelect,
      time: heureSelect,
      isActive: true,
      idSon: sonSelect,
      snooze: snoozeSelect,
    };
    setAlarmes([...alarmes, nouvelleAlarme]);
    setModalVisible(false);
    
  };

  const basculerAlarme = (id: string) => {
    setAlarmes(
      // On parcourt le tableau. Si on trouve la bonne alarme, on inverse son état.
      alarmes.map((alarme) => 
        alarme.id === id ? { ...alarme, isActive: !alarme.isActive } : alarme
      )
    );
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
          
          alarmes.map((alarme) => (
            <View key={alarme.id} style={styles.alarmeCard}>
            
              <Text style={[styles.alarmeTime, !alarme.isActive && styles.alarmeTimeDisabled]}>
                {alarme.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>

              <Switch
                value={alarme.isActive}
                onValueChange={() => basculerAlarme(alarme.id)}
                trackColor={{ false: '#E9E9EB', true: '#34C759' }} // Le fameux vert iOS
              />



            </View>
          ))
        )}

      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle Alarme</Text>
            
            {/* 1. Le Nom de l'alarme */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom de l'alarme</Text>
              <TextInput 
                style={styles.textInput}
                value={nameSelect}
                onChangeText={setNameSelect} // Met à jour le nom
                placeholder="Ex: Entraînement"
              />
            </View>

            {/* 2. L'Heure */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Heure</Text>
              <DateTimePicker 
                value={heureSelect} 
                mode="time" 
                display="default" // "default" est plus compact que "spinner" sur iOS pour laisser de la place au reste
                onChange={(event, date) => {
                  if (date) setHeureSelect(date);
                }}
              />
            </View>

            {/* 3. Le Son (Personne 2 mettra ses ID ici plus tard) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sonnerie</Text>
              <Picker
                selectedValue={sonSelect}
                onValueChange={(itemValue) => setSonSelect(itemValue)}
                style={styles.picker}
              >
                {/* On prépare des fausses données pour l'instant */}
                <Picker.Item label="Radar (Défaut)" value={1} />
                <Picker.Item label="Apex" value={2} />
                <Picker.Item label="Alarme nucléaire" value={3} />
              </Picker>
            </View>

            {/* 4. Le Snooze */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rappel (Snooze)</Text>
              <Picker
                selectedValue={snoozeSelect}
                onValueChange={(itemValue) => setSnoozeSelect(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Désactivé" value={0} />
                <Picker.Item label="5 minutes" value={5} />
                <Picker.Item label="10 minutes" value={10} />
              </Picker>
            </View>

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
  },
  alarmeTimeDisabled: {
    color: '#C7C7CC', // Gris clair iOS
  },
  // --- Nouveaux styles pour les paramètres ---
  inputGroup: {
    width: '100%',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: 120, // Hauteur réduite pour que tout rentre sur l'écran
  }
});

