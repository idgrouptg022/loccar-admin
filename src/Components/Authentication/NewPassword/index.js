import React from 'react'
import { Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import logonotextsvg from "../../../assets/images/sogenuvotext.svg"
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from 'axios'

export default function NewPassword() {
    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const [isLoading, setIsLoading] = React.useState(false)

    const [password, setPassword] = React.useState("")
    const [passwordError, setPasswordError] = React.useState(false)
    const [passwordErrorText, setPasswordErrorText] = React.useState('')

    if (!localStorage.getItem("code")) {
        window.location = "/"
        return "Redirection ..."
    }

    if (localStorage.getItem("isLogged")) {
        window.location = "/admins"
        return "Redirection ..."
    }

    const handleNewPassword = async (e) => {
        e.preventDefault()
        let canLogin = true

        setPasswordError(false)
        setPasswordErrorText("")

        if (password.trim().length === 0) {
            setPasswordError(true)
            setPasswordErrorText("Mandatory field.")
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
            bodyFormData.append('email', localStorage.getItem('email'))
            bodyFormData.append('code', localStorage.getItem('code'))
            bodyFormData.append('password', password)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/new-password`,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            localStorage.clear()
                            window.location = "/"
                        } else {
                            setPasswordError(true)
                            setPasswordErrorText("Unkown error occured. Try again !")
                            setIsLoading(false)
                        }
                    } catch {
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

                        default:
                            setPasswordError(true)
                            setPasswordErrorText("Unkown error occured. Try again !")
                            break
                    }
                    setIsLoading(false)
                })
        }
    }

    return (
        <Grid container>
            <Grid xs item>

            </Grid>
            <Grid xl={2.5} lg={4} md={6} sm={10} xs={12} item textAlign={"center"} mt={20}>

                <a href="/">
                    <img src={logonotextsvg} alt="Logo SOGEVO" width={250} />
                </a>

                <h2>Nouveau mot de passe</h2>

                <p>Chiosissez un nouveau mot de passe pour votre compte.</p>

                <form method='post' onSubmit={handleNewPassword}>
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

                    <Button variant="contained" disabled={isLoading} size='large' disableElevation fullWidth type='submit'>
                        {
                            isLoading ? <CircularProgress size={26} /> :
                                <strong>Soumettre</strong>
                        }
                    </Button>
                </form>

                <Typography textAlign={"center"} mt={10}>
                    <small>
                        <strong>SOGEVO &copy; Tous droits réservés</strong><br />
                        Léo 2000, Lomé, TOGO  - Tel : 228 90 09 98 90<br />
                        Powered BY <a href="/"><strong>IDGroup</strong></a>
                    </small>
                </Typography>

            </Grid>
            <Grid xs item>

            </Grid>
        </Grid>
    )
}