import { Add, CarCrash, Check } from '@mui/icons-material'
import { Autocomplete, Box, Button, Card, CircularProgress, Grid, Modal, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet';
import CreateInvoice from '../../Invoices/Create'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
}

export default function Accident(props) {
    const [accidents, setAccidents] = useState([])
    const [cars, setCars] = useState([])
    const [whatsapp, setWhatsapp] = useState([])

    const [invoices, setInvoices] = useState([])
    const [sogevoReports, setSogevoReports] = useState([])
    const [policeReports, setPoliceReports] = useState([])
    const [diagnosticReports, setDiagnosticReports] = useState([])
    const [assuranceReports, setAssuranceReports] = useState([])

    const [currentCarId, setCurrentCarId] = useState(0)

    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/accidents/${props.accident}/read-one`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setAccidents(response.data.data)
                        setIsFetched(true)

                        await axios({
                            method: "get",
                            url: `${process.env.REACT_APP_API_URL}/owners/${response.data.data[0].owner.id}/cars`,
                            headers: {
                                "Content-Type": "multipart/form-data",
                                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                            }
                        })
                            .then(async function (response) {
                                try {
                                    if (response.data?.responseCode === '0') {
                                        setCars(response.data.data)
                                    }
                                } catch {
                                    //
                                }
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
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

    async function fetchSogevoReports() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/reports/accident/${props.accident}/sogenuvo-report/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setSogevoReports(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    async function fetchPoliceReports() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/reports/accident/${props.accident}/police-report/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setPoliceReports(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    async function fetchDiagnosticReports() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/reports/accident/${props.accident}/diagnostic-report/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setDiagnosticReports(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    async function fetchAssuranceReports() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/reports/accident/${props.accident}/assurance-report/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setAssuranceReports(response.data.data)
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
            url: `${process.env.REACT_APP_API_URL}/invoices/accident/${props.accident}/list`,
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

        fetchSogevoReports()
        fetchPoliceReports()
        fetchDiagnosticReports()
        fetchAssuranceReports()
        fetchInvoices()

        fetchSettings()

        fetchData()

    }, [])

    const handleAddCar = async (accidentId, carId) => {
        setIsLoading(true)

        const bodyFormData = new FormData()
        bodyFormData.append('id', accidentId)
        bodyFormData.append('carId', carId)

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/accidents/cars/add`,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchData()
                        setIsLoading(false)
                    }
                } catch {
                    setIsLoading(false)
                }
            })
            .catch(function (error) {
                setIsLoading(false)
            })

    }

    const handleUpdateDataCallBack = (data) => {
        if (data) {
            fetchSogevoReports()
            fetchPoliceReports()
            fetchDiagnosticReports()
            fetchAssuranceReports()
            fetchInvoices()
        }
    }

    return (
        <Fragment>
            <br /><br />

            {
                !isFetched ?
                    <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                        <CircularProgress />
                    </div> :
                    <Fragment>
                        {
                            accidents.map((data) => {
                                return (
                                    <Fragment key={data.id}>

                                        <Grid container>
                                            <Grid xs={6} item>
                                                <h2>Détails de l'accident</h2>
                                            </Grid>
                                            <Grid xs={6} item textAlign={"right"}>

                                                {
                                                    data.car && <Button variant="contained" disableElevation startIcon={<Add />} sx={{ borderRadius: 5 }} onClick={() => {
                                                        setOpenModal(true)
                                                    }}>
                                                        <strong>Détails</strong>
                                                    </Button>
                                                }

                                                <Modal
                                                    open={openModal}
                                                    onClose={() => {
                                                        setOpenModal(false)
                                                    }}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <CreateInvoice
                                                            handleUpdateDataCallBack={handleUpdateDataCallBack}
                                                            carId={data.car?.id}
                                                            ownerId={data.owner.id}
                                                            accidentId={data.id}
                                                            wording={'Facture de(s) réparation(s) : ' + data.car?.brand + ' ' + data.car?.model + ' ' + data.car?.year + ' ' + data.car?.carPlateNumber} source={'accident'} />
                                                    </Box>
                                                </Modal>
                                            </Grid>
                                        </Grid><br />

                                        <Grid container spacing={3}>
                                            <Grid xl={3} lg={4} item>
                                                <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>

                                                    <Grid container spacing={1}>
                                                        <Grid xs={9} item>
                                                            <Autocomplete
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setCurrentCarId(newValue.id)
                                                                    }
                                                                }}
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={cars}
                                                                getOptionLabel={(option) => option.brand + ' ' + option.model + ' ' + option.year + ' - ' + option.carPlateNumber}
                                                                sx={{ mb: 2 }}
                                                                renderInput={(params) => <TextField {...params} label="Voiture ..." />}
                                                            />
                                                        </Grid>
                                                        <Grid xs={3} item textAlign={"right"}>

                                                            <Button variant="contained" color='success' disableElevation disabled={isLoading} fullWidth sx={{ borderRadius: 5, mt: 1 }} onClick={() => {
                                                                handleAddCar(data.id, currentCarId)
                                                            }}>
                                                                <Check />
                                                            </Button>
                                                        </Grid>
                                                    </Grid><br />

                                                    <Typography typography={'h5'} mb={1}>{data.car?.brand} {data.car?.model} {data.car?.year} {data.state === 0 && <CarCrash sx={{ color: "red" }} />}</Typography>
                                                    <Typography fontSize={13} lineHeight={2}>
                                                        <strong>Numéro de plaque : </strong>{data.car?.carPlateNumber}<br />
                                                        <strong>Date de déclaration : </strong>{data.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />

                                                        <strong>INFORMATIONS DU PROPRIÉTAIRE</strong><br />
                                                        <strong>Référence compte : </strong>{data.owner.ref}<br />
                                                        <strong>Type de compte :</strong> {data.owner.accountType === 'personnal' ? 'Compte personnel' : 'Compte entreprise'}<br />
                                                        <strong>Propriétaire :</strong> {data.owner.accountType === 'personnal' ? data.owner.fullName : data.owner.socialReason}<br />
                                                        <strong>Télephone :</strong> {data.owner.phoneNumber}<br />
                                                        <strong>Email :</strong> {data.owner.email}<br /><br />

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

                                                    <strong>FACTURE</strong><br />

                                                    {
                                                        invoices.length > 0 ?
                                                            <Typography>
                                                                <a href={`${process.env.REACT_APP_API_BASE_URL}/${invoices[0].file}`}><strong>Facture {invoices[0].ref}.PDF</strong></a><br /><br />
                                                            </Typography> : <Typography>Pas de facture associée.<br /><br /></Typography>
                                                    }



                                                    <strong>RAPPORT SOGEVO</strong><br />

                                                    {
                                                        sogevoReports.length > 0 ?
                                                            <Typography>
                                                                <a href={`${process.env.REACT_APP_API_BASE_URL}/${sogevoReports[0].file}`}><strong>Rapport SOGEVO.PDF</strong></a><br /><br />
                                                            </Typography> : <Typography>Pas de rapport associé.<br /><br /></Typography>
                                                    }

                                                    <strong>RAPPORT DE POLICE</strong><br />

                                                    {
                                                        policeReports.length > 0 ?
                                                            <Typography>
                                                                <a href={`${process.env.REACT_APP_API_BASE_URL}/${policeReports[0].file}`}><strong>Rapport POLICE.PDF</strong></a><br /><br />
                                                            </Typography> : <Typography>Pas de rapport associé.<br /><br /></Typography>
                                                    }

                                                    <strong>DIAGNOSTIC COMPLET</strong><br />

                                                    {
                                                        diagnosticReports.length > 0 ?
                                                            <Typography>
                                                                <a href={`${process.env.REACT_APP_API_BASE_URL}/${diagnosticReports[0].file}`}><strong>Rapport DIAGNOSTIC.PDF</strong></a><br /><br />
                                                            </Typography> : <Typography>Pas de rapport associé.<br /><br /></Typography>
                                                    }

                                                    <strong>RAPPORT ASSURANCE</strong><br />

                                                    {
                                                        assuranceReports.length > 0 ?
                                                            <Typography>
                                                                <a href={`${process.env.REACT_APP_API_BASE_URL}/${assuranceReports[0].file}`}><strong>Rapport ASSURANCE.PDF</strong></a><br /><br />
                                                            </Typography> : <Typography>Pas de rapport associé.<br /><br /></Typography>
                                                    }

                                                </Card>
                                            </Grid>
                                            <Grid xl={9} lg={8} item>
                                                <Card variant="outlined" sx={{ borderRadius: 5, height: '75vh' }}>
                                                    <MapContainer center={[data.latitude, data.longitude]} zoom={12} style={{ height: "70em" }}>
                                                        <TileLayer
                                                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        />
                                                        <Marker position={[data.latitude, data.longitude]}>
                                                            <Popup>
                                                                Position exacte du signalement de l'accident par <strong>{data.owner.fullName}</strong><br /><br />
                                                                <strong>Latitute : </strong>{data.latitude}<br />
                                                                <strong>Longitude : </strong>{data.longitude}<br />
                                                            </Popup>
                                                        </Marker>
                                                    </MapContainer>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                )
                            })
                        }
                    </Fragment>
            }


        </Fragment>
    )
}