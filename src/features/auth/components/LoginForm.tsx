import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { AuthUser, validateLogin } from '../../meals/services/auth';

interface LoginFormProps {
  onLoginSuccess: (user: AuthUser) => void;
  isDarkMode: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }

    const user = validateLogin(trimmedEmail, trimmedPass);

    if (!user) {
      setError('Email o password non corretti.');
      return;
    }

    setError('');
    onLoginSuccess(user);
  };

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      
      <View style={styles.headerContainer}>
        <Text style={[styles.title, themeStyles.text]}>Italian Meals</Text>
        <Text style={styles.subtitle}>Il gusto della semplicità</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Email"
          placeholderTextColor={isDarkMode ? '#8E8E93' : '#AEAEB2'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Password"
          placeholderTextColor={isDarkMode ? '#8E8E93' : '#AEAEB2'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Accedi</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', 
    paddingHorizontal: 28,
    paddingTop: 100,
    paddingBottom: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700', 
    letterSpacing: -0.8, 
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    marginBottom: 40,
  },
  input: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30', 
    fontSize: 13,
    marginHorizontal: 8,
    marginTop: 4,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF', 
    height: 54,
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#F2F2F7' }, 
  input: { backgroundColor: '#FFFFFF', color: '#000000' }, 
  text: { color: '#000000' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000000' }, 
  input: { backgroundColor: '#1C1C1E', color: '#FFFFFF' }, 
  text: { color: '#FFFFFF' },
});