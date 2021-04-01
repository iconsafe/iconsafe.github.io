import { withStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'

const styles = () =>
  ({
    icon: {
      marginRight: '1.5em'
    },
    button: {
      backgroundColor: 'Transparent',
      backgroundRepeat: 'no-repeat',
      border: 'none',
      cursor: 'pointer',
      overflow: 'hidden',
      outline: 'none'
    }
  })

const DarkMode = () => {
  const [theme, setTheme] = useState(() => {
    return window.localStorage.getItem('theme')
  })

  const changeTheme = () => {
    document.documentElement.classList.toggle('dark-mode')
    document.querySelectorAll('.inverted').forEach((result) => {
      result.classList.toggle('dark-mode')
    })

    const theme = window.localStorage.getItem('theme')

    if (theme == null || theme === 'light') {
      window.localStorage.setItem('theme', 'dark')
      setTheme('dark')
    } else {
      window.localStorage.setItem('theme', 'light')
      setTheme('light')
    }
  }

  return (
    <>
      <button style={styles().button}>
        <FontAwesomeIcon
          id='themeToggle'
          style={styles().icon}
          icon={theme == null || theme === 'light' ? faMoon : faSun}
          onClick={changeTheme}
        />
      </button>
    </>
  )
}

export default withStyles(styles)(DarkMode)
