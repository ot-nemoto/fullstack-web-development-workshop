'use client'

import { useState, useEffect } from 'react'

export default function Page() {
    const [data, setData] = useState({ message: '' })

    useEffect(() => {
        fetch('/api/hello_db/backend')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })

    }, [])
    return <div>hello {data.message}!</div>
}
