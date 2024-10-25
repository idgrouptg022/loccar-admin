import { Close, Delete } from '@mui/icons-material'
import { Button, CircularProgress, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const bodyData = new FormData()

export default function Tenant(props) {
    const [users, setUsers] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [isUserUpdating, setIsUserUpdating] = useState(false)

    const [isUserUpdated, setIsUserUpdated] = useState(false)

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

    async function fetchData(tenantId) {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/rentals/users/${tenantId}/show`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    
                    if (response.data?.responseCode === '0') {
                        setUsers(response.data.data)

                        setDriverLicenseCategory(response.data.data[0].driverLicenseCategory || '')
                        setDriverLicenseIssueDate(response.data.data[0].driverLicenseIssueDate || '')
                        setDriverLicenseExpiryDate(response.data.data[0].driverLicenseExpiryDate || '')

                        setUserName(response.data.data[0].userName || '')
                        setLastName(response.data.data[0].lastName || '')
                        setFirstName(response.data.data[0].firstName || '')
                        setForeignAddress(response.data.data[0].foreignAddress || '')
                        setAddress(response.data.data[0].address || '')
                        setNicNumber(response.data.data[0].nicNumber || '')
                        setProfession(response.data.data[0].profession || '')
                        setPhoneNumber(response.data.data[0].phoneNumber || '')
                        setDriverLicenseNumber(response.data.data[0].driverLicenseNumber || '')
                        setNationality(response.data.data[0].nationality || '')
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

    const updateUser = async () => {

        setIsUserUpdating(true)

        bodyData.set('driverLicenseCategory', driverLicenseCategory)
        bodyData.set('driverLicenseIssueDate', driverLicenseIssueDate)
        bodyData.set('driverLicenseExpiryDate', driverLicenseExpiryDate)

        if (password.trim().length > 0) {
            bodyData.set('password', password)
        }

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
            method: "put",
            url: `${process.env.REACT_APP_API_URL}/rentals/users/${props.tenant}/update`,
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
                        setIsUserUpdating(false)
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

    useEffect(() => {
        fetchData(props.tenant)
    }, [props.tenant])
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
                                                        const issueDate = e.$y + '-' + (e.$M + 1).toString().padStart(2, '0') + '-' + e.$D.toString().padStart(2, '0')
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
                                                        const expiryDate = e.$y + '-' + (e.$M + 1).toString().padStart(2, '0') + '-' + e.$D.toString().padStart(2, '0')
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
                                    (driverLicenseExpiryDate !== '') &&
                                        ((driverLicenseExpiryDate.substring(0, 12).replaceAll('-', '') < (new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + new Date().getDate()).replaceAll('-', '').toString().padStart(2, '0')) ? <strong style={{ color: 'red' }}>Permis expiré</strong> : <strong style={{ color: 'green' }}>Permis en cours de validité ...</strong>)
                                }<br />

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

                                {
                                    (driverLicense.length === 0 && users[0].driverLicense) &&
                                    <Grid container spacing={1} mb={2}>
                                        <Grid item xs={5}>
                                            <img src={`${process.env.REACT_APP_API_BASE_URL}/${users[0].driverLicense}`} alt="License" width={'100%'} style={{ borderRadius: 5 }} />
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
                                {isUserUpdating ? <CircularProgress size={22} /> : <strong>Mettre à jour</strong>}
                            </Button>&nbsp;&nbsp;
                        </Grid>
                    </Grid>
            }
        </div>
    )
}
