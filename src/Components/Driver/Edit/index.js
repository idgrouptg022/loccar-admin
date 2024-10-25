import { Button, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useNavigate } from 'react-router-dom'
import { Delete } from '@mui/icons-material'

let bodyFormData = null
export default function EditDriver(props) {
    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [driverFullName, setDriverFullName] = useState('')
    const [driverPhoneNumber, setDriverPhoneNumber] = useState('')
    const [driverLicenseNumber, setDriverLicenseNumber] = useState('')
    const [driverLicenseCategory, setDriverLicenseCategory] = useState('')

    const [driverLicenseIssueDate, setDriverLicenseIssueDate] = useState('')
    const [driverLicenseExpiryDate, setDriverLicenseExpiryDate] = useState('')
    const [driverLicense, setDriverLicense] = useState([])

    const [oldDriverLicense, setOldDriverLicense] = useState('')


    const [errorDate, setErrorDate] = useState(false)

    const navigate = useNavigate()

    async function fetchDriver() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/${props.driver}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setDriverFullName(response.data.data[0].car.driverFullName)
                        setDriverPhoneNumber(response.data.data[0].car.driverPhoneNumber)
                        setDriverLicenseNumber(response.data.data[0].car.driverLicenseNumber)
                        setDriverLicenseCategory(response.data.data[0].car.driverLicenseCategory)
                        setDriverLicenseIssueDate(response.data.data[0].car.driverLicenseIssueDate)
                        setDriverLicenseExpiryDate(response.data.data[0].car.driverLicenseExpiryDate)

                        setOldDriverLicense(response.data.data[0].car.driverLicense)

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

    const handleEditCar = async () => {
        if (bodyFormData === null) bodyFormData = new FormData()

        setIsLoading(true)

        bodyFormData.set('driverFullName', driverFullName)
        bodyFormData.set('driverPhoneNumber', driverPhoneNumber)
        bodyFormData.set('driverLicenseNumber', driverLicenseNumber)
        bodyFormData.set('driverLicenseCategory', driverLicenseCategory)
        bodyFormData.set('driverLicenseIssueDate', driverLicenseIssueDate)
        bodyFormData.set('driverLicenseExpiryDate', driverLicenseExpiryDate)

        await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/${props.driver}`,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setIsLoading(false)
                        navigate(-1)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
                setIsLoading(false)
                if (error.response.data.responseCode === "E-R-00027-23") {
                    setErrorDate(true)
                }
            })
    }

    const handleSelectDriverLicense = (e) => {
        if (e.target.files.length > 0) {

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            for (let i = 0; i < e.target.files.length; i++) {
                bodyFormData.set('driverLicense', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setDriverLicense([previewFile])
            }
        }
    }

    useEffect(() => {
        fetchDriver()
    }, [])

    return (

        <Fragment>
            <br /><br /><br />
            {
                !isFetched ?
                    <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                        <CircularProgress />
                    </div> :
                    <Grid container spacing={2}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5}>

                            {
                                errorDate && <Typography bgcolor={'red'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Date de délivrance ou date d'expiration invalide !</Typography>
                            }

                            <TextField label="Nom complet du chauffeur" variant="outlined" sx={{ mb: 2 }} fullWidth value={driverFullName} onChange={(e) => {
                                setDriverFullName(e.target.value)
                            }} />
                            <TextField label="Numéro de téléphone" variant="outlined" sx={{ mb: 2 }} fullWidth value={driverPhoneNumber} onChange={(e) => {
                                setDriverPhoneNumber(e.target.value)
                            }} />

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
                                                <strong>{driverLicenseIssueDate.substring(0, 10)}</strong>&nbsp;
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
                                                {driverLicenseExpiryDate.substring(0, 10)}
                                            </LocalizationProvider> :
                                            <div>
                                                <br />
                                                <strong>{driverLicenseExpiryDate.substring(0, 10)}</strong>&nbsp;
                                                <IconButton onClick={() => {
                                                    setDriverLicenseExpiryDate('')
                                                }}>
                                                    <Delete />
                                                </IconButton>
                                            </div>
                                    }
                                </Grid>
                            </Grid><br />

                            {
                                oldDriverLicense !== '' &&
                                <img src={`${process.env.REACT_APP_API_BASE_URL}/${oldDriverLicense}`} alt="Photo permis" style={{ borderRadius: 10 }} width={'100%'} />

                            }<br />

                            <Fragment>
                                {
                                    driverLicense.length > 0 &&
                                    <Grid container spacing={1} mb={2}>
                                        <Grid item xs={12}>
                                            {
                                                driverLicense.map((licence, key) => {
                                                    return (
                                                        <img src={licence.path} alt="Photo permis" key={key} style={{ borderRadius: 10 }} width={'100%'} />
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Grid>
                                }
                            </Fragment>

                            <div className="parent">
                                <div className="file-upload">
                                    <h3>Photo du permis</h3>
                                    <p>Taille maximale 10mb</p>
                                    <input type="file" accept='image/*' onInput={(e) => { handleSelectDriverLicense(e) }} />
                                </div>
                            </div><br />

                            <Button
                                disabled={driverFullName === 0 || driverPhoneNumber.trim().length === 0 || driverLicenseNumber.trim().length === 0 || driverLicenseCategory.trim().length === 0
                                    || driverLicenseIssueDate.trim().length === 0 || driverLicenseExpiryDate.trim().length === 0 || isLoading}
                                variant="contained"
                                disableElevation
                                fullWidth
                                onClick={handleEditCar}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                <strong>{isLoading ? "Patientez ..." : "Continer"}</strong>
                            </Button>

                        </Grid>
                    </Grid>
            }
        </Fragment>
    )
}
