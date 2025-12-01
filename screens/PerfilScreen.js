import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from 'jwt-decode';
  


  const UserScreen = ({navigation}) => {
  const [nombre, setName] = useState(null);
  const [foto_perfil, setPhoto] = useState(null);
  
  // Cargar datos de perfil al montar el componente
  useEffect(() => {
  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const decoded = jwtDecode(token);
    const id_usuario = parseInt(decoded.sub);
    if (!token) {
      alert("Error: no hay token, vuelve a iniciar sesión");
      return;
    }

    try {
      const response = await fetch(
        `https://dispmovilbackend.onrender.com/usuarios/foto/${id_usuario}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(blob);
      
    } catch (error) {
      alert('Error al cargar perfil. Por favor, inténtalo de nuevo. ' + error);
    }
  };

  fetchProfile();
}, []);



  // Elegir entre cámara o galería
  const selectImageOption = () => {
    Alert.alert(
      "Seleccionar foto",
      "Elige una opción",
      [
        { text: "Camara", onPress: takePhoto },
        { text: "Galería", onPress: pickImage },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const confirmLogout = async(navigation) => {
    try {
      // 1. Borrar token
      

      await AsyncStorage.removeItem("access_token");
      // AsyncStorage.removeItem("access_token");

      // 2. Redirigir a Login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      alert("Error cerrando sesión:", error);
    }
  };



  const logout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: () => confirmLogout(navigation) }
      ]
    );
  }

  // Abrir galería
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permiso de galería denegado.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permiso de cámara denegado.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const saveProfile = async() => {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      alert("Error: no hay token, vuelve a iniciar sesión");
      return;
    }
    
    
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('foto_perfil', {
      uri: foto_perfil,         
      name: foto_perfil.fileName || 'foto.jpg', 
      type: foto_perfil.type || 'image/jpeg',   
    });
    
    try {
      const response = await fetch('https://dispmovilbackend.onrender.com/usuarios/actualizar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const data = await response.json();
      
      if(response.status !== 200){
        alert('Error al guardar perfil: ' + data.error);
        return;
      }
      alert('Perfil guardado exitosamente.');
    } catch (error) {
      alert('Error al guardar perfil. Por favor, inténtalo de nuevo.'+ error);
    }
  };
  
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Perfil de Usuario</Text>

      {/* Foto de perfil */}
      <TouchableOpacity 
        style={styles.photoContainer} 
        onPress={selectImageOption}
      >
        {foto_perfil ? (
          <Image source={{ uri: foto_perfil }} style={styles.foto_perfil} />
        ) : (
          <Text style={styles.addPhotoText}>Añadir foto</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nombre de perfil:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setName}
        placeholder="Ingresa tu nombre"
        placeholderTextColor="#888"
        color="#fff"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logOutButton} onPress={logout}>
        <Text style={styles.logOutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#2e2d2dff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#ffffff",
  },
  photoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  foto_perfil: {
    width: "100%",
    height: "100%",
  },
  addPhotoText: {
    color: "#555",
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
    color: "#ffffff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#444343ff",
    
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 90,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logOutButton: {
    marginTop: 30,
    backgroundColor: "#fa2e2eff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logOutText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
