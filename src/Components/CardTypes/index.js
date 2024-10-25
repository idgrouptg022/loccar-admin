import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, Modal, Snackbar, TextField, Typography } from '@mui/material'
import { Add, Close, Delete, Edit } from '@mui/icons-material'
import axios from 'axios'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25%',
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
}

export default function CardTypes(props) {
    const [cards, setCards] = useState([])

    const [currentCardTypeId, setCurrentCardTypeId] = useState(0)

    const [name, setName] = useState("")
    const [nameError, setNameError] = useState(false)
    const [nameErrorText, setNameErrorText] = useState("")

    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [isSuccessed, setIsSuccessed] = useState(false)
    const [isSuccessedMessage, setIsSuccessedMessage] = useState(false)
    const [isFetched, setIsFetched] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)

    const handleCreateCardType = async (e) => {
        if (props.userRights?.split(',').includes('25') || JSON.parse(localStorage.getItem('data')).id == 1) {
            let canSubmit = true
            e.preventDefault()

            setNameError(false)
            setNameErrorText("")

            if (name.length === 0) {
                setNameError(true)
                setNameErrorText("Champ obligatoire.")
                canSubmit = false
            }

            if (canSubmit) {
                setIsLoading(true)

                const bodyFormData = new FormData()
                bodyFormData.append('name', name)
                bodyFormData.append('description', description)

                await axios({
                    method: currentCardTypeId === 0 ? "post" : "put",
                    url: currentCardTypeId === 0 ? `${process.env.REACT_APP_API_URL}/card-types` : `${process.env.REACT_APP_API_URL}/card-types/${currentCardTypeId}`,
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                    }
                })
                    .then(function (response) {
                        try {
                            if (response.data?.responseCode === '0') {
                                setCards(response.data.data)
                                setName("")
                                setDescription("")
                                setIsSuccessed(true)
                                setIsSuccessedMessage("Le type de carte a été créé avec succè !")
                                setOpenModal(false)
                                setIsLoading(false)
                                fetchData()
                            }
                        } catch {
                            //
                        }
                    })
                    .catch(function (error) {
                        if (error.response.data?.responseCode === "E-R-00009-23") {
                            setNameError(true)
                            setNameErrorText("Un type de carte avec le même nom existe déjà.")
                        } else {
                            setNameError(true)
                            setNameErrorText("Un problème de source iconnue survenur. Réessayez !")
                        }
                        setIsLoading(false)
                    })
            }
        }
    }

    const handleDeleteCardType = async () => {
        if (props.userRights?.split(',').includes('25') || JSON.parse(localStorage.getItem('data')).id == 1) {
            await axios({
                method: "delete",
                url: `${process.env.REACT_APP_API_URL}/card-types/${currentCardTypeId}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setOpenAlert(false)
                            setIsSuccessed(true)
                            setIsSuccessedMessage("Le type de carte a été supprimé avec succès !")
                            setCurrentCardTypeId(0)
                            setName("")
                            fetchData()
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
        }
    }

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/card-types`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setCards(response.data.data)
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

    useEffect(() => {
        fetchData()
    }, [])



    return (
        <div>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des types de cartes</h2>
                </Grid>
                <Grid xs={6} item textAlign={"right"}>
                    <Button variant="contained" disabled={!props.userRights?.split(',').includes('25') && JSON.parse(localStorage.getItem('data')).id != 1} disableElevation startIcon={<Add />} sx={{ borderRadius: 5 }} onClick={() => {
                        setOpenModal(true)
                    }}>
                        <strong>Créer</strong>
                    </Button>

                    <Modal
                        open={openModal}
                        onClose={() => {
                            setOpenModal(false)
                            setCurrentCardTypeId(0)
                        }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                <strong>{currentCardTypeId === 0 ? "Créer" : "Modifier"} un type de carte</strong>
                            </Typography>

                            <form method='post' onSubmit={handleCreateCardType}>
                                <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                                    <TextField label="Nom du type de la carte" variant="outlined" value={name} onChange={(e) => {
                                        setName(e.target.value)
                                    }} disabled={isLoading} error={nameError} helperText={nameErrorText} /><br />

                                    <TextField
                                        label="Description du type de carte (Facultatif)"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        disabled={isLoading}
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value)
                                        }}
                                    />

                                </FormControl>

                                <Button fullWidth variant='contained' type='submit' disableElevation size='large' disabled={isLoading}>
                                    {
                                        isLoading ?
                                            <CircularProgress size={26} /> :
                                            <strong>Soumettre</strong>
                                    }
                                </Button>
                            </form>
                        </Box>
                    </Modal>

                    <Snackbar
                        open={isSuccessed}
                        autoHideDuration={6000}
                        onClose={() => {
                            setIsSuccessed(false)
                        }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        message={isSuccessedMessage}
                        action={<IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => {
                                setIsSuccessed(false)
                            }}
                        >
                            <Close fontSize="small" />
                        </IconButton>}
                    />
                </Grid>
            </Grid><br />
            {
                !props.userRights?.split(',').includes('25') && JSON.parse(localStorage.getItem('data')).id != 1 ?
                    <Typography textAlign={`center`} typography={`h5`}>
                        <br /><br /><br />
                        Non autorisé !
                    </Typography> :
                    !isFetched ?
                        <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                            <CircularProgress />
                        </div> :
                        <Fragment>
                            {
                                cards.length === 0 ?
                                    <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de type de carte créé</strong>.</Typography> :
                                    <Grid container spacing={2}>
                                        {
                                            cards.map((data) => {
                                                return (
                                                    <Grid xl={4} lg={4} item key={data.id}>
                                                        <Card variant='outlined' sx={{ pt: 3, pl: 3, pr: 3, pb: 1, borderRadius: 5 }}>
                                                            <h3>{data.name}</h3><br />

                                                            <div style={{ height: 40, overflow: 'auto' }}>{data.description ? data.description : <span style={{ color: 'GrayText' }}>Sans description.</span>}</div><br />

                                                            <IconButton color='primary' onClick={() => {
                                                                setCurrentCardTypeId(data.id)
                                                                setOpenModal(true)

                                                                setName(data.name)
                                                                setDescription(data.description)
                                                            }}>
                                                                <Edit />
                                                            </IconButton>

                                                            <IconButton color='error' onClick={() => {
                                                                setCurrentCardTypeId(data.id)
                                                                setName(data.name)
                                                                setOpenAlert(true)
                                                            }}>
                                                                <Delete />
                                                            </IconButton>

                                                            <Dialog
                                                                open={openAlert}
                                                                onClose={() => {
                                                                    setOpenAlert(false)
                                                                    setCurrentCardTypeId(0)
                                                                    setName("")
                                                                }}
                                                                aria-labelledby="alert-dialog-title"
                                                                aria-describedby="alert-dialog-description"
                                                            >
                                                                <DialogTitle id="alert-dialog-title">
                                                                    {"Supprimer ce type de carte ?"}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText id="alert-dialog-description">
                                                                        Êtes-vous sûr(e) de vouloir supprimer le type de carte "<strong>{name}</strong>" ? Cette action sera défintive et irréversible !
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={() => {
                                                                        setOpenAlert(false)
                                                                        setCurrentCardTypeId(0)
                                                                        setName("")
                                                                    }}>Fermer</Button>
                                                                    <Button color='error' onClick={handleDeleteCardType} autoFocus>
                                                                        Supprimer
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                            }
                        </Fragment>
            }
        </div>
    )
}
