import { Delete } from '@mui/icons-material'
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid, Switch, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const transmissions = [
    {
        name: 'Automatique',
    },
    {
        name: 'Manuel',
    }
]

let bodyFormData = null

export default function EditCar(props) {
    const [openAlert, setOpenAlert] = useState(false)

    const [owners, setOwners] = useState([])

    const [categories, setCategories] = React.useState([])
    const [category, setCategory] = React.useState(null)
    const [categoryId, setCategoryId] = React.useState(0)

    const [ownerId, setOwnerId] = useState(0)
    const [plateNumber, setPlateNumber] = useState('')
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [color, setColor] = useState('')
    const [year, setYear] = useState('')
    const [grayCardNumber, setGrayCardNumber] = useState('')
    const [chassisNumber, setChassisNumber] = useState('')
    const [geoLocation, setGeoLocation] = useState(false)
    const [isOnLocation, setIsOnLocation] = useState(false)
    const [isOnShop, setIsOnShop] = useState(false)
    const [isPopular, setIsPopular] = React.useState(false)

    const [locationFees, setLocationFees] = useState(0)
    const [shopFees, setShopFees] = useState(0)


    const [comment, setComment] = useState('')

    const [carPhotos, setCarPhotos] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [isPhotoDeleting, setIsPhotoDeleting] = useState(false)

    const [oldOwner, setOldOwner] = useState({})
    const [oldCarPhotos, setOldCarPhotos] = useState([])

    const [currentPhotoId, setCurrentPhotoId] = useState(0)

    const [airConditioner, setAirConditioner] = useState(0)
    const [places, setPlaces] = useState(0)
    const [doors, setDoors] = useState(0)

    const [transmission, setTransmission] = useState("")

    const navigate = useNavigate()

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


    async function fetchCars() {

        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/${props.car}`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        setOldOwner(response.data.data[0].owner)
                        setOwnerId(response.data.data[0].owner.id)
                        setPlateNumber(response.data.data[0].car.carPlateNumber)
                        setBrand(response.data.data[0].car.brand)
                        setModel(response.data.data[0].car.model)
                        setColor(response.data.data[0].car.color)
                        setYear(response.data.data[0].car.year.toString())
                        setChassisNumber(response.data.data[0].car.chassisNumber)
                        setGrayCardNumber(response.data.data[0].car.grayCardNumber)
                        setGeoLocation(response.data.data[0].car.geolocation)
                        setIsOnLocation(response.data.data[0].car.isOnLocation)
                        setIsOnShop(response.data.data[0].car.isOnShop)
                        setIsPopular(response.data.data[0].car.isPopular)
                        setLocationFees(response.data.data[0].car.locationFees)
                        setShopFees(response.data.data[0].car.shopFees)
                        setComment(response.data.data[0].car.comment)
                        setOldCarPhotos(response.data.data[0].car.carPhotos)

                        setCategoryId(response.data.data[0].car.category?.id || 0);
                        setCategory(response.data.data[0].car.category);

                        setAirConditioner(response.data.data[0].car.airConditioner);
                        setPlaces(response.data.data[0].car.places);
                        setDoors(response.data.data[0].car.doors);
                        setDoors(response.data.data[0].car.doors);

                        setTransmission(response.data.data[0].car.transmission);

                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                //
            })
    }

    const handleCreateCar = async () => {
        if (bodyFormData === null) bodyFormData = new FormData()

        setIsLoading(true)

        bodyFormData.set('airConditioner', airConditioner)
        bodyFormData.set('places', places)
        bodyFormData.set('doors', doors)

        bodyFormData.set('transmission', transmission)

        bodyFormData.set('categoryId', categoryId)
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

        await axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/${props.car}`,
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
                        navigate(-1)
                    }
                } catch {
                    //
                }
            })
            .catch(function (error) {
                console.log(error)
                setIsLoading(false)
            })
    }


    const handleRemovePhoto = async () => {
        await axios({
            method: "delete",
            url: `${process.env.REACT_APP_API_URL}/owners/cars/car-photos/${currentPhotoId}/remove`,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
            .then(function (response) {
                try {
                    if (response.data?.responseCode === '0') {
                        fetchCars()
                        setOpenAlert(false)
                        setCurrentPhotoId(0)
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


    useEffect(() => {
        async function fetchOwners() {

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

        fetchCars()
        fetchOwners()
        fetchCategories()

    }, [])

    return (
        <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={6}>
                <Box mt={5} maxWidth={400}>
                    <Typography typography={'h5'}>
                        <strong>Modifier une voiture</strong>
                    </Typography><br /><br />

                    <Fragment>

                        <Autocomplete
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setCategoryId(newValue.id)
                                } else {
                                    setCategoryId(0)
                                }
                            }}
                            value={category}
                            disablePortal
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            sx={{ mb: 2 }}
                            renderInput={(params) => <TextField {...params} label="Catégorie de voiture" />}
                        /><br />

                        <Autocomplete
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setOwnerId(newValue.id)
                                } else {
                                    setOwnerId(0)
                                }
                            }}
                            value={oldOwner}
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

                        <Grid container spacing={2}>
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
                            value={{ name: transmission }}
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
                            oldCarPhotos.length > 0 &&
                            <Grid container spacing={1}>
                                {
                                    oldCarPhotos.map((oldPhoto, key) => {
                                        return (
                                            <Grid item xs={3} key={key} style={{ textAlign: 'center' }}>
                                                <Typography borderRadius={3} sx={{
                                                    backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/${oldPhoto.carPhoto})`,
                                                    height: 100,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}></Typography>
                                                <Button color='error' sx={{ mb: 1 }} onClick={() => {
                                                    setCurrentPhotoId(oldPhoto.id)
                                                    setOpenAlert(true)
                                                }}><Delete /></Button>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        }<hr /><br />

                        {
                            carPhotos.length > 0 &&
                            <Grid container spacing={1}>
                                {
                                    carPhotos.map((photo, key) => {
                                        return (
                                            <Grid item xs={3} key={key} mb={2}>
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

                        <Button fullWidth variant='contained' disableElevation size='large' disabled={
                            ownerId === 0 || plateNumber.trim().length === 0 || brand.trim().length === 0 || model.trim().length === 0 || year.trim().length === 0 || isLoading
                        } onClick={handleCreateCar}>
                            <strong>Mettre à jour</strong>
                        </Button><br /><br /><br />

                    </Fragment>
                </Box>
            </Grid>

            <Dialog
                open={openAlert}
                onClose={() => {
                    setCurrentPhotoId(0)
                    setOpenAlert(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Supprimer cette photo ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr(e) de vouloir cette photo ? Cette action sera défintive et irréversible !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setCurrentPhotoId(0)
                        setOpenAlert(false)
                    }}>Fermer</Button>
                    <Button color='error' onClick={() => {
                        handleRemovePhoto()
                    }} autoFocus>
                        {isPhotoDeleting ? "Patientez ..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}