
import { useRouteMatch } from 'react-router-dom'

export const getSafeAddress = () => {
  const match = useRouteMatch()
  return match.params.address
}
