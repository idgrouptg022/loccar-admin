import { Delete, ReportProblem } from '@mui/icons-material'
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Maintenances(props) {
    const [maintenances, setMaintenances] = useState([])
    const [readMaintenances, setReadMaintenances] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [currentMaintenanceId, setCurrentMaintenanceId] = useState(0)

    const navigate = useNavigate()

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/maintenances/list/all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setMaintenances(response.data.data)
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

    async function fetchRead() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/maintenances/list/read`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setReadMaintenances(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleDeleteMaintenance = async () => {
        if (props.userRights?.split(',').includes('12') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/maintenances/${currentMaintenanceId}`,
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
                            setCurrentMaintenanceId(0)
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

        fetchRead()

    }, [])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des maintenances</h2>
                </Grid>
            </Grid><br />
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
                            maintenances.length === 0 ?
                                <Typography textAlign={'center'} color={'GrayText'}><strong>Pas d'entretien créé</strong>.</Typography> :
                                <Grid container spacing={3}>
                                    {
                                        maintenances.map((data) => {
                                            return (
                                                <Grid xl={3} lg={4} item key={data.id}>
                                                    <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                        <Typography typography={'h5'} mb={1}>
                                                            {
                                                                data.car ? <span>{data.car?.brand} {data.car?.model} {data.car?.year}</span> : "Non rempli "
                                                            }<ReportProblem style={{ color: data.state === 2 ? 'green' : 'red' }} />
                                                        </Typography>
                                                        <Typography fontSize={13}>
                                                            <strong>Numéro de plaque : </strong>{data.car ? data.car.carPlateNumber : 'Non rempli'}<br />
                                                            <strong>Date de déclaration : </strong>{data?.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />
                                                            <strong>Propriétaire :</strong> {data.owner ? data.owner?.fullName : 'Non rempli'}<br />
                                                            <strong>Télephone :</strong> {data.owner ? data.owner?.driverPhoneNumber : 'Non rempli'}<br /><br />

                                                            <Button variant='text' onClick={() => {
                                                                navigate('/admins/maintenances-' + data.id)
                                                            }}><small><strong>Détails entretien</strong></small></Button>

                                                            <IconButton color='error' onClick={() => {
                                                                setOpenAlert(true)
                                                                setCurrentMaintenanceId(data.id)
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
            <br /><br />

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentMaintenanceId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cette maintenance ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir supprimer cette maintenance ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentMaintenanceId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleDeleteMaintenance(currentMaintenanceId)
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}
