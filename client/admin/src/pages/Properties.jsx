import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Fab,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Autocomplete,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  AspectRatio as AreaIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const PropertiesAdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    locality: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Residential',
    type: 'Rent',
    highlights: {
      locality: '',
      subLocality: '',
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      otherFeatures: []
    },
    price: {
      amount: 0,
      currency: 'INR'
    },
    images: []
  });

  const categories = ['Residential', 'Commercial', 'Industrial'];
  const types = ['Rent', 'Buy'];
  const features = ['Balcony', 'Modular Kitchen', 'Covered Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security', 'Elevator'];

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // API functions
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/properties/');
      const data = await response.json();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      showSnackbar('Error fetching properties', 'error');
    }
    setLoading(false);
  };

  const createProperty = async (propertyData) => {
    try {
      const response = await fetch('http://localhost:5000/api/properties/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      const newProperty = await response.json();
      
      setProperties(prev => [...prev, newProperty]);
      setFilteredProperties(prev => [...prev, newProperty]);
      showSnackbar('Property created successfully!', 'success');
    } catch (error) {
      showSnackbar('Error creating property', 'error');
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      const updatedProperty = await response.json();
      
      setProperties(prev => prev.map(p => p._id === id ? updatedProperty : p));
      setFilteredProperties(prev => prev.map(p => p._id === id ? updatedProperty : p));
      showSnackbar('Property updated successfully!', 'success');
    } catch (error) {
      showSnackbar('Error updating property', 'error');
    }
  };

  const deleteProperty = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/properties/${id}`, { method: 'DELETE' });
      setProperties(prev => prev.filter(p => p._id !== id));
      setFilteredProperties(prev => prev.filter(p => p._id !== id));
      showSnackbar('Property deleted successfully!', 'success');
    } catch (error) {
      showSnackbar('Error deleting property', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData(property);
    } else {
      setEditingProperty(null);
      setFormData({
        title: '',
        description: '',
        category: 'Residential',
        type: 'Rent',
        highlights: {
          locality: '',
          subLocality: '',
          bedrooms: 1,
          bathrooms: 1,
          area: '',
          otherFeatures: []
        },
        price: { amount: 0, currency: 'INR' },
        images: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProperty(null);
  };

  const handleSubmit = async () => {
    if (editingProperty) {
      await updateProperty(editingProperty._id, formData);
    } else {
      await createProperty(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    let filtered = properties;
    if (newFilters.category) {
      filtered = filtered.filter(p => p.category === newFilters.category);
    }
    if (newFilters.type) {
      filtered = filtered.filter(p => p.type === newFilters.type);
    }
    if (newFilters.locality) {
      filtered = filtered.filter(p => p.highlights.locality.toLowerCase().includes(newFilters.locality.toLowerCase()));
    }
    
    setFilteredProperties(filtered);
    setPage(0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: price.currency,
      maximumFractionDigits: 0
    }).format(price.amount);
  };

  return (
    <Box sx={{ p: 0,width: '100vw', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 0, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ p: 7,display: 'flex',alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#667eea' }}>
              <HomeIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Properties Management
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Manage your property listings with ease
              </Typography>
            </Box>
          </Box>
          <Fab 
            color="secondary" 
            onClick={() => handleOpenDialog()}
            sx={{ 
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={10} sx={{ mb: 3,justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{properties.length}</Typography>
                  <Typography variant="body2">Total Properties</Typography>
                </Box>
                <HomeIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{properties.filter(p => p.type === 'Rent').length}</Typography>
                  <Typography variant="body2">For Rent</Typography>
                </Box>
                <LocationIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{properties.filter(p => p.type === 'Buy').length}</Typography>
                  <Typography variant="body2">For Buy</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{new Set(properties.map(p => p.highlights.locality)).size}</Typography>
                  <Typography variant="body2">Locations</Typography>
                </Box>
                <FilterIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon /> Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {types.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Locality"
              value={filters.locality}
              onChange={(e) => handleFilterChange('locality', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Properties Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Specs</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProperties
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((property) => (
                  <TableRow key={property._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {property.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.description.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={property.category} 
                        color={property.category === 'Residential' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={property.type} 
                        color={property.type === 'Rent' ? 'success' : 'warning'}
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {property.highlights.locality}, {property.highlights.subLocality}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<BedIcon />} 
                          label={`${property.highlights.bedrooms} Bed`} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          icon={<BathtubIcon />} 
                          label={`${property.highlights.bathrooms} Bath`} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          icon={<AreaIcon />} 
                          label={property.highlights.area} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(property.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(property)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(property._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProperties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}  maxWidth="md" fullWidth sx={{ zIndex: 2000 }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          {editingProperty ? 'Edit Property' : 'Add New Property'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  {types.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Locality"
                value={formData.highlights.locality}
                onChange={(e) => setFormData({
                  ...formData, 
                  highlights: {...formData.highlights, locality: e.target.value}
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Sub Locality"
                value={formData.highlights.subLocality}
                onChange={(e) => setFormData({
                  ...formData, 
                  highlights: {...formData.highlights, subLocality: e.target.value}
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Bedrooms"
                value={formData.highlights.bedrooms}
                onChange={(e) => setFormData({
                  ...formData, 
                  highlights: {...formData.highlights, bedrooms: parseInt(e.target.value)}
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Bathrooms"
                value={formData.highlights.bathrooms}
                onChange={(e) => setFormData({
                  ...formData, 
                  highlights: {...formData.highlights, bathrooms: parseInt(e.target.value)}
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Area"
                value={formData.highlights.area}
                onChange={(e) => setFormData({
                  ...formData, 
                  highlights: {...formData.highlights, area: e.target.value}
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                type="number"
                label="Price Amount"
                value={formData.price.amount}
                onChange={(e) => setFormData({
                  ...formData, 
                  price: {...formData.price, amount: parseInt(e.target.value)}
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.price.currency}
                  label="Currency"
                  onChange={(e) => setFormData({
                    ...formData, 
                    price: {...formData.price, currency: e.target.value}
                  })}
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={features}
                value={formData.highlights.otherFeatures}
                onChange={(e, newValue) => setFormData({
                  ...formData, 
                  highlights: {...formData.highlights, otherFeatures: newValue}
                })}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Features"
                    placeholder="Select features"
                    margin="dense"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              '&:hover': { background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)' }
            }}
          >
            {editingProperty ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertiesAdminPanel;