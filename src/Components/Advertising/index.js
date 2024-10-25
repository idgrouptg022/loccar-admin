import { Delete } from '@mui/icons-material'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'

let bodyData = null

export default function Advertising() {
    const [isLoading, setIsLoading] = useState(false)
    const [oldImages, setOldImages] = useState([])
    const [images, setImages] = useState([])
    const [openDeleteAdvertising, setOpenDeleteAdvertising] = useState(false)
    const [currentAdvertisingId, setCurrentAdvertisingId] = useState(0)

    const handleFetchdvertising = async () => {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/settings/carousels`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setOldImages(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const handleCreateAdvertising = async () => {
        setIsLoading(true)

        if (bodyData === null) bodyData = new FormData()

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/settings/carousels`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setIsLoading(false)
                        handleFetchdvertising()
                        setImages([])
                        bodyData.delete('carousels')
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const handleDeleteAdvertising = async () => {
        setIsLoading(true)

        if (bodyData === null) bodyData = new FormData()

        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/settings/carousels/${currentAdvertisingId}`,
            data: bodyData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setCurrentAdvertisingId(0)
                        handleFetchdvertising()
                        setIsLoading(false)
                        setOpenDeleteAdvertising(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const handleSelectImages = (e) => {
        if (e.target.files.length > 0) {

            if (bodyData === null) {
                bodyData = new FormData()
            }

            for (let i = 0; i < e.target.files.length; i++) {
                bodyData.set('carousels', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setImages(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    useEffect(() => {
        handleFetchdvertising()
    }, [])

    return (
        <Fragment>
            <Grid container>
                <Grid item xs={6}>
                    <br /><br />
                    <Typography typography={`h4`}>
                        Créer une image de publicité
                    </Typography><br /><br />
                    <div>
                        {oldImages.length === 0 && <CircularProgress size={22} />}
                    </div><br />
                    <Grid container>
                        {
                            oldImages.map((data, index) => {
                                return (
                                    <Grid item xs={4} key={index}>
                                        <img src={`${process.env.REACT_APP_API_BASE_URL}/${data.path}`} alt="Carousel" width={100} /><br />
                                        <Button color='error' onClick={() => {
                                            setCurrentAdvertisingId(data.id)
                                            setOpenDeleteAdvertising(true)
                                        }}>
                                            <Delete />
                                        </Button><br /><br />
                                    </Grid>
                                )
                            })
                        }

                    </Grid>

                    {
                        images.length > 0 &&
                        <Grid container spacing={1}>
                            {
                                images.map((photo, key) => {
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
                            <h3>Images de la publicité</h3>
                            <p>Taille maximale 10mb</p>
                            <input type="file" accept='image/*' onInput={(e) => { handleSelectImages(e) }} multiple />
                        </div>
                    </div>
                    <br />

                    <Button variant='contained' size='large' disabled={isLoading} disableElevation onClick={() => {
                        handleCreateAdvertising()
                    }}>
                        {isLoading ? <CircularProgress size={22} /> : <strong>Créer</strong>}
                    </Button>&nbsp;&nbsp;
                </Grid>
            </Grid>

            <Dialog
                open={openDeleteAdvertising}
                onClose={() => {
                    setOpenDeleteAdvertising(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    <strong>Confirmer la suppression ?</strong>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes vous sûr(e) de vouloir supprimer cette image de publicité ? Cette action supprimera toutes les autres information liées et sera irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDeleteAdvertising(false)
                    }}>
                        <strong>Fermer</strong>
                    </Button>
                    <Button color='error' onClick={handleDeleteAdvertising}>
                        <strong>{isLoading ? "Patientez" : "Supprimer"}</strong>
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>

    )
}
