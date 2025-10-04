
import React from "react";
import { Stack, Link } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();

  const quickActions = [
    {
      title: "Scan Product",
      description: "Scan barcode or QR code to check for banned substances",
      route: "/scan",
      icon: "camera.fill",
      color: "#007AFF",
      primary: true,
    },
    {
      title: "Search Database",
      description: "Manually search for products and ingredients",
      route: "/search",
      icon: "magnifyingglass",
      color: "#34C759",
    },
    {
      title: "Recent Scans",
      description: "View your scanning history",
      route: "/history",
      icon: "clock.fill",
      color: "#FF9500",
    },
    {
      title: "WADA List",
      description: "Browse WADA prohibited substances",
      route: "/(tabs)/wada-list",
      icon: "exclamationmark.triangle.fill",
      color: "#FF3B30",
    }
  ];

  const renderHeaderRight = () => (
    <Link href="/profile" asChild>
      <Pressable style={styles.headerButtonContainer}>
        <IconSymbol name="person.circle" color={theme.colors.primary} size={24} />
      </Pressable>
    </Link>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => console.log("Settings pressed")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={theme.colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "AthleteCheck",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
              Stay Competition Ready
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
              Scan food and drinks to check for banned substances before consumption
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            {quickActions.map((action, index) => (
              <Link key={action.route} href={action.route as any} asChild>
                <Pressable>
                  <GlassView 
                    style={[
                      styles.actionCard,
                      action.primary && styles.primaryActionCard,
                      Platform.OS !== 'ios' && { 
                        backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
                      }
                    ]} 
                    glassEffectStyle="regular"
                  >
                    <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                      <IconSymbol name={action.icon as any} color="white" size={action.primary ? 32 : 24} />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={[
                        styles.actionTitle, 
                        { color: theme.colors.text },
                        action.primary && styles.primaryActionTitle
                      ]}>
                        {action.title}
                      </Text>
                      <Text style={[
                        styles.actionDescription, 
                        { color: theme.dark ? '#98989D' : '#666' }
                      ]}>
                        {action.description}
                      </Text>
                    </View>
                    <IconSymbol 
                      name="chevron.right" 
                      color={theme.dark ? '#98989D' : '#666'} 
                      size={16} 
                    />
                  </GlassView>
                </Pressable>
              </Link>
            ))}
          </View>

          {/* Safety Notice */}
          <GlassView 
            style={[
              styles.noticeCard,
              Platform.OS !== 'ios' && { 
                backgroundColor: theme.dark ? 'rgba(255,152,0,0.1)' : 'rgba(255,152,0,0.05)' 
              }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.noticeIcon}>
              <IconSymbol name="info.circle.fill" color="#FF9500" size={24} />
            </View>
            <View style={styles.noticeContent}>
              <Text style={[styles.noticeTitle, { color: theme.colors.text }]}>
                Important Notice
              </Text>
              <Text style={[styles.noticeText, { color: theme.dark ? '#98989D' : '#666' }]}>
                This app provides guidance based on WADA prohibited list. Always consult with your sports organization and medical professionals for official clearance.
              </Text>
            </View>
          </GlassView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  welcomeSection: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryActionCard: {
    padding: 24,
    marginBottom: 20,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  primaryActionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  headerButtonContainer: {
    padding: 6,
  },
  noticeCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noticeIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
