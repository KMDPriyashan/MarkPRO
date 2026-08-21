import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  TextField,
} from '@mui/material';
import Webcam from 'react-webcam';
import { apiClient } from '../../api/axios.config';
import { useAuthStore } from '../../store/auth.store';
import { useAttendanceStore } from '../../store/attendance.store';

const OFFICE_LAT = 7.8731;
const OFFICE_LNG = 80.7718;
const RADIUS = 100;

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const CheckIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationValid, setLocationValid] = useState(false);
  const [note, setNote] = useState('');
  const webcamRef = useRef<Webcam>(null);
  const { user } = useAuthStore();
  const { setTodayAttendance } = useAttendanceStore();

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });
  };

  const handleCheckLocation = async () => {
    try {
      const position = await getLocation();
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });

      const distance = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
      const valid = distance <= RADIUS;
      setLocationValid(valid);

      if (!valid) {
        setError('You are outside the office geo-fence');
      } else {
        setError(null);
      }
    } catch (error) {
      setError('Failed to get location. Please enable GPS.');
    }
  };

  const handleCheckIn = async () => {
    if (!user) {
      setError('Please login first');
      return;
    }

    if (!location || !locationValid) {
      setError('Please verify your location first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const screenshot = webcamRef.current?.getScreenshot();

      const response = await apiClient.post('/attendance/check-in', {
        latitude: location.lat,
        longitude: location.lng,
        photoURL: screenshot,
        note,
      });

      if (response.data.success) {
        setSuccess(true);
        setTodayAttendance(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Check-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Check In
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 320px' }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Face Capture
            </Typography>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height={300}
              style={{ borderRadius: 8 }}
            />
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 320px' }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Location Verification
            </Typography>

            <Box sx={{ mb: 2 }}>
              {location ? (
                <>
                  <Typography variant="body2">
                    📍 Latitude: {location.lat.toFixed(6)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📍 Longitude: {location.lng.toFixed(6)}
                  </Typography>
                  {locationValid ? (
                    <Chip label="✅ Inside Geo-fence" color="success" />
                  ) : (
                    <Chip label="❌ Outside Geo-fence" color="error" />
                  )}
                </>
              ) : (
                <Typography color="textSecondary">
                  Click below to get your location
                </Typography>
              )}
            </Box>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleCheckLocation}
              sx={{ mb: 2 }}
            >
              Verify Location
            </Button>

            <TextField
              fullWidth
              label="Note (optional)"
              multiline
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckIn}
              disabled={!locationValid || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Check In'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ Check-in successful!
              </Alert>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};