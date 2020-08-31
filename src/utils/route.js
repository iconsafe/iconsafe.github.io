
import { useRouteMatch } from 'react-router-dom'

export const getSafeAddressFromUrl = () => {
  const match = useRouteMatch()
  return match.params.address
}
