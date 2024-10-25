import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Badge, Fab, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { AccountBalance, AttachMoneyTwoTone, CarCrash, CardGiftcard, CarRepair, CheckBoxTwoTone, ChecklistRounded, Close, CommentBank, CreditCard, DocumentScanner, Error, Group, GroupSharp, History, Key, ListAlt, ListAltRounded, MapsUgcSharp, Menu, ReportProblem, Settings, SettingsBackupRestore, VerifiedUserTwoTone } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import accidentSong from '../../assets/notifications/01.wav'
import breakdownSong from '../../assets/notifications/04.wav'
import maintenanceSong from '../../assets/notifications/03.mp3'
import renewalSong from '../../assets/notifications/05.mp3'
import axios from 'axios'
import logoText from '../../assets/images/sogenuvologotext.png'

export default function SidebBar(props) {
    const navigate = useNavigate()

    const [accident] = useState(new Audio(accidentSong))

    const [maintenance] = useState(new Audio(maintenanceSong))
    const [breakdown] = useState(new Audio(breakdownSong))
    const [renewal] = useState(new Audio(renewalSong))

    const [accidents, setAccidents] = useState([])
    const [acceptedInvoices, setAcceptedInvoices] = useState([])
    const [rejectedInvoices, setRejectedInvoices] = useState([])
    const [commentedInvoices, setCommentedInvoices] = useState([])
    const [breakDowns, setBreakDowns] = useState([])
    const [geolocationNotifications, setGeolocationNotifications] = useState([])
    const [unreadMaintenances, setUnreadMaintenances] = useState([])
    const [unreadRenewals, setUnreadRenewals] = useState([])
    const [newRentals, setNewRentals] = useState([])

    async function fetchNewAccidents() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/accidents/list/unread`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setAccidents(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchAcceptedInvoices() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/invoices/list/accepted`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setAcceptedInvoices(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchRejectedInvoices() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/invoices/list/rejected`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setRejectedInvoices(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchCommentedInvoices() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/invoices/list/commented`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setCommentedInvoices(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchBreakDowns() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/breakdowns/list/unread`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setBreakDowns(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchGeolocationNotifications() {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/geolocation-notifications/list/unread`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setGeolocationNotifications(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchUnreadMaintenances() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/maintenances/list/unread`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setUnreadMaintenances(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchUnreadRenewals() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/renewals/list/unread`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setUnreadRenewals(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    async function fetchNewRentals() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/rental/list/new-list`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setNewRentals(response.data.data)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleReadAllAccidents = async () => {
        accident.pause()
        accident.loop = false
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/accidents/list/read-all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchNewAccidents()

                        navigate('/admins/accidents')
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleReadAllBreakdowns = async () => {
        breakdown.pause()
        breakdown.loop = false
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/breakdowns/list/read-all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchBreakDowns()

                        navigate('/admins/breakdowns')
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleReadAllMaintenances = async () => {
        maintenance.pause()
        maintenance.loop = false
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/maintenances/list/read-all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchUnreadMaintenances()

                        navigate('/admins/maintenances')
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleReadAllRenewals = async () => {
        renewal.pause()
        renewal.loop = false
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/renewals/list/read-all`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchUnreadRenewals()

                        navigate('/admins/renewals')
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    useEffect(() => {
        props.socket.on("handleCreateAccident", async (data) => {
            fetchNewAccidents()
            try {
                accident.loop = true
                accident.play()
            } catch (error) {
                console.log(error)
            }
        })
    }, [props.socket, accidents, accident])

    useEffect(() => {
        props.socket.on("handleAcceptInvoice", async (data) => {
            fetchAcceptedInvoices()
        })
    }, [props.socket])

    useEffect(() => {
        props.socket.on("handleRejectInvoice", async (data) => {
            fetchRejectedInvoices()
        })
    }, [props.socket])

    useEffect(() => {
        props.socket.on("handleCommentInvoice", async (data) => {
            fetchCommentedInvoices()
        })
    }, [props.socket])

    useEffect(() => {
        props.socket.on("handleCreateBreakDown", async (data) => {
            fetchBreakDowns()

            try {
                breakdown.loop = true
                breakdown.play()
            } catch (error) {
                console.log(error)
            }
        })
    }, [props.socket])

    useEffect(() => {
        props.socket.on("handleCreateMaintenance", async (data) => {
            fetchUnreadMaintenances()

            try {
                maintenance.loop = true
                maintenance.play()
            } catch (error) {
                console.log(error)
            }
        })
    }, [props.socket])

    useEffect(() => {
        props.socket.on("handleCreateRenewal", async (data) => {
            fetchUnreadRenewals()

            try {
                renewal.play()
                renewal.loop = false
            } catch (error) {
                console.log(error)
            }
        })
    }, [props.socket])

    useEffect(() => {
        props.socket.on("handleCreateGeolocation", async (data) => {
            fetchGeolocationNotifications()
        })
    }, [props.socket])

    useEffect(() => {
        fetchNewAccidents()
        fetchAcceptedInvoices()
        fetchRejectedInvoices()
        fetchCommentedInvoices()
        fetchBreakDowns()
        fetchGeolocationNotifications()
        fetchUnreadMaintenances()
        fetchUnreadRenewals()
        fetchNewRentals()
    }, [])

    const sideBarRef = useRef()
    const [hideButton, setHideButton] = useState(false)

    return (
        <div className='side-bar-cover'>

            {
                !hideButton &&
                <Fab color='primary' className='show-menu-bar-button' size='small'
                    sx={{ mt: 4, ml: 1 }} onClick={() => {
                        if (sideBarRef) {
                            sideBarRef.current.style.display = 'block'
                            setHideButton(true)
                        }
                    }}>
                    <Menu />
                </Fab>
            }


            <div className='side-bar' ref={sideBarRef}>

                <div className='side-bar-body'>
                    <table width={`100%`}>
                        <tbody>
                            <tr>
                                <td>
                                    <a href="/">
                                        <img src={logoText} alt="img-logo" width={'90%'} />
                                    </a>
                                </td>
                                <td width={50} className='close-menu-bar-button'>
                                    <Fab color='light' size='small' sx={{ mt: -1 }} onClick={() => {
                                        if (sideBarRef) {
                                            if (sideBarRef.current.style.display === 'none') {
                                                sideBarRef.current.style.display = 'block'
                                                setHideButton(true)
                                            } else {
                                                sideBarRef.current.style.display = 'none'
                                                setHideButton(false)
                                            }

                                        }
                                    }}>
                                        <Close />
                                    </Fab>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <List
                        sx={{ width: '100%', color: '#FFF' }}
                        component="nav">

                        <ListItemButton onClick={() => {
                            navigate('/admins/advertising')
                        }}>
                            <ListItemIcon>
                                <CardGiftcard style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de publicités</strong>} />
                        </ListItemButton>

                        <ListItemButton onClick={() => {
                            navigate('/admins/owners')
                        }}>
                            <ListItemIcon>
                                <Group style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de propriétaires</strong>} />
                        </ListItemButton>

                        <ListItemButton onClick={() => {
                            navigate('/admins/cars')
                        }}>
                            <ListItemIcon>
                                <CarRepair style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de voitures</strong>} />
                        </ListItemButton>

                        <ListItemButton onClick={() => {
                            navigate('/admins/categories')
                        }}>
                            <ListItemIcon>
                                <ListAltRounded style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de catégories</strong>} />
                        </ListItemButton>

                        <ListItemButton onClick={() => {
                            navigate('/admins/tenants')
                        }}>
                            <ListItemIcon>
                                <Group style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de locataires</strong>} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('14') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/rentals')
                        }}>
                            <ListItemIcon>
                                <AttachMoneyTwoTone style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Demande de location</strong>} />
                            <Badge badgeContent={newRentals.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('10') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            handleReadAllAccidents()
                        }}>
                            <ListItemIcon>
                                <CarCrash style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion d'accident</strong>} />
                            <Badge badgeContent={accidents.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('11') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            handleReadAllBreakdowns()
                        }}>
                            <ListItemIcon>
                                <ReportProblem style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de pannes</strong>} />
                            <Badge badgeContent={breakDowns.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('12') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            handleReadAllMaintenances()
                        }}>
                            <ListItemIcon>
                                <Key style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion d'entretiens</strong>} />
                            <Badge badgeContent={unreadMaintenances.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none', border: 'none' }}>
                            <AccordionSummary
                                disabled={!props.userRights?.split(',').includes('13') && JSON.parse(localStorage.getItem('data')).id != 1}
                                aria-controls="panel1a-content"
                                id="panel1a-header">
                                <DocumentScanner style={{ color: '#FFF', marginRight: 30 }} />
                                <strong style={{ color: 'white' }}>Gestion de documents</strong>
                            </AccordionSummary>
                            <AccordionDetails sx={{ lineHeight: 3 }}>
                                <Link to={'/admins/outdates-driver-licenses'} style={{ color: 'white' }}><strong>Permis de conduire</strong></Link><br />
                                <Link to={'/admins/outdates-assurances'} style={{ color: 'white' }}><strong>Assurances</strong></Link><br />
                                <Link to={'/admins/outdates-technical-visits'} style={{ color: 'white' }}><strong>Visites techniques</strong></Link><br />
                                <Link to={'/admins/outdates-tvms'} style={{ color: 'white' }}><strong>TVMs</strong></Link><br />
                            </AccordionDetails>
                        </Accordion>

                        <ListItemButton onClick={() => {
                            handleReadAllRenewals()
                        }}>
                            <ListItemIcon>
                                <History style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion de renouvellement</strong>} />
                            <Badge badgeContent={unreadRenewals.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('14') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/geolocation-notifications')
                        }}>
                            <ListItemIcon>
                                <MapsUgcSharp style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Demande de géolocalisation</strong>} />
                            <Badge badgeContent={geolocationNotifications.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>


                        <Typography px={'20px'} mt={2} mb={1} color={'lightblue'}>
                            <small>Gestion de devis</small>
                        </Typography>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('18') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/payed-invoices')
                        }}>
                            <ListItemIcon>
                                <ChecklistRounded style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Devis payés</strong>} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('15') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/accepted-invoices')
                        }}>
                            <ListItemIcon>
                                <CheckBoxTwoTone style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Devis acceptés</strong>} />
                            <Badge badgeContent={acceptedInvoices.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('15') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/rejected-invoices')
                        }}>
                            <ListItemIcon>
                                <Error style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Devis rejetés</strong>} />
                            <Badge badgeContent={rejectedInvoices.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('20') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/commented-invoices')
                        }}>
                            <ListItemIcon>
                                <CommentBank style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Devis commentés</strong>} />
                            <Badge badgeContent={commentedInvoices.length} color="error" sx={{ mr: 1 }} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('23') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/classified-invoices')
                        }}>
                            <ListItemIcon>
                                <ListAlt style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Devis classés</strong>} />
                        </ListItemButton>

                        <Typography px={'20px'} mt={2} mb={1} color={'lightblue'}>
                            <small>Gestion de caisse</small>
                        </Typography>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('24') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/funds')
                        }}>
                            <ListItemIcon>
                                <AccountBalance style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Etat de caisse</strong>} />
                        </ListItemButton>

                        <Typography px={'20px'} mt={2} mb={1} color={'lightblue'}>
                            <small>Gestion de types de cartes</small>
                        </Typography>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('25') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/card-types')
                        }}>
                            <ListItemIcon>
                                <CreditCard style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Types de cartes</strong>} />
                        </ListItemButton>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('26') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/settings')
                        }}>
                            <ListItemIcon>
                                <Settings style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Paramètres</strong>} />
                        </ListItemButton>
                        <Typography px={'20px'} mt={2} mb={1} color={'lightblue'}>
                            <small>Utilisateurs</small>
                        </Typography>

                        <ListItemButton disabled={!props.userRights?.split(',').includes('27') && JSON.parse(localStorage.getItem('data')).id != 1} onClick={() => {
                            navigate('/admins/users')
                        }}>
                            <ListItemIcon>
                                <GroupSharp style={{ color: '#FFF' }} />
                            </ListItemIcon>
                            <ListItemText primary={<strong>Gestion d'utilisateurs</strong>} />
                        </ListItemButton>
                    </List>


                    <div style={{ margin: 20, color: 'white' }}>
                        Copyright &copy; 2023 SOGEVO
                    </div>
                </div>
            </div>
        </div>
    )
}
