import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import { AuthUser, validateLogin } from '../../meals/services/auth';

interface LoginFormProps {
  onLoginSuccess: (user: AuthUser) => void;
  isDarkMode: boolean;
}

const { width } = Dimensions.get('window');

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

  const currentTheme = isDarkMode 
    ? { background: '#0D0E12', card: '#161820', text: '#FFFFFF', inputBg: '#1F222F', border: '#2D3142', textMuted: '#9CA3AF' }
    : { background: '#F4F5F9', card: '#FFFFFF', text: '#111827', inputBg: '#F9FAFB', border: '#E5E7EB', textMuted: '#6B7280' };

  const styles = useMemo(() => 
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: currentTheme.background,
        justifyContent: 'center',
        paddingHorizontal: 24,
      },
      glowBackground: {
        position: 'absolute',
        top: -100,
        right: -50,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: (width * 0.8) / 2,
        backgroundColor: isDarkMode ? '#1E293B' : '#E0E7FF',
        opacity: isDarkMode ? 0.3 : 0.6,
      },
      card: {
        backgroundColor: currentTheme.card,
        borderRadius: 28,
        padding: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: isDarkMode ? 0.3 : 0.06,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: currentTheme.border,
      },
      headerContainer: {
        marginBottom: 32,
      },
      title: {
        fontSize: 32,
        fontWeight: '800',
        color: currentTheme.text,
        letterSpacing: -1,
      },
      subtitle: {
        fontSize: 15,
        color: currentTheme.textMuted,
        marginTop: 6,
        fontWeight: '400',
      },
      inputWrapper: {
        marginBottom: 16,
      },
      inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: currentTheme.text,
        marginBottom: 8,
        marginLeft: 4,
      },
      input: {
        height: 54,
        backgroundColor: currentTheme.inputBg,
        borderWidth: 1,
        borderColor: currentTheme.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: currentTheme.text,
      },
      errorText: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 8,
        marginLeft: 4,
      },
      button: {
        backgroundColor: isDarkMode ? '#FFFFFF' : '#111827',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
      },
      buttonText: {
        color: isDarkMode ? '#111827' : '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
      },
    }),
    [isDarkMode]
  );

  return (
    <View style={styles.container}>
      <View style={styles.glowBackground} />

      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} maxFontSizeMultiplier={1.2}>Italian Meals</Text>
          <Text style={styles.subtitle}>Il gusto della semplicità</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Indirizzo Email</Text>
          <TextInput
            style={styles.input}
            placeholder="mario.rossi@student.it"
            placeholderTextColor={isDarkMode ? '#4B5563' : '#9CA3AF'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={isDarkMode ? '#4B5563' : '#9CA3AF'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }
          ]} 
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Accedi</Text>
        </Pressable>
      </View>
    </View>
  );
};