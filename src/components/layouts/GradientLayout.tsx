import React from 'react';
import { StyleSheet, StatusBar, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GradientLayout: React.FC<GradientLayoutProps> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={['#1E3A8A', '#134E4A']}
      start={{ x: 0, y: 0.2 }}
      end={{ x: 1, y: 0.2 }}
      style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientLayout; 