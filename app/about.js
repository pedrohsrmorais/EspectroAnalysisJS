import React from "react";
import { Text, View, StyleSheet } from "react-native";

//componentes
import Header from '../components/header';


export default function AboutScreen() {


  //Styles--
  //////////STYLES --
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
    }
  });


  return (
    <View style={styles.container}>
      <Header />
 
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}> Esse aplicativo foi desenvolvido como parte da conclusão de curso TCC bla bla bla</Text>
      </View>

    </View>
  );
}
