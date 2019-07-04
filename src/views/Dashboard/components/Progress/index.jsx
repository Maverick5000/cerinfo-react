import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography, LinearProgress } from '@material-ui/core';

// Material icons
import { InsertChartOutlined as InsertChartIcon } from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';

// Axios
import axios from 'axios';

class Progress extends Component {
  state = {
    nMonto: 0
  };

  componentDidMount() {
    const id = localStorage.getItem('id');
    //const id = '1'
    let total = 0;
    const tipo = localStorage.getItem('tipo_usuario');
    let url = '';
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/multas';
    } else {
      url = 'https://cerinfo-api.herokuapp.com/user/multas';
    }
    //const id = '1'
    axios
      .get(url, {
        params: { usuario_id: id }
      })
      .then(res => {
        let array = res.data;
        array.forEach(element => {
          total = total + element.monto_multa;
        });
        this.setState({ nMonto: parseFloat(total).toFixed(2) });
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
              {tipo == 'Administrador' ? 'TOTAL DEUDAS' : 'DEUDA'}
            </Typography>
            <Typography className={classes.value} variant='h4'>
              {this.state.nMonto ? this.state.nMonto : 0}Bs
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <InsertChartIcon className={classes.icon} />
          </div>
        </div>
        {/* <div className={classes.footer}>
          <LinearProgress
            value={75.5}
            variant="determinate"
          />
        </div> */}
      </Paper>
    );
  }
}

Progress.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Progress);
