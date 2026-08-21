import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import { People, CheckCircle, Warning, Schedule } from '@mui/icons-material';
import { useAuthStore } from '../../store/auth.store';
import { useAttendanceStore } from '../../store/attendance.store';
import { apiClient } from '../../api/axios.config';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { todayAttendance } = useAttendanceStore();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Present Today',
      value: stats.presentToday || 0,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Late Today',
      value: stats.lateToday || 0,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'User'} 👋
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  {stat.title}
                </Typography>
                <Typography variant="h4">{stat.value}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                {stat.icon}
              </Avatar>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Today's Status
        </Typography>
        {todayAttendance ? (
          <Box>
            <Chip
              label={`Checked In at ${new Date(todayAttendance.checkInTime).toLocaleTimeString()}`}
              color="success"
              sx={{ mr: 1 }}
            />
            <Chip
              label={`Status: ${todayAttendance.status}`}
              color={todayAttendance.status === 'LATE' ? 'warning' : 'info'}
            />
          </Box>
        ) : (
          <Typography color="textSecondary">Not checked in yet today</Typography>
        )}
      </Card>
    </Box>
  );
};