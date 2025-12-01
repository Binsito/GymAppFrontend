import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const API_URL = "https://dispmovilbackend.onrender.com/ejercicios"; 

const EjerciciosScreen = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const obtenerEjercicios = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/obtener`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) {
        const listaTransformada = data.lista.map(e => ({
          id_usuario: e[0],
          nombre: e[1],
          descripcion: e[2],
          nombre_usuario: e[3],
          email: e[4],
          id_ejercicio: e[5],
          id_rutina: e[6],
          nombre_rutina: e[7]
        }));
        setEjercicios(listaTransformada);
      } else {
        Alert.alert("Error", data.error || "No se pudieron cargar los ejercicios");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerEjercicios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ver resultados de ejercicio</Text>

      <FlatList
        data={ejercicios}
        keyExtractor={(item) => item.id_ejercicio.toString()}
        refreshing={loading}
        onRefresh={obtenerEjercicios}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("ResEjerScreen", {'ejercicio': item })}
          >
            <Text style={styles.itemTitle}>{item.nombre}</Text>
            <Text style={styles.itemDesc}>{item.descripcion}</Text>
            <Text style={styles.itemDesc}>{item.nombre_rutina}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default EjerciciosScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#2e2d2dff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color:"#ffff" },
  item: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop:20,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold", color:"#ffff" },
  itemDesc: { color: "#ffffffff", marginVertical: 5 }
});
