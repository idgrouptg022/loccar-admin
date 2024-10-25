import { Delete } from '@mui/icons-material'
import { Button, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const bodyData = new FormData()

export default function CreateTenant() {
    const [isUserUpdating, setIsUserUpdating] = useState(false)

    const [userName, setUserName] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [foreignAddress, setForeignAddress] = useState('')
    const [address, setAddress] = useState('')
    const [nicNumber, setNicNumber] = useState('')
    const [profession, setProfession] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [nationality, setNationality] = useState('')

    const [driverLicenseNumber, setDriverLicenseNumber] = useState('')
    const [driverLicenseCategory, setDriverLicenseCategory] = useState('')
    const [driverLicenseIssueDate, setDriverLicenseIssueDate] = useState('')
    const [driverLicenseExpiryDate, setDriverLicenseExpiryDate] = useState('')
    const [driverLicense, setDriverLicense] = useState([])
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const updateUser = async () => {

        setIsUserUpdating(true)

        bodyData.set('driverLicenseCategory', driverLicenseCategory)
        bodyData.set('driverLicenseIssueDate', driverLicenseIssueDate)
        bodyData.set('driverLicenseExpiryDate', driverLicenseExpiryDate)
        bodyData.set('password', password)

        bodyData.set('userName', userName)
        bodyData.set('lastName', lastName)
        bodyData.set('firstName', firstName)
        bodyData.set('foreignAddress', foreignAddress)
        bodyData.set('address', address)
        bodyData.set('nicNumber', nicNumber)
        bodyData.set('profession', profession)
        bodyData.set('phoneNumber', phoneNumber)
        bodyData.set('driverLicenseNumber', driverLicenseNumber)
        bodyData.set('nationality', nationality)

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/rentals/users/create/new`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setIsUserUpdating(false)
                        navigate(-1)
                    }
                } catch (e) {


                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleSelectDriverLicense = (e) => {
        if (e.target.files.length > 0) {

            for (let i = 0; i < e.target.files.length; i++) {
                bodyData.set('driverLicense', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setDriverLicense(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    return (
        <div>
            <br /><br />
            <Grid container>
                <Grid item xs={5}>

                    <Typography typography={`h4`}>
                        Détails locataire
                    </Typography><br /><br />

                    <React.Fragment>
                        <Grid container spacing={2}>
                            <Grid xs={8} item>
                                <TextField label="Numéro de permis" variant="outlined" sx={{ mb: 2 }} fullWidth value={driverLicenseNumber} onChange={(e) => {
                                    setDriverLicenseNumber(e.target.value)
                                }} />
                            </Grid>
                            <Grid xs={4} item>
                                <TextField label="Catégorie" variant="outlined" sx={{ mb: 2 }} fullWidth value={driverLicenseCategory} onChange={(e) => {
                                    setDriverLicenseCategory(e.target.value)
                                }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid xs={6} item>
                                <small><strong>Date de délivrance</strong></small>
                                {
                                    driverLicenseIssueDate === '' ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker onChange={(e) => {
                                                const issueDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                setDriverLicenseIssueDate(issueDate)
                                            }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                        </LocalizationProvider> :
                                        <div>
                                            <br />
                                            <strong>{driverLicenseIssueDate}</strong>&nbsp;
                                            <IconButton onClick={() => {
                                                setDriverLicenseIssueDate('')
                                            }}>
                                                <Delete />
                                            </IconButton>
                                        </div>
                                }
                            </Grid>
                            <Grid xs={6} item>
                                <small><strong>Date d'expiration</strong></small>
                                {
                                    driverLicenseExpiryDate === '' ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker onChange={(e) => {
                                                const expiryDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                setDriverLicenseExpiryDate(expiryDate)
                                            }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                        </LocalizationProvider> :
                                        <div>
                                            <br />
                                            <strong>{driverLicenseExpiryDate}</strong>&nbsp;
                                            <IconButton onClick={() => {
                                                setDriverLicenseExpiryDate('')
                                            }}>
                                                <Delete />
                                            </IconButton>
                                        </div>
                                }
                            </Grid>
                        </Grid>

                        {
                            driverLicense.length > 0 &&
                            <Grid container spacing={1} mb={2}>
                                <Grid item xs={12}>
                                    {
                                        driverLicense.map((licence, key) => {
                                            return (
                                                <img src={licence.path} alt="Permis" key={key} style={{ borderRadius: 10 }} width={'100%'} />
                                            )
                                        })
                                    }
                                </Grid>
                            </Grid>
                        }<br />


                        <div className="parent">
                            <div className="file-upload">
                                <h3>Photo du permis</h3>
                                <p>Taille maximale 10mb</p>
                                <input type="file" accept='image/*' onInput={(e) => { handleSelectDriverLicense(e) }} />
                            </div>
                        </div><br />

                    </React.Fragment>

                    <TextField value={userName} label="Nom utilisateur" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setUserName(e.target.value)
                    }} />&nbsp;&nbsp;<br /><br />

                    <TextField value={lastName} label="Nom de famille" variant="outlined" sx={{ width: 300 }} onChange={(e) => {
                        setLastName(e.target.value)
                    }} />&nbsp;&nbsp;
                    <TextField value={firstName} label="Prénom" sx={{ width: 300 }} variant="outlined" onChange={(e) => {
                        setFirstName(e.target.value)
                    }} /><br /><br />

                    <TextField value={foreignAddress} label="Adresse étrangère" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setForeignAddress(e.target.value)
                    }} /><br /><br />

                    <TextField value={address} label="Adresse locale" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setAddress(e.target.value)
                    }} /><br /><br />

                    <TextField value={nicNumber} label="Numéro de CIN" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setNicNumber(e.target.value)
                    }} /><br /><br />

                    <TextField value={profession} label="Profession" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setProfession(e.target.value)
                    }} /><br /><br />

                    <TextField value={phoneNumber} label="Numéro de téléphone" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setPhoneNumber(e.target.value)
                    }} /><br /><br />

                    <TextField value={nationality} label="Nationalité" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setNationality(e.target.value)
                    }} /><br /><br />

                    <TextField value={password} label="Mot de passe" variant="outlined" sx={{ width: 606 }} onChange={(e) => {
                        setPassword(e.target.value)
                    }} /><br /><br />

                    <Button variant='contained' size='large' disabled={isUserUpdating} disableElevation onClick={() => {
                        updateUser()
                    }}>
                        {isUserUpdating ? <CircularProgress size={22} /> : <strong>Créer</strong>}
                    </Button>&nbsp;&nbsp;
                </Grid>
            </Grid>
        </div>
    )
}
