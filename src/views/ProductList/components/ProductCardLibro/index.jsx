import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography, Divider, Button } from '@material-ui/core';

// Material icons
import {
  AccessTime as AccessTimeIcon,
  GetApp as GetAppIcon
} from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';

// Axios
import axios from 'axios';

class ProductCardLibro extends Component {
  state = {
    visible: true,
    userPrestamos: [],
    userSolicitudes: []
  };

  deleteLibro(id) {
    let url = 'https://cerinfo-api.herokuapp.com/libros/';
    axios
      .delete(url + id)
      .then(res => {
        console.log(res);
        this.setState({ visible: false });
      })
      .catch(function(error) {
        console.log(error);
        window.alert(
          'No se puede eliminar este libro porque se encuentra prestado o con una multa'
        );
      });
  }

  solicitarLibro(id) {
    if (window.confirm('Solicitar este libro?')) {
      const u_id = localStorage.getItem('id');
      axios
        .post('https://cerinfo-api.herokuapp.com/solicituds', {
          usuario_id: u_id,
          libro_id: id
        })
        .then(res => {
          console.log(res);
          window.alert('Libro Solicitado');
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    this.getPrestamos();
    this.getSolicitudes();
  }

  getPrestamos() {
    const id = localStorage.getItem('id');
    //const id = '1'
    const tipo = localStorage.getItem('tipo_usuario');
    let url = '';
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/prestamos';
    } else {
      url = `https://cerinfo-api.herokuapp.com/user/prestamos`;
    }

    axios.get(url, { params: { usuario_id: id } }).then(res => {
      this.setState({ userPrestamos: res.data });
    });
  }

  getSolicitudes() {
    const id = localStorage.getItem('id');
    //const id = '1'
    const tipo = localStorage.getItem('tipo_usuario');
    let url = '';
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/solicituds';
    } else {
      url = `https://cerinfo-api.herokuapp.com/user/solicituds`;
    }

    axios.get(url, { params: { usuario_id: id } }).then(res => {
      this.setState({ userSolicitudes: res.data });
    });
  }

  mapButton(libro_id) {
    let button = '';
    let flag = false;
    let prestamos = this.state.userPrestamos;
    for (let index = 0; index < prestamos.length; index++) {
      const element = prestamos[index];
      if (element.libro.id == libro_id) {
        button = (
          <Button
            color='secondary'
            size='small'
            variant='outlined'
            type='button'
            style={{ marginLeft: '1vw', width: '7vw' }}>
            Prestado
          </Button>
        );
        flag = true;
        break;
      } else {
        button = (
          <Button
            color='primary'
            size='small'
            variant='outlined'
            type='button'
            style={{ marginLeft: '1vw', width: '7vw' }}
            onClick={() => {
              this.solicitarLibro(libro_id);
            }}>
            Solicitar libro
          </Button>
        );
      }
    }

    if (flag) {
      return button;
    } else {
      return this.mapButtonSolicitud(libro_id);
    }
  }

  mapButtonSolicitud(libro_id) {
    let button = '';
    let solicitudes = this.state.userSolicitudes;
    for (let index = 0; index < solicitudes.length; index++) {
      const element = solicitudes[index];
      if (element.libro.id == libro_id) {
        button = (
          <Button
            color='secondary'
            size='small'
            variant='outlined'
            type='button'
            style={{ marginLeft: '1vw', width: '7vw' }}>
            Solicitado
          </Button>
        );
        break;
      } else {
        button = (
          <Button
            color='primary'
            size='small'
            variant='outlined'
            type='button'
            style={{ marginLeft: '1vw', width: '7vw' }}
            onClick={() => {
              this.solicitarLibro(libro_id);
            }}>
            Solicitar libro
          </Button>
        );
      }
    }

    return button;
  }

  render() {
    const { classes, className, libro } = this.props;
    const tipo = localStorage.getItem('tipo_usuario');
    const rootClassName = classNames(classes.root, className);

    return (
      <div>
        {this.state.visible ? (
          <Paper className={rootClassName}>
            <div className={classes.imageWrapper}>
              <img
                alt='Libro'
                className={classes.image}
                src='https://odcspress.org/wp-content/uploads/2017/01/Stack-Books-Copy.jpg'
              />
            </div>
            <div className={classes.details}>
              <Typography className={classes.title} variant='h4'>
                {libro.titulo_libro}
              </Typography>
              <Typography className={classes.description} variant='body1'>
                {libro.nombre_autor}
              </Typography>
            </div>
            <Divider />
            <div className={classes.stats}>
              {/* <AccessTimeIcon className={classes.updateIcon} /> */}
              <Typography className={classes.updateText} variant='body2'>
                Genero: {libro.nombre_genero}
              </Typography>
              {/* <GetAppIcon className={classes.downloadsIcon} /> */}
              <Typography className={classes.downloadsText} variant='body2'>
                Idioma: {libro.significado_idioma}
              </Typography>
              {tipo == 'Administrador' ? (
                <Button
                  color='secondary'
                  size='small'
                  variant='outlined'
                  type='button'
                  style={{ marginLeft: '1vw', width: '7vw' }}
                  onClick={() => {
                    this.deleteLibro(libro.id);
                  }}>
                  Eliminar libro
                </Button>
              ) : (
                <div>{this.mapButton(libro.id)}</div>
              )}
            </div>
          </Paper>
        ) : null}
      </div>
    );
  }
}

ProductCardLibro.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  libro: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCardLibro);
