import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import Header from '../components/header';

export default function App() {
  const [plsResult, setPlsResult] = useState(null);
  const [isTfReady, setIsTfReady] = useState(false);

  // Inicializando o TensorFlow.js
  useEffect(() => {
    const initTensorFlow = async () => {
      try {
        await tf.ready(); // Certificando-se de que o TensorFlow.js foi carregado
        console.log("TensorFlow.js está pronto!");
        setIsTfReady(true); // Marcar o TensorFlow.js como pronto
      } catch (error) {
        console.error("Erro ao inicializar o TensorFlow.js:", error);
      }
    };
    initTensorFlow();
  }, []);

  const performPLS = async () => {
    if (!isTfReady) {
      console.log("TensorFlow.js não está pronto.");
      return;
    }

    // Dados de exemplo X (previsores) e Y (resposta)
    const X = [
      [0.5, 1.1],
      [0.8, 2.2],
      [1.2, 3.3],
      [1.5, 4.4],
      [2.0, 5.5],
      [2.5, 6.6],
      [3.0, 7.7],
      [3.5, 8.8],
      [4.0, 9.9],
      [4.5, 10.0]
    ];

    const Y = [
      [1.1],
      [2.2],
      [3.3],
      [4.4],
      [5.5],
      [6.6],
      [7.7],
      [8.8],
      [9.9],
      [11.0]
    ];

    // Transformando os dados em tensores
    const XTensor = tf.tensor2d(X);
    const YTensor = tf.tensor2d(Y);

    // Construindo o modelo de regressão linear com TensorFlow.js
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [X[0].length] }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // Treinando o modelo
    await model.fit(XTensor, YTensor, { epochs: 100 });

    // Realizando previsões
    const predictions = model.predict(XTensor);

    // Convertendo os resultados para arrays para exibição
    const coeffs = model.getWeights().map(weight => weight.arraySync());
    const preds = predictions.arraySync();

    // Salvando os resultados no estado
    setPlsResult({
      coefficients: coeffs,
      predictions: preds,
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <Button
        title={isTfReady ? "Executar Regressão Linear" : "Aguardando TensorFlow.js"}
        onPress={performPLS}
        disabled={!isTfReady}
      />
      {plsResult && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.title}>Coeficientes do Modelo:</Text>
          <Text>{JSON.stringify(plsResult.coefficients, null, 2)}</Text>
          <Text style={styles.title}>Previsões:</Text>
          <Text>{JSON.stringify(plsResult.predictions, null, 2)}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
