import { Close } from '@mui/icons-material'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

let bodyData = null

export default function Category(props) {
    const [isFetched, setIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isCategoryUpdated, setIsCategoryUpdated] = useState(false)
    const [isCategoryUpdating, setIsCategoryUpdating] = useState(false)

    const [openDeleteCategory, setOpenDeleteCategory] = useState(false)

    const [icon, setIcon] = useState([])
    const [oldIcon, setOldIcon] = useState("")

    const [name, setName] = useState('')

    const navigate = useNavigate()

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/cars/categories/${props.category}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setName(response.data.data[0].name)
                        setOldIcon(response.data.data[0].icone)
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

    const updateCategory = async () => {

        setIsCategoryUpdating(true)

        if (bodyData === null) bodyData = new FormData()
        bodyData.set('name', name)

        await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}/cars/categories/${props.category}`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setIsCategoryUpdated(true)
                        setIsCategoryUpdating(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const deleteCategory = async () => {

        setIsLoading(true)

        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/cars/categories/${props.category}`,
            data: {},
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        navigate(-1)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const handleSelectIcon = (e) => {
        if (e.target.files.length > 0) {

            if (bodyData === null) {
                bodyData = new FormData()
            }

            for (let i = 0; i < e.target.files.length; i++) {
                bodyData.set('icone', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setIcon(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [props.category])

    return (
        <div>
            <Snackbar
                open={isCategoryUpdated}
                autoHideDuration={6000}
                onClose={() => {
                    setIsCategoryUpdated(false)
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message="Operation effectuée avec succès !"
                action={<IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => {
                        setIsCategoryUpdating(false)
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
                                Détails de la catégorie
                            </Typography><br /><br />

                            {
                                oldIcon &&
                                <Fragment>
                                    <img src={`${process.env.REACT_APP_API_BASE_URL}/${oldIcon}`} alt={name} width={60} /><br /><br />
                                </Fragment>
                            }

                            {
                                icon.length > 0 &&
                                <Grid container spacing={1}>
                                    {
                                        icon.map((photo, key) => {
                                            return (
                                                <Grid item xs={3} key={key}>
                                                    <Typography borderRadius={3} sx={{
                                                        backgroundImage: `url(${photo.path})`,
                                                        height: 100,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}></Typography>
                                                    <br />
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            }

                            <div className="parent" style={{ maxWidth: 300, margin: 0 }}>
                                <div className="file-upload">
                                    <h3>Icône de la catégorie</h3>
                                    <p>Taille maximale 10mb</p>
                                    <input type="file" accept='image/*' onInput={(e) => { handleSelectIcon(e) }} multiple />
                                </div>
                            </div>
                            <br /><br />

                            <TextField value={name} label="Nom de la catégorie" variant="outlined" sx={{ width: 300 }} onChange={(e) => {
                                setName(e.target.value)
                            }} />&nbsp;&nbsp;

                            <br /><br />

                            <Button variant='contained' size='large' disabled={isCategoryUpdating} disableElevation onClick={() => {
                                updateCategory()
                            }}>
                                {isCategoryUpdating ? <CircularProgress size={22} /> : <strong>Mettre à jour</strong>}
                            </Button>&nbsp;&nbsp;

                            <Button variant='contained' size='large' color='error' disableElevation onClick={() => {
                                setOpenDeleteCategory(true)
                            }}>
                                <strong>Supprimer</strong>
                            </Button>&nbsp;&nbsp;
                        </Grid>
                    </Grid>
            }

            <Dialog
                open={openDeleteCategory}
                onClose={() => {
                    setOpenDeleteCategory(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    <strong>Confirmer la suppression ?</strong>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes vous sûr(e) de vouloir supprimer cette catégorie ? Cette action supprimera toutes les autres information liées et sera irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDeleteCategory(false)
                    }}>
                        <strong>Fermer</strong>
                    </Button>
                    <Button color='error' onClick={deleteCategory}>
                        <strong>{isLoading ? "Patientez" : "Supprimer"}</strong>
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}