import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  IconButton,
  CircularProgress,
  Grid,
  Typography
} from '@material-ui/core';

// Material icons
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Shared services
import { getProducts } from 'services/product';

// Custom components
import { ProductsToolbar, ProductCard, ProductCardLibro } from './components';

// Component styles
import styles from './styles';

// Axios
import axios from 'axios';

class ProductList extends Component {
  signal = true;

  state = {
    isLoading: false,
    limit: 6,
    products: [],
    productsTotal: 0,
    error: null,
    search: false,
    searchString: ''
  };

  async getProducts(limit) {
    try {
      this.setState({ isLoading: true });

      const { products, productsTotal } = await getProducts(limit);

      if (this.signal) {
        this.setState({
          isLoading: false,
          products,
          productsTotal,
          limit
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
  }

  getLibros() {
    axios.get(`https://cerinfo-api.herokuapp.com/libros`).then(res => {
      const libros = res.data;
      this.setState({ libros });
    });
  }

  loadingAction = bool => {
    this.setState({ isLoading: bool });
  };

  componentWillMount() {
    this.signal = true;

    //const { limit } = this.state;

    //this.getProducts(limit);
    this.getLibros();
  }

  componentWillUnmount() {
    this.signal = false;
  }

  searchFunc = string => {
    if (string.target.value == '') {
      this.setState({ search: false });
    } else {
      this.setState({ search: true, searchString: string.target.value });
    }
  };

  renderProducts() {
    const { classes } = this.props;
    const { isLoading, products, libros } = this.state;

    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (libros.length === 0) {
      return (
        <Typography variant='h6'>There are no products available</Typography>
      );
    }

    return (
      <Grid container spacing={3}>
        {this.state.search == false
          ? libros.map(libro => (
              <Grid item key={libro.id} lg={4} md={6} xs={12}>
                <Link to='#'>
                  <ProductCardLibro loader={this.loadingAction} libro={libro} />
                </Link>
              </Grid>
            ))
          : libros
              .filter(libro =>
                libro.titulo_libro
                  .toLowerCase()
                  .includes(this.state.searchString.toLowerCase())
              )
              .map(libro => (
                <Grid item key={libro.id} lg={4} md={6} xs={12}>
                  <Link to='#'>
                    <ProductCardLibro
                      loader={this.loadingAction}
                      libro={libro}
                    />
                  </Link>
                </Grid>
              ))}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title='Libros'>
        <div className={classes.root}>
          <ProductsToolbar search={this.searchFunc} />
          <div className={classes.content}>
            {this.state.libros ? (
              this.renderProducts()
            ) : (
              <div className={classes.progressWrapper}>
                {' '}
                <CircularProgress />{' '}
              </div>
            )}
          </div>
          <div className={classes.pagination}>
            <Typography variant='caption'>1-6 of 20</Typography>
            <IconButton>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton>
              <ChevronRightIcon />
            </IconButton>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductList);
