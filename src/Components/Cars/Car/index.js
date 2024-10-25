import { Autocomplete, Box, Button, ButtonGroup, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Modal, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { Fragment, useEffect } from 'react'
import { ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { red } from '@mui/material/colors'

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

const sources = [
    "Course",
    "Location",
    "Vente"
]

const channels = [
    "Cash",
    "Mobile money"
]

export default function Car(props) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const [openModal, setOpenModal] = React.useState(false)
    const handleOpenModal = () => setOpenModal(true)

    const [cars, setCars] = React.useState([])
    const [payments, setPayments] = React.useState([])
    const [isFetched, setIsFetched] = React.useState(false)

    const [source, setSource] = React.useState(sources[0])
    const [amount, setAmount] = React.useState(0)
    const [channel, setChannel] = React.useState(channels[0])
    const [fullName, setFullName] = React.useState('')
    const [phoneNumber, setPhoneNumber] = React.useState('')

    const [isLoading, setIsLoading] = React.useState(false)
    const [isCarDeleting, setIsCarDeleting] = React.useState(false)

    const [openCarAlert, setOpenCarAlert] = React.useState(false)

    const [openSuccess, setOpenSuccess] = React.useState(false)
    const [openAmount, setOpenAmount] = React.useState(false)

    const navigate = useNavigate()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
        setOpenModal(false)
    }

    async function fetchPayments() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/payments/car/${props.car}/list`,
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

    const hanhleCreatePayment = async () => {
        if (props.userRights?.split(',').includes('8') || JSON.parse(localStorage.getItem('data')).id == 1) {
            // e.preventDefault()
            setIsLoading(true)

            const bodyFormData = new FormData()
            bodyFormData.append('amount', amount)
            bodyFormData.append('channel', channel.trim())
            bodyFormData.append('operation', 'in')
            if (source === 'Location' || source === 'Vente') {
                bodyFormData.append('fullName', fullName.trim())
                bodyFormData.append('phoneNumber', phoneNumber.trim())
            }

            bodyFormData.append('entrySource', source.trim())
            bodyFormData.append('carId', props.car)

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
                            setOpenModal(false)
                            setIsLoading(false)
                            setSource(sources[0])
                            setChannel(channels[0])
                            setAmount(0)
                            setFullName('')
                            setPhoneNumber('')

                            setOpenSuccess(true)
                            setOpenAmount(false)
                        }
                    } catch {
                        setIsLoading(false)
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
                    setIsLoading(false)
                })
        }
    }

    useEffect(() => {
        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/owners/cars/${props.car}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
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
                    //
                })
        }

        fetchData()

        fetchPayments()

    }, [])

    const handleCreateItem = async (target, ownerId) => {
        if (props.userRights?.split(',').includes('4') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            let url

            const bodyFormData = new FormData()

            switch (target) {
                case 'breakdowns':
                    url = `${process.env.REACT_APP_API_URL}/breakdowns`
                    break

                case 'maintenances':
                    url = `${process.env.REACT_APP_API_URL}/maintenances`
                    bodyFormData.append('wording', "Maintenance voiture " + cars[0].carPlateNumber)
                    break

                case 'accidents':
                    url = `${process.env.REACT_APP_API_URL}/accidents`
                    break

                default:
                    break
            }

            bodyFormData.append('ownerId', ownerId)
            bodyFormData.append('carId', props.car)

            await axios({
                method: "post",
                url: url,
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
                            navigate('/admins/' + target + '-' + response.data.data[0].id)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    setIsLoading(false)
                    console.log(error.response);
                })
        }
    }

    const handleRemoveCar = async () => {
        if (props.userRights?.split(',').includes('7') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsCarDeleting(true)
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/owners/cars/${props.car}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            navigate(-1)
                            setIsCarDeleting(false)
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

    return (

        <Fragment>
            <br /><br /><br />
            {
                !isFetched ?
                    <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                        <CircularProgress />
                    </div> :
                    <Grid container spacing={2}>
                        {
                            cars.map((carData, key) => {
                                return (
                                    <Fragment key={key}>
                                        <Grid xs={4} item>

                                            <Card variant="outlined" sx={{ p: 2, borderRadius: 5, mb: 2 }}>
                                                <Typography typography='h4' mb={2}>
                                                    <strong>{carData.car.brand} {carData.car.model} {carData.car.year}</strong>
                                                </Typography>
                                                <Typography typography='h5' color={'GrayText'} mb={2}>
                                                    <strong>{carData.car.carPlateNumber}</strong>
                                                </Typography>

                                                <Typography mb={2} mt={2} lineHeight={2}>
                                                    <strong>Fonction:</strong> [Course{carData.car.isOnLocation && ", Location"}{carData.car.isOnShop && ", Vente"}]<br />
                                                    <strong>Géolocalisation:</strong> {carData.car.geolocation ? "Oui" : "NON"}<br />
                                                    <strong>Catégorie:</strong> {carData.car.category?.name || "Non senseigné."}<br />
                                                </Typography>

                                                <ButtonGroup variant="outlined" size='small' aria-label="outlined button group" fullWidth>
                                                    <Button
                                                        disabled={isLoading || (!props.userRights?.split(',').includes('8') && JSON.parse(localStorage.getItem('data')).id != 1)}
                                                        sx={{ borderRadius: 5 }} color='success' onClick={handleOpenModal}>
                                                        <strong><small>Versement</small></strong>
                                                    </Button>

                                                    <Modal
                                                        open={openModal}
                                                        onClose={handleClose}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                    >
                                                        <Box sx={style}>
                                                            <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                                                                <strong>Effectuer un versement</strong>
                                                            </Typography>

                                                            <Typography mt={1}>
                                                                <small>
                                                                    Cette action consiste faire un versement sur le compte de la voiture.<br />
                                                                </small>
                                                            </Typography><br />

                                                            <Autocomplete
                                                                value={channel}
                                                                clearIcon={false}
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setChannel(newValue)
                                                                    } else {
                                                                        setChannel('')
                                                                    }
                                                                }}
                                                                disablePortal
                                                                options={channels}
                                                                getOptionLabel={(option) => option}
                                                                sx={{ mb: 2 }}
                                                                renderInput={(params) => <TextField {...params} label="Canal de versement" />}
                                                            />

                                                            <Grid container spacing={2}>
                                                                <Grid item xs={4}>
                                                                    <Autocomplete
                                                                        value={source}
                                                                        clearIcon={false}
                                                                        onChange={(event, newValue) => {
                                                                            if (newValue) {
                                                                                setSource(newValue)
                                                                            } else {
                                                                                setSource('')
                                                                            }
                                                                        }}
                                                                        disablePortal
                                                                        options={sources}
                                                                        getOptionLabel={(option) => option}
                                                                        sx={{ mb: 2 }}
                                                                        renderInput={(params) => <TextField {...params} label="Source" />}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={8}>
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
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>

                                                            {
                                                                source !== 'Course' &&
                                                                <Fragment>
                                                                    <TextField
                                                                        required
                                                                        fullWidth
                                                                        label="Nom complet"
                                                                        variant="outlined"
                                                                        disabled={isLoading}
                                                                        value={fullName}
                                                                        onChange={(e) => {
                                                                            setFullName(e.target.value)
                                                                        }}
                                                                    /><br /><br />

                                                                    <TextField
                                                                        required
                                                                        fullWidth
                                                                        label="Numéro de téléphone"
                                                                        variant="outlined"
                                                                        disabled={isLoading}
                                                                        value={phoneNumber}
                                                                        onChange={(e) => {
                                                                            setPhoneNumber(e.target.value)
                                                                        }}
                                                                    /><br /><br />
                                                                </Fragment>
                                                            }

                                                            <Button variant='contained' type='submit' disabled={channel.trim().length === 0 || amount === 0 || amount.trim().length === 0 || source.trim().length === 0} disableElevation fullWidth size='large' onClick={() => {
                                                                setOpenAmount(true)
                                                            }}>
                                                                <strong>{isLoading ? "Patientez" : "Payer"}</strong>
                                                            </Button>

                                                            <br /><br />
                                                        </Box>
                                                    </Modal>

                                                    <Button id="basic-button"
                                                        aria-controls={open ? 'basic-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={handleClick}><strong><small>Créer</small></strong></Button>

                                                    <Menu
                                                        id="basic-menu"
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'basic-button',
                                                        }}>
                                                        <MenuItem onClick={() => {
                                                            handleClose()
                                                            navigate('/admins/assurances-' + carData.car.id)
                                                        }}>Assurance</MenuItem>
                                                        <MenuItem onClick={() => {
                                                            handleClose()
                                                            navigate('/admins/technical-visits-' + carData.car.id)
                                                        }} disabled={isLoading || (!props.userRights?.split(',').includes('4') && JSON.parse(localStorage.getItem('data')).id != 1)}>Visite technique</MenuItem>
                                                        <MenuItem onClick={() => {
                                                            handleClose()
                                                            navigate('/admins/tvms-' + carData.car.id)
                                                        }} disabled={isLoading || (!props.userRights?.split(',').includes('4') && JSON.parse(localStorage.getItem('data')).id != 1)}>TVM</MenuItem>
                                                        <MenuItem onClick={() => {
                                                            handleCreateItem("maintenances", carData.car.ownerId)
                                                        }} disabled={isLoading || (!props.userRights?.split(',').includes('4') && JSON.parse(localStorage.getItem('data')).id != 1)}>Entretien</MenuItem>
                                                        <MenuItem disabled={isLoading} onClick={() => {
                                                            handleCreateItem("breakdowns", carData.car.ownerId)
                                                        }}>Panne</MenuItem>
                                                        <MenuItem disabled={isLoading} onClick={() => {
                                                            handleCreateItem("accidents", carData.car.ownerId)
                                                        }}>Accident</MenuItem>
                                                    </Menu>

                                                    <Button onClick={() => {
                                                        navigate('/admins/car-' + carData.car.id)
                                                    }} disabled={isLoading || (!props.userRights?.split(',').includes('4') && JSON.parse(localStorage.getItem('data')).id != 1)}><strong><small>Modifier</small></strong></Button>
                                                    <Button color='error' sx={{ borderRadius: 5 }} onClick={() => {
                                                        setOpenCarAlert(true)
                                                    }} disabled={isLoading || (!props.userRights?.split(',').includes('7') && JSON.parse(localStorage.getItem('data')).id != 1)}><Delete /></Button>
                                                </ButtonGroup>

                                                <Grid container spacing={1}>
                                                    {
                                                        carData.car.carPhotos.map((photo, key) => {
                                                            return (
                                                                <Grid item xs={3} key={key}>
                                                                    <Typography borderRadius={3} mt={2} sx={{
                                                                        backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/${photo.carPhoto})`,
                                                                        height: 100,
                                                                        backgroundSize: 'cover',
                                                                        backgroundPosition: 'center'
                                                                    }}></Typography>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Grid>

                                            </Card>

                                            <Card variant="outlined" sx={{ p: 2, borderRadius: 5 }}>
                                                <h2 style={{ color: 'blue' }}><strong>Informations du propriétaire</strong></h2><br />

                                                <small>Référence</small><br />
                                                <Link to={'/admins/owners-' + carData.owner.id}><strong>{carData.owner.ref}</strong></Link><br /><br />

                                                <small>Type de compte</small><br />
                                                <strong>{carData.owner.accountType === 'personnal' ? 'Personnel' : 'Entreprise'}</strong><br /><br />

                                                <small>Téléphone</small><br />
                                                <strong>{carData.owner.phoneNumber}</strong><br /><br />

                                                <small>E-mail</small><br />
                                                <strong>{(carData.owner.email && carData.owner.email.length > 0) ? carData.owner.email : "Non renseigné"}</strong><br /><br />

                                                {
                                                    carData.owner.accountType === 'enterptise' ?
                                                        <Fragment>
                                                            <small>Raison sociale</small><br />
                                                            <strong>{carData.owner.socialReason}</strong><br /><br />
                                                            <small>NIF</small><br />
                                                            <strong>{carData.owner.nif}</strong><br /><br />

                                                            <small>RCCM</small><br />
                                                            <strong>{carData.owner.rccm}</strong><br /><br />

                                                            <small>Nom complet du responsable</small><br />
                                                            <strong>{carData.owner.responsibleFullName}</strong><br /><br /><br />
                                                        </Fragment> :
                                                        <Fragment>
                                                            <small>Nom complet</small><br />
                                                            <strong>{carData.owner.fullName}</strong><br /><br />
                                                        </Fragment>
                                                }

                                                <small>Numéro de carte</small><br />
                                                <strong>{carData.owner.idCardNumber}</strong><br /><br />

                                                {
                                                    carData.owner.cfeCard &&
                                                    <Fragment><br /><br />
                                                        <strong>Carte CFE</strong>
                                                        <img src={`${process.env.REACT_APP_API_BASE_URL}/${carData.owner.cfeCard}`} alt="License Image" width={'100%'} style={{ borderRadius: 5 }} /><br /><br />
                                                    </Fragment>
                                                }

                                                {
                                                    carData.owner.idCard &&
                                                    <Fragment><br /><br />
                                                        <strong>Document d'identité</strong>
                                                        <img src={`${process.env.REACT_APP_API_BASE_URL}/${carData.owner.idCard}`} alt="License Image" width={'100%'} style={{ borderRadius: 5 }} /><br /><br />
                                                    </Fragment>
                                                }

                                            </Card>
                                        </Grid>
                                        <Grid xs={4} item>
                                            <Card variant="outlined" sx={{ p: 2, borderRadius: 5 }}>

                                                <Typography style={{ color: 'blue' }} typography={'h6'}>
                                                    <strong>Dernière assurance</strong>&nbsp;&nbsp;
                                                    {
                                                        carData.car.assurances.length > 0 &&
                                                        <Fragment>
                                                            {carData.car.assurances[carData.car.assurances.length - 1].expiryDate.substring(0, 10).replace(/-0+/g, '-') < (new Date().getFullYear() + "-" + (new Date().getMonth() > 9 ? "" : "0") + (new Date().getMonth() + 1) + "-" + new Date().getDate()) ? <strong style={{ color: 'red' }}>Expiré</strong> : <strong style={{ color: 'green' }}>En cours</strong>}
                                                        </Fragment>
                                                    }
                                                </Typography>

                                                {
                                                    carData.car.assurances.length > 0 &&
                                                    <List>
                                                        <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }}>
                                                            <ListItemText>
                                                                <div style={{ fontSize: 13, marginBottom: 10 }}>
                                                                    <strong>Name :</strong> {carData.car.assurances[carData.car.assurances.length - 1].name}<br />
                                                                    <strong>Type :</strong> {carData.car.assurances[carData.car.assurances.length - 1].type}<br />
                                                                    <strong>Police d'assurance :</strong> {carData.car.assurances[carData.car.assurances.length - 1].assuranceNumber}<br />
                                                                    <strong>Date de délivrance: </strong> {carData.car.assurances[carData.car.assurances.length - 1].issueDate.substring(0, 10)}<br />
                                                                    <strong>Date d'expiration: </strong> <strong>{carData.car.assurances[carData.car.assurances.length - 1].expiryDate.substring(0, 10)}</strong><br />
                                                                </div>
                                                                {
                                                                    carData.car.assurances[carData.car.assurances.length - 1].file && <img src={`${process.env.REACT_APP_API_BASE_URL}/${carData.car.assurances[carData.car.assurances.length - 1].file}`} alt="License Image" width={'100%'} style={{ borderRadius: 5 }} />
                                                                }
                                                            </ListItemText>
                                                        </ListItemButton>
                                                    </List>
                                                }

                                                <Typography style={{ color: 'blue' }} mt={3} typography={'h6'}>
                                                    <strong>Dernière visite technique</strong>&nbsp;&nbsp;
                                                    {
                                                        carData.car.technicalVisits.length > 0 &&
                                                        <Fragment>
                                                            {carData.car.technicalVisits[carData.car.technicalVisits.length - 1].expiryDate.substring(0, 10).replace(/-0+/g, '-') < (new Date().getFullYear() + "-" + (new Date().getMonth() > 9 ? "" : "0") + (new Date().getMonth() + 1) + "-" + new Date().getDate()) ? <strong style={{ color: 'red' }}>Expiré</strong> : <strong style={{ color: 'green' }}>En cours</strong>}
                                                        </Fragment>
                                                    }
                                                </Typography>

                                                {
                                                    carData.car.technicalVisits.length > 0 &&
                                                    <List>
                                                        <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }}>
                                                            <ListItemText>
                                                                <div style={{ fontSize: 13, marginBottom: 10 }}>
                                                                    <strong>Date de délivrance: </strong> {carData.car.technicalVisits[carData.car.technicalVisits.length - 1].issueDate.substring(0, 10)}<br />
                                                                    <strong>Date d'expiration: </strong> <strong>{carData.car.technicalVisits[carData.car.technicalVisits.length - 1].expiryDate.substring(0, 10)}</strong><br />
                                                                </div>
                                                                {
                                                                    carData.car.technicalVisits[carData.car.technicalVisits.length - 1].file && <img src={`${process.env.REACT_APP_API_BASE_URL}/${carData.car.technicalVisits[carData.car.technicalVisits.length - 1].file}`} alt="License Image" width={'100%'} style={{ borderRadius: 5 }} />
                                                                }
                                                            </ListItemText>
                                                        </ListItemButton>
                                                    </List>
                                                }

                                                <Typography style={{ color: 'blue' }} mt={3} typography={'h6'}>
                                                    <strong>Dernière TVM</strong>&nbsp;&nbsp;
                                                    {
                                                        carData.car.tvms.length > 0 &&
                                                        <Fragment>
                                                            {carData.car.tvms[carData.car.tvms.length - 1].expiryDate.substring(0, 10).replace(/-0+/g, '-') < (new Date().getFullYear() + "-" + (new Date().getMonth() > 9 ? "" : "0") + (new Date().getMonth() + 1) + "-" + new Date().getDate()) ? <strong style={{ color: 'red' }}>Expiré</strong> : <strong style={{ color: 'green' }}>En cours</strong>}
                                                        </Fragment>
                                                    }
                                                </Typography>
                                                {
                                                    carData.car.tvms.length > 0 &&
                                                    <List>
                                                        <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }}>
                                                            <ListItemText>
                                                                <div style={{ fontSize: 13, marginBottom: 10 }}>
                                                                    <strong>Date de délivrance: </strong> {carData.car.tvms[carData.car.tvms.length - 1].issueDate.substring(0, 10)}<br />
                                                                    <strong>Date d'expiration: </strong> <strong>{carData.car.tvms[carData.car.tvms.length - 1].expiryDate.substring(0, 10)}</strong><br />
                                                                </div>
                                                                {
                                                                    carData.car.tvms[carData.car.tvms.length - 1].file && <img src={`${process.env.REACT_APP_API_BASE_URL}/${carData.car.tvms[carData.car.tvms.length - 1].file}`} alt="License Image" width={'100%'} style={{ borderRadius: 5 }} />
                                                                }
                                                            </ListItemText>
                                                        </ListItemButton>
                                                    </List>
                                                }

                                            </Card>
                                        </Grid>
                                        <Grid xs={4} item>
                                            <Card variant="outlined" sx={{ p: 2, borderRadius: 5 }}>
                                                <h2 style={{ color: 'blue' }}><strong>Historiques de paiements</strong></h2>
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
                                                                                (paymentData.entrySource === 'Location' || paymentData.entrySource === 'Vente') &&
                                                                                <Fragment>
                                                                                    <strong>Nom complet: </strong> {paymentData.fullName}<br />
                                                                                    <strong>Téléphone: </strong> {paymentData.phoneNumber}<br />
                                                                                </Fragment>
                                                                            }
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
                                    </Fragment>
                                )
                            })
                        }
                    </Grid>
            }

            <Dialog
                open={openCarAlert}
                onClose={() => {
                    setOpenCarAlert(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cette voiture ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir cette voiture" ? Cette action sera défintive et irréversible !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenCarAlert(false)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleRemoveCar()
                    }} autoFocus>
                        {isCarDeleting ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>

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
                        Le versement que vous venez de faire a été effectué avec succès !
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

            <Dialog
                open={openAmount}
                onClose={() => {
                    setOpenAmount(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    <strong>Confirmer le montant ?</strong>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes vous sûr(e) de vouloir effectuer un versement de <strong style={{color: red[900]}}>{parseInt(amount, 10).toLocaleString('fr-FR')} F CFA</strong> sur cette voiture ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoading} onClick={() => {
                        hanhleCreatePayment()
                    }}>
                        <strong>{isLoading ? "Patientez" : "Confirmer"}</strong>
                    </Button>
                </DialogActions>
            </Dialog>

        </Fragment>
    )
}
