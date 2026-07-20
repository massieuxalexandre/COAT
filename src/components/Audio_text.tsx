// On importe le hook spécifique à la nouvelle bibliothèque
import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

export function text_checking(user_text: string, real_text: string): boolean {
    return user_text === real_text;
}


export function AlarmController({ isRinging, onStop }: { isRinging: boolean, onStop: () => void }) {
    // 1. On crée le lecteur en utilisant le nouveau hook (C'est la nouvelle méthode !)
    const player = useAudioPlayer(require('../../assets/sounds/alarmetest.mp3'));
    
    // 2. On utilise useEffect pour surveiller quand l'alarme doit sonner ou s'arrêter
    useEffect(() => {
        if (isRinging) {
            player.loop = true; // On met en boucle
            player.play();      // On lance le son
        } else {
            player.pause();     // On coupe le son
        }
    }, [isRinging]); // Ce code se déclenche à chaque fois que isRinging change

    return null; // Ce composant ne dessine rien à l'écran, il fait juste du bruit !
}