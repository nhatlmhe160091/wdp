import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Checkbox,
} from '@mui/material';
import { Autocomplete } from '@mui/material';

import SetTimeRangeDialog from './SetTimeRangeDialog';
import BookingService from '../../../services/bookingService';
const AssignTableDialog = ({
  open,
  onClose,
  bookingTime,
  restaurantId,

  bookingData,
  fetchBookings
}) => {
  const [tables, setTables] = useState([]);
  const [timeRange, setTimeRange] = useState(localStorage.getItem('timeRange') || 60);
  const [selectedTables, setSelectedTables] = useState([]);
  const [isSetTimeRangeDialogOpen, setSetTimeRangeDialogOpen] = useState(false);

  const convertBookingTimeToISO = (bookingTime) => {
    const dateObj = new Date(bookingTime);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid bookingTime:", bookingTime);
      return null;
    }
    return dateObj.toISOString();
  };

  const formattedBookingTime = convertBookingTimeToISO(bookingTime);

  useEffect(() => {
    const fetchReservationsAndTableAvailable = async () => {
      if (open) {
        try {
          const data = await BookingService.getReservationsByBookingTime(

            formattedBookingTime,
            timeRange
          );
          // console.log("restaurantId", restaurantId);
          // console.log("data.availableTables", data.availableTables);
          const filteredTables = data.data.availableTables.filter(
            (table) => table.restaurant === restaurantId
          );
          const filteredTabled = bookingData?.reservation?.table;
          // console.log("filteredTables", filteredTables);
          // console.log("filteredTabled", filteredTabled);
          setSelectedTables(filteredTabled);

          setTables(filteredTables);
        } catch (error) {
          setTables([]);
          alert(error?.message);
        }
      }
    };

    fetchReservationsAndTableAvailable();
  }, [open, restaurantId, timeRange, formattedBookingTime]);

  const saveTableAssignment = async () => {
    try {
      const tableIds = selectedTables.map(table => table._id);
      const reservationData = {
        table: tableIds,
        status: 'RESERVED'
      };
      await BookingService.updateReservation(bookingData?._id, reservationData);
      alert('Update table for booking successfully!');
      // setSelectedTables([]);
      fetchBookings();
      onClose();
    } catch (error) {
     alert(error?.message);
    }
  };

  const handleSetTimeRange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    localStorage.setItem('timeRange', newTimeRange);
  };
  return (
    <>
      <Dialog
        open={open} onClose={onClose}>
        <DialogTitle>XẾP BÀN</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            Khoảng thời gian (phút): {timeRange}
          </Typography>

          {tables?.length > 0 ? (
            <Autocomplete
              multiple
              options={tables}
              getOptionLabel={(table) => `Số Bàn ${table.tableNumber} - tối đa ${table.capacity}  người`}
              value={selectedTables || []}
              onChange={(event, newValue) => setSelectedTables(newValue)}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    checked={selected}
                    sx={{ marginRight: 1 }}
                  />
                  {`Số Bàn ${option.tableNumber} - tối đa ${option.capacity} người`}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Chọn Bàn" placeholder="Chọn bàn" />
              )}
              sx={{ marginTop: '20px' }}
            />
          ) : (
            <Typography color="error" sx={{ marginTop: '20px' }}>
              Không còn bàn trống tại nhà hàng này.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetTimeRangeDialogOpen(true)} color="primary">
            Thiết lập thời gian
          </Button>
          <Button onClick={onClose} color="secondary">
            Hủy bỏ
          </Button>
          <Button onClick={saveTableAssignment} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* SetTimeRangeDialog */}
      <SetTimeRangeDialog
        open={isSetTimeRangeDialogOpen}
        onClose={() => setSetTimeRangeDialogOpen(false)}
        onSave={handleSetTimeRange}
      />
    </>
  );
};

export default AssignTableDialog;
