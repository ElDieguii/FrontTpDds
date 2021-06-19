import React ,{ useState , useEffect} from 'react';
import { Input } from '../Input/Input';
import './Register.css'
import { Button } from '../Button/Button';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormControlLabel } from '@material-ui/core';


function Alert(props) {
    return <MuiAlert elevation={5} variant="filled" {...props} />;
}

export const Register = (props) => {
    const [message, setMessage] =  useState('')
    const [switched, setSwitched] =  useState(false)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    useEffect(()=> {
        if(message!==''){
            setOpen(true)
        }
    },[])
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const handleRegister = (event) => {
        event.preventDefault()
        if(event.target[1].value!==event.target[2].value){
            setMessage('Las contraseñas no coinciden')
            setOpen(true)  
        }else{
            setLoading(true)
            const datosUsuario={
                nombreDeUsuario: event.target[0].value,
                contrasenia: event.target[1].value,
            }
    
            const url = `http://localhost:8080/auth/registro`

            axios.post(url,datosUsuario)
            .then((res) => {
                setLoading(false)
                setMessage('Registro Exitoso')
                setOpen(true)
                setError(false)
            })
            .catch((err) => {
                setLoading(false)
                setMessage(err.response ? err.response.data.error : "Error de conexion\n"+err)
                setError(true)
                setOpen(true)  
            })
        }
    }

      const handleChange = (event) => {
          setSwitched(event.target.checked)
      };
    return (
        
        <div className="container">
            <form onSubmit={handleRegister}>
                <h1 className={'title'}>Se uno mas de nosotros</h1>
                <Input placeholder='Ingresar usuario'/>
                <Input 
                    placeholder='Ingresar contraseña'
                    type='Password'
                />
                <Input 
                    placeholder='Repetir contraseña'
                    type='Password'
                />
                <div className={'adminSwitch'}>
                <FormControlLabel
                    control={
                    <Switch
                        checked={switched}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Es Administrador"
                />
                </div>
                {loading ?
                        <CircularProgress className="loading"/> 
                : 
                    <Button
                        name='Registrarse'
                    />
                }
            </form>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={error? "error":"success"}>
                    {message}
                </Alert>
            </Snackbar>

        </div>
    )
} 