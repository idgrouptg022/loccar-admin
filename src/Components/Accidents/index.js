import { CarCrash, Delete } from '@mui/icons-material'
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Acidents(props) {
    const [accidents, setAccidents] = useState([])
    const [allAccidents, setAllAccidents] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [currentAccidentId, setCurrentAccidentId] = useState(0)

    const navigate = useNavigate()

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/accidents/list/all`,
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
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleDeleteAccident = async() => {
        setIsLoading(true)

        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/accidents/${currentAccidentId}`,
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
                        setCurrentAccidentId(0)
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

    }, [])

    useEffect(() => {
        props.socket.on("handleCreateAccident", async (data) => {
            fetchData()
        })
    }, [props.socket, accidents])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des accidents</h2>
                </Grid>
            </Grid><br />
            {
                !isFetched ?
                    <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                        <CircularProgress />
                    </div> :
                    <Fragment>
                        {
                            accidents.length === 0 ?
                                <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de nouveau accident déclaré</strong>.</Typography> :
                                <Grid container spacing={3}>
                                    {
                                        accidents.map((data) => {
                                            return (
                                                <Grid xl={3} lg={4} item key={data.id}>
                                                    <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                        <Typography typography={'h5'} mb={1}>
                                                            {
                                                                data.car ? <span>{data.car?.brand} {data.car?.model} {data.car?.year}</span> : "Non rempli "
                                                            }
                                                            <CarCrash sx={{ color: data.state === 2 ? "green" : 'red' }} />
                                                        </Typography>
                                                        <Typography fontSize={13}>
                                                            <strong>Numéro de plaque : </strong>{data.car ? data.car.carPlateNumber : 'Non rempli'}<br />
                                                            <strong>Date de déclaration : </strong>{data?.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />
                                                            
                                                            <strong>Propriétaire :</strong> {data.owner.accountType === 'personnal' ? data.owner.fullName : data.owner.socialReason}<br />
                                                            <strong>Télephone :</strong> {data.owner.phoneNumber}<br /><br />

                                                            <Button variant='text' onClick={() => {
                                                                navigate('/admins/accidents-' + data.id)
                                                            }}><strong>Détails de l'accident</strong></Button>

                                                            <IconButton color='error' onClick={() => {
                                                                setOpenAlert(true)
                                                                setCurrentAccidentId(data.id)
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
                    setCurrentAccidentId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cet accident ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cet accident ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentAccidentId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleDeleteAccident(currentAccidentId)
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}
