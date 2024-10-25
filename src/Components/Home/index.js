import { Avatar, IconButton } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import SidebBar from '../SideBar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { io } from "socket.io-client"
import Profile from '../../Components/Profile'
import Cars from '../Cars/'
import Car from '../Cars/Car'
import CreateCar from '../Cars/Create'
import Accidents from '../Accidents'
import Accident from '../Accidents/Accident'
import Owners from '../Owners'
import CreateOwner from '../Owners/Create'
import Owner from '../Owners/Owner'
import AcceptedInvoice from '../Invoices/Accepted'
import ClassifiedInvoice from '../Invoices/Classified'
import RejectedInvoice from '../Invoices/Rejected'
import CommentedInvoice from '../Invoices/Commented'
import BreakDowns from '../BreakDowns'
import BreakDown from '../BreakDowns/BreakDown'
import Settings from '../Settings'
import Funds from '../Funds'
import Maintenances from '../Maintenances'
import Maintenance from '../Maintenances/Maintenance'
import GeolocationNotifications from '../GeolocationNotifications'
import Assurances from '../Assurances'
import TechnicalVisits from '../TechnicalVisits'
import Tvms from '../Tvms'
import OutdateDriverLicence from '../Outdates/DriverLicence'
import OutdateAssurance from '../Outdates/Assurance'
import OutdateTechnicalVisit from '../Outdates/TechnicalVisit'
import OutdateTvm from '../Outdates/Tvm'
import EditOwner from '../Owners/Edit'
import EditCar from '../Cars/Edit'
import PayedInvoice from '../Invoices/Payed'
import EditDriver from '../Driver/Edit'
import Users from '../Users'
import CreateUser from '../Users/Create'
import EditUser from '../Users/Edit'
import User from '../Users/User'
import Renewals from '../Renewals'
import Tenants from '../Tenants'
import Tenant from '../Tenants/Tenant'
import Rentals from '../Rentals'
import Rental from '../Rentals/Rental'
import CreateTenant from '../Tenants/CreateTenant'
import Advertising from '../Advertising'

const socket = io.connect(process.env.REACT_APP_API_BASE_URL, {
    query: {
        id: JSON.parse(localStorage.getItem("data"))?.id
    }
})

function stringToColor(string) {
    let hash = 0
    let i

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    }
}

export default function Home() {
    const [administrators, setAdministrators] = useState([])
    

    const params = useParams()
    const navigate = useNavigate()

    const Component = () => {
        if (params.page === undefined) {
            return (
                <Owners userRights={administrators[0].rightsId} />
            )
        } else if (params.page === ("cars")) {
            return (
                <Cars userRights={administrators[0].rightsId} />
            )
        } else if (params.page.startsWith("drivers-")) {
            return (
                <EditDriver userRights={administrators[0].rightsId} driver={params.page.substring(8)} />
            )
        } else if (params.page === ("profile")) {
            return (
                <Profile userRights={administrators[0].rightsId} admin={administrators[0]} />
            )
        } else if (params.page === ("create-car")) {
            return (
                <CreateCar userRights={administrators[0].rightsId} />
            )
        } else if(params.page === 'accidents') {
            return (
                <Accidents userRights={administrators[0].rightsId} socket={socket} />
            )
        } else if(params.page.startsWith('accidents')) {
            return (
                <Accident userRights={administrators[0].rightsId} socket={socket} accident={params.page.substring(10)} />
            )
        } else if(params.page === ('owners')) {
            return (
                <Owners userRights={administrators[0].rightsId} />
            )
        } else if(params.page === ('create-owner')) {
            return (
                <CreateOwner userRights={administrators[0].rightsId} />
            )
        } else if(params.page.startsWith('owners-')) {
            return (
                <Owner userRights={administrators[0].rightsId} owner={params.page.substring(7)} />
            )
        } else if(params.page.startsWith('owner-')) {
            return (
                <EditOwner userRights={administrators[0].rightsId} owner={params.page.substring(6)} />
            )
        } else if(params.page === ('payed-invoices')) {
            return (
                <PayedInvoice userRights={administrators[0].rightsId} />
            )
        } else if(params.page === ('accepted-invoices')) {
            return (
                <AcceptedInvoice userRights={administrators[0].rightsId} socket={socket} />
            )
        } else if(params.page === ('classified-invoices')) {
            return (
                <ClassifiedInvoice userRights={administrators[0].rightsId} socket={socket} />
            )
        } else if(params.page === ('rejected-invoices')) {
            return (
                <RejectedInvoice userRights={administrators[0].rightsId} socket={socket} />
            )
        } else if(params.page === ('commented-invoices')) {
            return (
                <CommentedInvoice userRights={administrators[0].rightsId} socket={socket} />
            )
        } else if(params.page === ('breakdowns')) {
            return (
                <BreakDowns userRights={administrators[0].rightsId} socket={socket} />
            )
        } else if(params.page.startsWith('breakdowns-')) {
            return (
                <BreakDown userRights={administrators[0].rightsId} breakDown={params.page.substring(11)} />
            )
        } else if (params.page.startsWith('cars-')) {
            return (
                <Car userRights={administrators[0].rightsId} car={params.page.substring(5)} />
            )
        } else if (params.page.startsWith('car-')) {
            return (
                <EditCar userRights={administrators[0].rightsId} car={params.page.substring(4)} />
            )
        } else if (params.page === 'settings') {
            return (
                <Settings userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'funds') {
            return (
                <Funds userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'maintenances') {
            return (
                <Maintenances userRights={administrators[0].rightsId} />
            )
        } else if (params.page.startsWith('maintenances-')) {
            return (
                <Maintenance userRights={administrators[0].rightsId} maintenance={params.page.substring(13)} />
            )
        } else if (params.page === 'geolocation-notifications') {
            return (
                <GeolocationNotifications userRights={administrators[0].rightsId} socket={socket} />
            )
        } else if (params.page.startsWith('assurances-')) {
            return (
                <Assurances userRights={administrators[0].rightsId} car={params.page.substring(11)} />
            )
        } else if (params.page.startsWith('technical-visits-')) {
            return (
                <TechnicalVisits userRights={administrators[0].rightsId} car={params.page.substring(17)} />
            )
        } else if (params.page.startsWith('tvms-')) {
            return (
                <Tvms car={params.page.substring(5)} userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'outdates-driver-licenses') {
            return (
                <OutdateDriverLicence userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'outdates-assurances') {
            return (
                <OutdateAssurance userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'outdates-technical-visits') {
            return (
                <OutdateTechnicalVisit userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'outdates-tvms') {
            return (
                <OutdateTvm userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'users') {
            return (
                <Users userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'create-user') {
            return (
                <CreateUser userRights={administrators[0].rightsId} />
            )
        } else if (params.page.startsWith('user-')) {
            return (
                <EditUser userRights={administrators[0].rightsId} user={params.page.substring(5)} />
            )
        } else if (params.page.startsWith('users-')) {
            return (
                <User user={params.page.substring(6)} userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'renewals') {
            return (
                <Renewals socket={socket} userRights={administrators[0].rightsId} />
            )
        } else if (params.page === 'tenants') {
            return (
                <Tenants socket={socket} />
            )
        } else if (params.page.startsWith('tenants-')) {
            return (
                <Tenant tenant={params.page.substring(8)} />
            )
        } else if (params.page === 'create-tenant') {
            return (
                <CreateTenant />
            )
        } else if (params.page === 'rentals') {
            return (
                <Rentals socket={socket} />
            )
        } else if (params.page.startsWith('rentals-')) {
            return (
                <Rental rental={params.page.substring(8)} />
            )
        } else if (params.page === 'advertising') {
            return (
                <Advertising socket={socket} />
            )
        }
    }

    useEffect(() => {
        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/admnistrators/${JSON.parse(localStorage.getItem("data")).id}`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            if (response.data.data[0].admin.lastLogin.substring(0, response.data.data[0].admin.lastLogin.length - 5) === JSON.parse(localStorage.getItem("data")).lastLogin.substring(0, JSON.parse(localStorage.getItem("data")).lastLogin.length - 5)) {
                                setAdministrators([response.data.data[0].admin])
                            } else {
                                console.log(response.data.data[0].admin);
                            }
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
        fetchData()

    }, [])

    if (!localStorage.getItem('isLogged')) {
        window.location = '/sign-in'
        return 'Redirection ...'
    }

    return (
        <Fragment>
            {
                administrators.length > 0 ?
                    <Fragment>
                        <SidebBar socket={socket} userRights={administrators[0].rightsId} />
                        <div className='wrap-content'>
                            <div className='wrap-content-body'>
                                <div className='wrap-content-header'>
                                    <table width='100%'>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Link to='/admins'><strong>Home</strong></Link>
                                                </td>
                                                <td>
                                                    <div align='right'>
                                                        {
                                                            administrators.map((data) => {
                                                                return (
                                                                    <div key={data.id}>
                                                                        <IconButton size="small" onClick={() => {
                                                                            navigate('/sign-out')
                                                                        }}>
                                                                            <Avatar sx={{ width: 32, height: 32 }} {...stringAvatar(data.fullName)} />
                                                                        </IconButton>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <Component />
                            </div>
                        </div>
                    </Fragment> :
                    "Chargement ..."
            }
        </Fragment>
    )
}
