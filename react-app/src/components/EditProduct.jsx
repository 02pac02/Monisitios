import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const endpoint = 'http://localhost:8000/api/product/';

const EditProduct = () => {
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState(0)
    const [stock, setStock] = useState(0)
    const navigate = useNavigate()
    const {id} = useParams()

    const update = async (e) => {
        e.preventDefault()
        await axios.put("${endpoint}${id}", {
            descripcion: descripcion,
            precio: precio,
            stock: stock
        })
        navigate('/')
    }

    useEffect(() =>{
        const getProductById = async () =>{
            const response = await axios.get(`${endpoint}${id}`)
            setDescripcion(response.data.descripcion)
            setPrecio(response.data.precio)
            setStock(response.data.stock)
        }

        getProductById()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div>
        <h3>Editar Producto</h3>
        <form onSubmit={update}>
        <div className="mb-3">
            <label className="form-label">Descripcion</label>
            <input 
                value={descripcion}
                onChange={(e)=>setDescripcion(e.target.value)}
                type='text'
                className='form-control'
            />
        </div>
        <div className="mb-3">
            <label className="form-label">precio</label>
            <input 
                value={precio}
                onChange={(e)=>setPrecio(e.target.value)}
                type='number'
                className='form-control'
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Stock</label>
            <input 
                value={stock}
                onChange={(e)=>setStock(e.target.value)}
                type='number'
                className='form-control'
            />
        </div>
        <button type='submit' className='btn btn-primary'>Editar</button>
        </form>
    </div>
  )
}

export default EditProduct
