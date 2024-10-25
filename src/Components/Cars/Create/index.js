import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Autocomplete, Checkbox, FormControlLabel, Grid, IconButton, Switch, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Delete } from '@mui/icons-material'

const steps = [
    {
        label: 'Information de la voiture',
        description: <React.Fragment></React.Fragment>,
    },
    {
        label: 'Assurance',
        description: <React.Fragment></React.Fragment>,
    },
    {
        label: 'Visite technique',
        description: <React.Fragment></React.Fragment>,
    },
    {
        label: 'TVM',
        description: <React.Fragment></React.Fragment>,
    },
]

const transmissions = [
    {
        name: 'Automatique',
    },
    {
        name: 'Manuel',
    }
]

let bodyFormData = null

export default function CreateCar(props) {
    const [activeStep, setActiveStep] = React.useState(0)
    const [owners, setOwners] = React.useState([])

    const [ownerId, setOwnerId] = React.useState(0)
    const [plateNumber, setPlateNumber] = React.useState('')
    const [brand, setBrand] = React.useState('')
    const [color, setColor] = React.useState('')
    const [model, setModel] = React.useState('')
    const [year, setYear] = React.useState('')
    const [grayCardNumber, setGrayCardNumber] = React.useState('')
    const [chassisNumber, setChassisNumber] = React.useState('')
    const [geoLocation, setGeoLocation] = React.useState(false)
    const [isOnLocation, setIsOnLocation] = React.useState(false)
    const [isOnShop, setIsOnShop] = React.useState(false)
    const [isPopular, setIsPopular] = React.useState(false)

    const [locationFees, setLocationFees] = React.useState(0)
    const [shopFees, setShopFees] = React.useState(0)

    const [categories, setCategories] = React.useState([])
    const [categoryId, setCategoryId] = React.useState(0)

    const [assuranceNumber, setAssuranceNumber] = React.useState('')
    const [assuranceName, setAssuranceName] = React.useState('')
    const [assuranceType, setAssuranceType] = React.useState('')
    const [assuranceIssueDate, setAssuranceIssueDate] = React.useState('')
    const [assuranceExpiryDate, setAssuranceExpiryDate] = React.useState('')
    const [assurance, setAssurance] = React.useState([])

    const [technicalVisitNumber, setTechnicalVisitNumber] = React.useState('')
    const [technicalVisitIssueDate, setTechnicalVisitIssueDate] = React.useState('')
    const [technicialVisitExpiryDate, setTechnicalVisitExpiryDate] = React.useState('')
    const [technicalVisit, setTechnicalVisit] = React.useState([])

    const [tvmNumber, setTvmNumber] = React.useState('')
    const [tvmIssueDate, setTvmIssueDate] = React.useState('')
    const [tvmExpiryDate, setTvmExpiryDate] = React.useState('')
    const [tvm, setTvm] = React.useState([])

    const [comment, setComment] = React.useState('')

    const [carPhotos, setCarPhotos] = React.useState([])

    const [isLoading, setIsLoading] = React.useState(false)

    const [carId, setCarId] = React.useState(0)

    const [errorDriverLicenseDate, setErrorDriverLicenseDate] = React.useState(false)
    const [errorAssuranceDate, setErrorAssuranceDate] = React.useState(false)
    const [errorTechnicalVisitDate, setErrorTechnicalVisitDate] = React.useState(false)
    const [errorTvmDate, setErrorTvmDate] = React.useState(false)

    const [airConditioner, setAirConditioner] = React.useState(0)
    const [places, setPlaces] = React.useState(0)
    const [doors, setDoors] = React.useState(0)

    const [transmission, setTransmission] = React.useState(transmissions[1].name)

    const navigate = useNavigate()

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    React.useEffect(() => {
        async function fetchData() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/owners/`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setOwners(response.data.data)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    //
                })
        }

        async function fetchCategories() {

            await axios({
                method: "get",
                url: `${process.env.REACT_APP_API_URL}/cars/categories`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setCategories(response.data.data)
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
        fetchCategories()

    }, [])


    async function handleCreateAssurance() {
        if (props.userRights?.split(',').includes('2') || JSON.parse(localStorage.getItem('data')).id == 1) {
            if (bodyFormData === null) bodyFormData = new FormData()

            setIsLoading(true)
            setErrorAssuranceDate(false)

            bodyFormData.set('name', assuranceName)
            bodyFormData.set('type', assuranceType)
            bodyFormData.set('assuranceNumber', assuranceNumber)
            bodyFormData.set('carId', carId)
            bodyFormData.set('issueDate', assuranceIssueDate)
            bodyFormData.set('expiryDate', assuranceExpiryDate)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/assurances`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setIsLoading(false)
                            handleNext()
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    console.log(error.response)
                    setIsLoading(false)
                    if (error.response.data.responseCode === "E-R-00027-23") {
                        setErrorAssuranceDate(true)
                    }
                })
        }
    }

    async function handleCreateTechnicalVisit() {
        if (props.userRights?.split(',').includes('2') || JSON.parse(localStorage.getItem('data')).id == 1) {
            if (bodyFormData === null) bodyFormData = new FormData()

            setIsLoading(true)
            setErrorTechnicalVisitDate(false)

            bodyFormData.set('technicalVisitNumber', technicalVisitNumber)
            bodyFormData.set('carId', carId)
            bodyFormData.set('issueDate', technicalVisitIssueDate)
            bodyFormData.set('expiryDate', technicialVisitExpiryDate)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/technical-visits`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setIsLoading(false)
                            handleNext()
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
                    if (error.response.data.responseCode === "E-R-00027-23") {
                        setErrorTechnicalVisitDate(true)
                    }
                    setIsLoading(false)
                })
        }
    }

    async function handleCreateTvm() {
        if (props.userRights?.split(',').includes('2') || JSON.parse(localStorage.getItem('data')).id == 1) {
            if (bodyFormData === null) bodyFormData = new FormData()

            setIsLoading(true)
            setErrorTvmDate(false)

            bodyFormData.set('tvmNumber', tvmNumber)
            bodyFormData.set('carId', carId)
            bodyFormData.set('issueDate', tvmIssueDate)
            bodyFormData.set('expiryDate', tvmExpiryDate)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/tvms`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setIsLoading(false)
                            handleNext()
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    if (error.response.data.responseCode === "E-R-00027-23") {
                        setErrorTvmDate(true)
                    }
                    setIsLoading(false)
                })
        }
    }


    const handleCreateCar = async () => {

        if (props.userRights?.split(',').includes('2') || JSON.parse(localStorage.getItem('data')).id == 1) {
            if (bodyFormData === null) bodyFormData = new FormData()

            setIsLoading(true)
            setErrorDriverLicenseDate(false)

            bodyFormData.set('airConditioner', airConditioner)
            bodyFormData.set('places', places)
            bodyFormData.set('doors', doors)

            bodyFormData.set('transmission', transmission)

            bodyFormData.set('brand', brand)
            bodyFormData.set('grayCardNumber', grayCardNumber)
            bodyFormData.set('chassisNumber', chassisNumber)
            bodyFormData.set('carPlateNumber', plateNumber)
            bodyFormData.set('year', year)
            bodyFormData.set('model', model)
            bodyFormData.set('color', color)
            
            bodyFormData.set('geolocation', geoLocation)
            bodyFormData.set('isOnLocation', isOnLocation)
            bodyFormData.set('isOnShop', isOnShop)
            bodyFormData.set('isPopular', isPopular)
            bodyFormData.set('shopFees', shopFees)
            bodyFormData.set('locationFees', locationFees)
            bodyFormData.set('comment', comment)
            bodyFormData.set('ownerId', ownerId)
            bodyFormData.set('categoryId', categoryId)

            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}/owners/cars`,
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
                .then(function (response) {
                    try {
                        if (response.data?.responseCode === '0') {
                            setIsLoading(false)
                            handleNext()
                            setCarId(response.data.data[0].id)
                        }
                    } catch {
                        //
                    }
                })
                .catch(function (error) {
                    if (error.response.data.responseCode === "E-R-00027-23") {
                        setErrorDriverLicenseDate(true)
                    }
                    setIsLoading(false)
                })
        }

    }

    const handleSelectCarPhotos = (e) => {
        if (e.target.files.length > 0) {

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            for (let i = 0; i < e.target.files.length; i++) {
                bodyFormData.append('carPhoto', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setCarPhotos(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    const handleSelectAssurance = (e) => {
        if (e.target.files.length > 0) {

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            for (let i = 0; i < e.target.files.length; i++) {
                bodyFormData.set('file', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setAssurance([previewFile])
            }
        }
    }

    const handleSelectTechnicalVisit = (e) => {
        if (e.target.files.length > 0) {

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            for (let i = 0; i < e.target.files.length; i++) {
                bodyFormData.set('file', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setTechnicalVisit([previewFile])
            }
        }
    }

    const handleSelectTvm = (e) => {
        if (e.target.files.length > 0) {

            if (bodyFormData === null) {
                bodyFormData = new FormData()
            }

            for (let i = 0; i < e.target.files.length; i++) {
                bodyFormData.set('file', e.target.files[i])
                const previewFile = {
                    path: URL.createObjectURL(e.target.files[i]),
                    type: e.target.files[i].type,
                }
                setTvm(oldFiles => [...oldFiles, previewFile])
            }
        }
    }

    return (
        <Grid container>
            <Grid xs={2} item>

            </Grid>
            <Grid xs={6} item>

                {
                    (!props.userRights?.split(',').includes('2') && JSON.parse(localStorage.getItem('data')).id != 1) ?
                        <Typography typography={`h5`}>
                            <br /><br /><br />
                            Non autorisé !
                        </Typography> :
                        <form>
                            <Box mt={5} maxWidth={400}>
                                <Typography typography={'h5'}>
                                    <strong>Créer une voiture</strong>
                                </Typography><br /><br />
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel
                                                optional={
                                                    index === 4 ? (
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
                                                                    if (newValue) {
                                                                        setCategoryId(newValue.id)
                                                                    } else {
                                                                        setCategoryId(0)
                                                                    }
                                                                }}
                                                                disablePortal
                                                                options={categories}
                                                                getOptionLabel={(option) => option.name}
                                                                sx={{ mb: 2 }}
                                                                renderInput={(params) => <TextField {...params} label="Catégorie de voiture" />}
                                                            />

                                                            <Autocomplete
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setOwnerId(newValue.id)
                                                                    } else {
                                                                        setOwnerId(0)
                                                                    }
                                                                }}
                                                                disablePortal
                                                                options={owners}
                                                                getOptionLabel={(option) => option.ref + ' ' + (option.accountType === 'personnal' ? option.fullName : option.socialReason)}
                                                                sx={{ mb: 2 }}
                                                                renderInput={(params) => <TextField {...params} label="Propriétaire" />}
                                                            />
                                                            <TextField label="Numéro de plaque" variant="outlined" sx={{ mb: 2 }} fullWidth value={plateNumber} onChange={(e) => {
                                                                setPlateNumber(e.target.value)
                                                            }} />
                                                            <TextField label="Marque" variant="outlined" sx={{ mb: 2 }} fullWidth value={brand} onChange={(e) => {
                                                                setBrand(e.target.value)
                                                            }} />

                                                            <Grid container spacing={1}>
                                                                <Grid xs={4} item>
                                                                    <TextField label="Modèle" variant="outlined" sx={{ mb: 2 }} fullWidth value={model} onChange={(e) => {
                                                                        setModel(e.target.value)
                                                                    }} />
                                                                </Grid>
                                                                <Grid xs={4} item>
                                                                    <TextField label="Couleur" variant="outlined" sx={{ mb: 2 }} fullWidth value={color} onChange={(e) => {
                                                                        setColor(e.target.value)
                                                                    }} />
                                                                </Grid>
                                                                <Grid xs={4} item>
                                                                    <TextField label="Année" variant="outlined" sx={{ mb: 2 }} fullWidth value={year} onChange={(e) => {
                                                                        setYear(e.target.value)
                                                                    }} />
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container spacing={2}>
                                                                <Grid xs={6} item>
                                                                    <TextField label="Numéro de carte grise" variant="outlined" sx={{ mb: 2 }} fullWidth value={grayCardNumber} onChange={(e) => {
                                                                        setGrayCardNumber(e.target.value)
                                                                    }} />
                                                                </Grid>
                                                                <Grid xs={6} item>
                                                                    <TextField label="Numéro de chassis" variant="outlined" sx={{ mb: 2 }} fullWidth value={chassisNumber} onChange={(e) => {
                                                                        setChassisNumber(e.target.value)
                                                                    }} />
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container>
                                                                <Grid xs={6} item>
                                                                    <FormControlLabel control={<Switch checked={geoLocation} onChange={(e) => {
                                                                        setGeoLocation(e.target.checked)
                                                                    }} />} label="Géolocalisation" />
                                                                </Grid>
                                                                <Grid xs={6} item>
                                                                    <FormControlLabel control={<Switch checked={airConditioner == 1 ? true : false} onChange={(e) => {
                                                                        setAirConditioner(e.target.checked ? 1 : 0)
                                                                    }} />} label="Climatisée" />
                                                                </Grid>
                                                            </Grid>
                                                            <br /><br />

                                                            <Grid container spacing={2}>
                                                                <Grid xs={6} item>
                                                                    <FormControlLabel control={<Checkbox checked={isOnLocation} onChange={(e) => {
                                                                        setIsOnLocation(e.target.checked)
                                                                    }} />} label="Location" />
                                                                </Grid>
                                                                <Grid xs={6} item>
                                                                    <FormControlLabel control={<Checkbox checked={isOnShop} onChange={(e) => {
                                                                        setIsOnShop(e.target.checked)
                                                                    }} />} label="Vente" />
                                                                </Grid>
                                                            </Grid><br />

                                                            <Grid container spacing={2}>
                                                                <Grid xs={12} item>
                                                                    <FormControlLabel control={<Checkbox checked={isPopular} onChange={(e) => {
                                                                        setIsPopular(e.target.checked)
                                                                    }} />} label="Cochez si c'est une voiture populaire." />
                                                                </Grid>
                                                            </Grid><br />

                                                            <Autocomplete
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setTransmission(newValue.name)
                                                                    } else {
                                                                        setTransmission(transmissions[1])
                                                                    }
                                                                }}
                                                                disablePortal
                                                                options={transmissions}
                                                                getOptionLabel={(option) => option.name}
                                                                sx={{ mb: 2 }}
                                                                value={transmissions[1]}
                                                                renderInput={(params) => <TextField {...params} label="Transmission" />}
                                                            />

                                                            <Grid container spacing={2}>
                                                                <Grid xs={6} item>
                                                                    <TextField label="Frais de location" variant="outlined" sx={{ mb: 2 }} fullWidth value={locationFees} onChange={(e) => {
                                                                        if (isOnLocation) {
                                                                            if ((e.target.value >= 0 && e.target.value < 1000000000) || e.target.value.trim().length === 0) {
                                                                                setLocationFees(e.target.value)
                                                                            }
                                                                        }
                                                                    }} />
                                                                </Grid>
                                                                <Grid xs={6} item>
                                                                    <TextField label="Frais de vente" variant="outlined" sx={{ mb: 2 }} fullWidth value={shopFees} onChange={(e) => {
                                                                        if (isOnShop) {
                                                                            if ((e.target.value >= 0 && e.target.value < 1000000000) || e.target.value.trim().length === 0) {
                                                                                setShopFees(e.target.value)
                                                                            }
                                                                        }
                                                                    }} />
                                                                </Grid>
                                                            </Grid>

                                                            <Grid container spacing={2}>
                                                                <Grid xs={6} item>
                                                                    <TextField label="Nombre de places" variant="outlined" sx={{ mb: 2 }} fullWidth value={places} onChange={(e) => {
                                                                        if ((e.target.value >= 0 && e.target.value < 100) || e.target.value.trim().length === 0) {
                                                                            setPlaces(e.target.value)
                                                                        }
                                                                    }} />
                                                                </Grid>
                                                                <Grid xs={6} item>
                                                                    <TextField label="Nombre de portières" variant="outlined" sx={{ mb: 2 }} fullWidth value={doors} onChange={(e) => {
                                                                        if ((e.target.value >= 0 && e.target.value < 10) || e.target.value.trim().length === 0) {
                                                                            setDoors(e.target.value)
                                                                        }
                                                                    }} />
                                                                </Grid>
                                                            </Grid>

                                                            {
                                                                carPhotos.length > 0 &&
                                                                <Grid container spacing={1}>
                                                                    {
                                                                        carPhotos.map((photo, key) => {
                                                                            return (
                                                                                <Grid item xs={3} key={key}>
                                                                                    <Typography borderRadius={3} sx={{
                                                                                        backgroundImage: `url(${photo.path})`,
                                                                                        height: 100,
                                                                                        backgroundSize: 'cover',
                                                                                        backgroundPosition: 'center'
                                                                                    }}></Typography>
                                                                                </Grid>
                                                                            )
                                                                        })
                                                                    }
                                                                </Grid>
                                                            }

                                                            <TextField label="Commentaire en cas de vente ou location" variant="outlined" multiline rows={2} sx={{ mb: 2 }} fullWidth value={comment} onChange={(e) => {
                                                                if (isOnLocation || isOnShop) {
                                                                    setComment(e.target.value)
                                                                }
                                                            }} />
                                                            <br />
                                                            <div className="parent">
                                                                <div className="file-upload">
                                                                    <h3>Photos de la voiture</h3>
                                                                    <p>Taille maximale 10mb</p>
                                                                    <input type="file" accept='image/*' onInput={(e) => { handleSelectCarPhotos(e) }} multiple />
                                                                </div>
                                                            </div><br />

                                                        </React.Fragment> :
                                                        <React.Fragment>
                                                            {
                                                                <React.Fragment>
                                                                    {
                                                                        index === 1 ?
                                                                            <React.Fragment>

                                                                                {
                                                                                    errorAssuranceDate && <Typography bgcolor={'red'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Date de délivrance ou date d'expiration invalide !</Typography>
                                                                                }

                                                                                <TextField label="Police d'assurance" variant="outlined" sx={{ mb: 2 }} fullWidth value={assuranceNumber} onChange={(e) => {
                                                                                    setAssuranceNumber(e.target.value)
                                                                                }} />
                                                                                <TextField label="Nom de l'assurance" variant="outlined" sx={{ mb: 2 }} fullWidth value={assuranceName} onChange={(e) => {
                                                                                    setAssuranceName(e.target.value)
                                                                                }} />
                                                                                <TextField label="Type de l'assurance" variant="outlined" sx={{ mb: 2 }} fullWidth value={assuranceType} onChange={(e) => {
                                                                                    setAssuranceType(e.target.value)
                                                                                }} />

                                                                                <Grid container spacing={2}>
                                                                                    <Grid xs={6} item>
                                                                                        <small><strong>Date de délivrance</strong></small>
                                                                                        {
                                                                                            assuranceIssueDate === '' ?
                                                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                                    <DatePicker onChange={(e) => {
                                                                                                        const issueDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                                                        setAssuranceIssueDate(issueDate)
                                                                                                    }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                                                </LocalizationProvider> :
                                                                                                <div>
                                                                                                    <br />
                                                                                                    <strong>{assuranceIssueDate}</strong>&nbsp;
                                                                                                    <IconButton onClick={() => {
                                                                                                        setAssuranceIssueDate('')
                                                                                                    }}>
                                                                                                        <Delete />
                                                                                                    </IconButton>
                                                                                                </div>
                                                                                        }

                                                                                    </Grid>
                                                                                    <Grid xs={6} item>
                                                                                        <small><strong>Date d'expiration</strong></small>
                                                                                        {
                                                                                            assuranceExpiryDate === '' ?
                                                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                                    <DatePicker onChange={(e) => {
                                                                                                        const expiryDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                                                        setAssuranceExpiryDate(expiryDate)
                                                                                                    }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                                                </LocalizationProvider> :
                                                                                                <div>
                                                                                                    <br />
                                                                                                    <strong>{assuranceExpiryDate}</strong>&nbsp;
                                                                                                    <IconButton onClick={() => {
                                                                                                        setAssuranceExpiryDate('')
                                                                                                    }}>
                                                                                                        <Delete />
                                                                                                    </IconButton>
                                                                                                </div>
                                                                                        }
                                                                                    </Grid>
                                                                                </Grid>

                                                                                {
                                                                                    assurance.length > 0 &&
                                                                                    <Grid container spacing={1}>
                                                                                        <Grid item xs={12}>
                                                                                            {
                                                                                                assurance.map((assuranceImage, key) => {
                                                                                                    return (
                                                                                                        <img src={assuranceImage.path} alt="Photo assurance" key={key} style={{ borderRadius: 10 }} width={'100%'} />
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                }<br />

                                                                                <div className="parent">
                                                                                    <div className="file-upload">
                                                                                        <h3>Photo de l'assurance</h3>
                                                                                        <p>Taille maximale 10mb</p>
                                                                                        <input type="file" accept='image/*' onInput={(e) => { handleSelectAssurance(e) }} />
                                                                                    </div>
                                                                                </div><br />
                                                                            </React.Fragment> :
                                                                            <React.Fragment>
                                                                                {
                                                                                    index === 2 ?
                                                                                        <React.Fragment>

                                                                                            {
                                                                                                errorTechnicalVisitDate && <Typography bgcolor={'red'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Date de délivrance ou date d'expiration invalide !</Typography>
                                                                                            }

                                                                                            <TextField label="Numéro de la visite technique" variant="outlined" sx={{ mb: 2 }} fullWidth value={technicalVisitNumber} onChange={(e) => {
                                                                                                setTechnicalVisitNumber(e.target.value)
                                                                                            }} />
                                                                                            <Grid container spacing={2}>
                                                                                                <Grid xs={6} item>
                                                                                                    <small><strong>Date de délivrance</strong></small>
                                                                                                    {
                                                                                                        technicalVisitIssueDate === '' ?
                                                                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                                                <DatePicker onChange={(e) => {
                                                                                                                    const isueDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                                                                    setTechnicalVisitIssueDate(isueDate)
                                                                                                                }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                                                            </LocalizationProvider> :
                                                                                                            <div>
                                                                                                                <br />
                                                                                                                <strong>{technicalVisitIssueDate}</strong>&nbsp;
                                                                                                                <IconButton onClick={() => {
                                                                                                                    setTechnicalVisitIssueDate('')
                                                                                                                }}>
                                                                                                                    <Delete />
                                                                                                                </IconButton>
                                                                                                            </div>
                                                                                                    }
                                                                                                </Grid>
                                                                                                <Grid xs={6} item>
                                                                                                    <small><strong>Date d'expiration</strong></small>
                                                                                                    {
                                                                                                        technicialVisitExpiryDate === '' ?
                                                                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                                                <DatePicker onChange={(e) => {
                                                                                                                    const expiryDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                                                                    setTechnicalVisitExpiryDate(expiryDate)
                                                                                                                }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                                                            </LocalizationProvider> :
                                                                                                            <div>
                                                                                                                <br />
                                                                                                                <strong>{technicialVisitExpiryDate}</strong>&nbsp;
                                                                                                                <IconButton onClick={() => {
                                                                                                                    setTechnicalVisitExpiryDate('')
                                                                                                                }}>
                                                                                                                    <Delete />
                                                                                                                </IconButton>
                                                                                                            </div>
                                                                                                    }
                                                                                                </Grid>
                                                                                            </Grid>

                                                                                            {
                                                                                                technicalVisit.length > 0 &&
                                                                                                <Grid container spacing={1}>
                                                                                                    <Grid item xs={12}>
                                                                                                        {
                                                                                                            technicalVisit.map((technicalVisitImage, key) => {
                                                                                                                return (
                                                                                                                    <img src={technicalVisitImage.path} alt="Photo visite technique" key={key} style={{ borderRadius: 10 }} width={'100%'} />
                                                                                                                )
                                                                                                            })
                                                                                                        }
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            }<br />

                                                                                            <div className="parent">
                                                                                                <div className="file-upload">
                                                                                                    <h3>Photo de la visite technique</h3>
                                                                                                    <p>Taille maximale 10mb</p>
                                                                                                    <input type="file" accept='image/*' onInput={(e) => { handleSelectTechnicalVisit(e) }} />
                                                                                                </div>
                                                                                            </div><br />
                                                                                        </React.Fragment> :
                                                                                        <React.Fragment>

                                                                                            {
                                                                                                errorTvmDate && <Typography bgcolor={'red'} color={'white'} p={1} textAlign={'center'} mb={3} borderRadius={3}>Date de délivrance ou date d'expiration invalide !</Typography>
                                                                                            }

                                                                                            <TextField label="Numéro de la TVM" variant="outlined" sx={{ mb: 2 }} fullWidth value={tvmNumber} onChange={(e) => {
                                                                                                setTvmNumber(e.target.value)
                                                                                            }} />
                                                                                            <Grid container spacing={2}>
                                                                                                <Grid xs={6} item>
                                                                                                    <small><strong>Date de délivrance</strong></small>
                                                                                                    {
                                                                                                        tvmIssueDate === '' ?
                                                                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                                                <DatePicker onChange={(e) => {
                                                                                                                    const issueDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                                                                    setTvmIssueDate(issueDate)
                                                                                                                }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                                                            </LocalizationProvider> :
                                                                                                            <div>
                                                                                                                <br />
                                                                                                                <strong>{tvmIssueDate}</strong>&nbsp;
                                                                                                                <IconButton onClick={() => {
                                                                                                                    tvmIssueDate('')
                                                                                                                }}>
                                                                                                                    <Delete />
                                                                                                                </IconButton>
                                                                                                            </div>
                                                                                                    }
                                                                                                </Grid>
                                                                                                <Grid xs={6} item>
                                                                                                    <small><strong>Date d'expiration</strong></small>
                                                                                                    {
                                                                                                        tvmExpiryDate === '' ?
                                                                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                                                <DatePicker onChange={(e) => {
                                                                                                                    const expiryDate = e.$y + '-' + (e.$M + 1) + '-' + e.$D
                                                                                                                    setTvmExpiryDate(expiryDate)
                                                                                                                }} sx={{ width: '100%', mt: 1, mb: 2 }} />
                                                                                                            </LocalizationProvider> :
                                                                                                            <div>
                                                                                                                <br />
                                                                                                                <strong>{tvmExpiryDate}</strong>&nbsp;
                                                                                                                <IconButton onClick={() => {
                                                                                                                    tvmExpiryDate('')
                                                                                                                }}>
                                                                                                                    <Delete />
                                                                                                                </IconButton>
                                                                                                            </div>
                                                                                                    }
                                                                                                </Grid>
                                                                                            </Grid>

                                                                                            {
                                                                                                tvm.length > 0 &&
                                                                                                <Grid container spacing={1}>
                                                                                                    <Grid item xs={12}>
                                                                                                        {
                                                                                                            tvm.map((tvmImage, key) => {
                                                                                                                return (
                                                                                                                    <img src={tvmImage.path} alt="Photo TVM" key={key} style={{ borderRadius: 10 }} width={'100%'} />
                                                                                                                )
                                                                                                            })
                                                                                                        }
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            }<br />

                                                                                            <div className="parent">
                                                                                                <div className="file-upload">
                                                                                                    <h3>Photo de la TVM</h3>
                                                                                                    <p>Taille maximale 10mb</p>
                                                                                                    <input type="file" accept='image/*' onInput={(e) => { handleSelectTvm(e) }} />
                                                                                                </div>
                                                                                            </div><br />
                                                                                        </React.Fragment>
                                                                                }
                                                                            </React.Fragment>
                                                                    }
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                }
                                                <Box sx={{ mb: 2 }}>
                                                    {
                                                        index === 0 ?
                                                            <div>
                                                                <Button
                                                                    disabled={ownerId === 0 || plateNumber.trim().length === 0 || brand.trim().length === 0 || model.trim().length === 0
                                                                        || year.trim().length === 0 || locationFees.toString().trim().length === 0 || shopFees.toString().trim().length === 0}
                                                                    variant="contained"
                                                                    disableElevation
                                                                    onClick={handleCreateCar}
                                                                    sx={{ mt: 1, mr: 1 }}
                                                                >
                                                                    {index === steps.length - 1 ? 'Continuer' : 'Continuer'}
                                                                </Button>
                                                            </div> :
                                                            <React.Fragment>
                                                                {
                                                                    <React.Fragment>
                                                                        {
                                                                            index === 1 ?
                                                                                <div>
                                                                                    <Button
                                                                                        disabled={assuranceNumber.trim().length === 0 || assuranceName.trim().length === 0 || assuranceType.trim().length === 0 || assuranceIssueDate.trim().length === 0 || assuranceExpiryDate.trim().length === 0 || isLoading}
                                                                                        variant="contained"
                                                                                        disableElevation
                                                                                        onClick={handleCreateAssurance}
                                                                                        sx={{ mt: 1, mr: 1 }}
                                                                                    >
                                                                                        {isLoading ? "Patientez ..." : "Continer"}
                                                                                    </Button>
                                                                                </div> :
                                                                                <React.Fragment>
                                                                                    {
                                                                                        index === 2 ?
                                                                                            <div>
                                                                                                <Button
                                                                                                    disabled={technicalVisitNumber.trim().length === 0 || technicalVisitIssueDate.trim().length === 0 || technicialVisitExpiryDate.trim().length === 0 || isLoading}
                                                                                                    variant="contained"
                                                                                                    disableElevation
                                                                                                    onClick={handleCreateTechnicalVisit}
                                                                                                    sx={{ mt: 1, mr: 1 }}
                                                                                                >
                                                                                                    {isLoading ? "Patientez ..." : "Continer"}
                                                                                                </Button>
                                                                                            </div> :
                                                                                            <div>
                                                                                                <Button
                                                                                                    disabled={tvmNumber.trim().length === 0 || tvmIssueDate.trim().length === 0 || tvmExpiryDate.trim().length === 0 || isLoading}
                                                                                                    variant="contained"
                                                                                                    disableElevation
                                                                                                    onClick={handleCreateTvm}
                                                                                                    sx={{ mt: 1, mr: 1 }}
                                                                                                >
                                                                                                    {isLoading ? "Patientez ..." : "Continer"}
                                                                                                </Button>
                                                                                                <Button
                                                                                                    disableElevation
                                                                                                    onClick={handleNext}
                                                                                                    sx={{ mt: 1, mr: 1 }}
                                                                                                >
                                                                                                    Passer
                                                                                                </Button>
                                                                                            </div>
                                                                                    }
                                                                                </React.Fragment>
                                                                        }
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
                                        <Typography mb={2}>La voiture est prête à être publiée. Pour finir le processus, cliquez sur "<strong>Terminer</strong>".</Typography>
                                        <Button sx={{ mt: 1, mr: 1 }} variant='contained' disableElevation onClick={() => {
                                            navigate('/admins/cars')
                                        }}>
                                            <strong>Terminer</strong>
                                        </Button>
                                    </Paper>
                                )}
                            </Box>
                        </form>
                }

            </Grid>
        </Grid>

    )
}