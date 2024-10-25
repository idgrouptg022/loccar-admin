import React from 'react'

export default function SignOut() {

    localStorage.clear()

    window.location = '/'

    return (
        <div>Déconnexio</div>
    )
}