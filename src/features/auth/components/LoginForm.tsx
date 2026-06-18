import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface LoginFormProps {
  onLoginSuccess: (username: string) => void;
  isDarkMode: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }
    if (trimmedPass.length < 4) {
      setError('La password deve contenere almeno 4 caratteri.');
      return;
    }

    setError('');
    onLoginSuccess(trimmedUser);
  };

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      
      {/* Intestazione minimalista e spostata verso l'alto */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, themeStyles.text]}>Italian Meals</Text>
        <Text style={styles.subtitle}>Il gusto della semplicità</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Nome Utente"
          placeholderTextColor={isDarkMode ? '#8E8E93' : '#AEAEB2'}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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

        {/* Pulsante in stile iOS (colore blu di sistema ed elegante) */}
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