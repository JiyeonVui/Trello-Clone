import { useState } from 'react'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import ModeSelect from '~/components/ModeSelect'
import TrelloLogo from '~/assets/trello.svg?react'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from '~/components/AppBar/Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templated'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profile from './Menus/Profile'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

function AppBar() {
  const [SearchValue, setSearchValue] = useState('')

  return (
    <Box sx={{
      width: '100%',
      height: (themes) => themes.trello.appBarHeight,
      display: 'flex',
      gap: 2,
      paddingX: 2,
      alignItems: 'center',
      overflowX: 'auto',
      justifyContent: 'space-between',
      bgcolor: (themes) => (themes.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer'
      }}>
        <AppsIcon sx={{ color: 'white' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloLogo} sx={{ color:'white' }} />
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color:'white' }}> Trello </Typography>
        </Box>
        <Workspaces />
        <Recent />
        <Starred />
        <Templates />
        <Button variant="outlined" sx={{ color: 'white', border: 'none', '&:hover': { border: 'none' } }} startIcon={<LibraryAddIcon sx={{ color: 'white' }} />}>
          Create
        </Button>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer'
      }}>
        <TextField
          id="outlined-search"
          label="Search field"
          type="text"
          size='small'
          value={SearchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                fontSize='small'
                sx={{ color: SearchValue ? 'white' : 'transparent', cursor: 'pointer' }}
                onClick={() => setSearchValue('')}
              />
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': {
              color: 'white'
            },
            '& input': {
              color: 'white'
            },
            '& label.Mui-focused': { // click vao label
              color: 'white'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white'
              },
              '&:hover fieldset': {
                borderColor: 'white'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white'
              }
            }
          }}
        />
        <ModeSelect />
        <Tooltip title="Notifications" sx={{ cursor: 'pointer' }}>
          <Badge color="warning" variant="dot">
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help" >
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar