import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OutdateTvm(props) {
    const [sectionZeros, setSectionZeros] = useState([])
    const [sectionOnes, setSectionOnes] = useState([])
    const [sectionTwos, setSectionTwos] = useState([])
    const [sectionThrees, setSectionThrees] = useState([])

    const [isFetched, setIsFetched] = useState(false)
    const [isOutdateDeleting, setIsOutdateDeleting] = useState(false)

    const [currentOutdateId, setCurrentOutdateId] = useState(0)
    const [openAlert, setOpenAlert] = useState(false)

    const navigate = useNavigate()

    async function fetData() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/outdates/tvms/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setSectionZeros(response.data?.data[0].sectionZero)
                        setSectionOnes(response.data?.data[0].sectionOne)
                        setSectionTwos(response.data?.data[0].sectionTwo)
                        setSectionThrees(response.data?.data[0].sectionThree)
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

    const handleRemoveOutdate = async () => {
        if (props.userRights?.split(',').includes('13') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsOutdateDeleting(true)
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/outdates/all/list/${currentOutdateId}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            fetData()
                            setCurrentOutdateId(0)
                            setOpenAlert(false)
                            setIsOutdateDeleting(false)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    useState(() => {
        fetData()
    }, [])

    return (
        <Fragment>
            <br /><br />
            <h2>TVMs</h2><br /><br />
            {
                !props.userRights?.split(',').includes('13') && JSON.parse(localStorage.getItem('data')).id != 1 ?
                <Typography textAlign={`center`} typography={`h5`}>
                    <br /><br /><br />
                    Non autorisé !
                </Typography> :
                !isFetched ? <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                    <CircularProgress />
                </div> :
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <h3 style={{ color: 'red' }}>Expirés</h3><br />

                            {
                                sectionZeros.length === 0 ?
                                    <strong style={{ color: 'grey' }}>Pas de document.</strong> :
                                    <List>
                                        {
                                            sectionZeros.slice(0).reverse().map((sectionZero, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} onClick={() => {
                                                            navigate('/admins/cars-' + sectionZero.car.id)
                                                        }}>
                                                            <ListItemText>
                                                                <div style={{ fontSize: 13, lineHeight: 2 }}>
                                                                    <strong>{sectionZero.car.brand + ' ' + sectionZero.car.model + ' ' + sectionZero.car.year + ' ' + sectionZero.car.carPlateNumber}</strong><br />
                                                                    <strong>Date d'expiration : </strong>{sectionZero.expiryDate.substring(0, 10)}
                                                                </div>
                                                            </ListItemText>
                                                        </ListItemButton>
                                                        <Button color='error' size='smal' onClick={() => {
                                                            setCurrentOutdateId(sectionZero.id)
                                                            setOpenAlert(true)
                                                        }}>
                                                            <strong>Supprimer</strong>
                                                        </Button>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </List>
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <h3 style={{ color: 'orangered' }}>En cours ... 15 jours</h3><br />

                            {
                                sectionOnes.length === 0 ?
                                    <strong style={{ color: 'grey' }}>Pas de document.</strong> :
                                    <List>
                                        {
                                            sectionOnes.slice(0).reverse().map((sectionOne, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} onClick={() => {
                                                            navigate('/admins/cars-' + sectionOne.car.id)
                                                        }}>
                                                            <ListItemText>
                                                                <div style={{ fontSize: 13, lineHeight: 2 }}>
                                                                    <strong>{sectionOne.car.brand + ' ' + sectionOne.car.model + ' ' + sectionOne.car.year + ' ' + sectionOne.car.carPlateNumber}</strong><br />
                                                                    <strong>Date d'expiration : </strong>{sectionOne.expiryDate.substring(0, 10)}
                                                                </div>
                                                            </ListItemText>
                                                        </ListItemButton>
                                                        <Button color='error' size='smal' onClick={() => {
                                                            setCurrentOutdateId(sectionOne.id)
                                                            setOpenAlert(true)
                                                        }}>
                                                            <strong>Supprimer</strong>
                                                        </Button>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </List>
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <h3 style={{ color: 'orange' }}>En cours ... 30 jours</h3><br />

                            {
                                sectionTwos.length === 0 ?
                                    <strong style={{ color: 'grey' }}>Pas de document.</strong> :
                                    <List>
                                        {
                                            sectionTwos.slice(0).reverse().map((sectionTwo, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} onClick={() => {
                                                            navigate('/admins/cars-' + sectionTwo.car.id)
                                                        }}>
                                                            <ListItemText>
                                                                <div style={{ fontSize: 13, lineHeight: 2 }}>
                                                                    <strong>{sectionTwo.car.brand + ' ' + sectionTwo.car.model + ' ' + sectionTwo.car.year + ' ' + sectionTwo.car.carPlateNumber}</strong><br />
                                                                    <strong>Date d'expiration : </strong>{sectionTwo.expiryDate.substring(0, 10)}
                                                                </div>
                                                            </ListItemText>
                                                        </ListItemButton>
                                                        <Button color='error' size='smal' onClick={() => {
                                                            setCurrentOutdateId(sectionTwo.id)
                                                            setOpenAlert(true)
                                                        }}>
                                                            <strong>Supprimer</strong>
                                                        </Button>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </List>
                            }
                        </Grid>
                        <Grid item xs={3}>
                            <h3 style={{ color: 'green' }}>En cours ... 45 jours</h3><br />

                            {
                                sectionThrees.length === 0 ?
                                    <strong style={{ color: 'grey' }}>Pas de document.</strong> :
                                    <List>
                                        {
                                            sectionThrees.slice(0).reverse().map((sectionThree, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} onClick={() => {
                                                            navigate('/admins/cars-' + sectionThree.car.id)
                                                        }}>
                                                            <ListItemText>
                                                                <div style={{ fontSize: 13, lineHeight: 2 }}>
                                                                    <strong>{sectionThree.car.brand + ' ' + sectionThree.car.model + ' ' + sectionThree.car.year + ' ' + sectionThree.car.carPlateNumber}</strong><br />
                                                                    <strong>Date d'expiration : </strong>{sectionThree.expiryDate.substring(0, 10)}
                                                                </div>
                                                            </ListItemText>
                                                        </ListItemButton>
                                                        <Button color='error' size='smal' onClick={() => {
                                                            setCurrentOutdateId(sectionThree.id)
                                                            setOpenAlert(true)
                                                        }}>
                                                            <strong>Supprimer</strong>
                                                        </Button>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </List>
                            }
                        </Grid>
                    </Grid>
            }

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentOutdateId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer ce document de la liste?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir ce document de la liste ? Cette action sera défintive et irréversible !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentOutdateId(0)
                    }}>Fermer</Button>
                    <Button color='error' onClick={handleRemoveOutdate} autoFocus>
                        {isOutdateDeleting ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Fragment>
    )
}