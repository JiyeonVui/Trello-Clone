import { experimental_extendTheme as extendTheme } from '@mui/material/styles'


const theme = extendTheme({
  trello:{
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {

  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '1px !important',
          '&:hover': {
            borderWidth: '2px !important'
          }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          color: 'white',
          fontSize: '0.875rem',
          '& fieldset': {
            borderWidth: '1px !important'
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {

        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiOutlinedInput:{
      styleOverrides:{
        root: {
          '& fieldset': {
            borderWidth: '1px !important'
          },
          '&:hover fieldset': {
            borderWidth: '2px !important'
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px !important'
          }
        }
      }
    }
  }
})


export default theme