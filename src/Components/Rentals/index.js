import { Check, HourglassBottom } from '@mui/icons-material'
import { Badge, Card, Grid, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Rentals(props) {
    const [rentals, setRentals] = useState([])

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/rental/list/all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {                        
                        setRentals(response.data.data.reverse())                        
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [props.socket])


    useEffect(() => {
        props.socket.on("handleCreateRental", async (data) => {
            fetchData()
        })
    }, [props.socket, rentals])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des demandes de location</h2>
                </Grid>
            </Grid><br />

            {
                rentals.length === 0 ?
                    <Typography textAlign={'center'} color={'GrayText'}></Typography> :
                    <Grid container spacing={3}>
                        {
                            rentals.map((data) => {
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
                                                {
                                                    data.state === 1 && <Badge badgeContent={<HourglassBottom />} color="warning" sx={{ ml: 2 }} />
                                                }
                                                {
                                                    data.state === 2 && <Badge badgeContent={<Check />} color="success" sx={{ ml: 2 }} />
                                                }
                                            </Typography>
                                            <Typography fontSize={13}>
                                                <strong>Numéro de plaque : </strong>{data.car ? data.car.carPlateNumber : 'Non rempli'}<br />
                                                <strong>Date de demande : </strong>{data?.createdAt.substring(0, 10)} à {data.createdAt.substring(11, 16)}<br /><br />
                                                <strong>Demandeur :</strong> {(data.user && data.user?.lastName && data.user?.lastName) ? <Link to={'/admins/tenants-' + data.user.id}>{data.user?.lastName} {data.user?.firstName}</Link> : <Link>{data.user?.userName}</Link>}<br />
                                                <strong>Téléphone :</strong> {data.user?.phoneNumber || 'Non renseigné.'}<br /><br />

                                                <strong>Propriétaire :</strong> {data.car?.owner?.fullName || "Non renseigné."}<br />
                                                <strong>Téléphone :</strong> {data.car?.owner?.phoneNumber || "Non renseigné."}<br /><br />
                                            </Typography>
                                            <Link to={'/admins/rentals-' + data.id}>
                                                <b>Gérer la location</b>
                                            </Link>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
            }


        </Fragment>
    )
}