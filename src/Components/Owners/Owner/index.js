import { Box, Button, ButtonGroup, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import { ArrowDownward, ArrowUpward, Check, Delete, Lock } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
}

export default function Owner(props) {
    const [openEmail, setOpenEmail] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false)
    const [openEmailAlert, setOpenEmailAlert] = React.useState(false)
    const [openOwnerAlert, setOpenOwnerAlert] = React.useState(false)
    const handleOpenModal = () => setOpenModal(true)

    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)

    const [isEmailDeleting, setIsEmailDeleting] = useState(false)
    const [isOwnerDeleting, setIsOwnerDeleting] = useState(false)

    const [currentEmailId, setCurrentEmailId] = React.useState(0)
    const [currentEmail, setCurrentEmail] = React.useState('')

    const [currentOwnerId, setCurrentOwnerId] = React.useState(0)
    const [currentOwnerName, setCurrentOwnerName] = React.useState('')

    const [additionnalEmail, setAdditionnalEmail] = React.useState('')

    const [owners, setOwners] = useState([])
    const [additionnalEmails, setAdditionnalEmails] = useState([])
    const [payments, setPayments] = React.useState([])

    const [amount, setAmount] = useState(0)
    const [wording, setWording] = useState('')

    const [password, setPassword] = useState('')
    const [updatePassword, setUpdatePassword] = useState(false)

    const [openSuccess, setOpenSuccess] = useState(false)


    const navigate = useNavigate()

    async function fetchPayments() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/payments/withdrawings/owner/${props.owner}/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setPayments(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/${props.owner}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setOwners(response.data.data)
                        setAdditionnalEmails(response.data.data[0].additionalEmails)
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

    useEffect(() => {

        fetchPayments()

        fetchData()

    }, [])

    const handleRemoveEmail = async (emailId) => {
        setIsEmailDeleting(true)
        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/owners/emails/${emailId}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setAdditionnalEmails(additionnalEmails.filter(item => item.id !== emailId))
                        setOpenEmailAlert(false)
                        setCurrentEmailId(0)
                        setCurrentEmail('')
                        setIsEmailDeleting(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const handleRemoveOwner = async (ownerId) => {
        if (props.userRights?.split(',').includes('6') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsOwnerDeleting(true)
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/owners/${ownerId}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            navigate(-1)
                            setIsOwnerDeleting(false)
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

    const handleAddEmail = async () => {

        const bodyFormData = new FormData()
        bodyFormData.set('ownerId', props.owner)
        bodyFormData.set('email', additionnalEmail)

        setIsOwnerDeleting(true)
        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/owners/emails/`,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setAdditionnalEmails(data => [...data, response.data.data[0]])
                        setAdditionnalEmail('')
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const hanhleCreatePayment = async (e) => {
        e.preventDefault()

        if (props.userRights?.split(',').includes('9') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            const bodyFormData = new FormData()
            bodyFormData.append('amount', amount)
            bodyFormData.append('wording', wording)
            bodyFormData.append('channel', "Cash")
            bodyFormData.append('operation', 'out')
            bodyFormData.append('author', 'admin')
            bodyFormData.append('ownerId', props.owner)

            await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/payments`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            fetchPayments()
                            fetchData()
                            setOpenModal(false)
                            setIsLoading(false)
                            setAmount(0)

                            setOpenSuccess(true)
                        }
                    } catch {
                        setIsLoading(false)
                    }
                })
                .catch(function (error) {
                    setIsLoading(false)
                })
        }

    }

    const handleClose = () => {
        setOpenModal(false)
    }

    const hanhleUpdatePassword = async () => {
        if (props.userRights?.split(',').includes('5') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsPasswordLoading(true)
    
            const bodyFormData = new FormData()
            bodyFormData.append('password', password)
            bodyFormData.append('email', owners[0].phoneNumber)
            await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/owners/new-password`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setIsPasswordLoading(false)
                            setUpdatePassword(false)
                        }
                    } catch {
                        setUpdatePassword(false)
                    }
                })
                .catch(function (error) {
                    setUpdatePassword(false)
                })
        }
    }

    useEffect(() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const passwordLength = 8;

        let newPassword = ''
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            newPassword += characters.charAt(randomIndex);
        }

        setPassword(newPassword)
    }, [])

    return (

        <Fragment>

            {
                (props.userRights?.split(',').includes('3') || JSON.parse(localStorage.getItem('data')).id == 1) ?
                    <Fragment>
                        {
                            !isFetched ?
                                <div style={{ textAlign: 'center', height: '80vh', lineHeight: '80vh' }}>
                                    <CircularProgress />
                                </div> :
                                <Fragment>
                                    <br /><br /><br />
                                    {
                                        owners.map((data, key) => {
                                            return (
                                                <Grid container spacing={2} key={key}>
                                                    <Grid xs={4} item>

                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 5, mb: 2 }}>
                                                            <Typography typography='h4' mb={2}>
                                                                <strong>{data.accountType === 'personnal' ? data.fullName : data.socialReason}</strong>
                                                            </Typography>

                                                            <Typography mt={2} mb={2} lineHeight={2} component={'div'}>
                                                                {data.accountType === 'enterprise' && <div><strong>Nom responsable :</strong> {data.responsibleFullName}</div>}
                                                                <div><strong>Type de compte :</strong> {data.accountType === 'enterprise' ? "Compte entreprise" : "Compte personnel"}</div>
                                                                <div><strong>Email :</strong> {data.email}</div>
                                                                <div><strong>Téléphone 1 :</strong> {data.phoneNumber}</div>
                                                                <div><strong>Téléphone 2 :</strong> {(!data.phoneNumberBis || data.phoneNumberBis === '228') ? <i>Non renseigné !</i> : data.phoneNumberBis}</div>
                                                                <div><strong>Type de carte :</strong> {data.cardType.name}</div>
                                                                <div><strong>Numéro de carte:</strong> {data.idCardNumber}</div>
                                                            </Typography>

                                                            <small><strong>Solde de compte</strong></small><br />
                                                            <Typography typography={'h4'} mb={3} mt={1}><b style={{ color: 'green' }}>{data.balance} F CFA</b></Typography>

                                                            <ButtonGroup variant="outlined" aria-label="outlined button group" fullWidth>
                                                                <Button sx={{ borderRadius: 5 }} color='success' onClick={handleOpenModal} disabled={!props.userRights?.split(',').includes('9') && JSON.parse(localStorage.getItem('data')).id != 1}><strong>Retrait</strong></Button>

                                                                <Modal
                                                                    open={openModal}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="modal-modal-title"
                                                                    aria-describedby="modal-modal-description">

                                                                    <form method='post' onSubmit={hanhleCreatePayment}>
                                                                        <Box sx={style}>
                                                                            <Typography id="modal-modal-title" variant="h6" component="h2" mb={1}>
                                                                                <strong>Effectuer un retrait</strong>
                                                                            </Typography>

                                                                            <Typography mt={1}>
                                                                                <small>
                                                                                    Cette action consiste à faire un retrait du compte du propriétaire une somme présente au préalable sur son porte-feuille.<br />
                                                                                </small>
                                                                            </Typography><br />

                                                                            <FormControl fullWidth>
                                                                                <InputLabel htmlFor="outlined-adornment-amount">Montant du paiement en F CFA</InputLabel>
                                                                                <OutlinedInput
                                                                                    id="outlined-adornment-amount"
                                                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                                                    label="Montant du paiement en F CFA"
                                                                                    value={amount}
                                                                                    onChange={(e) => {
                                                                                        if ((e.target.value > 0 && e.target.value < 100000000) || e.target.value.trim().length === 0) {
                                                                                            setAmount(e.target.value)
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </FormControl><br /><br />

                                                                            <FormControl fullWidth>
                                                                                <InputLabel htmlFor="outlined-adornment-wotding">Motif de la transaction</InputLabel>
                                                                                <OutlinedInput
                                                                                    id="outlined-adornment-wotding"
                                                                                    label="Saisir le motif"
                                                                                    value={wording}
                                                                                    onChange={(e) => {
                                                                                        setWording(e.target.value)
                                                                                    }}
                                                                                />
                                                                            </FormControl><br /><br />

                                                                            <Button type='submit' variant='contained' fullWidth disableElevation size='large' disabled={amount === 0 || amount.trim().length === 0 || amount > data.balance || isLoading}>
                                                                                <b>{isLoading ? "Patientez ..." : "Soumettre"}</b>
                                                                            </Button>
                                                                        </Box>
                                                                    </form>
                                                                </Modal>

                                                                {
                                                                    data.accountType === 'enterprise' &&
                                                                    <Fragment>
                                                                        <Button id="basic-button"
                                                                            onClick={() => { setOpenEmail(!openEmail) }} disabled={isLoading || (!props.userRights?.split(',').includes('3') && JSON.parse(localStorage.getItem('data')).id != 1)}><strong>Email</strong></Button>
                                                                    </Fragment>
                                                                }

                                                                <Button onClick={() => {
                                                                    navigate('/admins/owner-' + data.id)
                                                                }} disabled={isLoading || (!props.userRights?.split(',').includes('3') && JSON.parse(localStorage.getItem('data')).id != 1)}><strong>Modifier</strong></Button>
                                                                <Button color='error' onClick={() => {
                                                                    setUpdatePassword(!updatePassword)
                                                                }} disabled={isLoading || (!props.userRights?.split(',').includes('5') && JSON.parse(localStorage.getItem('data')).id != 1)}>
                                                                    <Lock />
                                                                </Button>
                                                                <Button color='error' sx={{ borderRadius: 5 }} onClick={() => {
                                                                    setOpenOwnerAlert(true)
                                                                    setCurrentOwnerId(data.id)
                                                                    setCurrentOwnerName(data.accountType === 'personnal' ? data.fullName : data.socialReason)
                                                                }} disabled={isLoading || (!props.userRights?.split(',').includes('6') && JSON.parse(localStorage.getItem('data')).id != 1)}><Delete /></Button>
                                                            </ButtonGroup><br /><br />

                                                            {
                                                                updatePassword &&
                                                                <Grid container>
                                                                    <Grid item xs={10}>
                                                                        <TextField label="Mot de passe" variant="outlined" sx={{ mb: 2 }} fullWidth value={password} onChange={(e) => {
                                                                            setPassword(e.target.value)
                                                                        }} />
                                                                    </Grid>
                                                                    <Grid item xs={2}>
                                                                        <IconButton color='success' onClick={hanhleUpdatePassword} disabled={isPasswordLoading}>
                                                                            <Check />
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            }


                                                            {
                                                                openEmail &&

                                                                <Grid container spacing={2}>
                                                                    <Grid xl={10} lg={9} item>
                                                                        <TextField label="Email additionnel" variant="outlined" sx={{ mb: 2 }} value={additionnalEmail} fullWidth onChange={(e) => {
                                                                            setAdditionnalEmail(e.target.value)
                                                                        }} />
                                                                    </Grid>
                                                                    <Grid xl={2} lg={3} item alignContent={'right'}>
                                                                        <IconButton size='large' color='success' sx={{ mt: 1 }} onClick={handleAddEmail}><Check /></IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            }

                                                            {
                                                                additionnalEmails.length > 0 &&
                                                                <Fragment>
                                                                    <strong>E-mails additionnels</strong><br />
                                                                    <List dense>
                                                                        {
                                                                            additionnalEmails.map((additionnalEmail, key) => {
                                                                                return (
                                                                                    <ListItem key={key}
                                                                                        secondaryAction={

                                                                                            <IconButton edge="end" color='error' aria-label="delete" onClick={() => {
                                                                                                setOpenEmailAlert(true)
                                                                                                setCurrentEmailId(additionnalEmail.id)
                                                                                                setCurrentEmail(additionnalEmail.email)
                                                                                            }}>
                                                                                                <Delete />
                                                                                            </IconButton>
                                                                                        }>
                                                                                        <ListItemText primary={additionnalEmail.email} />
                                                                                    </ListItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </List><br />
                                                                </Fragment>
                                                            }

                                                            <Dialog
                                                                open={openOwnerAlert}
                                                                onClose={() => {
                                                                    setOpenOwnerAlert(false)
                                                                    setCurrentOwnerId(0)
                                                                    setCurrentOwnerName('')
                                                                }}
                                                                aria-labelledby="alert-dialog-title"
                                                                aria-describedby="alert-dialog-description"
                                                            >
                                                                <DialogTitle id="alert-dialog-title">
                                                                    {"Supprimer ce propriéraire de la lise ?"}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText id="alert-dialog-description">
                                                                        Êtes-vous sûr(e) de vouloir supprimer le propriétaire "<strong>{currentOwnerName}</strong>" et toutes ses instances ? Cette action sera défintive et irréversible !
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={() => {
                                                                        setOpenOwnerAlert(false)
                                                                        setCurrentOwnerId(0)
                                                                        setCurrentOwnerName('')
                                                                    }}>Fermer</Button>
                                                                    <Button color='error' onClick={() => {
                                                                        handleRemoveOwner(currentOwnerId)
                                                                    }} autoFocus>
                                                                        {isOwnerDeleting ? "Patientez ..." : "Supprimer"}
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>


                                                            <Dialog
                                                                open={openEmailAlert}
                                                                onClose={() => {
                                                                    setOpenEmailAlert(false)
                                                                    setCurrentEmailId(0)
                                                                    setCurrentEmail('')
                                                                }}
                                                                aria-labelledby="alert-dialog-title"
                                                                aria-describedby="alert-dialog-description"
                                                            >
                                                                <DialogTitle id="alert-dialog-title">
                                                                    {"Supprimer cette adresse e-mail additionnelle ?"}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText id="alert-dialog-description">
                                                                        Êtes-vous sûr(e) de vouloir ce e-mail "<strong>{currentEmail}</strong>" ? Cette action sera défintive et irréversible !
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={() => {
                                                                        setOpenEmailAlert(false)
                                                                        setCurrentEmailId(0)
                                                                        setCurrentEmail('')
                                                                    }}>Fermer</Button>
                                                                    <Button color='error' onClick={() => {
                                                                        handleRemoveEmail(currentEmailId)
                                                                    }} autoFocus>
                                                                        {isEmailDeleting ? "Patientez ..." : "Supprimer"}
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>

                                                            {
                                                                data.idCard?.length > 0 &&
                                                                <Fragment>
                                                                    <strong>Carte identité</strong>
                                                                    <img src={process.env.REACT_APP_API_BASE_URL + "/" + data.idCard} alt="License Image" width={'100%'} style={{ borderRadius: 5, marginTop: 10 }} /><br /><br />
                                                                </Fragment>
                                                            }
                                                            {
                                                                data.accountType === 'enterprise' &&
                                                                <Fragment>
                                                                    {
                                                                        data.cfeCard?.length > 0 &&
                                                                        <Fragment>
                                                                            <strong>Carte CFE</strong>
                                                                            <img src={process.env.REACT_APP_API_BASE_URL + "/" + data.cfeCard} alt="License Image" width={'100%'} style={{ borderRadius: 5, marginTop: 10 }} /><br /><br />
                                                                        </Fragment>
                                                                    }
                                                                </Fragment>
                                                            }

                                                        </Card>
                                                    </Grid>
                                                    <Grid xs={4} item>
                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 5 }}>

                                                            <Typography style={{ color: 'GrayText' }} typography={'h6'} mt={2}><strong>Historique de retraits</strong></Typography>

                                                            <List>
                                                                {
                                                                    payments.slice(0).reverse().map((paymentData, key) => {
                                                                        return (
                                                                            <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} key={key}>
                                                                                <ListItemIcon>
                                                                                    {
                                                                                        paymentData.operation === 'in' ? <ArrowDownward sx={{ color: 'green' }} /> : <ArrowUpward sx={{ color: 'red' }} />
                                                                                    }
                                                                                </ListItemIcon>
                                                                                <ListItemText>
                                                                                    <div style={{ fontSize: 13 }}>
                                                                                        <strong>Montant :</strong> <strong style={{ color: 'green' }}>{paymentData.amount} F CFA</strong><br />
                                                                                        {
                                                                                            paymentData.operation === 'in' &&
                                                                                            <Fragment>
                                                                                                <strong>Source d'entrée: </strong> <b style={{ color: 'red' }}>{paymentData.entrySource}</b><br />
                                                                                                {paymentData.channel && <div><strong>Canal: </strong> {paymentData.channel}</div>}
                                                                                            </Fragment>
                                                                                        }
                                                                                        {
                                                                                            paymentData.operation === 'out' &&
                                                                                            <Fragment>
                                                                                                <strong>Téléphone: </strong> {paymentData.phoneNumber || <i>Non renseigné !</i>}<br />
                                                                                                <strong>Auteur: </strong> <b style={{ color: 'blue' }}>{paymentData.author === 'admin' ? 'Admin' : 'Utiisateur'}</b><br />
                                                                                            </Fragment>
                                                                                        }
                                                                                        {
                                                                                            (paymentData.entrySource === 'Location' || paymentData.entrySource === 'Vente') &&
                                                                                            <Fragment>
                                                                                                <strong>Nom complet: </strong> {paymentData.fullName}<br />
                                                                                                <strong>Téléphone: </strong> {paymentData.phoneNumber}<br />
                                                                                            </Fragment>
                                                                                        }
                                                                                        <strong>Modif: </strong>{paymentData.wording || 'Pas de motif.'}<br />
                                                                                        <strong>Date: </strong>{paymentData.createdAt.substring(0, 10)} {paymentData.createdAt.substring(11, 16)}<br />
                                                                                    </div>
                                                                                </ListItemText>
                                                                            </ListItemButton>
                                                                        )
                                                                    })
                                                                }
                                                            </List>

                                                        </Card>
                                                    </Grid>
                                                    <Grid xs={4} item>
                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 5 }}>

                                                            <Typography style={{ color: 'GrayText' }} typography={'h6'} mt={2}><strong>Liste des véhicules</strong></Typography>

                                                            <List>
                                                                {
                                                                    data.cars.slice(0).reverse().map((carData, key) => {
                                                                        return (
                                                                            <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} key={key} onClick={() => {
                                                                                navigate('/admins/cars-' + carData.id)
                                                                            }}>
                                                                                <ListItemText>
                                                                                    <div style={{ fontSize: 13 }}>
                                                                                        <strong>Maque :</strong> {carData.brand}<br />
                                                                                        <strong>Modèle :</strong> {carData.model}<br />
                                                                                        <strong>Année: </strong> {carData.year}<br />
                                                                                        <strong>Imatriculation: </strong> {carData.carPlateNumber}<br />
                                                                                    </div>
                                                                                </ListItemText>
                                                                            </ListItemButton>
                                                                        )
                                                                    })
                                                                }
                                                            </List>

                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Fragment>
                        }
                    </Fragment> :
                    <Typography textAlign={`center`} typography={`h5`}>
                        <br /><br /><br />
                        Non autorisé !
                    </Typography>
            }


            <Dialog
                open={openSuccess}
                onClose={() => {
                    setOpenSuccess(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    <strong>Opération effectuée !</strong>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Le retrait que vous venez de faire a été effectué avec succès !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenSuccess(false)
                    }}>
                        <strong>Ok d'accord</strong>
                    </Button>
                </DialogActions>
            </Dialog>

        </Fragment>
    )
}
