import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';

import { currentTheme } from '../store';

export function HomeScreen(): React.JSX.Element {
  const isDarkMode = currentTheme.value === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/logos/toutix_logo_full.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>
          App initialization is done (Home page)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '400',
  },
}); 