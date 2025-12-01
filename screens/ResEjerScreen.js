import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, Alert, ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://dispmovilbackend.onrender.com/pesos"; // Cambia según tu ruta real

const ResEjerScreen = ({ route }) => {
  const { ejercicio } = route.params; // Recibimos el ejercicio desde la screen anterior
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerRegistros = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/obtener/${ejercicio.id_ejercicio}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) {
        const listaTransformada = data.lista.map(r => ({
          id_registro: r[0],
          id_usuario: r[1],
          id_ejercicio: r[2],
          peso: r[3],
          unidad_medida: r[4],
          repeticiones: r[5],
          series: r[6],
          fecha: r[7],
          nombre_usuario: r[8],
          email: r[9],
        }));

        setRegistros(listaTransformada);
      } else {
        Alert.alert("Info", data.error || "No hay registros para este ejercicio");
        setRegistros([]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerRegistros();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Peso: {item.peso} {item.unidad_medida}</Text>
      <Text style={styles.itemText}>Repeticiones: {item.repeticiones}</Text>
      <Text style={styles.itemText}>Series: {item.series}</Text>
      <Text style={styles.itemText}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ejercicio.nombre}</Text>
      <Text style={styles.desc}>{ejercicio.descripcion}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={registros}
          keyExtractor={(item) => item.id_registro.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.noData}>No hay registros aún</Text>}
        />
      )}
    </View>
  );
};

export default ResEjerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#2e2d2dff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  desc: { fontSize: 16, color: "#fff", marginBottom: 20 },
  item: { backgroundColor: "#2196F3", padding: 15, borderRadius: 10, marginBottom: 10 },
  itemText: { color: "#fff", fontSize: 16 },
  noData: { color: "#fff", textAlign: "center", marginTop: 20, fontSize: 16 }
});
