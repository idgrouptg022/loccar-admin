import React from 'react'
import { Button, CircularProgress, FormControl, Grid, TextField, Typography } from '@mui/material'
import logonotextsvg from "../../../assets/images/sogenuvotext.svg"
import axios from 'axios'

export default function ForgottenPassword() {

    const [isLoading, setIsLoading] = React.useState(false)

    const [email, setEmail] = React.useState("")
    const [emailError, setEmailError] = React.useState(false)
    const [emailErrorText, setEmailErrorText] = React.useState('')

    if (localStorage.getItem("email")) {
        window.location = "/confirmation-code"
        return "Redirection ..."
    }

    if (localStorage.getItem("isLogged")) {
        window.location = "/admins"
        return "Redirection ..."
    }

    const handleForgottenPassword = async (e) => {
        e.preventDefault()
        let canLogin = true

        setEmailError(false)
        setEmailErrorText("")

        if (email.trim().length === 0) {
            setEmailError(true)
            setEmailErrorText("Mandatory field.")
            canLogin = false
        }

        if (canLogin) {
            setIsLoading(true)

            const bodyFormData = new FormData()
            bodyFormData.append('email', email)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/forgotten-password`,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            localStorage.setItem("email", email)
                            window.location = "/confirmation-code"
                        } else {
                            setEmailError(true)
                            setEmailErrorText("Unkown error occured. Try again !")
                            setIsLoading(false)
                        }
                    } catch {
                        setEmailError(true)
                        setEmailErrorText("Unkown error occured. Try again !")
                        setIsLoading(false)
                    }
                })
                .catch(function (error) {
                    switch (error.response.data?.responseCode) {

                        case 'E-R-00002-23':
                            setEmailError(true)
                            setEmailErrorText(error.response.data?.responseMessage)
                            break

                        default:
                            setEmailError(true)
                            setEmailErrorText("Unkown error occured. Try again !")
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

                <h2>Mot de passe oublié</h2>

                <p>Renseignez le-mail utilisé pour la création de votre compte.</p>

                <form method='post' onSubmit={handleForgottenPassword}>

                    <FormControl sx={{ my: 2 }} variant="outlined" fullWidth>
                        <TextField
                            disabled={isLoading}
                            type='email'
                            fullWidth
                            error={emailError}
                            value={email}
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