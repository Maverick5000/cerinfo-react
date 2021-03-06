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
  ArrowDownward as ArrowDownwardIcon,
  Money as MoneyIcon
} from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';

// Axios
import axios from 'axios';

class Budget extends Component {
  state = {
    nMultas: 0
  };

  componentDidMount() {
    const id = localStorage.getItem('id');
    //const id = '1'

    const tipo = localStorage.getItem('tipo_usuario');
    let url = '';
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/multas';
    } else {
      url = 'https://cerinfo-api.herokuapp.com/user/multas';
    }
    //const id = '1'

    axios.get(url, { params: { usuario_id: id } }).then(res => {
      this.setState({ nMultas: res.data.length });
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
              {tipo == 'Administrador' ? 'TOTAL MULTAS' : 'MULTAS'}
            </Typography>
            <Typography className={classes.value} variant='h3'>
              {this.state.nMultas ? this.state.nMultas : 0}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <MoneyIcon className={classes.icon} />
          </div>
        </div>
        {/* <div className={classes.footer}>
          <Typography
            className={classes.difference}
            variant="body2"
          >
            <ArrowDownwardIcon />
            12%
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

Budget.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Budget);
