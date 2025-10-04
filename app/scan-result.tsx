
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView,
  Platform 
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';

type ScanStatus = 'safe' | 'warning' | 'banned';

interface StatusConfig {
  color: string;
  backgroundColor: string;
  icon: string;
  title: string;
}

const statusConfigs: Record<ScanStatus, StatusConfig> = {
  safe: {
    color: '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    icon: 'checkmark.circle.fill',
    title: 'Safe to Consume',
  },
  warning: {
    color: '#FF9500',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    icon: 'exclamationmark.triangle.fill',
    title: 'Use with Caution',
  },
  banned: {
    color: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    icon: 'xmark.circle.fill',
    title: 'Not Recommended',
  },
};

export default function ScanResultScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  
  const barcode = params.barcode as string;
  const productName = params.productName as string;
  const status = (params.status as ScanStatus) || 'safe';
  const message = params.message as string;
  const substances = params.substances ? JSON.parse(params.substances as string) : [];

  const config = statusConfigs[status];

  React.useEffect(() => {
    console.log('Scan result screen mounted with params:', params);
    
    // Haptic feedback based on result
    if (status === 'banned') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (status === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [status]);

  const handleScanAnother = () => {
    console.log('Scanning another product');
    router.replace('/scan');
  };

  const handleGoHome = () => {
    console.log('Going home');
    router.replace('/(tabs)/(home)/');
  };

  const handleSaveResult = () => {
    console.log('Saving scan result');
    // In a real app, this would save to local storage or backend
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderHeaderRight = () => (
    <Pressable onPress={handleSaveResult} style={styles.headerButton}>
      <IconSymbol name="bookmark" color={theme.colors.primary} size={20} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Scan Result',
          headerRight: renderHeaderRight,
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <GlassView 
          style={[
            styles.statusCard,
            { backgroundColor: config.backgroundColor },
            Platform.OS !== 'ios' && { backgroundColor: config.backgroundColor }
          ]} 
          glassEffectStyle="regular"
        >
          <View style={[styles.statusIcon, { backgroundColor: config.color }]}>
            <IconSymbol name={config.icon as any} color="white" size={32} />
          </View>
          <Text style={[styles.statusTitle, { color: config.color }]}>
            {config.title}
          </Text>
          <Text style={[styles.statusMessage, { color: theme.colors.text }]}>
            {message}
          </Text>
        </GlassView>

        {/* Product Info */}
        <GlassView 
          style={[
            styles.infoCard,
            Platform.OS !== 'ios' && { 
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }
          ]} 
          glassEffectStyle="regular"
        >
          <View style={styles.infoHeader}>
            <IconSymbol name="cube.box.fill" color={theme.colors.primary} size={24} />
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              Product Information
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
              Product Name:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {productName}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
              Barcode:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text, fontFamily: 'monospace' }]}>
              {barcode}
            </Text>
          </View>
        </GlassView>

        {/* Substances List */}
        {substances.length > 0 && (
          <GlassView 
            style={[
              styles.substancesCard,
              Platform.OS !== 'ios' && { 
                backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
              }
            ]} 
            glassEffectStyle="regular"
          >
            <View style={styles.substancesHeader}>
              <IconSymbol 
                name="exclamationmark.triangle.fill" 
                color={status === 'safe' ? '#34C759' : '#FF9500'} 
                size={24} 
              />
              <Text style={[styles.substancesTitle, { color: theme.colors.text }]}>
                {status === 'safe' ? 'Ingredients Checked' : 'Flagged Substances'}
              </Text>
            </View>
            
            {substances.map((substance: string, index: number) => (
              <View key={index} style={styles.substanceItem}>
                <View style={[
                  styles.substanceDot, 
                  { backgroundColor: status === 'safe' ? '#34C759' : '#FF9500' }
                ]} />
                <Text style={[styles.substanceText, { color: theme.colors.text }]}>
                  {substance}
                </Text>
              </View>
            ))}
          </GlassView>
        )}

        {/* Recommendations */}
        <GlassView 
          style={[
            styles.recommendationsCard,
            Platform.OS !== 'ios' && { 
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }
          ]} 
          glassEffectStyle="regular"
        >
          <View style={styles.recommendationsHeader}>
            <IconSymbol name="lightbulb.fill" color="#007AFF" size={24} />
            <Text style={[styles.recommendationsTitle, { color: theme.colors.text }]}>
              Recommendations
            </Text>
          </View>
          
          {status === 'safe' && (
            <Text style={[styles.recommendationText, { color: theme.dark ? '#98989D' : '#666' }]}>
              • This product appears safe for competitive athletes{'\n'}
              • Always check with your sports organization for specific rules{'\n'}
              • Consider timing of consumption before competition
            </Text>
          )}
          
          {status === 'warning' && (
            <Text style={[styles.recommendationText, { color: theme.dark ? '#98989D' : '#666' }]}>
              • Check competition-specific limits for flagged substances{'\n'}
              • Consider alternative products without these ingredients{'\n'}
              • Consult with your sports nutritionist or medical team{'\n'}
              • Avoid consumption close to competition dates
            </Text>
          )}
          
          {status === 'banned' && (
            <Text style={[styles.recommendationText, { color: theme.dark ? '#98989D' : '#666' }]}>
              • Do not consume this product if you are subject to drug testing{'\n'}
              • Look for alternative products without prohibited substances{'\n'}
              • Consult the current WADA prohibited list{'\n'}
              • Seek advice from qualified sports medicine professionals
            </Text>
          )}
        </GlassView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.secondaryButton, { borderColor: theme.colors.primary }]} 
            onPress={handleScanAnother}
          >
            <IconSymbol name="camera.fill" color={theme.colors.primary} size={20} />
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
              Scan Another
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleGoHome}
          >
            <IconSymbol name="house.fill" color="white" size={20} />
            <Text style={styles.primaryButtonText}>
              Go Home
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  statusCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '400',
    flex: 2,
    textAlign: 'right',
  },
  substancesCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  substancesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  substancesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  substanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  substanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  substanceText: {
    fontSize: 14,
    flex: 1,
  },
  recommendationsCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
