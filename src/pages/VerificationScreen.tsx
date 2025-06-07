import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronLeft, Check, Mail, Smartphone } from 'lucide-react-native';
import { AuthStackParamList } from '../navigation/AuthStack';
import GradientLayout from '../components/layouts/GradientLayout';
import MailIcon from '../assets/icons/mail.svg';
import MobileIcon from '../assets/icons/mobile.svg';

type VerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Verification'>;

interface VerificationScreenProps {
  route: {
    params: {
      email: string;
      mobileNumber?: string;
    };
  };
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ route }) => {
  const navigation = useNavigation<VerificationScreenNavigationProp>();
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'mobile'>('email');
  const { email, mobileNumber } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendOTP = () => {
   
    navigation.navigate('OTPVerification', {
      email: verificationMethod === 'email' ? 'someone@email.com' : '353 678 6776',
      type: verificationMethod,
    });
  };

  return (
    <GradientLayout>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ChevronLeft color="#FFFFFF" size={24} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logos/toutix_logo_full.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Find It, Book It, Live It</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          We need to verify your email or mobile number. Please select preferred mode.
        </Text>

        <TouchableOpacity
          style={[
            styles.optionContainer,
            verificationMethod === 'email' && styles.selectedOption,
          ]}
          onPress={() => setVerificationMethod('email')}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionIcon}>
              <Mail width={32} height={32} strokeWidth={1} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Email</Text>
              <Text style={styles.optionDescription}>
                A code will be sent to your email
              </Text>
              <Text style={styles.optionDescription}>
              someone@email.com
              </Text>
            </View>
          </View>
          <View style={[
            styles.radioButton,
            verificationMethod === 'email' && styles.radioButtonSelected
          ]}>
            {verificationMethod === 'email' && (
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionContainer,
            verificationMethod === 'mobile' && styles.selectedOption,
          ]}
          onPress={() => setVerificationMethod('mobile')}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionIcon}>
              <Smartphone width={32} height={32} strokeWidth={1} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Mobile</Text>
              <Text style={styles.optionDescription}>
                A code will be sent to your mobile number
              </Text>
              <Text style={styles.optionDescription}>353 678 6776</Text>
            </View>
          </View>
          <View style={[
            styles.radioButton,
            verificationMethod === 'mobile' && styles.radioButtonSelected
          ]}>
            {verificationMethod === 'mobile' && (
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={handleSendOTP}>
          <Text style={styles.sendButtonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 100 : 70,
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 35,
    tintColor: '#FFFFFF',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 24,
  },
  optionContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#06053A',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 14,
    color: '#000000',
  },
  radioButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#06053A',
    borderColor: '#06053A',
  },
  sendButton: {
    backgroundColor: '#06053A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerificationScreen; 