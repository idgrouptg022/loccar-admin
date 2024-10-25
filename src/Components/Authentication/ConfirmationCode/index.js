import React from 'react'
import { Button, CircularProgress, FormControl, Grid, TextField, Typography } from '@mui/material'
import logonotextsvg from "../../../assets/images/sogenuvotext.svg"
import axios from 'axios'

export default function ConfirmationCode() {

    const [isLoading, setIsLoading] = React.useState(false)

    const [code, setCode] = React.useState("")
    const [codeError, setCodeError] = React.useState(false)
    const [codeErrorText, setCodeErrorText] = React.useState('')

    if (!localStorage.getItem("email")) {
        window.location = "/"
        return "Redirection ..."
    }

    if (localStorage.getItem("isLogged")) {
        window.location = "/admins"
        return "Redirection ..."
    }

    const handleConfirmationCode = async (e) => {
        e.preventDefault()
        let canLogin = true

        setCodeError(false)
        setCodeErrorText("")

        if (code.trim().length === 0) {
            setCodeError(true)
            setCodeErrorText("Mandatory field.")
            canLogin = false
        }

        if (canLogin) {
            setIsLoading(true)

            const bodyFormData = new FormData()
            bodyFormData.append('email', localStorage.getItem("email"))
            bodyFormData.append('code', code)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/confirmation-code`,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {

                            if (response.data?.data.length > 0) {

                                localStorage.clear()

                                localStorage.setItem('data', JSON.stringify({
                                    id: response.data.data[0].id,
                                    token: response.data.data[0].token,
                                    lastLogin: response.data.data[0].lastLogin
                                }))
                                localStorage.setItem("isLogged", true)
                                window.location = "/"
                            } else {
                                localStorage.setItem("code", code)
                                window.location = "/new-password"
                            }

                        } else {
                            setCodeError(true)
                            setCodeErrorText("Unkown error occured. Try again !")
                            setIsLoading(false)
                        }
                    } catch {
                        setCodeError(true)
                        setCodeErrorText("Unkown error occured. Try again !")
                        setIsLoading(false)
                    }
                })
                .catch(function (error) {
                    switch (error.response.data?.responseCode) {

                        case 'E-R-00024-23':
                            setCodeError(true)
                            setCodeErrorText(error.response.data?.responseMessage)
                            break

                        default:
                            setCodeError(true)
                            setCodeErrorText("Unkown error occured. Try again !")
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

                <h2>Code de confirmation</h2>

                <p>Un code de confirmation vient d'être envoyé à votre e-mail ou au numéro de téléphone que vous avez saisi.</p>

                <form method='post' onSubmit={handleConfirmationCode}>
                    <FormControl sx={{ my: 2 }} variant="outlined" fullWidth>
                        <TextField
                            disabled={isLoading}
                            fullWidth
                            error={codeError}
                            value={code}
                            onChange={(e) => {
                                if (e.target.value.length <= 6) {
                                    setCode(e.target.value)
                                }
                            }}
                            label="Code de confirmation"
                            placeholder='Saisir le code de confirmation ...'
                            helperText={codeErrorText}
                            autoComplete='off'
                        />
                    </FormControl>

                    <Button disabled={isLoading} variant="contained" size='large' disableElevation fullWidth type='submit'>
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