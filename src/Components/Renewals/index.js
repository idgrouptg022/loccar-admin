import { Delete, History } from '@mui/icons-material'
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Link, useNavigate } from 'react-router-dom'

export default function Renewals(props) {
    const [renewals, setRenewals] = useState([])
    const [whatsapp, setWhatsapp] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [openDetails, setOpenDetails] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [currentRenewal, setCurrentRenewal] = useState(null)

    const navigate = useNavigate()

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/renewals/list/all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setRenewals(response.data.data)
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

    async function handleReadOneRenewal(renewalId) {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/renewals/${renewalId}/read-one`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchData()
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

    const handleDeleteRenewal = async () => {
        setIsLoading(true)

        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/renewals/${currentRenewal.id}`,
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
                        setCurrentRenewal(null)
                        setOpenAlert(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    useEffect(() => {
        fetchData()
        fetchSettings()
    }, [])

    useEffect(() => {
        props.socket.on("handleCreateRenewal", async (data) => {
            fetchData()
        })
    }, [props.socket])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des demandes de renouvellement</h2>
                </Grid>
            </Grid><br />
            {
                !isFetched ?
                    <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                        <CircularProgress />
                    </div> :
                    <Fragment>
                        {
                            renewals.length === 0 ?
                                <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de nouvelle demande</strong>.</Typography> :
                                <Grid container spacing={3}>
                                    {
                                        renewals.map((data) => {
                                            return (
                                                <Grid xl={3} lg={4} item key={data.id}>
                                                    <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                        <Typography typography={'h5'} mb={1}>
                                                            {
                                                                data.car ? <span>{data.car?.brand} {data.car?.model} {data.car?.year}</span> : "Non rempli "
                                                            }
                                                            <History sx={{ color: data.state === 2 ? "green" : 'red' }} />
                                                        </Typography>
                                                        <Typography fontSize={13}>
                                                            <strong>Numéro de plaque : </strong>{data.car ? data.car.carPlateNumber : 'Non rempli'}<br />
                                                            <strong>Date de déclaration : </strong>{data?.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />                                                            

                                                            <strong>Propriétaire :</strong> <Link to={`/admins/owners-${data.owner.id}`}>{data.owner.accountType === 'personnal' ? data.owner.fullName : data.owner.socialReason}</Link><br />
                                                            <strong>Télephone :</strong> {data.owner.phoneNumber}<br />

                                                            <strong>Objet : <span style={{ color: 'red' }}>{data.assurance ? 'Assurance' : (data.technicalVisit ? 'Visite technique' : (data.tvm ? 'TVM' : 'Permis de conduire'))}</span></strong><br /><br />

                                                            <Button variant='text' onClick={() => {
                                                                setCurrentRenewal(data)
                                                                handleReadOneRenewal(data.id)
                                                                setOpenDetails(true)
                                                            }}><strong>Détails de la demande</strong></Button>

                                                            <IconButton color='error' onClick={() => {
                                                                setOpenAlert(true)
                                                                setCurrentRenewal(data)
                                                            }}><Delete /></IconButton>
                                                        </Typography>
                                                    </Card>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                        }
                    </Fragment>
            }

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentRenewal(null)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cet accident ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cette demande de renouvellement ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentRenewal(null)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleDeleteRenewal(currentRenewal)
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={openDetails}
                onClose={() => {
                    setOpenDetails(false)
                    setCurrentRenewal(null)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent sx={{ minWidth: 600 }}>
                    {
                        whatsapp.map((whatsappData, key) => {
                            if (whatsappData.wording === 'whatsapp') {
                                return (
                                    <div key={key}>
                                        <Button variant='contained' disableElevation color='success' fullWidth size='large' onClick={() => {
                                            window.location = "https://wa.me/" + whatsappData.value + "?text=https://www.google.com/maps/dir//" + currentRenewal?.latitude + "," + currentRenewal?.longitude + "/data=!4m2!4m1!3e0?entry=ttu"
                                        }}>
                                            <strong>Envoyer le plan whatsapp</strong>
                                        </Button><br /><br />
                                    </div>
                                )
                            }
                        })
                    }
                    {
                        currentRenewal &&
                        <MapContainer center={[currentRenewal?.latitude, currentRenewal?.longitude]} zoom={12} style={{ height: "70em" }}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[currentRenewal?.latitude, currentRenewal?.longitude]}>
                                <Popup>
                                    Position exacte de la demande par <strong>{currentRenewal?.owner.fullName}</strong><br /><br />
                                    <strong>Latitute : </strong>{currentRenewal?.latitude}<br />
                                    <strong>Longitude : </strong>{currentRenewal?.longitude}<br />
                                </Popup>
                            </Marker>
                        </MapContainer>
                    }
                </DialogContent>
            </Dialog>


        </Fragment>
    )
}
