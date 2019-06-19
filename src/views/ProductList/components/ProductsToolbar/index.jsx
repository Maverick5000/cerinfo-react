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

// Component styles
import styles from './styles';

class ProductsToolbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }

  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
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
          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Crear libro</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Crear nuevo libro
          </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="nombre"
                label="Nombre"
                type="text"
                fullWidth
              />
              <TextField
                margin="dense"
                id="autor"
                label="Autor"
                type="text"
                fullWidth
              />
              <TextField
                margin="dense"
                id="ano"
                label="Año"
                type="text"
                fullWidth
              />
              <TextField
                margin="dense"
                id="publicacion"
                label="Lugar de publicacion"
                type="text"
                fullWidth
              />
              <TextField
                margin="dense"
                id="idioma"
                label="Idioma"
                type="text"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancelar
          </Button>
              <Button onClick={this.handleClose} color="primary">
                Crear
          </Button>
            </DialogActions>
          </Dialog>
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
