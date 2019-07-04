import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';

// Material icons
import {
  ArrowUpward as ArrowUpwardIcon,
  PeopleOutlined as PeopleIcon
} from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';

// Axios
import axios from 'axios';

class Users extends Component {
  state = {
    nPrestamos: 0
  };

  componentDidMount() {
    const id = localStorage.getItem('id');
    //const id = '1'

    const tipo = localStorage.getItem('tipo_usuario');
    let url = '';
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/prestamos';
    } else {
      url = 'https://cerinfo-api.herokuapp.com/user/prestamos';
    }

    axios
      .get(url, {
        params: { usuario_id: id }
      })
      .then(res => {
        this.setState({ nPrestamos: res.data.length });
      });
  }

  render() {
    const { classes, className, ...rest } = this.props;
    const tipo = localStorage.getItem('tipo_usuario');
    const rootClassName = classNames(classes.root, className);

    return (
      <Paper {...rest} className={rootClassName}>
        <div className={classes.content}>
          <div className={classes.details}>
            <Typography className={classes.title} variant='body2'>
              {tipo == 'Administrador' ? 'TOTAL PRESTAMOS' : 'PRESTAMOS'}
            </Typography>
            <Typography className={classes.value} variant='h3'>
              {this.state.nPrestamos ? this.state.nPrestamos : 0}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <PeopleIcon className={classes.icon} />
          </div>
        </div>
        {/* <div className={classes.footer}>
          <Typography
            className={classes.difference}
            variant="body2"
          >
            <ArrowUpwardIcon />
            16%
          </Typography>
          <Typography
            className={classes.caption}
            variant="caption"
          >
            Since last month
          </Typography>
        </div> */}
      </Paper>
    );
  }
}

Users.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Users);
