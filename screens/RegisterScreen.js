import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text,Title } from 'react-native-paper';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleRegister = () => {
        if (password !== confirm) {
        alert('Las contraseñas no coinciden');
        return;
        }
        console.log('Registro:',name ,email, password);
        console.log(`Usuario registrado con éxito \nNombre: ${name}\nCorreo: ${email}\nPassword: ${password}`);
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear Cuenta</Title>

      <TextInput
        label="Nombre completo"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="Confirmar contraseña"
        value={confirm}
        onChangeText={setConfirm}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleRegister} style={styles.buttonRegister}>
        <Text style={{ color: 'white', textAlign: 'center', padding: 10 }}>
            Registrarse
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
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
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1E88E5',
  },
  buttonRegister: {
    backgroundColor: '#1E88E5',
    borderRadius: 5,
    marginTop: 10,
  },
});
