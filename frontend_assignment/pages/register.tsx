import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import styles from '../styles/Home.module.css'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Item } from './components/Paper'
const theme = createTheme()

const schema = yup.object().shape({
  name: yup.string().required(),
  address: yup.string().required(),
  age: yup.number().lessThan(100).moreThan(1).required(),
})

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const onSubmitHandler = (data) => {
    // const jsonData = JSON.parse(data)
    console.log({ data })
    handleClickOpen()
    reset()
  }
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Item>
            <CssBaseline />
            <Box
              sx={{
                marginTop: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}></Avatar>
              <Typography component="h1" variant="h5">
                Register Now
              </Typography>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <TextField
                  margin="normal"
                  error={errors.name?.message ? true : false}
                  helperText={errors.name?.message ? errors.name?.message : ''}
                  fullWidth
                  label="First Name"
                  {...register('name')}
                />
                <TextField
                  margin="normal"
                  error={errors.address?.message ? true : false}
                  helperText={
                    errors.address?.message ? errors.address?.message : ''
                  }
                  fullWidth
                  label="Address"
                  {...register('address')}
                />
                <TextField
                  margin="normal"
                  error={errors.age?.message ? true : false}
                  fullWidth
                  helperText={errors.age?.message ? errors.age?.message : ''}
                  label="Age"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  {...register('age')}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Register
                </Button>
              </form>
            </Box>
          </Item>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <Alert severity="success" color="info">
                Your registration has been successfully submitted
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </main>
      </div>
    </ThemeProvider>
  )
}
