import { Close } from '@mui/icons-material'
import { Autocomplete, Button, Card, CircularProgress, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

export default function Rental(props) {
    const [users, setUsers] = useState([])

    const [rentals, setRentals] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [isRentalUpdated, setIsRentalUpdated] = useState(false)
    const [isRentalUpdating, setIsRentalUpdating] = useState(false)

    const [userId, setUserId] = useState(0)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [price, setPrice] = useState(0)
    const [days, setDays] = useState(0)
    const [deposit, setDeposit] = useState(0)
    const [state, setState] = useState(0)
    const [oldUser, setOldUser] = useState({})

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/rental/list/${props.rental}/read/details`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setRentals([response.data.data[0].rent])
                        setStartDate(response.data.data[0].rent.startDate || '')
                        setEndDate(response.data.data[0].rent.startDate || '')
                        setDays(response.data.data[0].rent.days)
                        setDeposit(response.data.data[0].rent.deposit)
                        setState(response.data.data[0].rent.state)
                        setIsFetched(true)
                        setOldUser(response.data.data[0].rent.user)
                        console.log(response.data.data[0].rent)
                        setPrice(response.data.data[0].rent.price)
                        setUserId(response.data.data[0].rent.user.id);
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const updateRental = async () => {

        setIsRentalUpdating(true)

        const bodyData = new FormData()
        bodyData.set('userId', userId)

        if (startDate !== "") {
            bodyData.set('startDate', startDate)
        }
        if (endDate !== "") {
            bodyData.set('endDate', endDate)
        }
        
        bodyData.set('days', days)
        bodyData.set('deposit', deposit)
        bodyData.set('state', state)

        await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/rental/list/${props.rental}/update`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setIsRentalUpdated(true)
                        setIsRentalUpdating(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    useEffect(() => {
        async function fetchUsers() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/rentals/users/list/all`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setUsers(response.data.data)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
        }

        fetchUsers()

    }, [])

    useEffect(() => {
        fetchData()
    }, [props.rental])

    return (
        <div>
            <Snackbar
                open={isRentalUpdated}
                autoHideDuration={6000}
                onClose={() => {
                    setIsRentalUpdated(false)
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message="Operation effectuée avec succès !"
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => {
                        setIsRentalUpdated(false)
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>}
            />
            <br /><br /><br />
            {
                !isFetched ? <Typography textAlign={`center`} component={`div`}><CircularProgress /></Typography> :
                    <Grid container>
                        <Grid item xs={6}>

                            <Typography typography={`h4`}>
                                Détails de la demande de location
                            </Typography><br /><br />

                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    <Autocomplete
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                setUserId(newValue.id)
                                            } else {
                                                setUserId(0)
                                            }
                                        }}
                                        value={oldUser}
                                        disablePortal
                                        options={users}
                                        getOptionLabel={(option) => (option?.lastName || option.phoneNumber) + ' ' + (option?.firstName || option.phoneNumber)}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params} label="Locataire ..." />}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={rentals[0].car?.brand + ' ' + rentals[0].car?.model + ' ' + rentals[0].car?.year || ''} label="Voiture" fullWidth variant="outlined" disabled /><br /><br />
                                </Grid>
                            </Grid>

                            &nbsp;&nbsp;

                            <Grid item xs={6}>
                                <label htmlFor='startDate'><b>Date de début [{rentals[0].startDate}]</b></label><br />
                                <input type="datetime-local" value={startDate} style={{ width: 300, padding: 14, border: '1px solid #CCC', borderRadius: 5 }} onChange={(e) => {
                                    setStartDate(e.target.value);

                                }} />
                            </Grid><br />
                            <Grid item xs={6}>
                                <label htmlFor='startDate'><b>Date de fin [{rentals[0].endDate}]</b></label><br />
                                <input type="datetime-local" value={endDate} style={{ width: 300, padding: 14, border: '1px solid #CCC', borderRadius: 5 }} onChange={(e) => {
                                    setEndDate(e.target.value);

                                }} />
                            </Grid>

                            <br /><br />

                            <TextField value={days} label="Nombre de jours" variant="outlined" sx={{ width: 300 }} onChange={(e) => {
                                setDays(e.target.value)
                            }} />&nbsp;&nbsp;
                            <TextField value={deposit} label="Caution" sx={{ width: 300 }} variant="outlined" onChange={(e) => {
                                setDeposit(e.target.value)
                            }} /><br /><br />


                            <TextField value={price} label="Prix en F CFA" variant="outlined" sx={{ width: 300 }} onChange={(e) => {
                                setDays(e.target.value)
                            }} />&nbsp;&nbsp;
                            <select style={{ width: 300, padding: 14, border: '1px solid #CCC', borderRadius: 5 }} onChange={(e) => {
                                setState(e.target.value);
                            }} defaultValue={state}>
                                <option value="0" key="0" defaultValue={state == 0}>Non traité</option>
                                <option value="1" key="1" defaultValue={state == 1}>En course ...</option>
                                <option value="2" key="2" defaultValue={state == 2}>Course terminiée</option>
                            </select><br /><br />

                            <Button variant='contained' size='large' disabled={isRentalUpdating} disableElevation onClick={() => {
                                updateRental()
                            }}>
                                {isRentalUpdating ? <CircularProgress size={22} /> : <strong>Mettre à jour</strong>}
                            </Button>&nbsp;&nbsp;
                        </Grid>
                        <Grid xl={6} lg={8} item>
                            <Card variant="outlined" sx={{ borderRadius: 5, height: '75vh' }}>
                                <MapContainer center={[rentals[0].lat || 0, rentals[0].lon || 0]} zoom={12} style={{ height: "70em" }}>
                                    <TileLayer
                                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[rentals[0].lat || 0, rentals[0].lon || 0]}>
                                        <Popup>
                                            Position exacte du signalement de l'accident par <strong>{rentals[0].user?.firstName}</strong><br /><br />
                                            <strong>Latitute : </strong>{rentals[0].lat || 0}<br />
                                            <strong>Longitude : </strong>{rentals[0].lon || 0}<br />
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </Card>
                        </Grid>
                    </Grid>
            }
        </div>
    )
}