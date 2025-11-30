import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text,Title } from 'react-native-paper';

export default function RegisterScreen({ navigation }) {
    const [nombre, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');


    const handleRegister = () => {
      //console.log('Register:', nombre, email, password, confirm);
      if (password !== confirm) {
        alert('Las contraseñas no coinciden');
        //console.log('Las contraseñas no coinciden');
        return;
        }
      if (!nombre || !email || !password) {
        alert('Por favor, completa todos los campos');
        return;
      }

      try {
        fetch('http://192.168.1.68:8080/usuarios/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, email, password }),
        })
        .then(response => response.json())
        .then(data => {
          if("error" in data){
            alert('Error de registro: ' + data.error);
            return;
          }
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          navigation.replace('Login');
        })
        .catch((error) => {
          //console.error('Error:', error);
        });
      } catch (error) {
        //console.error('Error en el registro:', error);
        alert('Error durante el registro. Por favor, inténtalo de nuevo.');
      }

  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear Cuenta</Title>

      <TextInput
        label="Nombre completo"
        value={nombre}
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
