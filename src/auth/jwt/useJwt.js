import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'

const { jwt } = useJwt(axios, {})
jwt.jwtConfig.loginEndpoint = '/user/login-icit-account'
export default jwt
