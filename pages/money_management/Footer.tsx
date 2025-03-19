import React from 'react'
import { AppBar, Box, Container, Typography } from '@mui/material'

const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#CCFFFF',
        height: '100px', // フッターの高さを調整
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" py={1}>
          <Typography variant="caption" sx={{ color: 'black' }}>
            © {year} たくわえる
          </Typography>
        </Box>
      </Container>
    </AppBar>
  )
}

export default Footer
