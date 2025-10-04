
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert, 
  Platform,
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ScanScreen() {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    console.log('Scan screen mounted');
    return () => {
      console.log('Scan screen unmounted');
    };
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    if (!isScanning || isAnalyzing) return;
    
    console.log('Barcode scanned:', { type, data });
    setIsScanning(false);
    setScannedData(data);
    setIsAnalyzing(true);
    
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate API call to check banned substances
    setTimeout(() => {
      analyzeProduct(data);
    }, 2000);
  };

  const analyzeProduct = (barcode: string) => {
    console.log('Analyzing product with barcode:', barcode);
    
    // Mock analysis - in real app, this would call a backend API
    const mockResults = [
      {
        barcode: '123456789',
        productName: 'Energy Drink X',
        status: 'warning',
        message: 'Contains caffeine above competition limits',
        substances: ['Caffeine (180mg)'],
      },
      {
        barcode: '987654321',
        productName: 'Protein Bar Y',
        status: 'safe',
        message: 'No banned substances detected',
        substances: [],
      },
      {
        barcode: '456789123',
        productName: 'Pre-Workout Z',
        status: 'banned',
        message: 'Contains prohibited stimulants',
        substances: ['DMAA', 'Synephrine'],
      }
    ];

    // Use first result as default, or find matching barcode
    const result = mockResults.find(r => r.barcode === barcode) || mockResults[1];
    
    setIsAnalyzing(false);
    
    // Navigate to results screen with the analysis
    router.push({
      pathname: '/scan-result',
      params: {
        barcode,
        productName: result.productName,
        status: result.status,
        message: result.message,
        substances: JSON.stringify(result.substances),
      }
    });
  };

  const resetScan = () => {
    console.log('Resetting scan');
    setIsScanning(true);
    setScannedData(null);
    setIsAnalyzing(false);
  };

  const handleClose = () => {
    console.log('Closing scan screen');
    router.back();
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.permissionContainer}>
          <IconSymbol name="camera.fill" size={64} color={theme.colors.primary} />
          <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
            Camera Permission Required
          </Text>
          <Text style={[styles.permissionText, { color: theme.dark ? '#98989D' : '#666' }]}>
            We need access to your camera to scan product barcodes and check for banned substances.
          </Text>
          <Pressable
            style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        }}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top Bar */}
          <SafeAreaView style={styles.topBar} edges={['top']}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <GlassView style={styles.glassButton} glassEffectStyle="regular">
                <IconSymbol name="xmark" size={20} color="white" />
              </GlassView>
            </Pressable>
            <Text style={styles.titleText}>Scan Product</Text>
            <View style={styles.placeholder} />
          </SafeAreaView>

          {/* Scanning Frame */}
          <View style={styles.scanningArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {isAnalyzing && (
                <View style={styles.analyzingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.analyzingText}>Analyzing...</Text>
                </View>
              )}
            </View>
          </View>

          {/* Bottom Instructions */}
          <View style={styles.bottomArea}>
            <GlassView style={styles.instructionCard} glassEffectStyle="regular">
              <IconSymbol name="viewfinder" size={24} color="white" />
              <Text style={styles.instructionText}>
                {isAnalyzing 
                  ? 'Checking for banned substances...' 
                  : 'Position the barcode within the frame'
                }
              </Text>
            </GlassView>
            
            {scannedData && !isAnalyzing && (
              <Pressable style={styles.rescanButton} onPress={resetScan}>
                <GlassView style={styles.glassButton} glassEffectStyle="regular">
                  <IconSymbol name="arrow.clockwise" size={20} color="white" />
                  <Text style={styles.rescanText}>Scan Again</Text>
                </GlassView>
              </Pressable>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 44,
    height: 44,
  },
  glassButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 44,
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  scanFrame: {
    width: screenWidth - 80,
    height: (screenWidth - 80) * 0.6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  analyzingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    textAlign: 'center',
  },
  rescanButton: {
    marginTop: 8,
  },
  rescanText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
