import { ArrowDownward, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Card, CircularProgress, Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Funds(props) {
    const [funds, setFunds] = useState([])
    const [balances, setbalances] = useState([])
    const [wallets, setWallets] = useState([])
    const [withdraws, setwithdraws] = useState([])
    const [withdrawsList, setwithdrawsList] = useState([])

    const [isFetched, setIsFetched] = useState(false)

    async function fetchFunds() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/funds`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setFunds(response.data.data)
                        setIsFetched(true)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }

    async function fetchBalances() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/funds/balance`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(async function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setbalances(response.data.data[0].balance)
                        setWallets(response.data.data[0].wallet)
                        setwithdraws(response.data.data[0].withdraw)
                        setwithdrawsList(response.data.data[0].withdraws)
                        setIsFetched(true)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {

            })
    }



    useEffect(() => {

        fetchFunds()
        fetchBalances()

    }, [])

    return (
        <Fragment>
            <br /><br />
            <Grid container>
                <Grid xs={6} item>
                    <h2>État de caisse</h2>
                </Grid>
            </Grid><br /><br />

            {
                !isFetched ?
                    <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                        <CircularProgress />
                    </div> :
                    !props.userRights?.split(',').includes('24') && JSON.parse(localStorage.getItem('data')).id != 1 ?
                        <Typography textAlign={`center`} typography={`h5`}>
                            <br /><br /><br />
                            Non autorisé !
                        </Typography> :
                        <Grid container spacing={2}>
                            <Grid item xs={5}>
                                <strong>SOLDE DU COMPTE</strong><br /><br />
                                {
                                    balances.map((data, key) => {
                                        return (
                                            <Typography typography={'h4'} key={key}><strong style={{ color: 'green' }}>{data.balance ? data.balance : 0} F CFA</strong></Typography>
                                        )
                                    })
                                }<br /><br /><br />

                                <strong>PORTE FEUILLE CLIENTS</strong><br /><br />
                                {
                                    wallets.map((data, key) => {
                                        return (
                                            <Typography typography={'h4'} key={key}><strong style={{ color: 'orange' }}>{data.wallet ? data.wallet : 0} F CFA</strong></Typography>
                                        )
                                    })
                                }<br /><br /><br />

                                <strong>MONTANT DES RETRAIS EFFECTUÉS</strong><br /><br />
                                {
                                    withdraws.map((data, key) => {
                                        return (
                                            <Typography typography={'h4'} key={key}><strong style={{ color: 'red' }}>{data.withdraw ? data.withdraw : 0} F CFA</strong></Typography>
                                        )
                                    })
                                }<br /><br /><br />

                                <Card variant="outlined" sx={{ p: 2, borderRadius: 5 }}>

                                    <Typography style={{ color: 'GrayText' }} typography={'h6'} mt={2}><strong>Historiques de retrais</strong></Typography>
                                    <br />
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header">
                                            <Typography>
                                                <strong>Cliquez pour ouvrir la liste des retraits</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <List>
                                                    {
                                                        withdrawsList.map((withdrawsL, key) => {
                                                            return (
                                                                <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} key={key}>
                                                                    <ListItemIcon>
                                                                        <ArrowDownward sx={{ color: 'green' }} />
                                                                    </ListItemIcon>
                                                                    <ListItemText>
                                                                        <div style={{ fontSize: 13 }}>
                                                                            <strong>Montant :</strong> <strong style={{ color: 'green' }}>{withdrawsL.amount} F CFA</strong><br />
                                                                            <strong>Date: </strong>{withdrawsL.createdAt.substring(0, 10)} {withdrawsL.createdAt.substring(11, 16)}<br />
                                                                            <strong>Propriéraire :</strong> <Link to={'/admins/owners-' + withdrawsL.owner.id}>{withdrawsL.owner.ref}</Link><br />
                                                                        </div>
                                                                    </ListItemText>
                                                                </ListItemButton>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>


                                </Card><br /><br /><br />
                            </Grid>
                            <Grid xs={5} item>
                                <Card variant="outlined" sx={{ p: 2, borderRadius: 5 }}>

                                    <Typography style={{ color: 'GrayText' }} typography={'h6'} mt={2}><strong>Historiques de versements</strong></Typography>
                                    <br />
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header">
                                            <Typography>
                                                <strong>Cliquez pour ouvrir la liste des versements</strong>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {
                                                    !isFetched ?
                                                        <div style={{ textAlign: 'center', height: '65vh', lineHeight: '65vh' }}>
                                                            <CircularProgress />
                                                        </div> :
                                                        <Fragment>
                                                            <List>
                                                                {
                                                                    funds.map((data, key) => {
                                                                        return (
                                                                            <ListItemButton sx={{ borderRadius: 5, overflow: 'hidden' }} key={key}>
                                                                                <ListItemIcon>
                                                                                    <ArrowDownward sx={{ color: 'green' }} />
                                                                                </ListItemIcon>
                                                                                <ListItemText>
                                                                                    <div style={{ fontSize: 13 }}>
                                                                                        <strong>Montant :</strong> <strong style={{ color: 'green' }}>{data.amount} F CFA</strong><br />
                                                                                        <strong>Date: </strong>{data.createdAt.substring(0, 10)} {data.createdAt.substring(11, 16)}<br />
                                                                                        <strong>Propriéraire :</strong> <Link to={'/admins/owners-' + data.owner.id}>{data.owner.ref}</Link><br />
                                                                                        <strong>Source: </strong>{data.source ? data.source : <i>Non définie.</i>}<br />
                                                                                    </div>
                                                                                </ListItemText>
                                                                            </ListItemButton>
                                                                        )
                                                                    })
                                                                }
                                                            </List>
                                                        </Fragment>
                                                }
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>


                                </Card>
                            </Grid>
                        </Grid>
            }
        </Fragment>
    )
}
