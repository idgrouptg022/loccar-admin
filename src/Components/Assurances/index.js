import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, List, ListItemButton, ListItemSecondaryAction, ListItemText, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Delete } from '@mui/icons-material'

let bodyFormData = null

export default function Assurances(props) {
    const [cars, setCars] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const [currentAssuranceId, setCurrentAssuranceId] = useState(0)

    const [assuranceName, setAssuranceName] = useState('')
    const [assuranceType, setAssuranceType] = useState('')
    const [assuranceNumber, setAssuranceNumber] = useState('')
    const [assuranceIssueDate, setAssuranceIssueDate] = useState('')
    const [assuranceExpiryDate, setAssuranceExpiryDate] = useState('')
    const [assurance, setAssurance] = useState([])

    const [errorDate, setErrorDate] = useState(false)

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/${props.car}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setCars(response.data.data)
                        setIsFetched(true)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }


    const handleCreateAssurance = async (e) => {
        if (props.userRights?.split(',').includes('4') || JSON.parse(localStorage.getItem('data')).id == 1) {
            e.preventDefault()
            setIsLoading(true)
            setErrorDate(false)

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            bodyFormData.set('name', assuranceName)
            bodyFormData.set('type', assuranceType)
            bodyFormData.set('assuranceNumber', assuranceNumber)
            bodyFormData.set('carId', props.car)
            bodyFormData.set('issueDate', assuranceIssueDate)
            bodyFormData.set('expiryDate', assuranceExpiryDate)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/assurances`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setAssurance([])
                            bodyFormData.delete("file")
                            setIsSent(true)
                            setIsLoading(false)

                            setAssuranceName('')
                            setAssuranceType('')
                            setAssuranceNumber('')
                            setAssuranceIssueDate('')
                            setAssuranceExpiryDate('')

                            fetchData()
                        }
                    } catch {

                    }
                })
                .catch(function (error) {
                    console.log(error)
                    setIsLoading(false)
                    setErrorDate(true)
                })
        }
    }


    const handleDeleteAssurance = async () => {
        if (props.userRights?.split(',').includes('4') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/assurances/${currentAssuranceId}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            fetchData()
                            setIsLoading(false)
                            setCurrentAssuranceId(0)
                            setOpenAlert(false)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {

                })
        }
    }

    const handleSelectFile = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('file', e.target.files[i])
                setAssurance([previewFile])
            }
        }
    }

    useEffect(() => {
        fetchData()

    }, [])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des assurance</h2>
                </Grid>
            </Grid><br />
            {
                props.userRights?.split(',').includes('4') || JSON.parse(localStorage.getItem('data')).id == 1 ?
                    !isFetched ?
                        <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                            <CircularProgress />
                        </div> :
                        <Fragment>
                            {
                                cars.length === 0 ?
                                    <Typography textAlign={'center'} color={'GrayText'}><strong>Pas d'assurance ajoutée.</strong>.</Typography> :
                                    <Grid container spacing={3}>
                                        {
                                            cars.map((data, key) => {
                                                return (
                                                    <Grid xl={4} lg={5} item key={key}>
                                                        <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                            <Typography typography={'h5'} mb={1}>
                                                                {
                                                                    data.car ? <span>{data.car?.brand} {data.car?.model} {data.car?.year}</span> : "Non rempli "
                                                                }
                                                            </Typography>
                                                            <strong>{data.car.carPlateNumber}</strong>

                                                            <List>
                                                                {
                                                                    data.car.assurances.slice(0).reverse().map((assurance, key) => {
                                                                        return (
                                                                            <ListItemButton disableRipple sx={{ borderRadius: 5, overflow: 'hidden' }} key={key}>
                                                                                <ListItemText>
                                                                                    <div style={{ fontSize: 13, marginBottom: 10 }}>
                                                                                        <strong>Name :</strong> {assurance.name}<br />
                                                                                        <strong>Type :</strong> {assurance.type}<br />
                                                                                        <strong>Police d'assurance :</strong> {assurance.assuranceNumber}<br />
                                                                                        <strong>Date de délivrance: </strong> {assurance.issueDate.substring(0, 10)}<br />
                                                                                        <strong>Date d'expiration: </strong> {assurance.expiryDate.substring(0, 10)}<br />
                                                                                    </div>

                                                                                    {
                                                                                        assurance.file && <img src={`${process.env.REACT_APP_API_BASE_URL}/${assurance.file}`} width={'100%'} style={{ borderRadius: 10 }} />
                                                                                    }
                                                                                    <Button size='small' color={'error'} disableElevation onClick={() => {
                                                                                        setOpenAlert(true)
                                                                                        setCurrentAssuranceId(assurance.id)
                                                                                    }}>Supprimer l'assurance</Button>
                                                                                </ListItemText>
                                                                            </ListItemButton>
                                                                        )
                                                                    })
                                                                }
                                                            </List>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })
                                        }
                                        <Grid xl={2} lg={2} item></Grid>
                                        <Grid xl={4} lg={4} item>
                                            <Typography typography={'h4'}>
                                                Créer une assurance
                                            </Typography><br /><br />

                                            {
                                                isSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Assurance créée avec succès !</Typography>
                                            }

                                            {
                                                errorDate && <Typography bgcolor={'red'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Date de délivrance ou date d'expiration invalide !</Typography>
                                            }

                                            <form method='post' onSubmit={handleCreateAssurance}>
                                                <TextField label="Nom de l'assurance" variant="outlined" sx={{ mb: 2 }} fullWidth value={assuranceName} onChange={(e) => {
                                                    setAssuranceName(e.target.value)
                                                }} />
                                                <TextField label="Type de l'assurance" variant="outlined" sx={{ mb: 2 }} fullWidth value={assuranceType} onChange={(e) => {
                                                    setAssuranceType(e.target.value)
                                                }} />

                                                <TextField label="Police d'assurance" variant="outlined" sx={{ mb: 2 }} fullWidth value={assuranceNumber} onChange={(e) => {
                                                    setAssuranceNumber(e.target.value)
                                                }} />

                                                <Grid container spacing={2}>
                                                    <Grid xs={6} item>
                                                        <small><strong>Date de délivrance</strong></small>
                                                        {
                                                            assuranceIssueDate === '' ?
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker onChange={(e) => {
                                                                        const issueDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                        setAssuranceIssueDate(issueDate)
                                                                    }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                </LocalizationProvider> :
                                                                <div>
                                                                    <br />
                                                                    <strong>{assuranceIssueDate}</strong>&nbsp;
                                                                    <IconButton onClick={() => {
                                                                        setAssuranceIssueDate('')
                                                                    }}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </div>
                                                        }
                                                    </Grid>
                                                    <Grid xs={6} item>
                                                        <small><strong>Date d'expiration</strong></small>
                                                        {
                                                            assuranceExpiryDate === '' ?
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker onChange={(e) => {
                                                                        const expiryDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                        setAssuranceExpiryDate(expiryDate)
                                                                    }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                </LocalizationProvider> :
                                                                <div>
                                                                    <br />
                                                                    <strong>{assuranceExpiryDate}</strong>&nbsp;
                                                                    <IconButton onClick={() => {
                                                                        setAssuranceExpiryDate('')
                                                                    }}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </div>
                                                        }
                                                    </Grid>
                                                </Grid>


                                                {
                                                    assurance.length > 0 &&
                                                    <Fragment>
                                                        {
                                                            assurance.map((data, key) => {
                                                                return (
                                                                    <img src={data.path} key={key} alt="upload" width={'100%'} style={{ borderRadius: 15 }} />
                                                                )
                                                            })
                                                        }<br /><br />
                                                    </Fragment>
                                                }

                                                <div className="parent">
                                                    <div className="file-upload">
                                                        <h3>Photo de l'assurance</h3>
                                                        <p>Taille maximale 10mb</p>
                                                        <input type="file" accept='image/*' onInput={(e) => { handleSelectFile(e) }} />
                                                    </div>
                                                </div><br />

                                                <Button fullWidth type='submit' variant='contained' disableElevation disabled={
                                                    assuranceName.trim().length === 0 || assuranceType.trim().length === 0 || assuranceIssueDate.trim().length === 0 || assuranceExpiryDate.trim().length === 0 || assuranceNumber.trim().length === 0 || isLoading
                                                }>
                                                    <strong>{isLoading ? "Patientez ..." : "Soumettre"}</strong>
                                                </Button>
                                            </form>

                                        </Grid>
                                    </Grid>
                            }
                            <br /><br /><br />
                        </Fragment> :
                    <Typography textAlign={`center`} typography={`h5`}>
                        <br /><br /><br />
                        Non autorisé !
                    </Typography>
            }

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentAssuranceId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cette assurance ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cette assurance ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentAssuranceId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleDeleteAssurance()
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}
