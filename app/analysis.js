import React, { useState, useEffect } from "react";
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Button,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import PLS from "../components/pls";
import Header from '../components/header';


export default function AnalysisScreen() {


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


        async function setupBackend() {
            // Configura o backend nativo do React Native
            await tf.ready();
            console.log(`Backend ativo: ${tf.getBackend()}`);
        };

        setupBackend();

    }, []);

    const [isTfReady, setIsTfReady] = useState(false);
    const [numCorantes, setNumCorantes] = useState(0); // Para armazenar o número de corantes
    const [numEspectros, setNumEspectros] = useState(0); // Para armazenar o número de espectros
    const [atualEspectro, setAtualEspectro] = useState(0) // TESTE
    const [espectrosInputs, setEspectrosInputs] = useState(0); // Para gerar os inputs de espectros
    const [files, setFiles] = useState([]); // Para armazenar os arquivos carregados
    const [jsonData, setJsonData] = useState([]); // Para armazenar os dados convertidos
    const [absorptions, setAbsorptions] = useState([]); // Para absorções (X)
    const [concentrations, setConcentrations] = useState([]); // Para concentrações de corantes (Y)    
    const [plsResults, setPlsResults] = useState([]); // Para armazenar os resultados da PLS

    const resetValues = () => {
        setNumCorantes(0);
        setNumEspectros(0);
        setAtualEspectro(0);
        setEspectrosInputs(0);
        setFiles([]); // Limpar a lista de arquivos
        setJsonData([]); // Limpar os dados JSON
        setAbsorptions([]); // Limpar as absorções
        setConcentrations([]); // Limpar as concentrações
        setPlsResults([]); // Limpar os resultados da PLS
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/vnd.ms-excel", // Para arquivos .xls
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Para arquivos .xlsx
                ],
                copyToCacheDirectory: true,
            });

            // Adiciona o arquivo à lista de arquivos
            setFiles((prevFiles) => [...prevFiles, result]);


            const file = await fetch(result.assets[0].uri);
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Obtém a primeira planilha
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            // Converte a planilha para JSON
            const json = XLSX.utils.sheet_to_json(worksheet);

            // Armazena os dados no estado jsonData
            setJsonData(json);

            //pegando os valores de absorção

            const newAbsorptions = json.map(item => item[" Abs"].trim()).map(valor => parseFloat(valor.replace(",", ".")));
            const blockSize = newAbsorptions.length; // Define o blockSize igual ao tamanho de newAbsorptions

            // Agora, os valores de newAbsorptions serão divididos em blocos de tamanho blockSize
            const blockAbsorptions = [];
            for (let i = 0; i < newAbsorptions.length; i += blockSize) {
                blockAbsorptions.push(newAbsorptions.slice(i, i + blockSize));
            }

            setAbsorptions(prevAbsorptions => [...prevAbsorptions, ...blockAbsorptions]);



        } catch (error) {
            console.error("Erro ao selecionar o arquivo: ", error);
        }
    };
    // Detecta mudanças no numCorantes ou numEspectros
    useEffect(() => {
        handleInputsChange();  // Chama a função quando qualquer um dos valores mudar
    }, [numCorantes, numEspectros]); // Esse useEffect vai ser chamado toda vez que numCorantes ou numEspectros mudarem

    const handleInputsChange = () => {
        // Verifica se os valores de corantes e espectros são válidos
        if (numCorantes > 0 && numEspectros > 0) {
            setEspectrosInputs(parseInt(numEspectros, 10)); // Define a quantidade de espectros
        } else {
            setEspectrosInputs(0); // Se os valores forem inválidos, zera os inputs
        }
    };

    const handlePLS = () => {
        const X = absorptions

        const Y = concentrations
        if (X.some(row => row.includes(undefined)) || Y.some(row => row.includes(undefined))) {
            console.log("Dados com valores undefined encontrados!!!!");
        }

        function is2DArray(arr) {
            // Verifica se é um array e se cada elemento também é um array (indicando que é 2D)
            return Array.isArray(arr) && arr.every(row => Array.isArray(row));
        }
        if (is2DArray(X) && is2DArray(Y)) {
            // Verificando se X e Y têm o mesmo número de linhas
            if (X.length === Y.length) {
                console.log("X e Y são matrizes válidas com o mesmo número de linhas.");
            } else {
                console.log("X e Y não têm o mesmo número de linhas.");
            }
        } else {
            console.log("X e/ou Y não são matrizes bidimensionais.");
        }



        console.log("X (variaveis dependentes): ")
        console.log(X)

        console.log("Y: ")
        console.log(Y)



        function topNValues(matrix, N) {
            // Itera pelas linhas da matriz, ordena em ordem decrescente e retorna os N maiores
            return matrix.map(row =>
                row.sort((a, b) => b - a) // Ordena em ordem decrescente
                    .slice(0, N)           // Pega os N primeiros elementos
            );
        }

        let filteredX = topNValues(X, 10);


        console.log("Valores Filtrados de X ")
        console.log(filteredX);



        console.log("INDO PARA PLS")
        setPlsResults(PLS(filteredX, Y))
        console.log(PLS(filteredX, Y))




    };


    // Salvar dados
    const saveData = async () => {
        try {
            // Converter objeto para string
            const plsData = JSON.stringify(plsResults); // `plsResults` é o objeto com os dados
            await AsyncStorage.setItem('PLS', plsData); // Salvar a string
            console.log('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <Header style={styles.header} />

            <View style={styles.container2} >
                <Text style={styles.label}>Selecione o número de corantes para análise:</Text>
                <Picker
                    selectedValue={numCorantes}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        setNumCorantes(itemValue)
                        handleInputsChange()
                    }}
                >
                    <Picker.Item label="--Selecione uma opção--" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                </Picker>

                <Text style={styles.label}>Adicione o número de espectros feitos:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={numEspectros}
                    onChangeText={(text) => {
                        setNumEspectros(text);
                        handleInputsChange();
                    }}
                />


                <View style={styles.espectrosContainer}>

                    {Array.from({ length: espectrosInputs }, (_, spectrumIndex) => (
                        <View key={spectrumIndex} style={styles.espectroItem}>
                            <Text style={styles.espectroLabel}>Espectro {spectrumIndex + 1}</Text>
                            <Button title="Selecionar Arquivo" onPress={pickDocument} />

                            {Array.from({ length: numCorantes }, (_, coranteIndex) => (
                                <View key={coranteIndex} style={styles.coranteItem}>
                                    <Text style={styles.coranteLabel}>Concentração do corante {coranteIndex + 1}</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={concentrations[spectrumIndex]?.[coranteIndex] || ""}
                                        onChangeText={(text) => {
                                            const updatedConcentrations = [...concentrations];
                                            updatedConcentrations[spectrumIndex] = updatedConcentrations[spectrumIndex] || [];
                                            updatedConcentrations[spectrumIndex][coranteIndex] = parseFloat(text) || 0;
                                            setConcentrations(updatedConcentrations);
                                        }}
                                    />
                                </View>
                            ))}


                        </View>
                    ))}



                    <View>
                        <Button title="Realizar PLS" onPress={handlePLS} />



                    </View>
                    <Text></Text>
                    <View>
                        <Button title="Desfazer" onPress={resetValues} />
                    </View>

                    {plsResults &&
                        plsResults.scoresX &&
                        plsResults.scoresY &&
                        plsResults.scoresX.length > 0 &&
                        plsResults.scoresY.length > 0 &&
                        plsResults.scoresX[0].length > 0 &&
                        plsResults.scoresY[0].length > 0 ? (
                        <View>
                            <View>
                                <Text style={styles.data}>ScoresX: {JSON.stringify(plsResults.scoresX)}</Text>
                                <Text style={styles.data}>ScoresY: {JSON.stringify(plsResults.scoresY)}</Text>
                            </View>

                            <Button title="Salvar Calibração" onPress={saveData} />
                        </View>
                    ) : null}

                </View>



            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute', // Fixa o header no topo
        top: 0,

    },
    container: {
        padding: 20,
        marginTop: 0,
    },
    container2: {
        padding: 20,
        marginTop: 60,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: "100%",
        marginBottom: 20,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    espectrosContainer: {
        marginTop: 20,
    },
    espectroLabel: {
        fontSize: 16,
        paddingVertical: 5,
    },
    fileList: {
        marginTop: 20,
    },
    fileItem: {
        fontSize: 14,
        marginVertical: 5,
    },
    jsonContainer: {
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
