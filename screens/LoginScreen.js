import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { TextInput, Text,Title } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', email, password);
    // funcion que lleva a la pantalla principal despues de iniciar sesion
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>GymApp</Title>

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

      <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
        <Text style={{ color: 'white', textAlign: 'center', padding: 10 }}>
            Iniciar Sesión
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>
          ¿No tienes cuenta? Regístrate aquí
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
    fontFamily: 'Roboto-Bold',
    fontSize: 32,

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
  buttonLogin: {
    backgroundColor: '#1E88E5',
    borderRadius: 5,
    marginTop: 10,
  },
});
