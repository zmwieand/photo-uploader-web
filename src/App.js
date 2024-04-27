import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Input from '@mui/material/Input';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://thewieands.com/">
        The Wieands
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [message, setMessage] = React.useState('');
  const [photos, setPhotos] = React.useState([]);
  const [showNotification, setShowNotification] = React.useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    const formPhotos = Array.from(event.target.files);
    setPhotos(formPhotos);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numPhotos = photos.length;
    setShowNotification(true);

    // Upload to backend API
    for (let i = 0; i < numPhotos; i++) {
      const formData = new FormData();
      setMessage(`Uploading photo ${i + 1}/${numPhotos}`);

      formData.append(`file`, photos[i]);

      // TODO: make URL configurable in REACT_APP_* env vars
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log("Failed to upload file");
      }
    }

    // Reset the form
    event.target.reset()

    // Finished Uploading Message for 5 seconds
    setMessage('Finished Uploading!');
    await new Promise(r => setTimeout(r, 5000));
    setMessage('');
    setShowNotification(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', height: '56px', width: '56px'}}>
            <AddAPhotoIcon />
          </Avatar>
          <Typography component="h1" variant="h2" style={{'font-family': 'Great Vibes'}}>
            Share the Love!
          </Typography>

          <br />

          <Box component="form" onChange={handleChange} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Input
              type="file"
              name="photos"
              id="photos"
              required
              inputProps={{
                  multiple: true,
                  hidden: true,
              }}
              fullWidth
            />


            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={photos.length===0}
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />

        <Snackbar
          open={showNotification}
          message={message}
        />

      </Container>
    </ThemeProvider>
  );
}
