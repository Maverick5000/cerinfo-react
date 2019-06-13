import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography, Divider } from '@material-ui/core';

// Material icons
import {
  AccessTime as AccessTimeIcon,
  GetApp as GetAppIcon
} from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';

class ProductCardLibro extends Component {
  render() {
    const { classes, className, libro } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Paper className={rootClassName}>
        <div className={classes.imageWrapper}>
          <img
            alt="Libro"
            className={classes.image}
            src='https://odcspress.org/wp-content/uploads/2017/01/Stack-Books-Copy.jpg'
          />
        </div>
        <div className={classes.details}>
          <Typography
            className={classes.title}
            variant="h4"
          >
            {libro.titulo_libro}
          </Typography>
          <Typography
            className={classes.description}
            variant="body1"
          >
            {libro.nombre_autor}
          </Typography>
        </div>
        <Divider />
        <div className={classes.stats}>
          {/* <AccessTimeIcon className={classes.updateIcon} /> */}
          <Typography
            className={classes.updateText}
            variant="body2"
          >
            Genero: {libro.nombre_genero}
          </Typography>
          {/* <GetAppIcon className={classes.downloadsIcon} /> */}
          <Typography
            className={classes.downloadsText}
            variant="body2"
          >
            Idioma: {libro.significado_idioma}
          </Typography>
        </div>
      </Paper>
    );
  }
}

ProductCardLibro.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  libro: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCardLibro);
