import { Close } from '@mui/icons-material'
import { Button, CircularProgress, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

let bodyData = null

export default function CreateCategory() {
    const [isCategoryUpdated, setIsCategoryUpdated] = useState(false)
    const [isCategoryUpdating, setIsCategoryUpdating] = useState(false)
    const [icon, setIcon] = React.useState([])

    const [name, setName] = useState('')

    const navigate = useNavigate()

    const updateCategory = async () => {

        setIsCategoryUpdating(true)

        if (bodyData === null) bodyData = new FormData()
        bodyData.set('name', name)

        console.log(bodyData.get('icone'));

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/cars/categories`,
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
                        setName('')
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
            <Grid container>
                <Grid item xs={6}>
                    <Typography typography={`h4`}>
                        Créer une catégorie
                    </Typography><br /><br />

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
                    <br />

                    <TextField value={name} label="Nom de la catégorie" variant="outlined" sx={{ width: 300 }} onChange={(e) => {
                        setName(e.target.value)
                    }} />&nbsp;&nbsp;

                    <br /><br />

                    <Button variant='contained' size='large' disabled={isCategoryUpdating} disableElevation onClick={() => {
                        updateCategory()
                    }}>
                        {isCategoryUpdating ? <CircularProgress size={22} /> : <strong>Créer</strong>}
                    </Button>&nbsp;&nbsp;
                </Grid>
            </Grid>
        </div>
    )
}