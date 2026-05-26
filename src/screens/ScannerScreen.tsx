import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Dimensions
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
  const navigation = useNavigation<ScannerScreenNavigationProp>();

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
        style={styles.camera} 
        facing="back"
        onBarcodeScanned={isScanning ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanBox} />
          <Text style={styles.scanText}>
            Arahkan QR Code siswa ke dalam kotak
          </Text>
          
          {isProcessing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Memproses...</Text>
            </View>
          )}
        </View>
      </CameraView>
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
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 32,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 24,
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
