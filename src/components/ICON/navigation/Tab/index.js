import React from 'react'
import TabMui from '@material-ui/core/Tab'
import TabsMui from '@material-ui/core/Tabs'
import { withStyles } from '@material-ui/core/styles'
import styled from 'styled-components'

import theme from '../../theme'
import IconText from '../../dataDisplay/IconText'
import Text from '../../dataDisplay/Text'

const TabWrapper = styled.div`
  border-bottom: ${({ variant, theme }) =>
    variant === 'outlined'
      ? '1px solid ' + theme.colors.overlay.color
      : 'none'};
`

const CustomTabs = ({ variantStyle, ...rest }) => {
  const CustomTabsMui = withStyles({
    root: {
      backgroundColor:
        variantStyle === 'contained' ? theme.colors.white : theme.colors.white,
      borderRadius: variantStyle === 'contained' ? '8px 8px 0 0' : 'inherit',

      '& .MuiTabs-indicator': {
        backgroundColor:
          variantStyle === 'outlined' ? theme.colors.primary : 'transparent'
      },
      '& .MuiTab-wrapper svg': {
        marginTop: '4px'
      },
      '& .MuiTab-root.Mui-selected': {
        backgroundColor:
          variantStyle === 'contained'
            ? theme.colors.inputField
            : theme.colors.white
      },
      '& .MuiTab-textColorInherit.Mui-selected p': {
        color: theme.colors.primary,
        fontWeight: '700'
      },
      '& .MuiTabs-root.MuiTabs-vertical p': {
        textAlign: 'left'
      }
    }
  })(TabsMui)

  return <CustomTabsMui {...rest} />
}

const CustomTab = ({ variantStyle, ...rest }) => {
  const CustomTabMui = withStyles({
    root: {
      fontFamily: theme.fonts.fontFamily,
      backgroundColor:
        variantStyle === 'contained' ? theme.colors.white : 'inherit',
      border:
        variantStyle === 'contained'
          ? '1px solid' + theme.colors.separator
          : 'inherit',
      '& .MuiTabs-indicator': {
        backgroundColor: variantStyle === 'contained' ? 'none' : 'inherit'
      },
      textTransform: variantStyle === 'contained' ? 'capitalize' : 'uppercase'
    }
  })(TabMui)

  return <CustomTabMui {...rest} />
}

const Tab = ({
  onChange,
  items,
  selectedTab,
  variant = 'outlined',
  fullWidth
}) => {
  const handleChange = (
    _event,
    value
  ) => {
    onChange(value)
  }

  const getLabel = (item) => {
    if (item.customContent) {
      return item.customContent
    }

    if (item.icon) {
      return (
        <IconText
          iconSize='sm'
          iconType={item.icon}
          textSize='sm'
          color={selectedTab === item.id ? 'primary' : 'text'}
          text={item.label}
        />
      )
    }

    return (
      <Text color='text' size='sm'>
        {item.label}{' '}
      </Text>
    )
  }

  return (
    <TabWrapper variant={variant}>
      <CustomTabs
        variant={fullWidth ? 'fullWidth' : 'scrollable'}
        value={selectedTab}
        onChange={handleChange}
        variantStyle={variant}
      >
        {items.map((item) => (
          <CustomTab
            key={item.id}
            label={getLabel(item)}
            value={item.id}
            disabled={item.disabled}
            variantStyle={variant}
          />
        ))}
      </CustomTabs>
    </TabWrapper>
  )
}

export default Tab
