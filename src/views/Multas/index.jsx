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
import Chart from 'react-apexcharts';
import { OrdersTable } from './components';
import Paper from '@material-ui/core/Paper';

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
    nMultas: null,
    options: {
      chart: {
        id: 'basic-bar'
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    series: [
      {
        name: 'Multas',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  };

  reloadMultas = () => {
    const id = localStorage.getItem('id');
    const tipo = localStorage.getItem('tipo_usuario');
    let url = '';
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/multas';
    } else {
      url = 'https://cerinfo-api.herokuapp.com/user/multas';
    }
    //const id = '1'

    axios.get(url, { params: { usuario_id: id } }).then(res => {
      this.setState({ nMultas: res.data });
      this.prepareData(res.data);
    });
  };

  prepareData = data => {
    let finalFechas = [];
    let finalMonto = [];
    let monto = 0;
    data.forEach(multa => {
      var myDate = new Date(multa.created_at);
      monto = monto + parseInt(multa.monto_multa);
      finalMonto.push(monto);
      finalFechas.push(myDate.getDate());
    });
    this.setState({
      options: {
        chart: {
          id: 'basic-bar'
        },
        xaxis: {
          categories: finalFechas
        },
        title: {
          text: 'Valor multas mensual',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        }
      },
      series: [
        {
          name: 'Bolivianos',
          data: finalMonto
        }
      ]
    });
  };

  componentDidMount() {
    this.reloadMultas();
  }

  render() {
    const { classes } = this.props;
    const tipo = localStorage.getItem('tipo_usuario');

    return (
      <DashboardLayout title='Multas'>
        <div className={classes.root}>
          <MultasToolbar reload={this.reloadMultas} />
          <Grid container justify='center' spacing={4}>
            <Grid item lg={12} md={16} xl={13} xs={16}>
              {this.state.nMultas ? (
                <OrdersTable
                  reload={this.reloadMultas}
                  multas={this.state.nMultas}
                  className={classes.item}
                />
              ) : null}
              {this.state.finalMonto != [] && tipo == 'Administrador' ? (
                <Paper style={{ marginTop: '5vh' }} className={classes.root}>
                  <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type='line'
                    width='100%'
                    height='350'
                  />
                </Paper>
              ) : null}
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
