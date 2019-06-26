import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid, Typography } from '@material-ui/core';

import { Dashboard as DashboardLayout } from 'layouts';

import { MultasToolbar } from './components';

import axios from 'axios';

import {
  OrdersTable
} from './components';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  content: {
    marginTop: '150px',
    textAlign: 'center'
  },
  image: {
    display: 'inline-block',
    marginTop: '50px',
    maxWidth: '100%',
    width: '554px'
  }
});

class Multas extends Component {

  state = {
    nMultas: null
  };

  reloadMultas = () => {
    const id = localStorage.getItem('id');
    const tipo = localStorage.getItem('tipo_usuario');
    let url = ''
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/multas'
    } else {
      url = 'https://cerinfo-api.herokuapp.com/user/multas'
    }
    //const id = '1'

    axios.get(url, { params: { usuario_id: id } })
      .then(res => {
        this.setState({ nMultas: res.data });
      })
  }

  componentDidMount() {
    this.reloadMultas()
  }

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Multas">
        <div className={classes.root}>
          <MultasToolbar reload={this.reloadMultas} />
          <Grid
            container
            justify="center"
            spacing={4}
          >
            <Grid
              item
              lg={10}
              md={14}
              xl={11}
              xs={14}
            >
              {this.state.nMultas ? <OrdersTable reload={this.reloadMultas} multas={this.state.nMultas} className={classes.item} /> : null}
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Multas.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Multas);
