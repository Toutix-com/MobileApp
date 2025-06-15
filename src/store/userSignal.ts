import { signal } from '@preact/signals-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userSignal = signal<{ email?: string; mobileNumber?: string; isNewUser?: boolean; role?: string }>({});

const USER_STORE_KEY = 'userSignalStore';

// Load persisted store on module load
AsyncStorage.getItem(USER_STORE_KEY).then((json) => {
  if (json) {
    try {
      userSignal.value = JSON.parse(json);
    } catch {}
  }
});

// Persist store on every change
userSignal.subscribe((value) => {
  AsyncStorage.setItem(USER_STORE_KEY, JSON.stringify(value));
});

export const setUserEmail = (email: string) => {
  userSignal.value = { ...userSignal.value, email, mobileNumber: undefined };
};

export const setUserMobile = (mobileNumber: string) => {
  userSignal.value = { ...userSignal.value, mobileNumber, email: undefined };
};

export const setUserIsNewUser = (isNewUser: boolean) => {
  userSignal.value = { ...userSignal.value, isNewUser };
};

export const setUserRole = (role: string) => {
  userSignal.value = { ...userSignal.value, role };
}; 