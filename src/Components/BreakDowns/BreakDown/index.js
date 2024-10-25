import { CarCrash, PictureAsPdfTwoTone } from '@mui/icons-material'
import { Button, Card, CircularProgress, Divider, Grid, Modal, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'

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

let bodyFormData = null

export default function BreakDown(props) {
    const [object, setObject] = useState("")
    const [breakDowns, setBreakDowns] = useState([])

    const [carId, setCarId] = useState(0)
    const [ownerId, setOwnerId] = useState(0)

    const [invoices, setInvoices] = useState([])
    const [isSent, setIsSent] = useState(false)

    const [whatsapp, setWhatsapp] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [invoicePreview, setInvoicePreview] = useState([])
    const [reportPreview, setReportPreview] = useState([])

    const [isReportSent, setIsReportSent] = useState(false)
    const [isInvoiceSent, setIsInvoiceSent] = useState(false)


    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/breakdowns/${props.breakDown}/read-one`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setBreakDowns(response.data.data)
                        setCarId(response.data.data[0].carId)
                        setOwnerId(response.data.data[0].ownerId)
                        setIsFetched(true)

                        setObject("Facture panne " + response.data.data[0].car?.brand + " " + response.data.data[0].car?.model + " " + response.data.data[0].car?.year + " " + response.data.data[0].car?.carPlateNumber)
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
            url: `${process.env.REACT_APP_API_URL}/invoices/breakdown/${props.breakDown}/list`,
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

        fetchData()

    }, [])

    const handleCreateInvoice = async () => {
        if (props.userRights?.split(',').includes('11') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            bodyFormData.set('object', object)
            bodyFormData.set('source', "breakdown")
            bodyFormData.set('carId', carId)
            bodyFormData.set('breakDownId', props.breakDown)
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
                            setIsInvoiceSent(true)
                        }
                    } catch {

                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    const handleCreateReport = async () => {
        if (props.userRights?.split(',').includes('11') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            bodyFormData.set("breakDownId", props.breakDown)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/breakdowns/reports/create`,
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
                            setReportPreview([])
                            bodyFormData.delete("report")
                            setIsSent(true)
                            setIsLoading(false)
                            fetchData()
                            setIsReportSent(true)
                        }
                    } catch {

                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
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
                setReportPreview(oldFiles => [...oldFiles, previewFile])
            }
        }
    }


    return (
        <Fragment>
            <br /><br />

            {
                !props.userRights?.split(',').includes('11') && JSON.parse(localStorage.getItem('data')).id != 1 ?
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
                                breakDowns.map((data) => {
                                    return (
                                        <Fragment key={data.id}>

                                            <Grid container>
                                                <Grid xs={12} item>
                                                    <h2>Détails de la panne</h2>
                                                </Grid>
                                            </Grid><br />

                                            {
                                                isSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Document envoyé avec succès !</Typography>
                                            }

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

                                                        <Divider /><br /><br />

                                                        <strong>RAPPORT</strong><br />

                                                        {
                                                            data.report ?
                                                                <Typography>
                                                                    <a href={`${process.env.REACT_APP_API_BASE_URL}/${data.report}`}><strong>Rapport.PDF</strong></a><br /><br />
                                                                </Typography> : <Typography>Pas de rapport associé.<br /><br /></Typography>
                                                        }

                                                        <strong>FACTURE</strong><br />

                                                        {
                                                            invoices.length > 0 ?
                                                                <Typography>
                                                                    <a href={`${process.env.REACT_APP_API_BASE_URL}/${invoices[0].file}`}><strong>Facture {invoices[0].ref}.PDF</strong></a><br /><br />
                                                                </Typography> : <Typography>Pas de facture associée.<br /><br /></Typography>
                                                        }

                                                    </Card>
                                                </Grid>
                                                <Grid item xs={9}>
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
                                                                            Position exacte du signalement de la panne<br /><br />
                                                                            <strong>Latitute : </strong>{data.latitude}<br />
                                                                            <strong>Longitude : </strong>{data.longitude}<br />
                                                                        </Popup>
                                                                    </Marker>
                                                                </MapContainer>
                                                            </Card>
                                                        </Grid>
                                                    </Grid><br />

                                                    <Grid container spacing={2}>
                                                        <Grid xs={6} item>
                                                            <Card variant="outlined" sx={{ borderRadius: 5, height: '75vh', px: 5 }}>


                                                                <Typography typography={'h5'} mt={5} textAlign={'center'}><strong>Rapport de panne</strong></Typography>
                                                                <br />

                                                                {
                                                                    isReportSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Rapport de panne envoyéeavec succès !</Typography>
                                                                }

                                                                <br /><br />

                                                                <TextField id="outlined-basic" label="Saisir un objet" variant="outlined" fullWidth value={object.replace('Facture', 'Rapport')} /><br /><br />

                                                                {
                                                                    reportPreview.length !== 0 && <Typography color={'green'} mb={1} textAlign={'center'}><PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Fichier joint</b></Typography>
                                                                }

                                                                <div className="parent">
                                                                    <div className="file-upload">
                                                                        <h3>Rapport de panne</h3>
                                                                        <p>Maximun file size 10mb</p>
                                                                        <input type="file" accept='application/pdf' onInput={(e) => { handleSelectReport(e) }} />
                                                                    </div>
                                                                </div><br />

                                                                <Button fullWidth disableElevation size='large' disabled={reportPreview.length === 0 || isLoading} variant='contained' onClick={handleCreateReport}>
                                                                    {
                                                                        isLoading ?
                                                                            <CircularProgress size={26} sx={{ color: 'white' }} /> : <strong>Envoyer le rapport</strong>
                                                                    }
                                                                </Button>

                                                            </Card>
                                                        </Grid>
                                                        <Grid xs={6} item>
                                                            <Card variant="outlined" sx={{ borderRadius: 5, height: '75vh', px: 5 }}>
                                                                <Typography typography={'h5'} mt={5} textAlign={'center'}><strong>Envoyer une facture</strong></Typography>
                                                                <br />

                                                                {
                                                                    isInvoiceSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Facture de panne envoyéeavec succès !</Typography>
                                                                }

                                                                <br /><br />

                                                                <TextField id="outlined-basic" label="Saisir un objet" variant="outlined" fullWidth value={object} onChange={(e) => {
                                                                    setObject(e.target.value)
                                                                }} /><br /><br />

                                                                {
                                                                    invoicePreview.length !== 0 && <Typography color={'green'} mb={1} textAlign={'center'}><PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Fichier joint</b></Typography>
                                                                }

                                                                <div className="parent">
                                                                    <div className="file-upload">
                                                                        <h3>Facture des rérapations</h3>
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
                                                    </Grid>
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