import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function CreateUser() {

    const [isUserCreating, setIsUserCreating] = useState(false)

    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [isUserCreated, setIsUserCreated] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const createUser = async () => {

        const bodyData = new FormData()
        bodyData.set('email', email)
        bodyData.set('fullName', fullName)
        bodyData.set('password', password)

        setIsUserCreating(true)

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/admnistrators`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setFullName('')
                        setPassword('')
                        setIsUserCreated(true)
                        setIsUserCreating(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    useEffect(() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const passwordLength = 8;

        let newPassword = ''
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            newPassword += characters.charAt(randomIndex);
        }

        setPassword(newPassword)

    }, [])
    return (
        <div>
            <Snackbar
                open={isUserCreated}
                autoHideDuration={6000}
                message="Operation effectuée avec succès !"
            />
            <br /><br /><br />
            <Grid container>
                <Grid item xs={6}>

                    <Typography typography={`h4`}>
                        Créer un administrateur
                    </Typography><br /><br />

                    <TextField value={email} label="Email" variant="outlined" sx={{ width: 300 }} onChange={(e) => {
                        setEmail(e.target.value)
                    }} />&nbsp;&nbsp;
                    <TextField value={fullName} label="Nom complet" sx={{ width: 200 }} variant="outlined" onChange={(e) => {
                        setFullName(e.target.value)
                    }} /><br /><br />
                    <FormControl sx={{ width: 508 }} variant="outlined">
                        <InputLabel>Mot de passe</InputLabel>
                        <OutlinedInput
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Mot de passe"
                        />
                    </FormControl><br /><br />
                    <Button variant='contained' size='large' disabled={isUserCreating || email.trim().length === 0 || fullName.trim().length === 0 || password.trim().length === 0} disableElevation onClick={createUser}>
                        {isUserCreating ? <CircularProgress size={22} /> : <strong>Créer</strong>}
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}