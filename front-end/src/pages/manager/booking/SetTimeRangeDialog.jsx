import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const SetTimeRangeDialog = ({ open, onClose, onSave }) => {
  const [timeRange, setTimeRange] = useState(() => {
    const savedTimeRange = localStorage.getItem('timeRange');
    return savedTimeRange ? Number(savedTimeRange) : 60; // Default to 60 minutes
  });

  const handleChangeTime = (e) => {
    if (e.target.value < 0) {
      alert("Thời gian không thể âm!")
    } else {
      setTimeRange(e.target.value)
    }
  }

  const handleSave = () => {
    localStorage.setItem('timeRange', timeRange);
    onSave(timeRange);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đặt Khoảng Thời Gian</DialogTitle>
      <DialogContent>
        <TextField
          label="Khoảng thời gian (phút)"
          type="number"
          value={timeRange}
          onChange={(e) => handleChangeTime(e)}
          fullWidth
          InputProps={{ inputProps: { min: 1 } }} // Ensure no negative values
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Hủy</Button>
        <Button onClick={handleSave} color="primary">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetTimeRangeDialog;
