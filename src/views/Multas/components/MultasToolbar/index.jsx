import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button } from '@material-ui/core';

// Shared components
import { DisplayMode, SearchInput } from 'components';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

// Component styles
import styles from './styles';

class MultasToolbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      usuario_id: '1',
      libro_id: '1',
      monto_multa: '',
      detalle_multa: '',
      estado_multa: '',
      users: [],
      libros: []
    }

  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleSubmit = () => {
    let data = this.state
    delete data['libros']
    delete data['users']
    delete data['open']
    this.saveMulta(data)
    this.handleClose()
    console.log(data)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    this.getLibros()
    this.getUsers()
  }

  saveMulta(data) {
    try {
      axios.post('https://cerinfo-api.herokuapp.com/multas', {
        usuario_id: data.usuario_id,
        libro_id: data.libro_id,
        detalle_multa: data.detalle_multa,
        estado_multa: data.estado_multa,
        monto_multa: data.monto_multa
      })
        .then(res => {
          console.log(res)
          this.handleClose()
          this.props.reload()
        })
    } catch (error) {
      console.error(error);
    }
  }

  async getUsers() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/usuarios');
      this.setState({ users: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  async getLibros() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/libros');
      this.setState({ libros: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { classes, className } = this.props;
    const tipo = localStorage.getItem('tipo_usuario');

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <span className={classes.spacer} />
          {tipo == 'Administrador' ? <Button
            color="primary"
            size="small"
            variant="outlined"
            onClick={this.handleClickOpen}
          >
            Crear Multa
          </Button> : null}
        </div>
        <div className={classes.row}>
          {/* <SearchInput
            className={classes.searchInput}
            placeholder="Buscar Libro"
          /> */}
          {this.state.open ? <Dialog fullWidth={'xl'} open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Crear Multa</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
              <DialogContentText>
                Crear nueva multa
            </DialogContentText>
              <TextField
                onChange={this.handleChange.bind(this)}
                name={'monto_multa'}
                autoFocus
                margin="dense"
                id="monto_multa"
                label="Monto"
                type="number"
                fullWidth
              />
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="usuario_id-simple">Usuario</InputLabel>
                {this.state.users != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.usuario_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'usuario_id',
                    id: 'usuario_id-simple',
                  }}
                >
                  {this.state.users.map((user) =>
                    <option value={user.id}>
                      {user.nombre_usuario} - Reg: {user.registro_usuario}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="libro_id-simple">Libro</InputLabel>
                {this.state.libros != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.libro_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'libro_id',
                    id: 'libro_id-simple',
                  }}
                >
                  {this.state.libros.map((libro, index) =>
                    <option value={libro.id}>
                      {libro.titulo_libro}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              
              <TextField
                name={'detalle_multa'}
                onChange={this.handleChange.bind(this)}
                margin="dense"
                id="detalle_multa"
                label="Detalle"
                type="text"
                fullWidth
              />
              <TextField
                name={'estado_multa'}
                onChange={this.handleChange.bind(this)}
                margin="dense"
                id="estado_multa"
                label="Estado"
                type="text"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button type={'button'} onClick={this.handleClose} color="primary">
                Cancelar
          </Button>
              <Button type={'button'} onClick={this.handleSubmit} color="primary">
                Crear
          </Button>
            </DialogActions>
          </Dialog> : null}
          {/* <span className={classes.spacer} /> */}
          {/* <DisplayMode mode="grid" /> */}
        </div>
      </div>
    );
  }
}

MultasToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MultasToolbar);
