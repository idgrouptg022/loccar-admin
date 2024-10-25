import { CarCrash, PictureAsPdfTwoTone } from '@mui/icons-material'
import { Button, Card, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

let bodyFormData = null

export default function Maintenance(props) {
    const [object, setObject] = useState("")
    const [maintenances, setMaintenances] = useState([])

    const [openAlert, setOpenAlert] = useState(false)
    const [isItemDeleting, setIsItemDeleting] = useState(false)

    const [carId, setCarId] = useState(0)
    const [currentItemId, setCurrentItemId] = useState(0)

    const [invoices, setInvoices] = useState([])
    const [isSent, setIsSent] = useState(false)

    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [invoicePreview, setInvoicePreview] = useState([])
    const [reportPreview, setReportPreview] = useState([])

    const [ownerId, setOwnerId] = useState(0)
    const [whatsapp, setWhatsapp] = useState([])


    const [wording, setWording] = useState('')
    const [currentMileage, setCurrentMileage] = useState(0)
    const [oilName, setOilName] = useState('')
    const [kilometersToGo, setKilometersToGo] = useState('')
    const [changeFilter, setChangeFilter] = useState(false)

    const [isLoadingMaintenaceData, setIsLoadingMaintenaceData] = useState(false)
    const [isMaintenaceSent, setIsMaintenaceSent] = useState(false)


    async function fetchData(maintenanceId) {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/maintenances/${maintenanceId}/read-one`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setMaintenances(response.data.data)
                        setCarId(response.data.data[0].carId)
                        setIsFetched(true)
                        setObject("Facture entretien " + response.data.data[0].car?.brand + " " + response.data.data[0].car?.model + " " + response.data.data[0].car?.year + " " + response.data.data[0].car?.carPlateNumber)
                        setWording("Entretien " + response.data.data[0].car?.brand + " " + response.data.data[0].car?.model + " " + response.data.data[0].car?.year + " " + response.data.data[0].car?.carPlateNumber)
                        setOwnerId(response.data.data[0].car?.ownerId)

                        setCurrentMileage(response.data.data[0].worgind ? response.data.data[0].worgind : wording)
                        setCurrentMileage(response.data.data[0].currentMileage)
                        setOilName(response.data.data[0].oilName ? response.data.data[0].oilName : "")
                        setKilometersToGo(response.data.data[0].kilometersToGo)
                        setChangeFilter(response.data.data[0].changeFilter)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchSettings() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/settings`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setWhatsapp(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    async function fetchInvoices() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/invoices/maintenance/${props.maintenance}/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setInvoices(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    useEffect(() => {

        fetchInvoices()

        fetchSettings()

        fetchData(props.maintenance)

    }, [props.maintenance])

    const handleCreateInvoice = async () => {
        if (props.userRights?.split(',').includes('12') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            bodyFormData.set('object', object)
            bodyFormData.set('source', "maintenance")
            bodyFormData.set('carId', carId)
            bodyFormData.set('maintenanceId', props.maintenance)
            bodyFormData.set('ownerId', ownerId)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/invoices`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setInvoicePreview([])
                            bodyFormData.delete("invoice")
                            setIsSent(true)
                            setIsLoading(false)
                            fetchInvoices()
                        }
                    } catch {

                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    const handleSaveMaintenance = async () => {
        if (props.userRights?.split(',').includes('12') || JSON.parse(localStorage.getItem('data')).id == 1) {
            if (wording.trim().length > 0) {
                setIsLoadingMaintenaceData(true)

                if (bodyFormData === null) {
                    bodyFormData = new FormData()
                }

                bodyFormData.set('wording', wording)
                bodyFormData.set('carId', carId)
                bodyFormData.set('currentMileage', currentMileage)
                bodyFormData.set('oilName', oilName)
                bodyFormData.set('kilometersToGo', kilometersToGo)
                bodyFormData.set('changeFilter', changeFilter)
                bodyFormData.set('maintenanceId', props.maintenance)

                await axios({
                    method: "post",
                    url: `${process.env.REACT_APP_API_URL}/maintenances`,
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                    }
                })
                    .then(async function (response) {
                        try {
                            if (response.data?.responseCode === '0') {
                                fetchData()
                                setIsLoadingMaintenaceData(false)
                                setIsMaintenaceSent(true)
                                bodyFormData.delete("report")
                            }
                        } catch {

                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
        }
    }

    const handleSelectInvoice = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('invoice', e.target.files[i])
                setInvoicePreview(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    const handleSelectReport = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('report', e.target.files[i])
                setReportPreview(previewFile)
            }
        }
    }

    const handleRemoveItem = async () => {
        if (props.userRights?.split(',').includes('12') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsItemDeleting(true)
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/maintenances/items/${currentItemId}/remove`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            fetchData()
                            setOpenAlert(false)
                            setCurrentItemId(0)
                            setIsItemDeleting(false)
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


    const items = [
        "Kilométrage actuel",
        "Changement d'huile",
        "Estimation de kilomètres à parcourir pour l'huile",
        "Estimation de kilomètres à parcourir pour les pneux",
        "Changement de pneux",
        "Changement de filtre"
    ]


    return (
        <Fragment>
            <br /><br />

            {
                !props.userRights?.split(',').includes('12') && JSON.parse(localStorage.getItem('data')).id != 1 ?
                    <Typography textAlign={`center`} typography={`h5`}>
                        <br /><br /><br />
                        Non autorisé !
                    </Typography> :
                    !isFetched ?
                        <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                            <CircularProgress />
                        </div> :
                        <Fragment>
                            {
                                maintenances.map((data) => {
                                    return (
                                        <Fragment key={data.id}>

                                            <Grid container>
                                                <Grid xs={6} item>
                                                    <h2>Détails de l'entretien</h2>
                                                </Grid>
                                            </Grid><br />

                                            <Grid container spacing={3}>

                                                <Grid xs={3} item>
                                                    <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>

                                                        <Typography typography={'h5'} mb={1}>{data.car?.brand} {data.car?.model} {data.car?.year} {data.state === 0 && <CarCrash sx={{ color: "red" }} />}</Typography>
                                                        <Typography fontSize={13} lineHeight={2}>
                                                            <strong>Numéro de plaque : </strong>{data.car?.carPlateNumber}<br />
                                                            <strong>Date de déclaration : </strong>{data.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />
                                                        </Typography>

                                                        {
                                                            whatsapp.map((whatsappData, key) => {
                                                                if (whatsappData.wording === 'whatsapp') {
                                                                    return (
                                                                        <div key={key}>
                                                                            <Button variant='contained' disableElevation color='success' fullWidth size='large' onClick={() => {
                                                                                window.location = "https://wa.me/" + whatsappData.value + "?text=https://www.google.com/maps/dir//" + data.latitude + "," + data.longitude + "/data=!4m2!4m1!3e0?entry=ttu"
                                                                            }}>
                                                                                <strong>Envoyer le plan whatsapp</strong>
                                                                            </Button>
                                                                        </div>
                                                                    )
                                                                }
                                                            })
                                                        }

                                                        <br /><br />

                                                        <Divider /><br /><br />

                                                        <strong>FACTURE</strong><br />

                                                        {
                                                            invoices.length > 0 ?
                                                                <Typography>
                                                                    <a href={`${process.env.REACT_APP_API_BASE_URL}/${invoices[0].file}`}><strong>Facture {invoices[0].ref}.PDF</strong></a><br /><br />
                                                                </Typography> : <Typography>Pas de facture associée.<br /><br /></Typography>
                                                        }

                                                        <strong>RAPPORT</strong><br />

                                                        {
                                                            data.report ?
                                                                <Typography>
                                                                    <a href={`${process.env.REACT_APP_API_BASE_URL}/${data.report}`}><strong>Rapport maintenance.PDF</strong></a><br /><br />
                                                                </Typography> : <Typography>Pas de rapprt associé.<br /><br /></Typography>
                                                        }

                                                    </Card>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Grid container spacing={2}>
                                                        <Grid xs={6} item>
                                                            <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>

                                                                <Typography typography={'h5'} mb={1}>Bilan de l'entretien</Typography>
                                                                <br />

                                                                {
                                                                    isMaintenaceSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Maintenance envoyée avec succès !</Typography>
                                                                }

                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={7}><br />
                                                                        <strong>Kilométrage ACTUEL</strong>
                                                                    </Grid>
                                                                    <Grid item xs={5}>
                                                                        <TextField id="outlined-basic" label="Valeur en KM" variant="outlined" fullWidth value={currentMileage} onChange={(e) => {
                                                                            if ((e.target.value >= 0 && e.target.value < 1000000) || e.target.value.toString().trim().length === 0) {
                                                                                setCurrentMileage(e.target.value)
                                                                            }
                                                                        }} />
                                                                    </Grid>
                                                                    <Grid item xs={7}><br />
                                                                        <strong>Nom de l'huile à moteur</strong>
                                                                    </Grid>
                                                                    <Grid item xs={5}>
                                                                        <TextField id="outlined-basic" label="Huile" variant="outlined" fullWidth value={oilName} onChange={(e) => {
                                                                            setOilName(e.target.value)
                                                                        }} />
                                                                    </Grid>
                                                                    <Grid item xs={7}><br />
                                                                        <strong>Estimation de kilomètres à parcourir</strong>
                                                                    </Grid>
                                                                    <Grid item xs={5}>
                                                                        <TextField id="outlined-basic" label="Valeur en KM" variant="outlined" fullWidth value={kilometersToGo} onChange={(e) => {
                                                                            if ((e.target.value >= 0 && e.target.value < 1000000) || e.target.value.toString().trim().length === 0) {
                                                                                setKilometersToGo(e.target.value)
                                                                            }
                                                                        }} />
                                                                    </Grid>
                                                                    <Grid item xs={7}><br />
                                                                        <strong>Changement de filtre</strong>
                                                                    </Grid>
                                                                    <Grid item xs={5}>
                                                                        <FormControlLabel control={<Checkbox checked={changeFilter} onChange={(e) => {
                                                                            setChangeFilter(e.target.checked)
                                                                        }} />} label="" />
                                                                    </Grid>
                                                                </Grid><br />

                                                                {
                                                                    reportPreview.length !== 0 && <Typography color={'green'} mb={1} textAlign={'center'}><PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Fichier joint</b></Typography>
                                                                }

                                                                <div className="parent">
                                                                    <div className="file-upload">
                                                                        <h3>Rapport d'entretien</h3>
                                                                        <p>Maximun file size 10mb</p>
                                                                        <input type="file" accept='application/pdf' onInput={(e) => { handleSelectReport(e) }} />
                                                                    </div>
                                                                </div><br />

                                                                <Button disableElevation fullWidth variant='contained' disabled={
                                                                    ((currentMileage.toString().trim().length === 0 || oilName.trim().length === 0 || kilometersToGo.toString().trim().length === 0) && reportPreview.length === 0) || isLoadingMaintenaceData
                                                                } onClick={() => {
                                                                    handleSaveMaintenance()
                                                                }}>
                                                                    <strong>
                                                                        {
                                                                            isLoadingMaintenaceData ? "Ptientez ..." : "Sauvegarder"
                                                                        }
                                                                    </strong>
                                                                </Button>

                                                            </Card>
                                                        </Grid>
                                                        <Grid xs={6} item>
                                                            <Card variant="outlined" sx={{ borderRadius: 5, height: '75vh', px: 5 }}>
                                                                <Typography typography={'h5'} mt={5} textAlign={'center'}><strong>Envoyer une facture</strong></Typography>
                                                                <br /><br /><br />

                                                                {
                                                                    isSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Facture envoyée avec succès !</Typography>
                                                                }

                                                                <TextField id="outlined-basic" label="Saisir un objet" variant="outlined" fullWidth value={object} onChange={(e) => {
                                                                    setObject(e.target.value)
                                                                }} /><br /><br />

                                                                {
                                                                    invoicePreview.length !== 0 && <Typography color={'green'} mb={1} textAlign={'center'}><PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Fichier joint</b></Typography>
                                                                }

                                                                <div className="parent">
                                                                    <div className="file-upload">
                                                                        <h3>Facture de maintenance</h3>
                                                                        <p>Maximun file size 10mb</p>
                                                                        <input type="file" accept='application/pdf' onInput={(e) => { handleSelectInvoice(e) }} />
                                                                    </div>
                                                                </div><br />

                                                                <Button fullWidth disableElevation size='large' disabled={invoicePreview.length === 0 || object.length === 0 || isLoading} variant='contained' onClick={handleCreateInvoice}>
                                                                    {
                                                                        isLoading ?
                                                                            <CircularProgress size={26} sx={{ color: 'white' }} /> : <strong>Envoyer la facture</strong>
                                                                    }
                                                                </Button>

                                                            </Card>
                                                        </Grid>
                                                    </Grid><br />
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Card variant="outlined" sx={{ borderRadius: 5, height: '75vh' }}>
                                                                <MapContainer center={[data.latitude, data.longitude]} zoom={12} style={{ height: "70em" }}>
                                                                    <TileLayer
                                                                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                    />
                                                                    <Marker position={[data.latitude, data.longitude]}>
                                                                        <Popup>
                                                                            Position exacte du signalement de l'entretien<br /><br />
                                                                            <strong>Latitute : </strong>{data.latitude}<br />
                                                                            <strong>Longitude : </strong>{data.longitude}<br />
                                                                        </Popup>
                                                                    </Marker>
                                                                </MapContainer>
                                                            </Card>
                                                        </Grid>
                                                    </Grid><br />
                                                </Grid>
                                            </Grid>
                                        </Fragment>
                                    )
                                })
                            }
                        </Fragment>
            }

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentItemId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cet élément de la maintenance ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cet élément ? Cette action sera défintive et irréversible !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentItemId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleRemoveItem()
                    }} autoFocus>
                        {isItemDeleting ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}