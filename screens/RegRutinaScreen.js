import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://dispmovilbackend.onrender.com";

const DetalleRutinaScreen = ({ route }) => {
  const { idRutina } = route.params;
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registroEjercicios, setRegistroEjercicios] = useState({});

  // ================================
  //       OBTENER EJERCICIOS
  // ================================
  const obtenerEjercicios = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/rutinas/obtenerrutina/${idRutina}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setEjercicios(data.lista);

        // Inicializar registroEjercicios con valores por defecto
        const registroInicial = {};
        data.lista.forEach((item) => {
          registroInicial[item[6]] = { peso: "", unidad: "kg", repeticiones: "", series: "" };
        });
        setRegistroEjercicios(registroInicial);
      } else {
        Alert.alert("Error", data.error || "No se pudieron cargar los ejercicios");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerEjercicios();
  }, []);

  // ================================
  //        MANEJO DE CAMBIOS
  // ================================
  const handleChange = (id, field, value) => {
    setRegistroEjercicios((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // ================================
  //        GUARDAR REGISTRO
  // ================================
  const guardarRegistro = async (id_ejercicio) => {
    const registro = registroEjercicios[id_ejercicio];
    if (!registro || !registro.peso || !registro.repeticiones || !registro.series)
      return Alert.alert("Error", "Complete los campos primero");

    const token = await AsyncStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_URL}/pesos/registrar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_ejercicio,
          peso: parseFloat(registro.peso),
          unidad_medida: registro.unidad,
          repeticiones: parseInt(registro.repeticiones),
          series: parseInt(registro.series),
        }),
      });

      const data = await res.json();
      if (res.ok) Alert.alert("Éxito", data.mensaje);
      else Alert.alert("Error", data.error);
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  // ================================
  //          RENDER
  // ================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicios de la Rutina</Text>

      <FlatList
        data={ejercicios}
        keyExtractor={(item) => item[6].toString()}
        renderItem={({ item }) => {
          const registro = registroEjercicios[item[6]];

          return (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item[4]}</Text>
              <Text style={styles.itemDesc}>{item[5]}</Text>

              {/* Fila compacta */}
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Peso"
                  keyboardType="numeric"
                  value={registro.peso}
                  onChangeText={(text) => handleChange(item[6], "peso", text)}
                />

                <View style={[styles.pickerWrapper]}>
                  <Picker
                    selectedValue={registro.unidad}
                    onValueChange={(value) => handleChange(item[6], "unidad", value)}
                    style={styles.picker}
                    itemStyle={{ fontSize: 14,fontStyle:"bold" }}
                  >
                    <Picker.Item label="kg" value="kg"/>
                    <Picker.Item label="lbs" value="lbs" />
                  </Picker>
                </View>

                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={registro.repeticiones}
                  onChangeText={(text) => handleChange(item[6], "repeticiones", text)}
                />

                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Series"
                  keyboardType="numeric"
                  value={registro.series}
                  onChangeText={(text) => handleChange(item[6], "series", text)}
                />
              </View>
                <TouchableOpacity style={styles.saveButton} onPress={() => guardarRegistro(item[6])}>
                    <Text style={styles.saveText}>Guardar cambios</Text>
                </TouchableOpacity>
            </View>
          );
        }}
        refreshing={loading}
        onRefresh={obtenerEjercicios}
      />
    </View>
  );
};

export default DetalleRutinaScreen;

// ================================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#2e2d2dff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#ffffff" },
  item: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  itemDesc: { fontSize: 14, color: "#eee", marginTop: 5 },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
  },
  pickerWrapper: {
    height:40,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  picker: {
    height: 30,
    width:80,
    justifyContent:"center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#7ae24aff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

});
