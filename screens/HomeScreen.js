import React, { use, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Title, Card } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const options = [
    { id: '1', name: 'Administrar ejercicios', image: require('../assets/images/weightlifting.png'), screen: 'Ejercicios' },
    { id: '2', name: 'Registrar entenamiento', image: require('../assets/images/verify.png'), screen: 'Entrenamientos' },
    { id: '3', name: 'Administrar rutinas', image: require('../assets/images/checklist.png'),screen: 'Rutinas' },
    { id: '4', name: 'Ver resultados', image: require('../assets/images/rising.png'), screen: 'Results' },
  ];
   const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          Alert.alert("Error", "No hay token, vuelve a iniciar sesión");
          return;
        }

        const response = await fetch('http://192.168.1.68:8080/usuarios/datos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setUser(data.datos);
        //console.log("Datos de usuario en HomeScreen:", data);
      } catch (error) {
        Alert.alert("Error", "Error al cargar datos de usuario. Por favor, inténtalo de nuevo. " + error);
      }
    };

    fetchUser();
  }, []);
  
      

  const handleOptionPress = (optionId) => {
    // manejar la navegación según la opción seleccionada
    console.log('Opción seleccionada:', optionId);
    const selectedOption = options.find(option => option.id === optionId)
    if (selectedOption) {
      navigation.navigate(selectedOption.screen)
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={handleOptionPress.bind(this, item.id)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
          </View>
          
          <Text style={styles.routineName}>{item.name}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>

    
  );

  return (
    <View style={styles.container}>

      {/* Boton de perfil */}
      <TouchableOpacity style={styles.circle} onPress={() => navigation.navigate('Perfil')}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' }}
          style={{ width: 24, height: 24, tintColor: 'white' }}
        />
      </TouchableOpacity>

      <Title style={styles.title}>
        {user ? `🏋️Bienvenido ${user.nombre}💪`:'Cargando...'}
      </Title>
      
      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2d2dff',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 'bold',
    top: 70,
    color: '#ffffff',
  },
  list: {
    paddingBottom: 0,
    paddingTop: 80,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    backgroundColor: '#1E88E5',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineName: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,

  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    backgroundColor: '#ffffff',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#535456ff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    top: 20,
    right: 20,
    zIndex: 999,
    position: 'absolute',

  },

});
