import React, { useState } from "react";
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

const UserScreen = ({navigation}) => {
  const [name, setName] = useState(null);
  const [photo, setPhoto] = useState(null);

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

  const saveProfile = () => {
    console.log("Datos guardados:");
    console.log("Nombre:", name);
    console.log("Foto:", photo);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Perfil de Usuario</Text>

      {/* Foto de perfil */}
      <TouchableOpacity 
        style={styles.photoContainer} 
        onPress={selectImageOption}
      >
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Text style={styles.addPhotoText}>Añadir foto</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nombre de perfil:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ingresa tu nombre"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logOutButton} onPress={() => navigation.replace('Login')}>
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
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
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
  photo: {
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
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
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
