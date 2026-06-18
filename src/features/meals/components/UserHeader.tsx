import React from 'react';
import { View, Text, Image, Switch, Pressable, StyleSheet } from 'react-native';

interface UserHeaderProps {
  username: string;
  isDarkMode: boolean;
  onToggleTheme: (value: boolean) => void;
  onLogout: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username,
  isDarkMode,
  onToggleTheme,
  onLogout,
}) => {
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.headerContainer, themeStyles.header]}>
      <Pressable 
        style={({ pressed }) => [
          styles.userInfo,
          pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
        ]}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.welcomeText}>Ciao,</Text>
          <Text style={[styles.usernameText, themeStyles.text]}>{username}</Text>
        </View>
      </Pressable>
      
      <View style={styles.controls}>
        <View style={styles.switchRow}>
          <Switch 
            value={isDarkMode} 
            onValueChange={onToggleTheme} 
            trackColor={{ false: '#AEAEB2', true: '#007AFF' }}
            thumbColor={'#FFFFFF'}
          />
        </View>
        <Pressable 
          onPress={onLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            isDarkMode ? darkStyles.logoutBtn : lightStyles.logoutBtn,
            pressed && { opacity: 0.4, transform: [{ scale: 0.92 }] }
          ]}
        >
          <Text style={styles.logoutText}>Esci</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

const lightStyles = StyleSheet.create({
  header: { backgroundColor: '#F2F2F7' },
  text: { color: '#000000' },
  logoutBtn: { backgroundColor: '#FFE5E5' },
});

const darkStyles = StyleSheet.create({
  header: { backgroundColor: '#000000' },
  text: { color: '#FFFFFF' },
  logoutBtn: { backgroundColor: '#2C0E0E' },
});