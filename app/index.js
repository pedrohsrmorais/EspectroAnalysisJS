import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';



//exports from components
import Header from '../components/header';
import ClickableIcon from '../components/icon';


export default function App() {



  const icons = [
    { iconName: 'question', label: 'Tutorial', onPress: () => router.push('/tutorial') },
    { iconName: 'checklist', label: 'Analysis', onPress: () => router.push('/analysis') },
    { iconName: 'book', label: 'Library', onPress: () => router.push('/library') },
    { iconName: 'people', label: 'About', onPress: () => router.push('/about') },
  ];

  //////////STYLES
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      paddingHorizontal: 20,
    },
    iconsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    icon: {
      alignItems: 'center',
      marginBottom: 60,
      width: '40%', // Ajuste a largura para ocupar aproximadamente metade da largura do contêiner
    },


  });


  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.iconsContainer}>
        {icons.map((icon, index) => (
          <View style={styles.icon} key={index}>
            <ClickableIcon {...icon} />
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
