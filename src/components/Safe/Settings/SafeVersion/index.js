import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { styles } from './style'
import Field from '@components/core/Field'
import GnoForm from '@components/core/GnoForm'
import TextField from '@components/core/TextField'
import { composeValidators, minMaxLength, required } from '@components/core/validator'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Heading from '@components/core/Heading'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import Link from '@components/core/Link'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import SaveIcon from '@material-ui/icons/Save'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { lowercaseWithCapital } from '@src/utils/strings'
import packageJson from '@src/../package.json'

const useStyles = makeStyles(styles)

const SafeVersion = () => {
  const classes = useStyles()
  const safeName = useSelector((state) => state.safeName)
  const contractVersions = useSelector((state) => state.contractVersions)

  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const granted = useSelector((state) => state.granted)

  const handleSubmit = (values) => {
    msw.set_safe_name(values.safeName)
  }

  const convertName = (name) => {
    return name.replace("_PROXY", "").split("_").map(word => lowercaseWithCapital(word)).join(' ').replace("Iconsafe", "ICONSafe")
  }

  return (
    <>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Heading tag='h2' style={{ marginBottom: '10px', marginTop: '10px' }}>ICONSafe Versions</Heading>
              <Heading tag='h3' style={{ marginBottom: '10px', marginTop: '5px' }}>User Interface</Heading>
              <div className={classes.versionNumber}>
                <ArrowRightIcon />
                ICONSafe React User Interface : {packageJson.version}
              </div>
              <Heading tag='h3' style={{ marginBottom: '10px', marginTop: '5px' }}>Smart contracts</Heading>
              {contractVersions && contractVersions.map(version => (
                <div key={version[1]} className={classes.versionNumber}>
                  <ArrowRightIcon />
                  {convertName(version[1])} : {version[0]}
                </div>
              ))}
              <div style={{ marginTop: '10px' }}>
                - <Link
                  className={cn(classes.item, classes.link)}
                  color='black'
                  target='_blank'
                  to='https://github.com/iconation/ICONSafe-SCORE'
                >Smart contracts source code on GitHub</Link>
                <br />
              - <Link
                  className={cn(classes.item, classes.link)}
                  color='black'
                  target='_blank'
                  to='https://github.com/iconsafe/iconsafe.github.io'
                >React User Interface source code on GitHub</Link>
              </div>
            </Block>

            <Row align='end' className={classes.controlsRow} grow>
              <Col end='xs'>
              </Col>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default SafeVersion
