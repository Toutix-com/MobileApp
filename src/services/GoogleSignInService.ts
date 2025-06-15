import {
  GoogleSignin,
  statusCodes,
  type User,
} from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env';

export interface GoogleSignInResult {
  email: string;
  name: string | null;
  photo: string | null;
  idToken: string | null;
}

class GoogleSignInService {
  static init() {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  static async signIn(): Promise<GoogleSignInResult | null> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const userData = userInfo?.data;
      
      return userInfo ? {
        email: userData?.user?.email || '',
        name: userData?.user?.name || '',
        photo: userData?.user?.photo || '',
        idToken: userData?.idToken || '',
      } : null;
    } catch (error: any) {
      return null;
    }
  }

  static async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error: any) {
      
    }
  }

  static async getCurrentUser(): Promise<GoogleSignInResult | null> {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser ? {
        email: currentUser.user.email,
        name: currentUser.user.name,
        photo: currentUser.user.photo,
        idToken: currentUser.idToken,
      } : null;
    } catch (error) {
      
      return null;
    }
  }
}

export default GoogleSignInService; 