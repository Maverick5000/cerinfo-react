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

class ProductsToolbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      autor_id: '1',
      genero_id: '1',
      idioma_id: '1',
      sigtop_id: '1',
      editorial_id: '1',
      material_id: '1',
      autors: [],
      generos: [],
      idiomas: [],
      sigtops: [],
      materials: [],
      editorials: []
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
    delete data['generos']
    delete data['sigtops']
    delete data['idiomas']
    delete data['autors']
    delete data['materials']
    delete data['editorials']
    delete data['open']
    this.saveLibro(data)
    console.log(data)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    this.getAutores()
    this.getIdiomas()
    this.getGeneros()
    this.getEditoriales()
    this.getSigtops()
    this.getMaterials()
  }

  saveLibro(data) {
    try {
      axios.post('https://cerinfo-api.herokuapp.com/libros', {
        autor_id: data.autor_id,
        genero_id: data.genero_id,
        material_id: data.material_id,
        sigtop_id: data.sigtop_id,
        idioma_id: data.idioma_id,
        editorial_id: data.editorial_id,
        titulo_libro: data.titulo_libro,
        ano_libro: data.ano_libro,
        lugar_publicacion_libro: data.lugar_publicacion_libro
      })
        .then(res => {
          console.log(res)
          this.handleClose()
        })
    } catch (error) {
      console.error(error);
    }
  }

  async getAutores() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/autors');
      this.setState({ autors: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  async getMaterials() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/materials');
      this.setState({ materials: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  async getIdiomas() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/idiomas');
      this.setState({ idiomas: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  async getGeneros() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/generos');
      this.setState({ generos: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  async getEditoriales() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/editorials');
      this.setState({ editorials: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  async getSigtops() {
    try {
      const response = await axios.get('https://cerinfo-api.herokuapp.com/sigtops');
      this.setState({ sigtops: response.data });
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
            Agregar Libro
          </Button> : null}
        </div>
        <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Buscar Libro"
          />
          {this.state.open ? <Dialog fullWidth={'xl'} open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Crear libro</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
              <DialogContentText>
                Crear nuevo libro
            </DialogContentText>
              <TextField
                onChange={this.handleChange.bind(this)}
                name={'titulo_libro'}
                autoFocus
                margin="dense"
                id="titulo_libro"
                label="Titulo"
                type="text"
                fullWidth
              />
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="autor_id-simple">Autor</InputLabel>
                {this.state.autors != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.autor_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'autor_id',
                    id: 'autor_id-simple',
                  }}
                >
                  {this.state.autors.map((autor) =>
                    <option value={autor.id}>
                      {autor.nombre_autor}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="genero_id-simple">Genero</InputLabel>
                {this.state.generos != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.genero_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'genero_id',
                    id: 'genero_id-simple',
                  }}
                >
                  {this.state.generos.map((genero, index) =>
                    <option value={genero.id}>
                      {genero.nombre_genero}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="editorial_id-simple">Editorial</InputLabel>
                {this.state.editorials != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.editorial_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'editorial_id',
                    id: 'editorial_id-simple',
                  }}
                >
                  {this.state.editorials.map((editorial) =>
                    <option value={editorial.id}>
                      {editorial.nombre_editorial}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="idioma_id-simple">Idioma</InputLabel>
                {this.state.idiomas != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.idioma_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'idioma_id',
                    id: 'idioma_id-simple',
                  }}
                >
                  {this.state.idiomas.map((idioma) =>
                    <option value={idioma.id}>
                      {idioma.significado_idioma}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="material_id-simple">Material</InputLabel>
                {this.state.materials != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.material_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'material_id',
                    id: 'material_id-simple',
                  }}
                >
                  {this.state.materials.map((material) =>
                    <option value={material.id}>
                      {material.significado_material}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="sigtop_id-simple">Sigtop</InputLabel>
                {this.state.sigtops != [] ? <Select
                  native
                  fullWidth
                  margin="dense"
                  value={this.state.sigtop_id}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'sigtop_id',
                    id: 'sigtop_id-simple',
                  }}
                >
                  {this.state.sigtops.map((sigtop) =>
                    <option value={sigtop.id}>
                      {sigtop.cuter_sigtop}
                    </option >
                  )}
                </Select> : null}
              </FormControl>
              <TextField
                name={'ano_libro'}
                onChange={this.handleChange.bind(this)}
                margin="dense"
                id="ano"
                label="Año"
                type="text"
                fullWidth
              />
              <TextField
                name={'lugar_publicacion_libro'}
                onChange={this.handleChange.bind(this)}
                margin="dense"
                id="lugar_publicacion_libro"
                label="Lugar de publicacion"
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

ProductsToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductsToolbar);
