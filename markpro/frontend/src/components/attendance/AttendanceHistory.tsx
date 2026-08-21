import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TablePagination,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility,
  Download,
  Print,
} from '@mui/icons-material';
import { useAttendanceStore } from '../../store/attendance.store';
import { attendanceApi } from '../../api/attendance.api';
import { Attendance } from '../../types/attendance.types';

export const AttendanceHistory: React.FC = () => {
  const { history, setHistory, isLoading, setLoading, error, setError } =
    useAttendanceStore();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({
    status: 'ALL',
    type: 'ALL',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchHistory();
  }, [page, rowsPerPage, filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getHistory(
        page + 1,
        rowsPerPage,
        filter.startDate || undefined,
        filter.endDate || undefined
      );

      if (response.success && response.data) {
        setHistory(response.data.items);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Failed to fetch history');
      }
    } catch (error) {
      setError('An error occurred while fetching history');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'success';
      case 'LATE':
        return 'warning';
      case 'ABSENT':
        return 'error';
      case 'HALF_DAY':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (id: string) => {
    // Navigate to attendance details or show dialog
    console.log('View details for:', id);
  };

  const handleDownloadReport = () => {
    // Download report logic
    console.log('Download report');
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (isLoading && history.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Attendance History
        </Typography>
        <Box>
          <IconButton onClick={handleDownloadReport} title="Download Report">
            <Download />
          </IconButton>
          <IconButton onClick={handlePrintReport} title="Print Report">
            <Print />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 220px' }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={filter.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PRESENT">Present</MenuItem>
              <MenuItem value="LATE">Late</MenuItem>
              <MenuItem value="ABSENT">Absent</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ flex: '1 1 220px' }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Type"
              value={filter.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              <MenuItem value="CHECK_IN">Check-in</MenuItem>
              <MenuItem value="CHECK_OUT">Check-out</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ flex: '1 1 220px' }}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={filter.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
          <Box sx={{ flex: '1 1 220px' }}>
            <TextField
              fullWidth
              size="small"
              label="End Date"
              type="date"
              value={filter.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </Box>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Check-in Time</TableCell>
                <TableCell>Check-out Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Overtime</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      No attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((record: Attendance) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.type === 'CHECK_IN' ? 'Check-in' : 'Check-out'}
                        color={record.type === 'CHECK_IN' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {record.checkInTime ? formatTime(record.checkInTime) : '-'}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime ? formatTime(record.checkOutTime) : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(record.status)}
                        color={getStatusColor(record.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {record.overtime ? `${record.overtime}h` : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(record.id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
};