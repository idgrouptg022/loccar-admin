import { Add } from '@mui/icons-material'
import { Button, CircularProgress, Grid, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'fullName', headerName: 'Nom complet', width: 130 },
]

export default function Users(props) {
    const [admins, setAdmins] = useState([])
    const [isFetched, setIsFetched] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/admnistrators`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setAdmins(response.data.data)
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
        if (props.userRights?.split(',').includes('27') || JSON.parse(localStorage.getItem('data')).id === 1) {
            const { id } = params.row
            navigate('/admins/users-' + id)
        }
    }

    return (
        <div>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des utilisateurs</h2>
                </Grid>
                <Grid xs={6} item textAlign={"right"}>
                    <Button variant="contained" disableElevation startIcon={<Add />} sx={{ borderRadius: 5 }} onClick={() => {
                        navigate('/admins/create-user')
                    }} disabled={!props.userRights?.split(',').includes('27') && JSON.parse(localStorage.getItem('data')).id !== 1}>
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
                            admins.length === 0 ?
                                <Typography textAlign={'center'} color={'GrayText'}><strong>Pas d'utilisateur créé</strong>.</Typography> :
                                <DataGrid
                                    sx={{ borderRadius: 5 }}
                                    rows={admins}
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