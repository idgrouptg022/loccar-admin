import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Autocomplete, CircularProgress, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Snackbar, Switch, TextField } from '@mui/material'
import axios from 'axios'
import { Check, Close, Delete, Lock } from '@mui/icons-material'

const steps = [
    {
        label: 'Documents d\'identité',
        description: <React.Fragment></React.Fragment>,
    },
    {
        label: 'Informations pripriétaire',
        description: <React.Fragment></React.Fragment>,
    },
    {
        label: 'Paramètres de connexion',
        description: <React.Fragment></React.Fragment>,
    }
]

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

function isNumeric(value) {
    return /^\d+$/.test(value)
}

let bodyFormData = null

export default function CreateOwner(props) {
    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const [activeStep, setActiveStep] = React.useState(0)
    const [cardTypes, setCardTypes] = React.useState([])

    const [isDocumentsProvided, setIsDocumentsProvided] = React.useState(false)
    const [isIdentityProvided, setIsIdentityProvided] = React.useState(false)
    const [isCredentialsProvided, setIsCredentialsProvided] = React.useState(false)

    const [isLoading, setIsLoading] = React.useState(false)
    const [isSuccessed, setIsSuccessed] = React.useState(false)
    const [isSuccessedMessage, setIsSuccessedMessage] = React.useState('')

    const [cardType, setCardType] = React.useState(0)
    const [previewCardId, setPreviewCardId] = React.useState([])
    const [previewCfe, setPreviewCfe] = React.useState([])
    const [cardNumber, setCardNumber] = React.useState("")
    const [accountType, setAccountType] = React.useState('personnal')
    const [fullName, setFullName] = React.useState("")
    const [responsibleFullName, setResponsibleFullName] = React.useState("")
    const [nif, setNif] = React.useState("")
    const [rccm, setRccm] = React.useState("")
    const [socialReason, setSocialReason] = React.useState("")

    const [additionnalEmails, setAdditionnalEmails] = React.useState([])

    const [email, setEmail] = React.useState('')
    const [emailError, setEmailError] = React.useState(false)
    const [emailErrorText, setEmailErrorText] = React.useState('')

    const [phoneNumber, setPhoneNumber] = React.useState('228')
    const [phoneNumberError, setPhoneNumberError] = React.useState(false)
    const [phoneNumberErrorText, setPhoneNumberErrorText] = React.useState('')

    const [phoneNumberBis, setPhoneNumberBis] = React.useState('228')

    const [additionnalEmail, setAdditionnalEmail] = React.useState('')
    const [additionnalEmailError, setAdditionnalEmailError] = React.useState(false)
    const [additionnalEmailErrorText, setAdditionnalEmailErrorText] = React.useState('')

    const [password, setPassword] = React.useState("")
    const [passwordError, setPasswordError] = React.useState(false)
    const [passwordErrorText, setPasswordErrorText] = React.useState('')

    React.useEffect(() => {

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
                            setCardTypes(response.data.data)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
        }

        fetchData()

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const passwordLength = 8;

        let newPassword = ''
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            newPassword += characters.charAt(randomIndex);
        }

        setPassword(newPassword)
    }, [])

    const handleAddEmail = (email) => {
        setAdditionnalEmailError(false)
        setAdditionnalEmailErrorText('')
        if (!emailRegex.test(email)) {
            setAdditionnalEmailError(true)
            setAdditionnalEmailErrorText('E-mail invalide')
        } else {
            setAdditionnalEmails(data => [...data, email])
            setAdditionnalEmail("")
        }
    }

    const handleRemoveEmail = (email) => {
        setAdditionnalEmails(additionnalEmails.filter(item => item !== email));
    }


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleSelectCardId = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('idCard', e.target.files[i])
                setPreviewCardId([previewFile])
            }
        }
    }

    const handleSelectCfe = (e) => {
        if (bodyFormData === null) {
            bodyFormData = new FormData()
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type
                }
                bodyFormData.set('cfeCard', e.target.files[i])
                setPreviewCfe([previewFile])
            }
        }
    }

    const handleCreateOwner = async () => {
        if (props.userRights?.split(',').includes('1') || JSON.parse(localStorage.getItem('data')).id == 1) {
            setIsLoading(true)

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            bodyFormData.set('accountType', accountType)
            bodyFormData.set('cardTypeId', cardType)
            bodyFormData.set('email', email)
            bodyFormData.set('phoneNumber', phoneNumber)
            bodyFormData.set('phoneNumberBis', phoneNumberBis)
            bodyFormData.set('idCardNumber', cardNumber)
            bodyFormData.set('password', password)
            bodyFormData.set('fullName', fullName)
            bodyFormData.set('responsibleFullName', responsibleFullName)
            bodyFormData.set('socialReason', socialReason)
            bodyFormData.set('additionnalEmails', additionnalEmails)
            bodyFormData.set('nif', nif)
            bodyFormData.set('rccm', rccm)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/owners`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(async function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setCardType(0)
                            setPreviewCardId([])
                            setPreviewCfe([])
                            setCardNumber("")
                            setAccountType("personnal")
                            setFullName("")
                            setResponsibleFullName("")
                            setNif("")
                            setRccm("")
                            setSocialReason("")
                            setAdditionnalEmails([])
                            setAdditionnalEmail("")
                            setEmail("")
                            setPhoneNumber("")
                            setIsLoading(false)
                            setIsDocumentsProvided(false)
                            setIsIdentityProvided(false)
                            setIsCredentialsProvided(false)
                            setActiveStep(0)
                            setIsSuccessed(true)
                            setIsSuccessedMessage('Le propriétaire a été ajouté avec succé !')
                            bodyFormData.delete("cfeCard")
                            bodyFormData.delete("idCard")
                        }
                    } catch {
                        setIsLoading(false)
                        setIsSuccessed(true)
                        setIsSuccessedMessage('Un problème de source inconnue est survenur. Réessayez !')
                    }
                })
                .catch(function (error) {
                    if (error.response.data?.responseCode === 'E-R-00002-23') {
                        setActiveStep(2)
                        setEmailError(true)
                        setEmailErrorText('Email invalide.')
                    } else if (error.response.data?.responseCode === 'E-R-00020-23') {
                        setActiveStep(2)
                        setEmailError(true)
                        setEmailErrorText('Email ou télé phone invalide ou déjà utilisés.')
                        setPhoneNumberError(true)
                        setPhoneNumberErrorText('Email ou télé phone invalide ou déjà utilisés.')
                    } else if (error.response.data?.responseCode === "E-R-00012-23") {
                        setActiveStep(0)
                        setIsSuccessed(true)
                        setIsSuccessedMessage('Le numéro de carte est invalide ou soit a déjà été utilisé pour un compte !')
                    }
                    setIsLoading(false)
                })
        }
    }

    return (
        <Grid container>
            <Grid xs={2} item>
            </Grid>
            <Grid xs={6} item>
                {
                    (!props.userRights?.split(',').includes('1') && JSON.parse(localStorage.getItem('data')).id != 1) ?
                        <Typography typography={`h5`}>
                            <br /><br /><br />
                            Non autorisé !
                        </Typography> :
                        <form>
                            <Box mt={5} maxWidth={400}>
                                <Typography typography={'h5'}>
                                    <strong>Créer un propriétaire</strong>
                                </Typography><br /><br />
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel
                                                optional={
                                                    index === 2 ? (
                                                        <Typography variant="caption">Dernière étape</Typography>
                                                    ) : null
                                                }
                                            >
                                                {step.label}
                                            </StepLabel>
                                            <StepContent>
                                                {step.description}
                                                {
                                                    index === 0 ?
                                                        <React.Fragment>
                                                            <Autocomplete
                                                                onChange={(event, newValue) => {
                                                                    const newCardTypeId = newValue ? newValue.id : 0

                                                                    setCardType(newCardTypeId)
                                                                    setIsDocumentsProvided(newCardTypeId !== 0 && cardNumber.length !== 0)
                                                                }}
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={cardTypes}
                                                                getOptionLabel={(option) => option.name}
                                                                sx={{ mb: 2 }}
                                                                renderInput={(params) => <TextField {...params} label="Type de carte" />}
                                                            />

                                                            <TextField label="Numéro de carte" variant="outlined" sx={{ mb: 2 }} fullWidth value={cardNumber} onChange={(e) => {
                                                                setCardNumber(e.target.value)
                                                                setIsDocumentsProvided(cardType !== 0 && e.target.value.length !== 0)
                                                            }} />

                                                            {
                                                                previewCardId.length > 0 &&
                                                                <React.Fragment>
                                                                    {
                                                                        previewCardId.map((data, key) => {
                                                                            return (
                                                                                <img src={data.path} key={key} alt="upload" width={'100%'} style={{ borderRadius: 15 }} />
                                                                            )
                                                                        })
                                                                    }<br /><br />
                                                                </React.Fragment>
                                                            }

                                                            <div className="parent">
                                                                <div className="file-upload">
                                                                    <h3>Photo de carte</h3>
                                                                    <p>Taille maximale 10mb</p>
                                                                    <input type="file" onInput={(e) => { handleSelectCardId(e) }} accept='image/*' />
                                                                </div>
                                                            </div><br />

                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                            {
                                                                index === 1 ?
                                                                    <React.Fragment>

                                                                        <FormControlLabel control={<Switch checked={accountType === 'enterprise'} onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setAccountType('enterprise')
                                                                                setIsIdentityProvided(responsibleFullName.length !== 0 && socialReason.length !== 0)
                                                                            } else {
                                                                                setAccountType('personnal')
                                                                                setIsIdentityProvided(fullName.length !== 0)
                                                                            }
                                                                        }} />} label="Compte entreprise" /><br /><br />

                                                                        {
                                                                            accountType === 'enterprise' ?
                                                                                <React.Fragment>

                                                                                    <TextField label="Nom complet du responsable" variant="outlined" sx={{ mb: 2 }} fullWidth value={responsibleFullName} onChange={(e) => {
                                                                                        setResponsibleFullName(e.target.value)
                                                                                        setIsIdentityProvided(e.target.value.length !== 0 && socialReason.length !== 0)
                                                                                    }} />

                                                                                    <Grid container spacing={2}>
                                                                                        <Grid xs={6} item>
                                                                                            <TextField label="NIF" variant="outlined" sx={{ mb: 2 }} fullWidth value={nif} onChange={(e) => {
                                                                                                setNif(e.target.value)
                                                                                            }} />
                                                                                        </Grid>
                                                                                        <Grid xs={6} item>
                                                                                            <TextField label="RCCM" variant="outlined" sx={{ mb: 2 }} fullWidth value={rccm} onChange={(e) => {
                                                                                                setRccm(e.target.value)
                                                                                            }} />
                                                                                        </Grid>
                                                                                    </Grid>

                                                                                    <TextField label="Raison sociale (Nom de l'entreprise)" variant="outlined" sx={{ mb: 2 }} fullWidth value={socialReason} onChange={(e) => {
                                                                                        setSocialReason(e.target.value)
                                                                                        setIsIdentityProvided(e.target.value.length !== 0 && responsibleFullName.length !== 0)
                                                                                    }} />

                                                                                    {
                                                                                        previewCfe.length > 0 &&
                                                                                        <React.Fragment>
                                                                                            {
                                                                                                previewCfe.map((data, key) => {
                                                                                                    return (
                                                                                                        <img src={data.path} key={key} alt="upload" width={'100%'} style={{ borderRadius: 15 }} />
                                                                                                    )
                                                                                                })
                                                                                            }<br /><br />
                                                                                        </React.Fragment>
                                                                                    }

                                                                                    <div className="parent">
                                                                                        <div className="file-upload">
                                                                                            <h3>Photo CFE</h3>
                                                                                            <p>Maximun file size 10mb</p>
                                                                                            <input type="file" onInput={(e) => { handleSelectCfe(e) }} accept='image/*' />
                                                                                        </div>
                                                                                    </div><br />

                                                                                    <Grid container spacing={2}>
                                                                                        <Grid xl={10} lg={9} item>
                                                                                            <TextField label="Emails additionnels" variant="outlined" sx={{ mb: 2 }} value={additionnalEmail} fullWidth onChange={(e) => {
                                                                                                setAdditionnalEmail(e.target.value)
                                                                                            }} error={additionnalEmailError} helperText={additionnalEmailErrorText} />
                                                                                        </Grid>
                                                                                        <Grid xl={2} lg={3} item alignContent={'right'}>
                                                                                            <IconButton size='large' color='success' sx={{ mt: 1 }} onClick={() => {
                                                                                                handleAddEmail(additionnalEmail)
                                                                                            }}><Check /></IconButton>
                                                                                        </Grid>
                                                                                    </Grid>

                                                                                    {
                                                                                        additionnalEmails.length > 0 &&
                                                                                        <List dense>
                                                                                            {
                                                                                                additionnalEmails.map((data, key) => {
                                                                                                    return (
                                                                                                        <ListItem key={key}
                                                                                                            secondaryAction={
                                                                                                                <IconButton edge="end" color='error' aria-label="delete" onClick={() => {
                                                                                                                    handleRemoveEmail(data)
                                                                                                                }}>
                                                                                                                    <Delete />
                                                                                                                </IconButton>
                                                                                                            }>
                                                                                                            <ListItemText primary={data} />
                                                                                                        </ListItem>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </List>
                                                                                    }

                                                                                </React.Fragment> :
                                                                                <TextField label="Nom complet" variant="outlined" sx={{ mb: 2 }} fullWidth value={fullName} onChange={(e) => {
                                                                                    setFullName(e.target.value)
                                                                                    setIsIdentityProvided(accountType === 'personnal' ? (e.target.value.length !== 0) : false)

                                                                                }} />
                                                                        }

                                                                    </React.Fragment> :
                                                                    <React.Fragment>
                                                                        <TextField label="Email" variant="outlined" sx={{ mb: 2 }} fullWidth value={email} onChange={(e) => {
                                                                            setEmail(e.target.value)
                                                                            if (accountType === 'enterprise') {
                                                                                setIsCredentialsProvided(e.target.value.length !== 0 && phoneNumber.length !== 0 && password.length !== 0)
                                                                            } else {
                                                                                setIsCredentialsProvided(phoneNumber.length !== 0 && password.length !== 0)
                                                                            }

                                                                        }} error={emailError} helperText={emailErrorText} />

                                                                        <TextField label="Téléphone 1" variant="outlined" sx={{ mb: 2 }} fullWidth value={phoneNumber} onChange={(e) => {
                                                                            setPhoneNumber(e.target.value)
                                                                            if (accountType === 'enterprise') {
                                                                                setIsCredentialsProvided(e.target.value.length !== 0 && email.length !== 0 && password.length !== 0)
                                                                            } else {
                                                                                setIsCredentialsProvided(e.target.value.length !== 0 && password.length !== 0)
                                                                            }
                                                                        }} error={phoneNumberError} helperText={phoneNumberErrorText} />

                                                                        <TextField label="Téléphone 2 (facultatif)" variant="outlined" sx={{ mb: 2 }} fullWidth value={phoneNumberBis} onChange={(e) => {
                                                                            setPhoneNumberBis(e.target.value)
                                                                        }} />

                                                                        <TextField
                                                                            fullWidth
                                                                            error={passwordError}
                                                                            value={password}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.length <= 32) {
                                                                                    setPassword(e.target.value)
                                                                                    if (accountType === 'enterprise') {
                                                                                        setIsCredentialsProvided(e.target.value.length !== 0 && email.length !== 0 && phoneNumber.length !== 0)
                                                                                    } else {
                                                                                        setIsCredentialsProvided(e.target.value.length !== 0 && phoneNumber.length !== 0)
                                                                                    }
                                                                                }
                                                                            }}
                                                                            type={showPassword ? 'text' : 'password'}
                                                                            label="Mot de passe"
                                                                            placeholder='Saisir le mot de ...'
                                                                            helperText={passwordErrorText}
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        aria-label="toggle password visibility"
                                                                                        // onClick={handleClickShowPassword}
                                                                                        edge="end"
                                                                                    >
                                                                                        {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                                                                                        <Lock />
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            }}
                                                                        />
                                                                    </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                }
                                                <Box sx={{ mb: 2 }}>
                                                    {
                                                        index === 0 ?
                                                            <React.Fragment>
                                                                <Button
                                                                    disabled={!isDocumentsProvided}
                                                                    variant="contained"
                                                                    disableElevation
                                                                    onClick={handleNext}
                                                                    sx={{ mt: 1, mr: 1 }}
                                                                >
                                                                    {index === steps.length - 1 ? 'Continuer' : 'Continuer'}
                                                                </Button>
                                                                <Button
                                                                    disabled={index === 0}
                                                                    onClick={handleBack}
                                                                    sx={{ mt: 1, mr: 1 }}
                                                                >
                                                                    Retour
                                                                </Button>
                                                            </React.Fragment> :
                                                            <React.Fragment>
                                                                {
                                                                    index === 1 ?
                                                                        <React.Fragment>
                                                                            <Button
                                                                                disabled={!isIdentityProvided}
                                                                                variant="contained"
                                                                                disableElevation
                                                                                onClick={() => {
                                                                                    if (accountType === 'enterprise') {
                                                                                        setIsCredentialsProvided(password.length !== 0 && email.length !== 0 && phoneNumber.length !== 0)
                                                                                    } else {
                                                                                        setIsCredentialsProvided(password.length !== 0 && phoneNumber.length !== 0)
                                                                                    }
                                                                                    handleNext()
                                                                                }}
                                                                                sx={{ mt: 1, mr: 1 }}
                                                                            >
                                                                                {index === steps.length - 1 ? 'Continuer' : 'Continuer'}
                                                                            </Button>
                                                                            <Button
                                                                                disabled={index === 0}
                                                                                onClick={handleBack}
                                                                                sx={{ mt: 1, mr: 1 }}
                                                                            >
                                                                                Retour
                                                                            </Button>
                                                                        </React.Fragment> :
                                                                        <React.Fragment>
                                                                            <Button
                                                                                disabled={!isCredentialsProvided}
                                                                                variant="contained"
                                                                                disableElevation
                                                                                onClick={() => {
                                                                                    setEmailError(false)
                                                                                    setEmailErrorText('')
                                                                                    setPhoneNumberError(false)
                                                                                    setPhoneNumberErrorText('')
                                                                                    setPasswordError(false)
                                                                                    setPasswordErrorText('')

                                                                                    let canSubmit = true
                                                                                    if (accountType === 'enterprise') {
                                                                                        if (!emailRegex.test(email)) {
                                                                                            setEmailError(true)
                                                                                            setEmailErrorText('Email invalide.')
                                                                                            canSubmit = false
                                                                                        }
                                                                                    }
                                                                                    if (!isNumeric(phoneNumber)) {
                                                                                        setPhoneNumberError(true)
                                                                                        setPhoneNumberErrorText('Téléphone invalide.')
                                                                                        canSubmit = false
                                                                                    }

                                                                                    if (password.length < 6) {
                                                                                        setPasswordError(true)
                                                                                        setPasswordErrorText('Le mot de passe doit contenir au moins 6 caractères.')
                                                                                        canSubmit = false
                                                                                    }

                                                                                    if (canSubmit) {
                                                                                        handleNext()
                                                                                    }
                                                                                }}
                                                                                sx={{ mt: 1, mr: 1 }}
                                                                            >
                                                                                {index === steps.length - 1 ? 'Continuer' : 'Continuer'}
                                                                            </Button>
                                                                            <Button
                                                                                disabled={index === 0}
                                                                                onClick={handleBack}
                                                                                sx={{ mt: 1, mr: 1 }}
                                                                            >
                                                                                Retour
                                                                            </Button>
                                                                        </React.Fragment>
                                                                }
                                                            </React.Fragment>
                                                    }
                                                </Box>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                                {activeStep === steps.length && (
                                    <Paper square elevation={0} sx={{ p: 3 }}>
                                        <Typography mb={2}>Le propriétaire est prêt à être ajouté. Pour finir le processus, cliquez sur "<strong>Terminer</strong>".</Typography>
                                        <Button sx={{ mt: 1, mr: 1 }} size='large' disabled={isLoading || (!props.userRights?.split(',').includes('1') && JSON.parse(localStorage.getItem('data')).id != 1)} variant='contained' disableElevation onClick={() => {
                                            handleCreateOwner()
                                        }}>
                                            {
                                                isLoading ? <CircularProgress size={26} /> :
                                                    <strong>Terminer</strong>
                                            }
                                        </Button>


                                    </Paper>
                                )}
                            </Box>
                        </form>
                }
            </Grid>

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

    )
}