import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/header';


export default function LibraryScreen() {
  const [storedData, setStoredData] = useState('');

  useEffect(() => {
    // Função para carregar os dados
    const loadData = async () => {
      try {
        const plsData = await AsyncStorage.getItem('PLS'); // Obter o valor salvo
        if (plsData !== null) {
          // Converter a string de volta para objeto
          const plsResults = JSON.parse(plsData); // Aqui você obtém o objeto novamente
          setStoredData(JSON.stringify(plsResults)); // Armazenar os dados no estado
        } else {
          setStoredData('Nenhum dado encontrado.'); // Caso não encontre dados
        }
      } catch (error) {
        console.error('Erro ao recuperar dados:', error);
        setStoredData('Erro ao carregar dados.');
      }
    };
    loadData(); // Chama a função para carregar os dados quando o componente monta
  }, []); // O array vazio garante que a função seja chamada apenas uma vez, quando o componente for montado

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem('PLS'); // Remove os dados salvos com a chave 'PLS'
      setStoredData('Nenhum dado encontrado.'); // Atualiza o estado para refletir que os dados foram apagados
      alert('Dados excluídos com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
      alert('Erro ao excluir dados.');
    }
  };

  // Estilos
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      paddingHorizontal: 20,
    },
    questionContainer: {
      width: 300,
      marginBottom: 20,
      marginTop: 40,
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 10,
      elevation: 9,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    questionText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center',
      fontStyle: 'italic',
      paddingBottom: 30,
      paddingTop: 8,
    },
    data: {
      fontSize: 16,
      color: '#333333',
      textAlign: 'center',
    }
  });

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Library</Text>

        {storedData && storedData !== 'Nenhum dado encontrado.' ? (
          <View>
            <Text style={styles.data}>Dados Salvos: {storedData}</Text>
            <Button title="Utilizar curva de calibração" onPress={() => { alert("Ainda em desenvolvimento! Mas é basicamente uma tela onde a pessoa adiciona um espectro e é utilizado a curva de calibração do tensorFlowJs para estipular a nova concentração de corante") }} />
              <Text></Text>
          </View>
        ) : (
          <Text style={styles.data}>Carregando dados...</Text>
        )}

        <Button title="Limpar Dados" onPress={clearData} />
      </View>
    </View>
  );
}
