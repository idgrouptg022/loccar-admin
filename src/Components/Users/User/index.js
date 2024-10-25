import { Close, Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, Switch, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function User(props) {
    const [admins, setAdmins] = useState([])
    const [rights, setRights] = useState([])
    const [rightsId, setRightsId] = useState([])
    const [selectedRights, setSelectedRights] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [isRightsUpdating, setIsRightsUpdating] = useState(false)
    const [isUserDeleting, setIsUserDeleting] = useState(false)

    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [isUserUpdated, setIsUserUpdated] = useState(false)

    const [openDeleteUser, setOpenDeleteUser] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const navigate = useNavigate()

    async function fetchData(userId) {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/admnistrators/${userId}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setAdmins([response.data.data[0].admin])
                        setRights(response.data.data[0].right)
                        setRightsId(response.data.data[0].right.map((right) => `${right.id}`))
                        setSelectedRights(response.data.data[0].admin.rightsId?.split(','))
                        setEmail(response.data.data[0].admin.email)
                        setFullName(response.data.data[0].admin.fullName)
                        setIsFetched(true)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    async function setAdminRights() {

        setIsRightsUpdating(true)

        const bodyData = new FormData()
        bodyData.set('administratorId', admins[0].id)
        bodyData.set('rightsId', selectedRights)

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/admnistrators/services/set-rights`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchData()
                        setIsUserUpdated(true)

                        setIsRightsUpdating(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    async function deleteAdmin() {

        setIsUserDeleting(true)

        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/admnistrators/${props.user}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        navigate('/admins/users')
                        setOpenDeleteUser(false)
                        setIsUserUpdated(true)
                        setIsUserDeleting(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const updateUser = async () => {

        if (JSON.parse(localStorage.getItem('data')).id === 1) {
            const bodyData = new FormData()
            bodyData.set('email', email)
            bodyData.set('fullName', fullName)
            if (password.trim().length > 0) {
                bodyData.set('password', password)
            }

            setIsRightsUpdating(true)

            await axios({
                method: "put",
                url: `${process.env.REACT_APP_API_URL}/admnistrators/${props.user}`,
                data: bodyData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setIsUserUpdated(true)
                            setIsRightsUpdating(false)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
        }
    }

    useEffect(() => {

        // const charmaintenanceacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const passwordLength = 8;

        // let newPassword = ''
        for (let i = 0; i < passwordLength; i++) {
            // const randomIndex = Math.floor(Math.random() * characters.length)
            // newPassword += characters.charAt(randomIndex);
        }

        fetchData(props.user)
    }, [props.user])

    return (
        <div>
            <Snackbar
                open={isUserUpdated}
                autoHideDuration={6000}
                onClose={() => {
                    setIsUserUpdated(false)
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message="Operation effectuée avec succès !"
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => {
                        setIsUserUpdated(false)
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>}
            />
            <br /><br /><br />
            {
                !isFetched ? <Typography textAlign={`center`} component={`div`}><CircularProgress /></Typography> :
                    <Grid container>
                        <Grid item xs={6}>

                            <Typography typography={`h4`}>
                                Détails utilisateur
                            </Typography><br /><br />

                            <TextField value={email} label="Email" variant="outlined" sx={{ width: 300 }} disabled={JSON.parse(localStorage.getItem('data')).id !== 1} onChange={(e) => {
                                setEmail(e.target.value)
                            }} />&nbsp;&nbsp;
                            <TextField value={fullName} label="Nom complet" sx={{ width: 200 }} variant="outlined" disabled={JSON.parse(localStorage.getItem('data')).id !== 1} onChange={(e) => {
                                setFullName(e.target.value)
                            }} /><br /><br />
                            <FormControl sx={{ width: 508 }} variant="outlined">
                                <InputLabel>Mot de passe</InputLabel>
                                <OutlinedInput
                                    value={password}
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={JSON.parse(localStorage.getItem('data')).id !== 1}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
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
                            <Button variant='contained' size='large' disableElevation disabled={isRightsUpdating || JSON.parse(localStorage.getItem('data')).id !== 1} onClick={() => {
                                updateUser()
                            }}>
                                {isRightsUpdating ? <CircularProgress size={22} /> : <strong>Mettre à jour</strong>}
                            </Button>&nbsp;&nbsp;
                            <Button variant='contained' size='large' color='error' disableElevation onClick={() => {
                                setOpenDeleteUser(true)
                            }} disabled={JSON.parse(localStorage.getItem('data')).id !== 1}>
                                <strong>Supprimer</strong>
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography typography={`h4`}>
                                Droits utilisateur
                            </Typography><br />
                            <FormGroup>


                                <FormControlLabel disabled={JSON.parse(localStorage.getItem('data')).id !== 1} control={<Switch checked={selectedRights?.length === rights?.length} onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedRights(rightsId)
                                        console.log(0);
                                    } else {
                                        console.log(1);
                                        setSelectedRights([])
                                    }
                                }} />} label={<strong>Donner tous les droits</strong>} /><br />

                                {
                                    rights.map((right, index) => {
                                        return (
                                            <FormControlLabel disabled={JSON.parse(localStorage.getItem('data')).id !== 1} key={index} control={<Switch checked={selectedRights?.includes(`${right.id}`)} />} label={right.Wording} onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRights(list => [...list, `${right.id}`])

                                                } else {
                                                    setSelectedRights(selectedRights => selectedRights.filter(id => id !== `${right.id}`))
                                                }
                                            }} />
                                        )
                                    })
                                }
                            </FormGroup><br />

                            <Button variant='contained' disabled={isRightsUpdating || (JSON.parse(localStorage.getItem('data')).id !== 1)} disableElevation onClick={setAdminRights}>
                                {isRightsUpdating ? <CircularProgress size={20} /> : <strong>Redéfinir</strong>}
                            </Button><br /><br /><br /><br /><br /><br />
                        </Grid>
                    </Grid>
            }

            <Dialog
                open={openDeleteUser}
                onClose={() => {
                    setOpenDeleteUser(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    <strong>Supprimer ce utilisateur ?</strong>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        L'utilisateur sera définitivement supprimé de votre base de donnée et cette action sera irréversible !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDeleteUser(false)
                    }}>
                        <strong>Fermer</strong>
                    </Button>
                    <Button disabled={isUserDeleting || (JSON.parse(localStorage.getItem('data')).id !== 1)} onClick={() => {
                        deleteAdmin()
                    }} color='error'>
                        {isUserDeleting ? <CircularProgress size={22} /> : <strong>Supprimer</strong>}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}