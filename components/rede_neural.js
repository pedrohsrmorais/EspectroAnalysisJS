import React, { useEffect } from "react";
import { View, Text } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

const TrainModel = ({ paramX, paramY }) => {
  useEffect(() => {
    async function runModel(Xdata, Ydata) {
      await tf.ready(); // Garante que o TensorFlow.js esteja inicializado

      // Dados X e Y fornecidos
      const X = tf.tensor2d(Xdata);
      const Y = tf.tensor2d(Ydata);

      // 1. Definir o modelo de rede neural
      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [1], units: 10, activation: "relu" }));
      model.add(tf.layers.dense({ units: 1 })); // Camada de saída

      // 2. Compilar o modelo
      model.compile({
        optimizer: tf.train.adam(0.01),
        loss: "meanSquaredError",
        metrics: ["mse"],
      });

      console.log("Modelo criado. Treinando...");

      // 3. Treinar o modelo
      await model.fit(X, Y, {
        epochs: 10,
        batchSize: 1,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
          },
        },
      });

      console.log("Treinamento finalizado!");

      // 4. Fazer previsões com o modelo
      const testX = tf.tensor2d([[0.006]]);
      const prediction = model.predict(testX);
      prediction.print(); // Exibir previsão no console
    }

    if (paramX && paramY) {
      runModel(paramX, paramY);
    }
  }, [paramX, paramY]); // Executa sempre que paramX ou paramY mudar

  return (
    <View>
      <Text>Treinamento de Rede Neural com TensorFlow.js</Text>
    </View>
  );
};

export default TrainModel;
