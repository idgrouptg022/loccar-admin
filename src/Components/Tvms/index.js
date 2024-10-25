import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, List, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Delete } from '@mui/icons-material'

let bodyFormData = null

export default function Tvms(props) {
    const [cars, setCars] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const [currentTvmId, setCurrentTvmId] = useState(0)

    const [tvmNumber, setTvmNumber] = useState('')
    const [tvmIssueDate, setTvmIssueDate] = useState('')
    const [tvmExpiryDate, setTvmExpiryDate] = useState('')
    const [tvm, setTvm] = useState([])

    const [errorDate, setErrorDate] = useState(false)

    async function fetchData(carId) {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/${carId}`,
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


    const handleCreateTvm = async (e) => {
        if (props.userRights?.split(',').includes('4') || JSON.parse(localStorage.getItem('data')).id === 1) {
            e.preventDefault()
            setIsLoading(true)
            setErrorDate(false)

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }
            bodyFormData.set('tvmNumber', tvmNumber)
            bodyFormData.set('issueDate', tvmIssueDate)
            bodyFormData.set('expiryDate', tvmExpiryDate)
            bodyFormData.set('carId', props.car)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/tvms`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setTvm([])
                            bodyFormData.delete("file")
                            setIsSent(true)
                            setIsLoading(false)

                            setTvmNumber('')
                            setTvmIssueDate('')
                            setTvmExpiryDate('')

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


    const handleDeleteTvm = async () => {
        if (props.userRights?.split(',').includes('4') || JSON.parse(localStorage.getItem('data')).id === 1) {
            setIsLoading(true)

            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/tvms/${currentTvmId}`,
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
                            setCurrentTvmId(0)
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
                setTvm([previewFile])
            }
        }
    }

    useEffect(() => {
        fetchData(props.car)
    }, [props.car])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des TVMs</h2>
                </Grid>
            </Grid><br />
            {
                props.userRights?.split(',').includes('4') || JSON.parse(localStorage.getItem('data')).id === 1 ?
                    !isFetched ?
                        <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                            <CircularProgress />
                        </div> :
                        <Fragment>
                            {
                                cars.length === 0 ?
                                    <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de TVM ajoutée.</strong>.</Typography> :
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
                                                                    data.car.tvms.slice(0).reverse().map((tvm, key) => {
                                                                        return (
                                                                            <ListItemButton disableRipple sx={{ borderRadius: 5, overflow: 'hidden' }} key={key}>
                                                                                <ListItemText>
                                                                                    <div style={{ fontSize: 13, marginBottom: 10 }}>
                                                                                        <strong>Numéro :</strong> {tvm.tvmNumber}<br />
                                                                                        <strong>Date de délivrance: </strong> {tvm.issueDate.substring(0, 10)}<br />
                                                                                        <strong>Date d'expiration: </strong> {tvm.expiryDate.substring(0, 10)}<br />
                                                                                    </div>

                                                                                    {
                                                                                        tvm.file && <img alt='TVM' src={`${process.env.REACT_APP_API_BASE_URL}/${tvm.file}`} width={'100%'} style={{ borderRadius: 10 }} />
                                                                                    }
                                                                                    <Button size='small' color={'error'} disableElevation onClick={() => {
                                                                                        setOpenAlert(true)
                                                                                        setCurrentTvmId(tvm.id)
                                                                                    }}>Supprimer la TVM</Button>
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
                                                Créer une TVM
                                            </Typography><br /><br />

                                            {
                                                isSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>TVM créée avec succès !</Typography>
                                            }

                                            {
                                                errorDate && <Typography bgcolor={'red'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Date de délivrance ou date d'expiration invalide !</Typography>
                                            }

                                            <form method='post' onSubmit={handleCreateTvm}>
                                                <TextField label="Numéro de la TVM" variant="outlined" sx={{ mb: 2 }} fullWidth value={tvmNumber} onChange={(e) => {
                                                    setTvmNumber(e.target.value)
                                                }} />

                                                <Grid container spacing={2}>
                                                    <Grid xs={6} item>
                                                        <small><strong>Date de délivrance</strong></small>
                                                        {
                                                            tvmIssueDate === '' ?
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker onChange={(e) => {
                                                                        const issueDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                        setTvmIssueDate(issueDate)
                                                                    }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                </LocalizationProvider> :
                                                                <div>
                                                                    <br />
                                                                    <strong>{tvmIssueDate}</strong>&nbsp;
                                                                    <IconButton onClick={() => {
                                                                        setTvmIssueDate('')
                                                                    }}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </div>
                                                        }
                                                    </Grid>
                                                    <Grid xs={6} item>
                                                        <small><strong>Date d'expiration</strong></small>
                                                        {
                                                            tvmExpiryDate === '' ?
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker onChange={(e) => {
                                                                        const expiryDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                        setTvmExpiryDate(expiryDate)
                                                                    }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                </LocalizationProvider> :
                                                                <div>
                                                                    <br />
                                                                    <strong>{tvmExpiryDate}</strong>&nbsp;
                                                                    <IconButton onClick={() => {
                                                                        setTvmExpiryDate('')
                                                                    }}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </div>
                                                        }
                                                    </Grid>
                                                </Grid>


                                                {
                                                    tvm.length > 0 &&
                                                    <Fragment>
                                                        {
                                                            tvm.map((data, key) => {
                                                                return (
                                                                    <img src={data.path} key={key} alt="upload" width={'100%'} style={{ borderRadius: 15 }} />
                                                                )
                                                            })
                                                        }<br /><br />
                                                    </Fragment>
                                                }

                                                <div className="parent">
                                                    <div className="file-upload">
                                                        <h3>Photo de la TVM</h3>
                                                        <p>Taille maximale 10mb</p>
                                                        <input type="file" accept='image/*' onInput={(e) => { handleSelectFile(e) }} />
                                                    </div>
                                                </div><br />

                                                <Button fullWidth type='submit' variant='contained' disableElevation disabled={
                                                    tvmNumber.trim().length === 0 || tvmIssueDate.trim().length === 0 || tvmIssueDate.trim().length === 0 || isLoading
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
                    setCurrentTvmId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cette visite ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cette visite technique ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentTvmId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleDeleteTvm()
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}
