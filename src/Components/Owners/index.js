import React, { Fragment, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, CircularProgress, Grid, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'ref', headerName: 'REF', width: 130 },
    {
        field: 'fullName',
        headerName: 'Nom complet',
        width: 120,
    },
    {
        field: 'socialReason',
        headerName: 'Raison sociale',
        width: 120,
    },
    {
        field: 'responsibleFullName',
        headerName: 'Responsable',
        width: 120,
    },
    { field: 'email', headerName: 'Email', width: 100 },
    { field: 'phoneNumber', headerName: 'Téléphone', width: 130 },
    { field: 'idCardNumber', headerName: 'Numéro de carte', width: 150 }
]

export default function Owners(props) {
    const [owners, setOwners] = useState([])
    const [isFetched, setIsFetched] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/owners/`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setOwners(response.data.data)
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
        if (props.userRights?.split(',').includes('3') || JSON.parse(localStorage.getItem('data')).id == 1) {
            const { id } = params.row
            navigate('/admins/owners-' + id)
        }
    }

    return (
        <div>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des propriétaires</h2>
                </Grid>
                <Grid xs={6} item textAlign={"right"}>
                    <Button variant="contained" disableElevation startIcon={<Add />} sx={{ borderRadius: 5 }} onClick={() => {
                        navigate('/admins/create-owner')
                    }} disabled={!props.userRights?.split(',').includes('1') && JSON.parse(localStorage.getItem('data')).id != 1}>
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
                            owners.length === 0 ?
                                <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de propriétaire créé</strong>.</Typography> :
                                <DataGrid
                                    sx={{ borderRadius: 5 }}
                                    rows={owners}
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
