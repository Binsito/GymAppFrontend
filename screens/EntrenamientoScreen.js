import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://dispmovilbackend.onrender.com/rutinas";

const EntrenamientoScreen = ({ navigation }) => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================================
  //       OBTENER RUTINAS
  // ================================
  const obtenerRutinas = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/obtener`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setRutinas(data.lista);
      } else {
        Alert.alert("Error", data.error || "No se pudieron cargar las rutinas");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerRutinas();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Rutinas</Text>

      <FlatList
        data={rutinas}
        keyExtractor={(item) => item[4].toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("RegRutinaScreen", { idRutina: item[4] })
            }
          >
            <Text style={styles.itemTitle}>{item[1]}</Text>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={obtenerRutinas}
      />
    </View>
  );
};

export default EntrenamientoScreen;

// ======================
//        ESTILOS
// ======================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#2e2d2dff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#ffffff" },
  item: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop:20,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});