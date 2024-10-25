import { Dangerous, Delete } from '@mui/icons-material'
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BreakDowns(props) {
    const [breakdowns, setBreakdowns] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [currentBreakDownId, setCurrentBreakDownId] = useState(0)

    const navigate = useNavigate()

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/breakdowns/list/all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setBreakdowns(response.data.data)
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

    const handleDeleteAccident = async () => {
        if (props.userRights?.split(',').includes('11') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)
    
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/breakDowns/${currentBreakDownId}`,
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
                            setCurrentBreakDownId(0)
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

    useEffect(() => {

        fetchData()

    }, [])

    useEffect(() => {
        props.socket.on("handleCreateBreakDown", async (data) => {
            // setAccidents(data)
            fetchData()
        })
    }, [props.socket])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des pannes</h2>
                </Grid>
            </Grid><br />

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
                                breakdowns.length === 0 ?
                                    <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de nouvelle panne déclarée</strong>.</Typography> :
                                    <Grid container spacing={3}>
                                        {
                                            breakdowns.map((data) => {
                                                return (
                                                    <Grid xl={3} lg={4} item key={data.id}>
                                                        <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                            <Typography typography={'h5'} mb={1}>
                                                                {
                                                                    data.car ? <span>{data.car?.brand} {data.car?.model} {data.car?.year}</span> : "Non rempli "
                                                                }
                                                                <Dangerous sx={{ color: data.state === 2 ? 'green' : "red" }} />
                                                            </Typography>
                                                            <Typography fontSize={13}>
                                                                <strong>Numéro de plaque : </strong>{data.car ? data.car.carPlateNumber : 'Non rempli'}<br />
                                                                <strong>Date de déclaration : </strong>{data?.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />
                                                                <strong>Chauffeur :</strong> {data.car ? data.car?.driverFullName : 'Non rempli'}<br />
                                                                <strong>Télephone :</strong> {data.car ? data.car?.driverPhoneNumber : 'Non rempli'}<br /><br />

                                                                <Button variant='text' onClick={() => {
                                                                    navigate('/admins/breakdowns-' + data.id)
                                                                }}><strong>Détails de la panne</strong></Button>

                                                                <IconButton color='error' onClick={() => {
                                                                    setOpenAlert(true)
                                                                    setCurrentBreakDownId(data.id)
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
                    setCurrentBreakDownId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cette panne ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cette panne ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentBreakDownId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleDeleteAccident(currentBreakDownId)
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}
