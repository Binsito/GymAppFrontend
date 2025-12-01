import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://dispmovilbackend.onrender.com/ejercicios"; 

const EjerciciosScreen = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", nombre_rutina: "" });


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
        // Transformar lista a objetos para mayor legibilidad
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
        // console.log(listaTransformada)
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

  const crearEjercicio = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!form.nombre || !form.descripcion || !form.nombre_rutina) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", "Ejercicio creado");
        setModalVisible(false);
        setForm({ nombre: "", descripcion: "", nombre_rutina: "" });
        obtenerEjercicios();
      } else {
        Alert.alert("Error", data.error || "No se pudo crear");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };


  const modificarEjercicio = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!form.nombre || !form.descripcion || !form.nombre_rutina) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    // console.log(form.nombre)
    // console.log(form.nombre_rutina)

    try {
      const res = await fetch(`${API_URL}/modificar/${editId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          nombre_rutina: form.nombre_rutina, 
        })
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", "Ejercicio actualizado");
        setModalVisible(false);
        setForm({ nombre: "", descripcion: "", nombre_rutina: "" });
        setEditMode(false);
        setEditId(null);
        obtenerEjercicios();
      } else {
        Alert.alert("Error", data.error || "No se pudo actualizar");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

 
  const eliminarEjercicio = async (id_ejercicio) => {
    const token = await AsyncStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_URL}/eliminar/${id_ejercicio}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", "Ejercicio eliminado");
        obtenerEjercicios();
      } else {
        Alert.alert("Error", data.error || "No se pudo eliminar");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };


  const abrirEditar = (item) => {
    setEditMode(true);
    setEditId(item.id_ejercicio);
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      nombre_rutina: item.nombre_rutina,
    });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Ejercicios</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditMode(false);
          setForm({ nombre: "", descripcion: "", nombre_rutina: "" });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addText}>+ Agregar Ejercicio</Text>
      </TouchableOpacity>

      <FlatList
        data={ejercicios}
        keyExtractor={(item) => item.id_ejercicio.toString()}
        refreshing={loading}
        onRefresh={obtenerEjercicios}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.nombre}</Text>
            <Text style={styles.itemDesc}>{item.descripcion}</Text>
            <Text style={styles.itemDesc}>{item.nombre_rutina}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.editBtn} onPress={() => abrirEditar(item)}>
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.delBtn} onPress={() => eliminarEjercicio(item.id_ejercicio)}>
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{editMode ? "Editar Ejercicio" : "Nuevo Ejercicio"}</Text>

          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={form.nombre}
            placeholderTextColor="black"
            onChangeText={(t) => setForm({ ...form, nombre: t })}
          />

          <TextInput
            placeholder="Descripción"
            style={styles.input}
            placeholderTextColor="black"
            value={form.descripcion}
            onChangeText={(t) => setForm({ ...form, descripcion: t })}
          />

          <TextInput
            placeholder="Nombre Rutina"
            style={styles.input}
            placeholderTextColor="black"
            value={form.nombre_rutina}
            onChangeText={(t) => setForm({ ...form, nombre_rutina: t })}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              if (editMode) modificarEjercicio();
              else crearEjercicio();
            }}
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

export default EjerciciosScreen;


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#2e2d2dff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20,color:"#ffff" },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20
  },
  addText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  item: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  itemTitle: { fontSize: 18, fontWeight: "bold",color:"#ffff" },
  itemDesc: { color: "#ffffffff", marginVertical: 5 },
  buttons: { flexDirection: "row", marginTop: 10 },
  editBtn: { backgroundColor: "#91c5f0ff", padding: 8, borderRadius: 8, marginRight: 10 },
  delBtn: { backgroundColor: "#E53935", padding: 8, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },

  modalView: {
    marginTop: 100,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  saveBtn: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 10, marginTop: 10 },
  cancelBtn: { backgroundColor: "#777", padding: 12, borderRadius: 10, marginTop: 10 }
});
