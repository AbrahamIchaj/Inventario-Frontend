import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AlertMessage } from './page';

const tipoAlerta = "filled";

interface AlertaComponentProps {
  alert: AlertMessage | null;
  onClose: () => void;
}

export const AlertaComponent: React.FC<AlertaComponentProps> = ({ alert, onClose }) => {
  return (
    <Snackbar
      open={!!alert}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <div>
        {alert && (
          <Alert
            severity={alert.severity}
            variant={tipoAlerta} 
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={onClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2, minWidth: '300px' }}
          >
            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
            {alert.message}
          </Alert>
        )}
      </div>
    </Snackbar>
  );
};