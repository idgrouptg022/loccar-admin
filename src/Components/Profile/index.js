import { Edit, LockOutlined } from '@mui/icons-material'
import { Button, Card, Grid, Typography } from '@mui/material'
import React from 'react'

export default function Profile(props) {
    return (
        <Grid container>
            <Grid xs item>

            </Grid>
            <Grid xl={4} lg={6} md={10} sm={12} item textAlign={"center"} mt={14}>

                <Card variant="outlined" sx={{ borderRadius: 5, p: 4 }}>
                    <Typography fontSize={32} mb={1}>{props.admin.fullName}</Typography>
                    <strong><a href={`mailto:${props.admin.email}`}>{props.admin.email}</a></strong><br /><br /><br />

                    <strong>Description</strong>

                    <p>
                        {
                            props.admin.description === null ? "Aucune description n'a été ajoutée à votre profil" :
                            props.admin.description
                        }
                    </p><br />

                    <Button variant="outlined" startIcon={<Edit />} size='small'><b>Modifier le profil</b></Button><br /><br />

                    <Button variant="text" color='error' startIcon={<LockOutlined />} size='small'><b>Changer mon mot de passe</b></Button>

                </Card>

            </Grid>
            <Grid xs item>

            </Grid>
        </Grid>
    )
}
