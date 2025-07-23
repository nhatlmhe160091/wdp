import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
const category = [
  { value: "MAIN_COURSE", label: "Món chính" },
  { value: "DESSERT", label: "Món tráng miệng" },
  { value: "BEVERAGE", label: "Đồ uống" },
  { value: "SALAD", label: "Salad rau trộn" },
  { value: "APPETIZER", label: "Món khai vị" },
];

const getCategoryLabel = (value) => {
  const found = category.find((c) => c.value === value);
  return found ? found.label : value;
};
export default function DishBookingDialog({ dishes }) {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Tooltip title="Xem món ăn đã đặt">
                <VisibilityOutlinedIcon fontSize='small' color="info" onClick={handleClickOpen} />
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thông tin món ăn đã đặt</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Tên món</StyledTableCell>
                                    <StyledTableCell>Giá</StyledTableCell>
                                    <StyledTableCell>Danh mục</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dishes?.map((dish) => (
                                    <StyledTableRow key={dish?._id}>
                                        <StyledTableCell>{dish?.name}</StyledTableCell>
                                        <StyledTableCell>{dish?.price?.toLocaleString()} VNĐ</StyledTableCell>
                                       <StyledTableCell>{getCategoryLabel(dish?.category)}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}