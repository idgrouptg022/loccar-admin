import { Check } from '@mui/icons-material'
import { CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'

export default function Settings(props) {
    const [settings, setSettings] = useState([])
    const [percentageValue, setPercentageValue] = useState('')
    const [phoneNumberValue, setPhoneNumberValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [geolocationValue, setGeolocationValue] = useState('')
    const [whatsappValue, setWhatsappValue] = useState('')

    const [isFetched, setIsFetched] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    async function fetchData() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/settings`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setSettings(response.data.data)
                        setIsFetched(true)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    const handleUpdateSetting = async (wording) => {

        if (props.userRights?.split(',').includes('26') || JSON.parse(localStorage.getItem('data')).id == 1) {
            const bodyFormData = new FormData()
            bodyFormData.append('wording', wording)
    
            switch (wording) {
                case 'sogenuvo-percentage':
                    bodyFormData.set('value', percentageValue)
                    break
    
                case 'phone-number':
                    bodyFormData.set('value', phoneNumberValue)
                    break
    
                case 'email':
                    bodyFormData.set('value', emailValue)
                    break
    
                case 'geolocation-link':
                    bodyFormData.set('value', geolocationValue)
                    break
    
                case 'whatsapp':
                    bodyFormData.set('value', whatsappValue)
                    break
    
                default:
                    break
            }
    
            if (bodyFormData.get('value') && bodyFormData.get('value').trim().length > 0) {
                setIsLoading(true)
                await axios({
                    method: "post",
                    url: `${process.env.REACT_APP_API_URL}/settings`,
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
                                setIsLoading(false)
                            }
                        } catch {
                            //
                        }
                    })
                    .catch(function (error) {
                        setIsLoading(false)
                        console.log(error.response)
                    })
            }
        }

    }

    useEffect(() => {

        fetchData()

    }, [])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>Paramètres</h2>
                </Grid>
            </Grid><br /><br />
            {
                !props.userRights?.split(',').includes('26') && JSON.parse(localStorage.getItem('data')).id != 1 ?
                    <Typography textAlign={`center`} typography={`h5`}>
                        <br /><br /><br />
                        Non autorisé !
                    </Typography> :
                    !isFetched ?
                        <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                            <CircularProgress />
                        </div> :
                        <table>
                            <thead>
                                <tr>
                                    <th width={300} style={{ textAlign: 'left', paddingBottom: 20 }}>
                                        Nom de l'information
                                    </th>
                                    <th style={{ textAlign: 'left' }}>Lien ou valeur</th>
                                    <th width={20}></th>
                                    <th style={{ textAlign: 'left' }}>Nouvelle valeur</th>
                                    <th width={100}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    settings.map((data, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>
                                                    {data.wording}
                                                </td>
                                                <td>
                                                    {data.value}
                                                </td>
                                                <td></td>
                                                <td>
                                                    <input type='text' style={{ border: '1px solid #CCC', padding: 6, borderRadius: 5, minWidth: 250 }} value={
                                                        data.wording === 'sogenuvo-percentage' ? percentageValue : data.wording === 'phone-number' ? phoneNumberValue :
                                                            data.wording === 'email' ? emailValue : data.wording === 'whatsapp' ? whatsappValue : geolocationValue
                                                    } onChange={(e) => {
                                                        switch (data.wording) {
                                                            case 'sogenuvo-percentage':
                                                                if ((e.target.value > 0 && e.target.value < 100) || e.target.value.trim().length === 0) {
                                                                    setPercentageValue(e.target.value)
                                                                }
                                                                break

                                                            case 'phone-number':
                                                                setPhoneNumberValue(e.target.value)
                                                                break

                                                            case 'email':
                                                                setEmailValue(e.target.value)
                                                                break

                                                            case 'geolocation-link':
                                                                setGeolocationValue(e.target.value)
                                                                break

                                                            case 'whatsapp':
                                                                setWhatsappValue(e.target.value)
                                                                break

                                                            default:
                                                                break
                                                        }
                                                    }} />
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <IconButton color='success' disabled={isLoading} onClick={() => {
                                                        handleUpdateSetting(data.wording)
                                                    }}><Check /></IconButton>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
            }
        </Fragment>
    )
}
