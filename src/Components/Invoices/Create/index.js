import { Delete, PictureAsPdfTwoTone } from '@mui/icons-material'
import { Button, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'


let bodyFormData = null

export default function CreateInvoice(props) {
    const [object, setObject] = useState(props.wording)

    const [isSent, setIsSent] = useState(false)
    const [isloading, setIsloading] = useState(false)

    const [isReportSent, setIsReportSent] = useState(false)
    const [isRepportLoading, setIsRepportLoading] = useState(false)

    const [invoicePreview, setInvoicePreview] = useState([])

    const [sogevoReportPreview, setSogevoPreview] = useState([])
    const [policeReportPreview, setPolicePreview] = useState([])
    const [diagnosticReportPreview, setDiagnosticPreview] = useState([])
    const [assuranceReportPreview, setAssurancePreview] = useState([])

    if (bodyFormData === null) {
        bodyFormData = new FormData()
    }

    const handleSelectSogevoReport = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('sogevo', e.target.files[i])
                setSogevoPreview(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    const handleSelectPoliceReport = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('police', e.target.files[i])
                setPolicePreview(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    const handleSelectDiagnostic = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('diagnostic', e.target.files[i])
                setDiagnosticPreview(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    const handleSelectAssuranceReport = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('assurance', e.target.files[i])
                setAssurancePreview(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    const handleSelectInvoice = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('invoice', e.target.files[i])
                setInvoicePreview(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    const handleCreateInvoice = async () => {
        setIsloading(true)

        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }

        bodyFormData.set('object', object)
        bodyFormData.set('source', "accident")
        bodyFormData.set('carId', props.carId)
        bodyFormData.set('ownerId', props.ownerId)
        bodyFormData.set('accidentId', props.accidentId)

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/invoices`,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setInvoicePreview([])
                        bodyFormData.delete("invoice")
                        setIsSent(true)
                        setIsloading(false)
                        props.handleUpdateDataCallBack(true)
                    }
                } catch {

                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleCreateReport = async () => {
        setIsRepportLoading(true)

        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }

        bodyFormData.set('carId', props.carId)
        bodyFormData.set('ownerId', props.ownerId)
        bodyFormData.set('accidentId', props.accidentId)

        await axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/reports`,
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setSogevoPreview([])
                        setPolicePreview([])
                        setDiagnosticPreview([])
                        setAssurancePreview([])
                        bodyFormData.delete("sogevo")
                        bodyFormData.delete("police")
                        bodyFormData.delete("disgnostic")
                        bodyFormData.delete("assurance")
                        setIsReportSent(true)
                        setIsRepportLoading(false)
                        props.handleUpdateDataCallBack(true)
                    }
                } catch {

                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleDeletePreview = (target) => {
        switch (target) {
            case 'sogevo':
                bodyFormData.delete(target)
                setSogevoPreview([])
                break;

            case 'police':
                bodyFormData.delete(target)
                setPolicePreview([])
                break;

            case 'diagnostic':
                bodyFormData.delete(target)
                setDiagnosticPreview([])
                break;

            case 'assurance':
                bodyFormData.delete(target)
                setAssurancePreview([])
                break;

            default:
                break;
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid xl={1} lg={1} item></Grid>
            <Grid xl={4} lg={5} item>

                <Typography mb={3}>
                    <strong>Rapport complet de l'accident</strong>
                </Typography>

                {
                    isReportSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Rapport(s) envoyé(s) avec succès !</Typography>
                }

                <br />

                {
                    policeReportPreview.length !== 0 ?
                        <Typography color={'green'} mb={1} textAlign={'center'}>
                            <PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Rapport POLICE joint. </b>
                            <IconButton color='error' onClick={() => {
                                handleDeletePreview('police')
                            }}><Delete /></IconButton>
                        </Typography> :
                        <div className="parent">
                            <div className="file-upload">
                                <h3>Rapport Police</h3>
                                <p>Maximun file size 10mb</p>
                                <input type="file" accept='application/pdf' onInput={(e) => { handleSelectPoliceReport(e) }} />
                            </div>
                        </div>
                }

                <br />

                {
                    diagnosticReportPreview.length !== 0 ?
                        <Typography color={'green'} mb={1} textAlign={'center'}>
                            <PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Rapport DIAGNOSTIC joint. </b>
                            <IconButton color='error' onClick={() => {
                                handleDeletePreview('diagnostic')
                            }}><Delete /></IconButton>
                        </Typography> :
                        <div className="parent">
                            <div className="file-upload">
                                <h3>Diagnostic complet</h3>
                                <p>Maximun file size 10mb</p>
                                <input type="file" accept='application/pdf' onInput={(e) => { handleSelectDiagnostic(e) }} />
                            </div>
                        </div>
                }


                <br />

                {
                    assuranceReportPreview.length !== 0 ?
                        <Typography color={'green'} mb={1} textAlign={'center'}>
                            <PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Rapport ASSURANCE joint. </b>
                            <IconButton color='error' onClick={() => {
                                handleDeletePreview('assurance')
                            }}><Delete /></IconButton>
                        </Typography> :
                        <div className="parent">
                            <div className="file-upload">
                                <h3>Rapport Assurance</h3>
                                <p>Maximun file size 10mb</p>
                                <input type="file" accept='application/pdf' onInput={(e) => { handleSelectAssuranceReport(e) }} />
                            </div>
                        </div>
                }


                <br />

                {
                    sogevoReportPreview.length !== 0 ?
                        <Typography color={'green'} mb={1} textAlign={'center'}>
                            <PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Rapport SOGEVO joint. </b>
                            <IconButton color='error' onClick={() => {
                                handleDeletePreview('sogevo')
                            }}><Delete /></IconButton>
                        </Typography> :
                        <div className="parent">
                            <div className="file-upload">
                                <h3>Rapport SOGEVO</h3>
                                <p>Maximun file size 10mb</p>
                                <input type="file" accept='application/pdf' onInput={(e) => { handleSelectSogevoReport(e) }} />
                            </div>
                        </div>
                }
                <br />

                <Button onClick={handleCreateReport} fullWidth disableElevation size='large' disabled={(sogevoReportPreview.length === 0 && policeReportPreview.length === 0 && diagnosticReportPreview.length === 0 && assuranceReportPreview.length === 0) || isRepportLoading} variant='contained'>
                    {
                        isRepportLoading ?
                            <CircularProgress size={26} sx={{ color: 'white' }} /> : <strong>Envoyer le(s) rapport(s)</strong>
                    }
                </Button>

            </Grid>
            <Grid xl={6} lg={5} item>

                <Typography typography={'h3'} className='text-center' textAlign={'center'}>Devis</Typography><br /><br />

                {
                    isSent && <Typography bgcolor={'green'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Devis envoyé avec succès !</Typography>
                }

                <TextField id="outlined-basic" label="Saisir un objet" variant="outlined" fullWidth value={object} onChange={(e) => {
                    setObject(e.target.value)
                }} /><br /><br />

                {
                    invoicePreview.length !== 0 && <Typography color={'green'} mb={1} textAlign={'center'}><PictureAsPdfTwoTone color='error' sx={{ fontSize: 50 }} /><br /> <b>Fichier joint</b></Typography>
                }

                <div className="parent">
                    <div className="file-upload">
                        <h3>Devis des rérapations</h3>
                        <p>Maximun file size 10mb</p>
                        <input type="file" accept='application/pdf' onInput={(e) => { handleSelectInvoice(e) }} />
                    </div>
                </div><br />

                <Button fullWidth disableElevation size='large' disabled={invoicePreview.length === 0 || object.length === 0 || isloading} variant='contained' onClick={handleCreateInvoice}>
                    {
                        isloading ?
                            <CircularProgress size={26} sx={{ color: 'white' }} /> : <strong>Envoyer le devis</strong>
                    }
                </Button>

            </Grid>
            <Grid xl={1} lg={1} item></Grid>
        </Grid>
    )
}
