import React, { useMemo, useState } from 'react';
import { View, Text, Image, Pressable, Switch, StyleSheet } from 'react-native';

interface UserHeaderProps {
  username: string;
  avatarUrl?: string;
  isDarkMode: boolean;
  onToggleTheme: (value: boolean) => void;
  onLogout: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username,
  avatarUrl,
  isDarkMode,
  onToggleTheme,
  onLogout,
}) => {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const avatarUri = avatarUrl || `https://picsum.photos/seed/${username}/64`;

  const currentTheme = isDarkMode 
    ? { background: "#000000", text: "#FFFFFF", border: "#1C1C1E", muted: "#8E8E93", card: "#1C1C1E" }
    : { background: "#F2F2F7", text: "#000000", border: "#E5E5EA", muted: "#8E8E93", card: "#FFFFFF" };

  const styles = useMemo(() => 
    StyleSheet.create({
      headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.border,
        backgroundColor: currentTheme.background,
      },
      userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      avatarWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: currentTheme.border,
        backgroundColor: currentTheme.card,
      },
      avatarImage: {
        width: '100%',
        height: '100%',
      },
      fallbackText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: currentTheme.text,
      },
      textContainer: {
        flexDirection: 'column',
      },
      welcomeText: {
        fontSize: 12,
        color: currentTheme.muted,
      },
      usernameText: {
        fontSize: 16,
        fontWeight: '600',
        color: currentTheme.text,
      },
      rightControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
      },
      switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      switchLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: currentTheme.text,
      },
      logoutBtn: {
        paddingVertical: 7,
        paddingHorizontal: 16,
        borderRadius: 24, 
        borderWidth: 0,
        backgroundColor: isDarkMode ? '#FFFFFF' : '#ff0000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
      logoutText: {
        fontSize: 12,
        fontWeight: '700', 
        color: isDarkMode ? '#ff0000' : '#FFFFFF',
        letterSpacing: 0.3,
      },
    }), 
    [isDarkMode]
  );

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfoRow}>
        <View style={styles.avatarWrap}>
          {avatarFailed ? (
            <Text style={styles.fallbackText}>
              {username ? username.charAt(0).toUpperCase() : '?'}
            </Text>
          ) : (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
              onError={() => setAvatarFailed(true)}
            />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Bentornato,</Text>
          <Text style={styles.usernameText} maxFontSizeMultiplier={1.4}>
            {username}
          </Text>
        </View>
      </View>

      <View style={styles.rightControls}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Dark</Text>
          <Switch
            accessibilityLabel="Attiva o disattiva tema scuro"
            value={isDarkMode}
            onValueChange={onToggleTheme}
            trackColor={{ false: "#767577", true: "#fefffe" }}
            thumbColor={isDarkMode ? "#FFFFFF" : "#F4F3F4"}
          />
        </View>
        
        <Pressable 
          accessibilityRole="button"
          accessibilityLabel="Esegui il logout"
          style={({ pressed }) => [
    styles.logoutBtn,
    pressed && { opacity: 0.5, transform: [{ scale: 0.97 }] } 
  ]} 
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};