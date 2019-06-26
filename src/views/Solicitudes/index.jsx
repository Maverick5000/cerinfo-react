import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid, Typography } from '@material-ui/core';

import { Dashboard as DashboardLayout } from 'layouts';

import { SolicitudesToolbar } from './components';

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

class Solicitudes extends Component {
  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Solicitudes">
        <div className={classes.root}>
          <SolicitudesToolbar />
          <Grid
            container
            justify="center"
            spacing={4}
          >
            <Grid
              item
              lg={12}
              md={16}
              xl={13}
              xs={16}
            >
              <OrdersTable className={classes.item} />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Solicitudes.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Solicitudes);
