import * as React from 'react'
import axios from 'axios'
import { Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import logonotextsvg from "../../../assets/images/sogenuvotext.svg"
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link } from 'react-router-dom'


export default function SignInSide() {
    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const [isLoading, setIsLoading] = React.useState(false)

    const [email, setEmail] = React.useState("")
    const [emailError, setEmailError] = React.useState(false)
    const [emailErrorText, setEmailErrorText] = React.useState('')

    const [password, setPassword] = React.useState("")
    const [passwordError, setPasswordError] = React.useState(false)
    const [passwordErrorText, setPasswordErrorText] = React.useState('')

    if (localStorage.getItem("email")) {
        window.location = "/confirmation-code"
        return "Redirection ..."
    }

    if (localStorage.getItem("isLogged")) {
        window.location = "/admins"
        return "Redirection ..."
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        let canLogin = true

        setEmailError(false)
        setEmailErrorText("")

        setPasswordError(false)
        setPasswordErrorText("")

        if (email.trim().length === 0) {
            setEmailError(true)
            setEmailErrorText("Mandatory field.")
            canLogin = false
        }

        if (password.trim().length === 0) {
            setPasswordError(true)
            setPasswordErrorText("Mandatory field.")
            canLogin = false
        }

        if (canLogin) {
            setIsLoading(true)

            const bodyFormData = new FormData()
            bodyFormData.append('email', email)
            bodyFormData.append('password', password)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/auth/administrators/login`,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            // localStorage.setItem("email", email)
                            // window.location = "/confirmation-code"

                            console.log(response.data);
                            

                            localStorage.clear()

                            localStorage.setItem('data', JSON.stringify({
                                id: response.data.data[0].id,
                                token: response.data.data[0].token,
                                lastLogin: response.data.data[0].lastLogin
                            }))
                            localStorage.setItem("isLogged", true)
                            window.location = "/admins"
                        } else {
                            console.log(response);
                            
                            setEmailError(true)
                            setEmailErrorText("Unkown error occured. Try again !")
                            setPasswordError(true)
                            setPasswordErrorText("Unkown error occured. Try again !")
                            setIsLoading(false)
                        }
                    } catch (e) {
                        console.log(e);
                        
                        setEmailError(true)
                        setEmailErrorText("Unkown error occured. Try again !")
                        setPasswordError(true)
                        setPasswordErrorText("Unkown error occured. Try again !")
                        setIsLoading(false)
                    }
                })
                .catch(function (error) {
                    switch (error.response.data?.responseCode) {

                        case 'E-R-00003-23':
                            setPasswordError(true)
                            setPasswordErrorText(error.response.data?.responseMessage)
                            break

                        case 'E-R-00004-23':
                            setEmailError(true)
                            setEmailErrorText(error.response.data?.responseMessage)
                            setPasswordError(true)
                            setPasswordErrorText(error.response.data?.responseMessage)
                            break

                        default:
                            setEmailError(true)
                            setEmailErrorText("Unkown error occured. Try again !")
                            setPasswordError(true)
                            setPasswordErrorText("Unkown error occured. Try again !")
                            break
                    }
                    setIsLoading(false)

                    console.log(error);
                    
                })
        }
    }

    return (
        <Grid container>
            <Grid xs item>

            </Grid>
            <Grid xl={2.5} lg={4} md={6} sm={10} xs={12} item textAlign={"center"} mt={10}>

                <a href="/">
                    <img src={logonotextsvg} alt="Logo SOGEVO" width={350} />
                </a>

                <h2>Connexion administrateur</h2><br />

                <p>Renseignez vos paramètres de connexion pour vous connecter à votre compte.</p>

                <form method='post' onSubmit={handleLogin}>
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                        <TextField
                            disabled={isLoading}
                            fullWidth
                            error={emailError}
                            value={email}
                            type='email'
                            onChange={(e) => {
                                if (e.target.value.length <= 64) {
                                    setEmail(e.target.value)
                                }
                            }}
                            label="Email ou téléphone"
                            placeholder='Saisir votre e-mail ou numéro de téphone ...'
                            helperText={emailErrorText}
                        />
                    </FormControl>

                    <FormControl sx={{ my: 2 }} variant="outlined" fullWidth>
                        <TextField
                            disabled={isLoading}
                            fullWidth
                            error={passwordError}
                            value={password}
                            onChange={(e) => {
                                if (e.target.value.length <= 32) {
                                    setPassword(e.target.value)
                                }
                            }}
                            type={showPassword ? 'text' : 'password'}
                            label="Mot de passe"
                            placeholder='Saisir le mot de ...'
                            helperText={passwordErrorText}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </FormControl>

                    <Link to="/forgotten-password"><strong>Mot de passe oublié ?</strong></Link><br /><br />

                    <Button variant="contained" disabled={isLoading} size='large' disableElevation fullWidth type='submit'>
                        {
                            isLoading ? <CircularProgress size={26} /> :
                                <strong>Se connecter</strong>
                        }
                    </Button>
                </form>

                <Typography textAlign={"center"} mt={10}>
                    <small>
                        <strong>SOGEVO &copy; Tous droits réservés</strong><br />
                        Léo 2000, Lomé, TOGO  - Tel : 228 91 01 92 45<br />
                        Powered BY <a href="/"><strong>IDGroup</strong></a>
                    </small>
                </Typography>

            </Grid>
            <Grid xs item>

            </Grid>
        </Grid>
    )
}