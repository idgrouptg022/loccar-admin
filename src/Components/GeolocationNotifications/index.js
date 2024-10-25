import { Delete } from '@mui/icons-material'
import { Badge, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function GeolocationNotifications(props) {
    const [notifications, setNotifications] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [currentNotificationId, setCurrentNotificationId] = useState(0)

    const navigate = useNavigate()

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/geolocation-notifications`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setNotifications(response.data.data)
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

    const handleDeleteNotification = async () => {
        setIsLoading(true)

        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/geolocation-notifications/${currentNotificationId}`,
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
                        setCurrentNotificationId(0)
                        setOpenAlert(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    const handleMarkAsRead = async (notificationId) => {
        setIsLoading(true)

        await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}/geolocation-notifications/${notificationId}`,
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

            })
    }

    useEffect(() => {

        fetchData()

    }, [])

    useEffect(() => {
        props.socket.on("handleCreateGeolocation", async (data) => {
            fetchData()
        })
    }, [props.socket])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des notifications de géolocalisation</h2>
                </Grid>
            </Grid><br />

            {
                !props.userRights?.split(',').includes('14') && JSON.parse(localStorage.getItem('data')).id != 1 ?
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
                                notifications.length === 0 ?
                                    <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de notification de géolocalisation.</strong>.</Typography> :
                                    <Grid container spacing={3}>
                                        {
                                            notifications.map((data) => {
                                                return (
                                                    <Grid xl={3} lg={4} item key={data.id}>
                                                        <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                            <Typography typography={'h5'} mb={1}>
                                                                {
                                                                    data.car ? <span>{data.car?.brand} {data.car?.model} {data.car?.year}</span> : "Non rempli "
                                                                }
                                                                {
                                                                    data.state === 0 && <Badge badgeContent={1} color="error" sx={{ ml: 2 }} />
                                                                }
                                                            </Typography>
                                                            <Typography fontSize={13}>
                                                                <strong>Numéro de plaque : </strong>{data.car ? data.car.carPlateNumber : 'Non rempli'}<br />
                                                                <strong>Date de demande : </strong>{data?.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />
                                                                <strong>Ref propriétaire :</strong> {data.owner ? <Link to={'/admins/owners-' + data.owner.id}>{data.owner?.ref}</Link> : 'Non rempli'}<br />
                                                                <strong>Nom :</strong> {data.owner.accountType === 'personnal' ? data.owner.fullName : data.owner.socialReason}<br />
                                                                <strong>Téléphone :</strong> {data.owner.phoneNumber}<br /><br />

                                                                <Button variant='text' onClick={() => {
                                                                    handleMarkAsRead(data.id)
                                                                }}><strong>Marquer comme lu</strong></Button>

                                                                <IconButton color='error' onClick={() => {
                                                                    setOpenAlert(true)
                                                                    setCurrentNotificationId(data.id)
                                                                }}><Delete /></IconButton>
                                                            </Typography>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                            }
                            <br /><br /><br />
                        </Fragment>
            }

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentNotificationId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cet notification ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cette notification de géolocalisation ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentNotificationId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleDeleteNotification(currentNotificationId)
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}
