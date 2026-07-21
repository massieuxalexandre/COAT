// On importe le hook spécifique à la nouvelle bibliothèque
import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

export function text_checking(user_text: string, real_text: string): boolean {
    return user_text === real_text;
}


export function AlarmController({ isRinging, audioSource }: { isRinging: boolean, audioSource: any }) {
    // Le lecteur charge le son qu'on lui passe en paramètre
    const player = useAudioPlayer(audioSource);
    
    useEffect(() => {
        if (isRinging) {
            player.loop = true; 
            player.play();     
        } else {
            player.pause();   
        }
    }, [isRinging, player]); 

    return null;
}