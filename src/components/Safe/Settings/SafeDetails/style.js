import { boldFont, border, lg, sm, connected } from '@src/theme/variables'

export const styles = () => ({
  formContainer: {
    padding: lg
  },
  safeNameInputField: {
    marginTop: '15px',
    display: 'flex',
    maxWidth: '460px'
  },
  saveBtn: {
    fontWeight: boldFont,
    marginRight: sm
  },
  controlsRow: {
    borderTop: `2px solid ${border}`,
    bottom: 0,
    boxSizing: 'border-box',
    padding: lg,
    position: 'absolute',
    width: '100%'
  },
  versionNumber: {
    height: '21px',
    display: 'flex',
    alignItems: 'center'
  },
  link: {
    color: `${connected}`,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
})
