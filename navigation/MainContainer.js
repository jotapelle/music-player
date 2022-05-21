import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import tracks from '../data/tracks.json';

export default function MainContainer() {
    const [sound, setSound] = useState(new Audio.Sound());
    const [status, setStatus] = useState(null);
    const [track, setTrack] = useState(tracks[0]);

    const handlePlaying = async () => {
        if (status === null) {
            return loadSound(track);
        }
        else if (status.isPlaying) {
            let current = await sound.pauseAsync();
            return setStatus(current);
        }
        else {
            let current = await sound.playAsync();
            return setStatus(current);
        }
    }

    const handleNext = async () => {
        let currentIndex = getCurrentIndex() + 1;
        if (currentIndex > tracks.length - 1) currentIndex = 0;
        return refreshSound(tracks[currentIndex]);
    }

    const handlePrev = async () => {
        let currentIndex = getCurrentIndex() - 1;
        if (currentIndex < 0) currentIndex = tracks.length - 1;
        return refreshSound(tracks[currentIndex]);
    }

    const refreshSound = async (song) => {
        await sound.unloadAsync();
        setTrack(song);
        return loadSound(song);
    }

    const loadSound = async (song) => {
        let current = await sound.loadAsync(
            { uri: song.uri },
            { shouldPlay: true }
        );
        await sound.setIsLoopingAsync(true);
        return setStatus(current);
    }

    const getCurrentIndex = () => {
        return tracks.findIndex(t => t.id == track.id);
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: track.image }} />
            <Text style={styles.title}>{track.title}</Text>
            <View style={styles.box}>
                <MaterialIcons name="skip-previous" style={styles.back} onPress={() => handlePrev()} />
                <MaterialIcons name={status == null || status.isPlaying ? "play-circle-outline" : "pause-circle-outline"} onPress={() => handlePlaying()} style={styles.circle} />
                <MaterialIcons name="skip-next" style={styles.forward} onPress={() => handleNext()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202124',
        alignItems: 'center',
        justifyContent: 'center'
    },
    circle: {
        paddingLeft: 5,
        fontSize: 120,
        color: 'white'
    },
    box: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 22,
        paddingTop: 25,
        paddingBottom: 12,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: 'white'
    },
    image: {
        height: 325,
        width: 300,
        borderRadius: 15
    },
    back: {
        paddingTop: 28,
        fontSize: 60,
        color: 'white'
    },
    forward: {
        paddingTop: 27,
        fontSize: 60,
        color: 'white'
    }
});