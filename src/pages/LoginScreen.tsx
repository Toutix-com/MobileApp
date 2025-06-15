import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import GradientLayout from '../components/layouts/GradientLayout';
import GoogleIcon from '../assets/icons/google.svg';
import AppleIcon from '../assets/icons/apple.svg';
import GoogleSignInService from '../services/GoogleSignInService';
import { loginWithOtp } from '../services/ApiService';
import { rootStore, setUser } from '../store/rootStore';
type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignInService.init();
  }, []);

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await GoogleSignInService.signIn();
      if (result && result.email) {
        // Split name into first and last
        let firstName = '';
        let lastName = '';
        if (result.name) {
          const nameParts = result.name.trim().split(' ');
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        }
        // Save user data in store
        setUser({
          ...rootStore.value.user,
          email: result.email,
          firstName,
          lastName
        });
        // Call loginWithOtp API
        const response = await loginWithOtp({ email: result.email });
        if (response && response.ok) {
          navigation.navigate('OTPVerification', {
            email: result.email,
            type: 'email',
          });
        } else {
          Alert.alert('Error', response?.message || 'Failed to send OTP');
        }
      } else {
        Alert.alert('Error', 'Failed to sign in with Google');
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = (value: string) => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;
    if (emailRegex.test(value)) return { type: 'email', value };
    if (phoneRegex.test(value)) return { type: 'mobileNumber', value };
    return null;
  };

  const handleContinue = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email or mobile number');
      return;
    }
    const valid = validateInput(email.trim());
    if (!valid) {
      Alert.alert('Error', 'Please enter a valid email or mobile number');
      return;
    }
    setIsLoading(true);
    try {
      let response;
      if (valid.type === 'email') {
        setUser({ ...rootStore.value.user, email: valid.value, mobileNumber: undefined });
        response = await loginWithOtp({ email: valid.value });
      } else {
        setUser({ ...rootStore.value.user, mobileNumber: valid.value, email: undefined });
        response = await loginWithOtp({ mobileNumber: valid.value });
      }
      console.log("Response",response?.ok);
      
      if (response && response?.ok) {
        navigation.navigate('OTPVerification', {
          email: valid.type === 'email' ? valid.value : undefined,
          mobileNumber: valid.type === 'mobileNumber' ? valid.value : undefined,
          type: valid.type === 'email' ? 'email' : 'mobile',
        });
      } else {
        Alert.alert('Error', response?.message || 'Failed to send OTP');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientLayout>
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logos/toutix_logo_full.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Find It, Book It, Live It</Text>
      </View>


      <View style={styles.formContainer}>
        <Text style={styles.title}>Log in or sign up</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email or mobile</Text>
          <TextInput
            style={styles.input}
            placeholder="Email/ mobile number"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        <Text style={styles.description}>We'll send you a code to log in to your account</Text>
        

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && { opacity: 0.7 }]} 
          disabled={isLoading}
          onPress={handleContinue}
        >
          <Text style={styles.loginButtonText}>Continue</Text>
        </TouchableOpacity>


        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={[styles.socialButton, isLoading && { opacity: 0.7 }]} 
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <GoogleIcon width={20} height={20} />
            <Text style={styles.socialButtonText}>
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          
        </View>
        <View style={styles.socialButtonsContainer}>
        <TouchableOpacity 
            style={[styles.socialButton, isLoading && { opacity: 0.7 }]}
            disabled={isLoading}
          >
            <AppleIcon width={20} height={20} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
      </View>
      </View>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '300',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 120 : 120,
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.45,
    height: 35,
    tintColor: '#FFFFFF',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: 44,
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 24,
  },
  description:{
    fontSize: 14,
    fontWeight: '400',
    color: '#5C636E',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1E1B4B',
    borderColor: '#1E1B4B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000000',
  },
  loginButton: {
    backgroundColor: '#1E1B4B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop:'20%'
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#1E1B4B',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    color: '#6B7280',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor:'#0C0453',
    borderWidth:1,
    flex:1,
    marginHorizontal:3
  },
  socialButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 12,
  },
  socialTextWithIcon: {
    marginLeft: 12,
  },
  socialPrefix: {
    color: '#666666',
  },
});

export default LoginScreen; 