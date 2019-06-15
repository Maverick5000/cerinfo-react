import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

import Paper from '@material-ui/core/Paper';

// Custom components
import {
  Budget,
  Users,
  Progress,
  Profit,
  SalesChart,
  DevicesChart,
  ProductList,
  OrdersTable
} from './components';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  item: {
    height: '100%'
  }
});

class Dashboard extends Component {
  render() {
    const { classes } = this.props;
    const auth = localStorage.getItem('isAuthenticated');

    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            {auth == 'true' ? <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget className={classes.item} />
            </Grid> : null }
            {auth == 'true' ? <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Users className={classes.item} />
            </Grid> : null }
            {auth == 'true' ? <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Progress className={classes.item} />
            </Grid> : null }
            {/* <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Profit className={classes.item} />
            </Grid> */}
            {/* <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <SalesChart className={classes.item} />
            </Grid> */}
            {/* <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <DevicesChart className={classes.item} />
            </Grid> */}
            {/* <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <ProductList className={classes.item} />
            </Grid> */}
            {/* <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <OrdersTable className={classes.item} />
            </Grid> */}
            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <div style={{display: 'inline-block', position: 'relative'}}>
                <div> 
                <h1 className='MuiTypography-root MuiTypography-h3 Users-value-284' style={{top: '40%', left: '35%', position: 'absolute', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: "1em", borderRadius: '5px'}}>BIENVENIDO A CERINFO</h1>
                </div>
                <img style={{width: '70vw', height: '50vh'}} src="https://www.texasmonthly.com/wp-content/uploads/2018/01/whatley-2-2000x0-c-default.jpg"/>
              </div>
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
