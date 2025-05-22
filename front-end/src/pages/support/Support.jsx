import React from 'react';
import { Box, Container, Typography, Paper, Link, Avatar, useTheme } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Support = () => {
    const theme = useTheme();

    const ContactItem = ({ icon, text, href }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
                sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 36,
                    height: 36,
                    mr: 2,
                }}
            >
                {icon}
            </Avatar>
            {href ? (
                <Link href={href} underline="hover" color="text.primary" variant="body1">
                    {text}
                </Link>
            ) : (
                <Typography variant="body1">{text}</Typography>
            )}
        </Box>
    );

    return (
        <Container maxWidth="sm" sx={{ mt: 10, mb: 10 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    background: theme.palette.background.paper,
                    boxShadow: `0px 6px 18px rgba(0,0,0,0.08)`,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: theme.palette.primary.main }}
                >
                    Hỗ trợ khách hàng
                </Typography>

                <Typography variant="body1" sx={{ mb: 4 }}>
                    Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua các kênh sau:
                </Typography>

                <ContactItem icon={<PhoneIcon />} text="0123 456 789" />
                <ContactItem
                    icon={<EmailIcon />}
                    text="contact@ratatouille.vn"
                    href="mailto:contact@ratatouille.vn"
                />
                <ContactItem icon={<LocationOnIcon />} text="123 Đường Nhà Hàng, TP. HCM" />

                <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
                    Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất!
                </Typography>
            </Paper>
        </Container>
    );
};

export default Support;
