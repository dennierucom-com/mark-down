import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, useTheme, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { usePWAInstall } from '../hooks/usePWAInstall';
export const PWAInstallPrompt: React.FC = () => {
    const { isInstallable, installPWA } = usePWAInstall();
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isInstallable) {
            setIsVisible(true);
        }
    }, [isInstallable]);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsVisible(false);
    };

    if (!isInstallable) return null;

    return (
        <Snackbar
            open={isVisible}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ bottom: { xs: 90, sm: 24 } }}
        >
            <Alert
                severity="info"
                icon={<DownloadIcon />}
                action={
                    <>
                        <Button color="inherit" size="small" onClick={installPWA}>
                            INSTALL
                        </Button>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    </>
                }
                sx={{
                    width: '100%',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '& .MuiAlert-icon': {
                        color: theme.palette.primary.contrastText
                    }
                }}
            >
                Install App for offline use
            </Alert>
        </Snackbar>
    );
};
