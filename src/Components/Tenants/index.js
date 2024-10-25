import { Add } from '@mui/icons-material'
import { Button, CircularProgress, Grid, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'lastName', headerName: 'Nom de famille', width: 130 },
    { field: 'firstName', headerName: 'Prénom', width: 130 },
    { field: 'phoneNumber', headerName: 'Numéro de téléphone', width: 130 },
]

export default function Tenants(props) {
    const [users, setUsers] = useState([])
    const [isFetched, setIsFetched] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {

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
        navigate('/admins/tenants-' + id)
    }

    return (
        <div>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des locataires</h2>
                </Grid>
                <Grid xs={6} item textAlign={"right"}>
                    <Button variant="contained" disableElevation startIcon={<Add />} sx={{ borderRadius: 5 }} onClick={() => {
                        navigate('/admins/create-tenant')
                    }}>
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
                            users.length === 0 ?
                                <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de locataire inscrit</strong>.</Typography> :
                                <DataGrid
                                    sx={{ borderRadius: 5 }}
                                    rows={users}
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