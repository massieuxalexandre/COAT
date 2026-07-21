import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AlarmController, text_checking } from '../components/Audio_text';
import FlipClock from '../components/FlipClock';

interface AlarmeData {
  id : string;
  name : string;
  time : Date;
  isActive : boolean;
  idSon : number;
}

const SOUND_FILES = {
  1: require('../../assets/sounds/Back On 74.mp3'),
  2: require('../../assets/sounds/Cyberkinetic.mp3'),
  3: require('../../assets/sounds/hellNBack.mp3'),
  4: require('../../assets/sounds/iphonealarm.mp3'),
  5: require('../../assets/sounds/Kali Uchis - I Wish you Roses (Official Music Video).mp3'),
  6: require('../../assets/sounds/radar.mp3'),
};

// Palette de l'appli, basée sur la charte graphique (cadre horloge, tuiles, tags d'alarmes)
const PALETTE = {
  cream: '#F2EBDE',
  textDark: '#2B2420',
  textMuted: '#6B6155',
  frame: '#a73c32',
  frameDark: '#2A2420',
  white: '#FFFFFF',
  neutralTrack: '#E5DFD3',
  accents: [
    { solid: '#3E6E62', tint: '#DCEAE4' }, // sarcelle
    { solid: '#C1603E', tint: '#F5DED2' }, // terracotta clair
    { solid: '#3C5A73', tint: '#DCE4EA' }, // bleu ardoise
    { solid: '#ca7530', tint: '#F2E7CE' }, // moutarde
  ],
};

export default function IndexScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const [alarmeEnEditionId, setAlarmeEnEditionId] = useState<string | null>(null);
  const [heureSelect, setHeureSelect] = useState(new Date());
  const [nameSelect, setNameSelect] = useState("Alarme");
  const [sonSelect, setSonSelect] = useState(1);
  const [alarmeQuiSonne, setAlarmeQuiSonne] = useState<AlarmeData | null>(null);
  const [alarmes, setAlarmes] = useState<AlarmeData[]>([]);
  const [texteSaisi, setTexteSaisi] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      alarmes.forEach((alarme) => {
        if (
          alarme.isActive &&
          alarme.time.getHours() === now.getHours() &&
          alarme.time.getMinutes() === now.getMinutes() &&
          now.getSeconds() === 0 &&
          !alarmeQuiSonne 
        ) {
          setAlarmeQuiSonne(alarme);
          setTexteSaisi("");
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmes, alarmeQuiSonne]);


  const TEXTE_DEFI = "Je suis reveille et pret";

  const arreterAlarme = () => {
    if (text_checking(texteSaisi, TEXTE_DEFI)) {
      setAlarmes(prev =>
        prev.map(a => (a.id === alarmeQuiSonne?.id ? { ...a, isActive: false } : a))
      );
      setAlarmeQuiSonne(null);
      setTexteSaisi("");
    } else {
      alert("Le texte ne correspond pas, essaye encore !");
    }
  };

  const ouvrirPourAjout = () => {
    setAlarmeEnEditionId(null); 
    setHeureSelect(new Date());
    setNameSelect("Alarme");
    setSonSelect(1);
    setModalVisible(true);
  };

  const ouvrirPourModification = (alarme: AlarmeData) => {
    setAlarmeEnEditionId(alarme.id); // On mémorise quelle alarme on modifie
    setHeureSelect(alarme.time);
    setNameSelect(alarme.name);
    setSonSelect(alarme.idSon);
    setModalVisible(true);
  };
  
  const validerAlarme = () => {
    if (alarmeEnEditionId) {
      setAlarmes(
        alarmes.map((alarme) =>
          alarme.id === alarmeEnEditionId
            ? { ...alarme, name: nameSelect, time: heureSelect, idSon: sonSelect }
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

  const supprimerAlarme = (id: string) => {
    setAlarmes(alarmes.filter((alarme) => alarme.id !== id));
  };

  
  return (
    <View style={styles.container}>
      <AlarmController 
        isRinging={alarmeQuiSonne !== null} 
        audioSource={alarmeQuiSonne ? SOUND_FILES[alarmeQuiSonne.idSon as keyof typeof SOUND_FILES] : SOUND_FILES[1]} 
      />
      {/* 1. Titre et Sous-titre */}
      <Image
      source={require('../../assets/images/COAT.png')}
      style={styles.coat}
      resizeMode="contain"
    />

      {/* 2. Ton composant Horloge s'insère ici */}
      <FlipClock />

      {/* 3. Bouton Ajouter : CORRIGÉ pour appeler ouvrirPourAjout */}
      <TouchableOpacity style={styles.addButton} onPress={ouvrirPourAjout} activeOpacity={0.85}>
        <Text style={styles.addButtonText}>Ajouter une alarme</Text>
      </TouchableOpacity>

      {/* 4. La zone pour la liste des alarmes */}
      <View style={styles.listContainer}>
        {alarmes.length === 0 ? (
          <Text style={styles.placeholderText}>Aucune alarme programmée</Text>
        ) : (
          alarmes.map((alarme, index) => {
            const accent = PALETTE.accents[index % PALETTE.accents.length];
            return (
              <View
                key={alarme.id}
                style={[
                  styles.alarmeCard,
                  { backgroundColor: accent.tint, borderColor: accent.solid },
                ]}
              >
                {/* Affichage de l'heure et du nom en dessous */}
                <View style={styles.alarmeInfo}>
                  <Text style={[styles.alarmeTime, { color: accent.solid }, !alarme.isActive && styles.alarmeTimeDisabled]}>
                    {alarme.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.alarmeName}>{alarme.name}</Text>
                </View>

                {/* Bouton Modifier + Switch regroupés à droite */}
                <View style={styles.alarmeActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => ouvrirPourModification(alarme)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editButtonText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => supprimerAlarme(alarme.id)}
                >
                  <Image 
                    source={require('../../assets/images/poubelle.png')} 
                    style={styles.deleteIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>


                  <Switch
                    value={alarme.isActive}
                    onValueChange={() => basculerAlarme(alarme.id)}
                    trackColor={{ false: PALETTE.neutralTrack, true: accent.solid }}
                    thumbColor={PALETTE.white}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>

      {/*  ÉCRAN DE SONNERIE PLEIN ÉCRAN */}
      <Modal animationType="fade" visible={alarmeQuiSonne !== null}>
        <View style={styles.ringingScreen}>
          <Text style={styles.ringingTitle}>Ding dong !</Text>
          <Text style={styles.ringingSubtitle}>Recopie ce texte pour arrêter l'alarme :</Text>

          <Text style={styles.ringingChallenge}>
            "{TEXTE_DEFI}"
          </Text>

          <TextInput
            style={styles.ringingInput}
            value={texteSaisi}
            onChangeText={setTexteSaisi}
            placeholder="Tape ici..."
            placeholderTextColor={PALETTE.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity style={styles.ringingButton} onPress={arreterAlarme} activeOpacity={0.85}>
            <Text style={styles.ringingButtonText}>Arrêter l'alarme</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Le titre change dynamiquement */}
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
                placeholderTextColor={PALETTE.textMuted}
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
                <Picker.Item label="iphonealarm" value={4} />
                <Picker.Item label="Kali Uchis - I Wish you Roses" value={5} />
                <Picker.Item label="radar" value={6} />
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalButtonSecondaryText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={validerAlarme}
                activeOpacity={0.85}
              >
                <Text style={styles.modalButtonPrimaryText}>Sauvegarder</Text>
              </TouchableOpacity>
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
    backgroundColor: PALETTE.cream,
    paddingTop: 80, 
    paddingHorizontal: 20, 
  },
  addButton: {
    backgroundColor: PALETTE.frameDark,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 30,
  },
  addButtonText: {
    color: PALETTE.cream,
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  placeholderText: {
    color: PALETTE.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(42, 36, 32, 0.5)',
  },
  modalContent: {
    backgroundColor: PALETTE.white,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.textDark,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: PALETTE.cream,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5DFD3',
  },
  modalButtonSecondaryText: {
    color: PALETTE.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    backgroundColor: PALETTE.frame,
    marginLeft: 10,
  },
  modalButtonPrimaryText: {
    color: PALETTE.cream,
    fontSize: 16,
    fontWeight: '700',
  },
  alarmeCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  alarmeInfo: {
    flexDirection: 'column',
  },
  alarmeTime: {
    fontSize: 30,
    fontWeight: '700',
  },
  alarmeTimeDisabled: {
    opacity: 0.4,
  },
  alarmeName: {
    fontSize: 14,
    color: PALETTE.textMuted,
    marginTop: 2,
  },
  alarmeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 15,
  },
  editButtonText: {
    color: PALETTE.textDark,
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
    color: PALETTE.textDark,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: PALETTE.cream,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: PALETTE.textDark,
  },
  picker: {
    width: '100%',
    height: 120,
  },
  coat: {
    width: 324,
    height: 200,
    alignSelf: 'center',
    marginBottom: 0,
  },
  ringingScreen: {
    flex: 1,
    backgroundColor: PALETTE.frame,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  ringingTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: PALETTE.cream,
    marginBottom: 20,
  },
  ringingSubtitle: {
    fontSize: 16,
    color: PALETTE.cream,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.9,
  },
  ringingChallenge: {
    fontSize: 22,
    fontWeight: '700',
    color: PALETTE.cream,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 15,
    borderRadius: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  ringingInput: {
    backgroundColor: PALETTE.cream,
    width: '100%',
    padding: 15,
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    color: PALETTE.textDark,
  },
  ringingButton: {
    backgroundColor: PALETTE.cream,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  ringingButtonText: {
    color: PALETTE.frame,
    fontSize: 18,
    fontWeight: '700',
  },deleteButton: {
    backgroundColor: '#581717',
    padding: 0,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 15,
    height: 23,
  },

});