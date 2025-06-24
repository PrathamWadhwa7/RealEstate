import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
  FilterList as FilterIcon,
  CloudUpload as CloudUploadIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

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

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/properties');
      const validatedData = response.data.map(item => ({
        _id: item._id || Math.random().toString(36).substr(2, 9),
        title: item.title || 'Untitled Property',
        description: item.description || '',
        category: item.category || 'Residential',
        type: item.type || 'Rent',
        highlights: {
          locality: item.highlights?.locality || '',
          subLocality: item.highlights?.subLocality || '',
          bedrooms: item.highlights?.bedrooms || 0,
          bathrooms: item.highlights?.bathrooms || 0,
          area: item.highlights?.area || '',
          otherFeatures: item.highlights?.otherFeatures || []
        },
        price: item.price || { amount: 0, currency: 'INR' },
        images: item.images || [],
        createdAt: item.createdAt || new Date().toISOString()
      }));
      setProperties(validatedData);
      setFilteredProperties(validatedData);
    } catch (error) {
      console.error('Fetch error:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // const handleImageUpload = async (e, propertyId = null) => {
  //   const files = e.target.files;
  //   if (!files || files.length === 0) return;

  //   setUploadingImages(true);
    
  //   try {
  //     const uploadData = new FormData();
  //     Array.from(files).forEach(file => {
  //       uploadData.append('images', file);
  //     });

  //     if (propertyId) {
  //       // Update existing property
  //       const response = await axiosInstance.put(
  //         `/properties/${propertyId}`,
  //         uploadData,
  //         {
  //           headers: {
  //             'Content-Type': 'multipart/form-data'
  //           }
  //         }
  //       );
        
  //       setFormData(prev => ({
  //         ...prev,
  //         images: response.data.images
  //       }));
        
  //       showSnackbar('Images updated successfully!', 'success');
  //     } else {
  //       // Upload images for new property
  //       const uploadResponse = await axiosInstance.post(
  //         '/properties/upload',
  //         uploadData,
  //         {
  //           headers: {
  //             'Content-Type': 'multipart/form-data'
  //           }
  //         }
  //       );
        
  //       setFormData(prev => ({
  //         ...prev,
  //         images: uploadResponse.data.images
  //       }));
        
  //       showSnackbar('Images uploaded successfully!', 'success');
  //     }
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     showSnackbar(
  //       error.response?.data?.message || 
  //       'Failed to upload images', 
  //       'error'
  //     );
  //   } finally {
  //     setUploadingImages(false);
  //   }
  // };
  const handleImageUpload = async (e, propertyId = null) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // Check if adding new images would exceed the limit
  const currentImageCount = formData.images?.length || 0;
  const newImageCount = files.length;
  const totalImages = currentImageCount + newImageCount;

  if (totalImages > 10) {
    showSnackbar(`Cannot upload ${newImageCount} images. Maximum 10 images allowed. You currently have ${currentImageCount} images.`, 'error');
    return;
  }

  setUploadingImages(true);
  
  try {
    const uploadData = new FormData();
    Array.from(files).forEach(file => {
      uploadData.append('images', file);
    });

    if (propertyId) {
      // For existing property, first upload images to get URLs
      const uploadResponse = await axiosInstance.post(
        '/properties/upload', // Use the general upload endpoint first
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Then update the property with merged images
      const mergedImages = [...(formData.images || []), ...uploadResponse.data.images];
      
      const updateResponse = await axiosInstance.put(
        `/properties/${propertyId}`,
        {
          ...formData,
          images: mergedImages
        }
      );
      
      setFormData(prev => ({
        ...prev,
        images: mergedImages
      }));
      
      // Update the properties list
      setProperties(prev => prev.map(prop => 
        prop._id === propertyId 
          ? { ...prop, images: mergedImages }
          : prop
      ));
      
      setFilteredProperties(prev => prev.map(prop => 
        prop._id === propertyId 
          ? { ...prop, images: mergedImages }
          : prop
      ));
      
      showSnackbar(`${files.length} image(s) uploaded successfully!`, 'success');
    } else {
      // Upload images for new property
      const uploadResponse = await axiosInstance.post(
        '/properties/upload',
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // For new properties, merge with existing images in form
      const updatedImages = [...(formData.images || []), ...uploadResponse.data.images];
      
      setFormData(prev => ({
        ...prev,
        images: updatedImages
      }));
      
      showSnackbar(`${files.length} image(s) uploaded successfully!`, 'success');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showSnackbar(
      error.response?.data?.message || 
      'Failed to upload images', 
      'error'
    );
  } finally {
    setUploadingImages(false);
    // Clear the input value to allow uploading the same files again
    e.target.value = '';
  }
};

  const handleDeleteImage = async (propertyId, fullPublicId) => {
    try {
      const imageId = fullPublicId.split('/').pop();
      await axiosInstance.delete(`/properties/${propertyId}/images/${imageId}`);
      
      // Update properties list
      const updatedProperties = properties.map(prop => {
        if (prop._id === propertyId) {
          return {
            ...prop,
            images: prop.images.filter(img => !img.public_id.endsWith(imageId))
          };
        }
        return prop;
      });
      
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      
      // Update form if editing this property
      if (editingProperty && editingProperty._id === propertyId) {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => !img.public_id.endsWith(imageId))
        }));
      }
      
      showSnackbar('Image deleted successfully!', 'success');
    } catch (error) {
      console.error('Image deletion error:', error);
      showSnackbar(
        error.response?.data?.message || 
        'Error deleting image', 
        'error'
      );
    }
  };
   const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
    }
  };
  const createProperty = async (propertyData) => {
    try {
      const response = await axiosInstance.post('/properties', propertyData);
      setProperties(prev => [...prev, response.data]);
      setFilteredProperties(prev => [...prev, response.data]);
      showSnackbar('Property created successfully!', 'success');
      return response.data;
    } catch (error) {
      console.error('Creation error:', error);
      showSnackbar(error.response?.data?.message || 'Error creating property', 'error');
      throw error;
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const response = await axiosInstance.put(`/properties/${id}`, propertyData);
      setProperties(prev => prev.map(p => p._id === id ? response.data : p));
      setFilteredProperties(prev => prev.map(p => p._id === id ? response.data : p));
      showSnackbar('Property updated successfully!', 'success');
    } catch (error) {
      console.error('Update error:', error);
      showSnackbar(error.response?.data?.message || 'Error updating property', 'error');
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axiosInstance.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
      setFilteredProperties(prev => prev.filter(p => p._id !== id));
      showSnackbar('Property deleted successfully!', 'success');
    } catch (error) {
      console.error('Deletion error:', error);
      showSnackbar(error.response?.data?.message || 'Error deleting property', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (property = null) => {
    setEditingProperty(property);
    setFormData(property
      ? { 
          ...property,
          highlights: {
            ...property.highlights,
            otherFeatures: property.highlights?.otherFeatures || []
          }
        }
      : {
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
        }
    );
    setImagePreviews(property?.images?.map(img => img.url) || []);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProperty(null);
    setImagePreviews([]);
  };

  const handleSubmit = async () => {
    try {
      if (editingProperty) {
        await updateProperty(editingProperty._id, formData);
      } else {
        // For new properties, make sure to include all required fields
        const propertyData = {
          ...formData,
          postedBy: "admin-user-id" // Replace with actual user ID from auth
        };
        await createProperty(propertyData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Submission error:', error);
      showSnackbar(
        error.response?.data?.message || 
        'Error submitting property', 
        'error'
      );
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
      filtered = filtered.filter(p => 
        p.highlights.locality.toLowerCase().includes(newFilters.locality.toLowerCase())
      );
    }
    
    setFilteredProperties(filtered);
    setPage(0);
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not set';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: price.currency || 'INR',
      maximumFractionDigits: 0
    }).format(price.amount || 0);
  };

  return (
    <Box sx={{ p: 0, width: '100vw', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 0, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      <Grid container spacing={3} sx={{ mb: 3, justifyContent: 'center' }}>
        {[
          { 
            value: properties.length, 
            label: 'Total Properties', 
            icon: <HomeIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          },
          { 
            value: properties.filter(p => p.type === 'Rent').length, 
            label: 'For Rent', 
            icon: <LocationIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          },
          { 
            value: properties.filter(p => p.type === 'Buy').length, 
            label: 'For Buy', 
            icon: <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          },
          { 
            value: new Set(properties.map(p => p.highlights.locality)).size, 
            label: 'Locations', 
            icon: <FilterIcon sx={{ fontSize: 40, opacity: 0.8 }} />,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
          }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: stat.gradient, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4">{stat.value}</Typography>
                    <Typography variant="body2">{stat.label}</Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon /> Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} sx={{width: 150}}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
                MenuProps={{ disableScrollLock: true }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} sx={{width: 150}}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
                MenuProps={{ disableScrollLock: true }}
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
                <TableCell><strong>Images</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Specs</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No properties found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((property) => (
                    <TableRow key={property._id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {property.title || 'Untitled Property'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {property.description ? `${property.description.substring(0, 50)}...` : 'No description'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {property.images.slice(0, 3).map((img, idx) => (
                            <Avatar 
                              key={idx} 
                              src={img.url} 
                              variant="rounded"
                              sx={{ width: 56, height: 56 }}
                            />
                          ))}
                          {property.images.length > 3 && (
                            <Avatar 
                              variant="rounded"
                              sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: 'white' }}
                            >
                              +{property.images.length - 3}
                            </Avatar>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={property.category || 'Uncategorized'} 
                          color={property.category === 'Residential' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={property.type || 'Unknown'} 
                          color={property.type === 'Rent' ? 'success' : 'warning'}
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {property.highlights?.locality || 'Location not specified'}
                            {property.highlights?.subLocality ? `, ${property.highlights.subLocality}` : ''}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            icon={<BedIcon />} 
                            label={`${property.highlights?.bedrooms || 0} Bed`} 
                            size="small" 
                            variant="outlined"
                          />
                          <Chip 
                            icon={<BathtubIcon />} 
                            label={`${property.highlights?.bathrooms || 0} Bath`} 
                            size="small" 
                            variant="outlined"
                          />
                          <Chip 
                            icon={<AreaIcon />} 
                            label={property.highlights?.area || 'N/A'} 
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
                  ))
              )}
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
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}  
        maxWidth="md" 
        fullWidth
        sx={{ 
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              zIndex: 1300
            }
          }
        }}
      >
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
                required
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
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  MenuProps={{ disableScrollLock: true }}
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
                required
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
                  highlights: {...formData.highlights, bedrooms: parseInt(e.target.value) || 0}
                })}
                margin="dense"
                required
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
                  highlights: {...formData.highlights, bathrooms: parseInt(e.target.value) || 0}
                })}
                margin="dense"
                required
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
                required
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
                  price: {...formData.price, amount: parseInt(e.target.value) || 0}
                })}
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={4} sx={{width: 200}}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.price.currency}
                  label="Currency"
                  onChange={(e) => setFormData({
                    ...formData, 
                    price: {...formData.price, currency: e.target.value}
                  })}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{width: 600}}>
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
                    <Chip 
                      key={option}
                      variant="outlined" 
                      label={option} 
                      {...getTagProps({ index })} 
                    />
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
            
            {/* Image Upload Section */}
            {editingProperty && (<Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
                Property Images
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {/* Image Previews */}
                {formData.images.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Avatar 
                      src={img.url} 
                      variant="rounded"
                      sx={{ width: 100, height: 100 }}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        right: 0,
                        backgroundColor: 'rgba(255,0,0,0.7)',
                        '&:hover': { backgroundColor: 'rgba(255,0,0,0.9)' }
                      }}
                      onClick={() => handleDeleteImage(formData._id, img.public_id)}
                    >
                      <DeleteForeverIcon sx={{ color: 'white', fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
                
                {/* Upload Button */}
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="property-images-upload"
                    type="file"
                    multiple
                    onChange={(e) => handleImageUpload(e, formData._id)}
                  />
                  <label htmlFor="property-images-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploadingImages}
                    >
                      {uploadingImages ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Upload up to 10 images (max 5MB each)
                  </Typography>
                </Box>
              </Box>
            </Grid>)}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.title || !formData.highlights.locality}
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertiesAdminPanel;