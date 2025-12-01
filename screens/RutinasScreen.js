import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://dispmovilbackend.onrender.com/rutinas";

const RutinasScreen = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formNombre, setFormNombre] = useState("");
  const [editId, setEditId] = useState(null); 

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
        //console.log("Rutinas obtenidas:", data.lista);
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

  // ================================
  //       CREAR RUTINA
  // ================================
  const crearRutina = async () => {
    const token = await AsyncStorage.getItem("access_token");

    if (!formNombre) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: formNombre }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Éxito", "Rutina creada correctamente");
        setModalVisible(false);
        obtenerRutinas();
      } else {
        Alert.alert("Error", data.error || "No se pudo crear la rutina");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  // ================================
  //       EDITAR RUTINA
  // ================================
  const actualizarRutina = async () => {
    const token = await AsyncStorage.getItem("access_token");
  

    
    if (!formNombre) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/actualizar/${editId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: formNombre }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Éxito", "Rutina actualizada correctamente");
        setModalVisible(false);
        obtenerRutinas();
      } else {
        Alert.alert("Error", data.error || "No se pudo actualizar la rutina");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  // ================================
  //       ELIMINAR RUTINA
  // ================================
  const eliminarRutina = async (id) => {
    const token = await AsyncStorage.getItem("access_token");
    

    try {
      const res = await fetch(`${API_URL}/eliminar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Éxito", "Rutina eliminada");
        obtenerRutinas();
      } else {
        Alert.alert("Error", data.error || "No se pudo eliminar la rutina");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  // ================================
  //   ABRIR MODAL EN MODO EDICIÓN
  // ================================
  const abrirEditar = (item) => {
    setEditMode(true);
    setEditId(item[4]);      
    setFormNombre(item[1]);  
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Rutinas</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditMode(false);
          setFormNombre("");
          setEditId(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addText}>+ Agregar Rutina</Text>
      </TouchableOpacity>

      <FlatList
        data={rutinas}
        refreshing={loading}
        onRefresh={obtenerRutinas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item[1]}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => abrirEditar(item)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => eliminarRutina(item[4])}
              >
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL */}
      <Modal animationType="slide" visible={modalVisible} transparent>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {editMode ? "Editar Rutina" : "Nueva Rutina"}
          </Text>

          <TextInput
            placeholder="Nombre de la rutina"
            style={styles.input}
            value={formNombre}
            onChangeText={setFormNombre}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={editMode ? actualizarRutina : crearRutina}
          >
            <Text style={styles.btnText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default RutinasScreen;

// ======================
//        ESTILOS
// ======================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#2e2d2dff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#ffffff" },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  addText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  item: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  buttons: { flexDirection: "row", marginTop: 10 },
  editBtn: {
    backgroundColor: "#91c5f0ff",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  delBtn: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },

  modalView: {
    marginTop: 100,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#777",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
});
