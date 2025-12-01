import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text,Title } from 'react-native-paper';

export default function ResultsScreen({ navigation }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const handleViewResults = () => {
        // Aquí puedes manejar la lógica para ver los resultados entre las fechas seleccionadas
        console.log(`Ver resultados desde ${startDate} hasta ${endDate}`);
    }
    return (
        <View style={styles.container}>
            <Title style={styles.title}>Ver Resultados</Title>
            <TextInput
                placeholder="Fecha de inicio (YYYY-MM-DD)"
                placeholderTextColor="#888"
                value={startDate}
                onChangeText={text => setStartDate(text)}  
                style={styles.input}
            />
            <TextInput
                placeholder="Fecha de fin (YYYY-MM-DD)"
                placeholderTextColor="#888"
                value={endDate}
                onChangeText={text => setEndDate(text)}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleViewResults}>
                <Text style={styles.buttonText}>Ver Resultados</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2e2d2dff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff',
        textAlign: 'center',
    },
    input: {
        marginBottom: 20,
        backgroundColor: '#3e3d3dff',
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#1E88E5',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
    