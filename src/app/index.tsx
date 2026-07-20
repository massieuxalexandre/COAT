import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Button, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Clock from '../components/Clock';
import { useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

interface AlarmeData {
  id : string;
  name : string;
  time : Date;
  isActive : boolean;
  idSon : number;
  snooze : number;
}

const SOUND_FILES = {
  1: require('../../assets/sounds/Back On 74.mp3'),
  2: require('../../assets/sounds/Cyberkinetic.mp3'),
  3: require('../../assets/sounds/hellNBack.mp3'),
  4: require('../../assets/sounds/iphonealarm.mp3'),
  5: require('../../assets/sounds/Kali Uchis - I Wish you Roses (Official Music Video).mp3'),
  6: require('../../assets/sounds/radar.mp3'),
};

export default function IndexScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const [alarmeEnEditionId, setAlarmeEnEditionId] = useState<string | null>(null);
  const [heureSelect, setHeureSelect] = useState(new Date());
  const [nameSelect, setNameSelect] = useState("Alarme");
  const [sonSelect, setSonSelect] = useState(1);
  const [snoozeSelect, setSnoozeSelect] = useState(5);

  const [alarmes, setAlarmes] = useState<AlarmeData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      alarmes.forEach(async (alarme) => {
        if (
          alarme.isActive &&
          alarme.time.getHours() === now.getHours() &&
          alarme.time.getMinutes() === now.getMinutes() &&
          now.getSeconds() === 0
        ) {
          
          try {
            // Utilisation de la nouvelle API expo-audio
            const player = useAudioPlayer(SOUND_FILES[alarme.idSon as keyof typeof SOUND_FILES]);
            player.play();
          } catch (error) {
            console.log("Erreur lors de la lecture du son :", error);
          }

          // Désactiver l'alarme automatiquement
          setAlarmes(prevAlarmes =>
            prevAlarmes.map(a =>
              a.id === alarme.id ? { ...a, isActive: false } : a
            )
          );
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmes]);

  const ouvrirPourAjout = () => {
    setAlarmeEnEditionId(null); // Pas d'ID = on crée du neuf
    setHeureSelect(new Date());
    setNameSelect("Alarme");
    setSonSelect(1);
    setSnoozeSelect(5);
    setModalVisible(true);
  };

  const ouvrirPourModification = (alarme: AlarmeData) => {
    setAlarmeEnEditionId(alarme.id); // On mémorise quelle alarme on modifie
    setHeureSelect(alarme.time);
    setNameSelect(alarme.name);
    setSonSelect(alarme.idSon);
    setSnoozeSelect(alarme.snooze);
    setModalVisible(true);
  };
  
  const validerAlarme = () => {
    if (alarmeEnEditionId) {
      setAlarmes(
        alarmes.map((alarme) =>
          alarme.id === alarmeEnEditionId
            ? { ...alarme, name: nameSelect, time: heureSelect, idSon: sonSelect, snooze: snoozeSelect }
            : alarme
        )
      );
    } else {
      const nouvelleAlarme: AlarmeData = {
        id: Math.random().toString(),
        name: nameSelect,
        time: heureSelect,
        isActive: true,
        idSon: sonSelect,
        snooze: snoozeSelect,
      };
      setAlarmes([...alarmes, nouvelleAlarme]);
    }
    
    setModalVisible(false);
  };

  const basculerAlarme = (id: string) => {
    setAlarmes(
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

      {/* 3. Bouton Ajouter : CORRIGÉ pour appeler ouvrirPourAjout */}
      <TouchableOpacity style={styles.addButton} onPress={ouvrirPourAjout}>
        <Text style={styles.addButtonText}>Ajouter une alarme</Text>
      </TouchableOpacity>

      {/* 4. La zone pour la liste des alarmes */}
      <View style={styles.listContainer}>
        {alarmes.length === 0 ? (
          <Text style={styles.placeholderText}>Aucune alarme programmée</Text>
        ) : (
          alarmes.map((alarme) => (
            <View key={alarme.id} style={styles.alarmeCard}>
            
              {/* CORRIGÉ : Affichage de l'heure et du nom en dessous */}
              <View style={styles.alarmeInfo}>
                <Text style={[styles.alarmeTime, !alarme.isActive && styles.alarmeTimeDisabled]}>
                  {alarme.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.alarmeName}>{alarme.name}</Text>
              </View>

              {/* CORRIGÉ : Bouton Modifier + Switch regroupés à droite */}
              <View style={styles.alarmeActions}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => ouvrirPourModification(alarme)}
                >
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>

                <Switch
                  value={alarme.isActive}
                  onValueChange={() => basculerAlarme(alarme.id)}
                  trackColor={{ false: '#E9E9EB', true: '#34C759' }}
                />
              </View>

            </View>
          ))
        )}
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* CORRIGÉ : Le titre change dynamiquement */}
            <Text style={styles.modalTitle}>
              {alarmeEnEditionId ? "Modifier l'alarme" : "Nouvelle Alarme"}
            </Text>
            
            {/* 1. Le Nom de l'alarme */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom de l'alarme</Text>
              <TextInput 
                style={styles.textInput}
                value={nameSelect}
                onChangeText={setNameSelect}
                placeholder="Ex: Entraînement"
              />
            </View>

            {/* 2. L'Heure */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Heure</Text>
              <DateTimePicker 
                value={heureSelect} 
                mode="time" 
                display="default"
                onChange={(event, date) => {
                  if (date) setHeureSelect(date);
                }}
              />
            </View>

            {/* 3. Le Son */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sonnerie</Text>
              <Picker
                selectedValue={sonSelect}
                onValueChange={(itemValue) => setSonSelect(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Back on 74" value={1} />
                <Picker.Item label="Cyberkinetic" value={2} />
                <Picker.Item label="hellNBack" value={3} />
                <Picker.Item label="iphonealarm" value={3} />
                <Picker.Item label="Kali Uchis - I Wish you Roses" value={3} />
                <Picker.Item label="radar" value={3} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#007AFF',
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
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  placeholderText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
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
  alarmeInfo: {
    flexDirection: 'column',
  },
  alarmeTime: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000',
  },
  alarmeTimeDisabled: {
    color: '#C7C7CC',
  },
  alarmeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  alarmeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 15,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
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
    height: 120,
  }
});