import * as tf from '@tensorflow/tfjs';

function PLS(X, Y) {

  try {
    // Converta X e Y para tensores do TensorFlow.js
    const tensorX = tf.tensor2d(X); // (2, 10)
    const tensorY = tf.tensor2d(Y); // (2, 1)

    // Defina o número de componentes principais
    const numComponents = Math.min(2, tensorX.shape[1]);

    // Calcular os componentes principais
    const [scoresX, scoresY] = calculatePLSComponents(tensorX, tensorY, numComponents);



    // Retornar os resultados como arrays
    return {
      scoresX: scoresX.arraySync(),
      scoresY: scoresY.arraySync()
    };

  } catch (error) {
    return alert("Insira dados válidos, por favorzinho")
  }
}

// Função para calcular os componentes principais usando PLS
function calculatePLSComponents(X, Y, numComponents) {
  // Calcular X'Y (produto entre X transposto e Y)
  const XTranspose = X.transpose(); // (10, 2)
  const XTY = XTranspose.matMul(Y); // (10, 1)

  // Calcular os scores de X
  const weights = XTY.div(XTY.norm()); // Normalizar os pesos
  const scoresX = X.matMul(weights); // (2, 1)

  // Calcular os scores de Y
  const scoresY = Y.matMul(weights.transpose()); // (2, 1)

  return [scoresX, scoresY];


}

export default PLS;
