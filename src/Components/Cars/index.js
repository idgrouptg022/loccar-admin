import React, { Fragment, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, CircularProgress, Grid, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'carPlateNumber', headerName: 'Plaque', width: 130 },
    { field: 'brand', headerName: 'Marque', width: 130 },
    {
        field: 'year',
        headerName: 'Année',
        type: 'number',
        width: 120,
    },
    { field: 'model', headerName: 'Modèle', width: 100 },
    { field: 'createdAt', headerName: 'Date de création', width: 200 },
    // { field: 'driverLicenseExpiryDate', headerName: 'Expiration de permis', width: 200 },
]

export default function Cars(props) {
    const [cars, setCars] = useState([])
    const [isFetched, setIsFetched] = useState(false)

    const [amount, setAmount] = React.useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/owners/cars/list/all`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setCars(response.data.data)
                            setIsFetched(true)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
        }

        fetchData()

    }, [])

    const handleRowClick = (params) => {
        const { id } = params.row
        navigate('/admins/cars-' + id)
    }

    return (
        <div>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des voitures</h2>
                </Grid>
                <Grid xs={6} item textAlign={"right"}>
                    <Button variant="contained" disableElevation startIcon={<Add />} sx={{ borderRadius: 5 }} onClick={() => {
                        navigate('/admins/create-car')
                    }} disabled={!props.userRights?.split(',').includes('2') && JSON.parse(localStorage.getItem('data')).id != 1}>
                        <strong>Créer</strong>
                    </Button>
                </Grid>
            </Grid><br />
            {
                !isFetched ?
                    <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                        <CircularProgress />
                    </div> :
                    <Fragment>
                        {
                            cars.length === 0 ?
                                <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de voiture créée</strong>.</Typography> :
                                <DataGrid
                                    sx={{ borderRadius: 5 }}
                                    rows={cars}
                                    columns={columns}
                                    onRowDoubleClick={handleRowClick}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 20 },
                                        },
                                    }}
                                    pageSizeOptions={[20, 40]}
                                />
                        }
                    </Fragment>
            }
        </div>
    )
}
