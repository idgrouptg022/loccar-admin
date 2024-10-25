import { Send } from '@mui/icons-material'
import { Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Modal, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useRef, useState } from 'react'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25%',
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
}

export default function CommentedInvoice(props) {
    const [invoices, setInvoices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [openModal, setOpenModal] = React.useState(false)

    const [currentInvoice, setCurrentInvoice] = React.useState(null)
    const [newComment, setNewComment] = React.useState('')
    const [comment, setComment] = React.useState('')
    const [comments, setComments] = React.useState([])

    const [currentInvoiceId, setCurrentInvoiceId] = useState(0)

    const [isFetched, setIsFetched] = useState(false)

    const bottomEl = useRef(null)

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/invoices/list/commented`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setInvoices(response.data.data)
                        setIsFetched(true)
                        setOpenAlert(false)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                // console.log(error)
            })
    }

    async function fetchComments(invoiceId) {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/invoices/${invoiceId}/comments/list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setComments(response.data.data)
                        setTimeout(() => {
                            bottomEl?.current?.scrollIntoView({ behavior: 'smooth' })
                        }, 300)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                // console.log(error)
            })
    }

    const handleClassifyInvoice = async () => {
        if (props.userRights?.split(',').includes('19') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            await axios({
                method: "put",
                url: `${process.env.REACT_APP_API_URL}/invoices/${currentInvoiceId}/classify`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            fetchData()
                            setIsLoading(false)
                            setCurrentInvoiceId(0)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {

                })
        }
    }

    const handleAnswerComment = async () => {

        if (props.userRights?.split(',').includes('21') || JSON.parse(localStorage.getItem('data')).id == 1) {
            const bodyFormData = new FormData()
            bodyFormData.append('comment', comment)
            bodyFormData.append('invoiceId', currentInvoice.id)
            bodyFormData.append('ownerId', currentInvoice.owner.id)

            await axios({
                method: "put",
                url: `${process.env.REACT_APP_API_URL}/invoices/${currentInvoice.id}/comment/answer`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            fetchData()
                            fetchComments(currentInvoice.id)
                            // setNewComment(comment)
                            setComment('')
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {

                })
        }

    }

    useEffect(() => {
        fetchData()

    }, [])

    useEffect(() => {
        props.socket.on("handleCommentInvoice", async (data) => {
            fetchData()

            if (currentInvoice) {
                fetchComments(currentInvoice.id)
            }
        })
    }, [props.socket, currentInvoice])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Liste des devis commentés</h2>
                </Grid>
            </Grid><br />
            {
                !props.userRights?.split(',').includes('20') && JSON.parse(localStorage.getItem('data')).id != 1 ?
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
                                invoices.length === 0 ?
                                    <Typography textAlign={'center'} color={'GrayText'}><strong>Pas de nouveau devis commentée</strong>.</Typography> :
                                    <Grid container spacing={3}>
                                        {
                                            invoices.map((data) => {
                                                return (
                                                    <Grid xl={3} lg={4} item key={data.id}>
                                                        <Card variant="outlined" sx={{ p: 3, borderRadius: 5 }}>
                                                            <Typography typography={'h5'} mb={1}>
                                                                Devis #{data.ref}
                                                            </Typography>
                                                            <Typography fontSize={13}>
                                                                <strong>{data.car.brand} {data.car.model} {data.car.year} {data.car.carPlateNumber}</strong><br />
                                                                <b>{data.owner.ref}</b> {data.owner.accountType === 'enterprise' ? data.owner.socialReason : data.owner.fullName}<br />

                                                                Objet :&nbsp;
                                                                {
                                                                    data.source === 'accident' ?
                                                                        <b>Devis d'accident</b> :
                                                                        <Fragment>
                                                                            {
                                                                                data.source === 'breakdown' ?
                                                                                    <b>Devis panne</b> :
                                                                                    <b>Devis d'entretien</b>
                                                                            }
                                                                        </Fragment>
                                                                }<br />
                                                                <Button disabled={!props.userRights?.split(',').includes('21') && JSON.parse(localStorage.getItem('data')).id != 1} variant='outlined' color='warning' size='small' sx={{ borderRadius: 5, mt: 1 }} onClick={() => {
                                                                    setComments([])
                                                                    fetchComments(data.id)
                                                                    setCurrentInvoice(data)
                                                                    setOpenModal(true)
                                                                }}><strong>Ouvrir les commentaires</strong></Button><br /><br />

                                                                <a href={`${process.env.REACT_APP_API_BASE_URL}/${data.file}`}><strong>Devis.PDF [Cliquez pour ouvrir]</strong></a><br /><br />

                                                                <Button disabled={!props.userRights?.split(',').includes('19') && JSON.parse(localStorage.getItem('data')).id != 1} variant='outlined' color='success' onClick={() => {
                                                                    setOpenAlert(true)
                                                                    setCurrentInvoiceId(data.id)
                                                                }}><strong>Classer le devis</strong></Button>
                                                            </Typography>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                            }

                        </Fragment>
            }

            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false)
                    setCurrentInvoice(null)
                    setNewComment('')
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <strong>Commentaires devis</strong>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} fontSize={13} component={'div'}>
                        <strong>Devis #{currentInvoice?.ref}</strong><br />
                        <strong>{currentInvoice?.car.brand} {currentInvoice?.car.model} {currentInvoice?.car.year} {currentInvoice?.car.carPlateNumber}</strong><br />
                        <b>{currentInvoice?.owner.ref}</b> {currentInvoice?.owner.accountType === 'enterprise' ? currentInvoice?.owner.socialReason : currentInvoice?.owner.fullName}<br />

                        Objet :&nbsp;
                        {
                            currentInvoice?.source === 'accident' ?
                                <b>Devis d'accident</b> :
                                <Fragment>
                                    {
                                        currentInvoice?.source === 'breakdown' ?
                                            <b>Devis panne</b> :
                                            <b>Devis d'entretien</b>
                                    }
                                </Fragment>
                        }<br />

                        <Grid container>

                        </Grid><br />
                        <Grid container style={{ maxHeight: "60vh", overflow: 'auto' }}>
                            {
                                comments.map((commentData, key) => {
                                    return (
                                        <Grid container key={key}>
                                            {
                                                commentData.sender === 'admin' ?
                                                    <Fragment>
                                                        <Grid item xs={4}></Grid>
                                                        <Grid item xs={8}>
                                                            <Typography bgcolor={'lightgray'} p={1} borderRadius={5} fontSize={13}>
                                                                {commentData?.comment}
                                                            </Typography>
                                                            <div style={{ marginBottom: 10 }}><small>{commentData.createdAt.substring(0, 10)} à {commentData.createdAt.substring(11, 16)}</small></div>
                                                        </Grid>
                                                    </Fragment> :
                                                    <Fragment>
                                                        <Grid item xs={8}>
                                                            <Typography bgcolor={'lightblue'} p={1} borderRadius={5} fontSize={13}>
                                                                {commentData.comment}
                                                            </Typography>
                                                            <div style={{ marginBottom: 10 }}><small>{commentData.createdAt.substring(0, 10)} à {commentData.createdAt.substring(11, 16)}</small></div>
                                                        </Grid>
                                                        <Grid item xs={4}></Grid>
                                                    </Fragment>
                                            }
                                        </Grid>
                                    )
                                })
                            }
                            <Grid item xs={12}><div ref={bottomEl}></div></Grid>
                        </Grid><br /><br />

                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <TextField id="outlined-basic" maxRows={3} multiline label="Commentaire" fullWidth variant="outlined" value={comment} onChange={(e) => {
                                    setComment(e.target.value)
                                }} />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton color='success' sx={{ mt: 1 }} onClick={() => {
                                    if (comment.trim().length > 0) {
                                        handleAnswerComment()
                                    }
                                }}>
                                    <Send />
                                </IconButton>
                            </Grid>
                        </Grid>

                    </Typography>
                </Box>
            </Modal>

            <Dialog
                open={openAlert}
                onClose={() => {
                    setOpenAlert(false)
                    setCurrentInvoiceId(0)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Classer ce devis ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir classer ce devis ? Cette action sera défintive et sans retour.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAlert(false)
                        setCurrentInvoiceId(0)
                    }}>Fermer</Button>
                    <Button color='primary' onClick={() => {
                        handleClassifyInvoice(currentInvoiceId)
                    }} autoFocus>
                        {isLoading ? "Patientez ..." : "Classer"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Fragment>
    )
}