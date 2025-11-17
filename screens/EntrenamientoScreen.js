import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text,Title } from 'react-native-paper';

export default function RutinasScreen({ navigation }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleCreateRoutine = () => {
        console.log('Nueva rutina creada:', name, description);
  }
    return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear Nueva Rutina</Title>
        <TextInput
        label="Nombre de la rutina"
        value={name}
        onChangeText={setName} 
        mode="outlined"
        style={styles.input}
      />
        <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        />
        <TouchableOpacity onPress={handleCreateRoutine} style={styles.buttonCreate}>
        <Text style={{ color: 'white', textAlign: 'center', padding: 10 }}>
            Crear Rutina
        </Text>
        </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffffff',
    },
    title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
    },
    input: {
    marginBottom: 20,  
    },
    buttonCreate: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
    },
});