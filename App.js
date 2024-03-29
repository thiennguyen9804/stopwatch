import { StatusBar } from 'expo-status-bar';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import formatTime from 'minutes-seconds-milliseconds';
import {useEffect, useRef, useState} from "react";


export default function App() {
    const [running, setRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(null);
    const [laps, setLaps] = useState([]);
    const startTimeRef = useRef(0);
    const timerRef = useRef(null);
    const testI = useRef(0);
    useEffect(() => {
        if(running) {
            console.log('callback is called')
            startTimeRef.current = Date.now() - timeElapsed;
            timerRef.current = setInterval(() => {
                setTimeElapsed(Date.now() - startTimeRef.current);
            }, 30);
        }

        return () => {
            console.log('clean-up function is called');
            clearInterval(timerRef.current);
        }
    }, [running]);


    const startHandling = () => {
        setRunning(!running);
    }

    const resetHandling = () => {
        clearInterval(timerRef.current);
        setTimeElapsed(0);
        setRunning(false);
        setLaps([]);
        testI.current = 0;
    }

    const lapHandling = () => {
        setLaps(prev => [...prev, timeElapsed]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.timerWrapper}>
                    <Text style={styles.timer}>
                        {formatTime(timeElapsed)}
                    </Text>
                </View>
                <View style={styles.buttonWrapper}>
                    {/*buttons*/}
                    <TouchableOpacity style={running ? stopButtonStyle : startButtonStyle} onPress={startHandling}>
                        <Text>{running ? "STOP" : "START"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={lapHandling}>
                        <Text>LAP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={resetHandling}>
                        <Text>RESET</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <FlatList
                    data={laps}
                    renderItem={({item, index}) => {
                        return (
                            <View style={styles.lap}>
                                <Text style={styles.lapText}>Lap #{index + 1}   {formatTime(item)}</Text>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => item + index}
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },

    header: {
        flex: 1,
    },

    footer: {
        flex: 1,
    },

    timerWrapper: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonWrapper: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    lap: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        padding: 10,
        marginTop: 10,
    },

    button: {
        borderWidth: 2,
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    timer: {
        fontSize: 60
    },

    startButton: {
        borderColor: 'green'
    },

    stopButton: {
        borderColor: 'red'
    },
    lapText: {
        fontSize: 30
    }
});

const startButtonStyle = StyleSheet.compose(styles.button, styles.startButton);
const stopButtonStyle = StyleSheet.compose(styles.button, styles.stopButton);
