import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { submitAttendance } from '../api/attendance';
import { logout } from '../api/auth';

type RootStackParamList = {
  Login: undefined;
  Scanner: undefined;
};

type ScannerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;

const { width } = Dimensions.get('window');
const SCAN_BOX_SIZE = width * 0.7;

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const navigation = useNavigation<ScannerScreenNavigationProp>();
  
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [laserAnim]);

  const translateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, SCAN_BOX_SIZE - 12],
  });

  // Prevent back button from going back to login screen easily
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Scanner Absensi',
      headerStyle: {
        backgroundColor: '#10B981',
      },
      headerTintColor: '#FFF',
      headerLeft: () => null, // Hide back button
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setIsFlashOn(prev => !prev);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya, Keluar', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          }
        },
      ]
    );
  };

  const handleBarcodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (isScanning || isProcessing) return;
    
    setIsScanning(true);
    setIsProcessing(true);

    try {
      // Parse QR format: NISN|FullName|ClassName
      const parts = data.split('|');
      if (parts.length !== 3) {
        Alert.alert('Gagal', 'Format QR Code tidak valid.');
        return;
      }
      
      const [nisn, fullName, className] = parts;

      // API call to submit attendance
      const response = await submitAttendance(nisn);
      
      if (response.success) {
        Alert.alert('Berhasil Absen!', `Siswa: ${fullName} dari kelas ${className} telah tercatat.`);
      } else {
        Alert.alert('Gagal', response.message || 'Gagal memproses QR Code');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Terjadi kesalahan jaringan.';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsProcessing(false);
      // Wait 2 seconds before allowing the next scan
      setTimeout(() => {
        setIsScanning(false);
      }, 2000);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color="#9CA3AF" style={{ marginBottom: 16 }} />
        <Text style={styles.textMessage}>Kami membutuhkan izin untuk menggunakan kamera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        facing={facing}
        enableTorch={isFlashOn}
        onBarcodeScanned={isScanning ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBoxContainer}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Animated.View style={[styles.laser, { transform: [{ translateY }] }]} />
        </View>
        
        <Text style={styles.scanText}>
          Arahkan QR Code siswa ke dalam kotak
        </Text>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Ionicons name={isFlashOn ? "flash" : "flash-off"} size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
        
        {isProcessing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Memproses...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#121212',
  },
  textMessage: {
    textAlign: 'center',
    color: '#E4E4E7',
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    padding: 8,
    marginRight: 8,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBoxContainer: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FBBF24',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  laser: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#FBBF24',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 4,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 32,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 32,
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 50,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(31, 41, 55, 0.9)', // Gray 800
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  loadingText: {
    color: '#FFF',
    marginLeft: 12,
    fontWeight: '600',
  }
});
