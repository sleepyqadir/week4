import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  alignItems: 'center',
  justifyContent: 'center',
  width: 500,
  paddingBottom: 50,
}))
