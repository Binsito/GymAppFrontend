import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Title, Card } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  const options = [
    { id: '1', name: 'Administrar ejercicios', image: require('../assets/images/weightlifting.png'), screen: 'Ejercicios' },
    { id: '2', name: 'Registrar entenamiento', image: require('../assets/images/verify.png'), screen: 'Entrenamientos' },
    { id: '3', name: 'Administrar rutinas', image: require('../assets/images/checklist.png'),screen: 'Rutinas' },
  ];

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
          <Image source={item.image} style={styles.image} />
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

      <Title style={styles.title}>🏋️Bienvenido💪</Title>
      
      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      
      
      {/* <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.logoutButton}>Cerrar sesión</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 'bold',
    top: 70,
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
    backgroundColor: '#ece7e7ff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineName: {
    marginLeft: 15,
    fontSize: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
