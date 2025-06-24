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
  Grid,
  IconButton,
  Paper,
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
  Tooltip,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as ServiceIcon,
  AttachMoney as PriceIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteImageIcon
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import { format } from 'date-fns';

const ServicesAdminPanel = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [],
    price: '',
    image: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/services/');
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      handleApiError(error, 'fetching services');
    }
    setLoading(false);
  };

  const createService = async (serviceData) => {
    try {
      const formData = new FormData();
      formData.append('name', serviceData.name);
      formData.append('description', serviceData.description);
      formData.append('features', JSON.stringify(serviceData.features));
      formData.append('price', serviceData.price);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axiosInstance.post('/services/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      const newService = response.data;
      setServices(prev => [...prev, newService]);
      setFilteredServices(prev => [...prev, newService]);
      showSnackbar('Service created successfully!', 'success');
      return newService;
    } catch (error) {
      handleApiError(error, 'creating service');
      throw error;
    } finally {
      setUploadProgress(0);
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      const formData = new FormData();
      formData.append('name', serviceData.name);
      formData.append('description', serviceData.description);
      formData.append('features', JSON.stringify(serviceData.features));
      formData.append('price', serviceData.price);
      formData.append('removeImage', removeImage.toString());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axiosInstance.put(`/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      const updatedService = response.data;
      setServices(prev => prev.map(s => s._id === id ? updatedService : s));
      setFilteredServices(prev => prev.map(s => s._id === id ? updatedService : s));
      showSnackbar('Service updated successfully!', 'success');
      return updatedService;
    } catch (error) {
      handleApiError(error, 'updating service');
      throw error;
    } finally {
      setUploadProgress(0);
    }
  };

  const deleteService = async (id) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      setFilteredServices(prev => prev.filter(s => s._id !== id));
      showSnackbar('Service deleted successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'deleting service');
    }
  };

  const handleApiError = (error, action) => {
    console.error(`Error ${action}:`, error);
    if (error.response?.status === 401) {
      showSnackbar('Session expired. Please login again.', 'error');
    } else {
      showSnackbar(`Error ${action}: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (service = null, viewOnly = false) => {
    setViewMode(viewOnly);
    setImageFile(null);
    setImagePreview('');
    setRemoveImage(false);
    
    if (service) {
      setEditingService(service);
      setFormData({
        ...service,
        features: [...service.features]
      });
      if (service.image?.url) {
        setImagePreview(service.image.url);
      }
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        features: [],
        price: '',
        image: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    setViewMode(false);
    setImageFile(null);
    setImagePreview('');
    setRemoveImage(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setRemoveImage(false);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setRemoveImage(true);
  };

  const handleSubmit = async () => {
    try {
      const serviceData = {
        ...formData,
        price: Number(formData.price)
      };

      if (editingService) {
        await updateService(editingService._id, serviceData);
      } else {
        await createService(serviceData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await deleteService(id);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ p: 0, width: '100vw', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#4caf50' }}>
              <ServiceIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Services Management
              </Typography>
              <Typography variant="subtitle1">
                Manage your real estate services
              </Typography>
            </Box>
          </Box>
          <Fab 
            color="secondary" 
            onClick={() => handleOpenDialog()}
            sx={{ background: 'linear-gradient(45deg, #FF7043 30%, #FF5722 90%)' }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={10} sx={{ mb: 3, justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{services.length}</Typography>
                  <Typography variant="body2">Total Services</Typography>
                </Box>
                <ServiceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    {formatCurrency(services.reduce((sum, service) => sum + (service.price || 0), 0))}
                  </Typography>
                  <Typography variant="body2">Total Value</Typography>
                </Box>
                <PriceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    {services.filter(s => s.price < 1000).length}
                  </Typography>
                  <Typography variant="body2">Basic Services</Typography>
                </Box>
                <PriceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    {services.filter(s => s.price >= 1000).length}
                  </Typography>
                  <Typography variant="body2">Premium Services</Typography>
                </Box>
                <PriceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Services Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell><strong>Service Name</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Features</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((service) => (
                    <TableRow key={service._id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {service.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {service.image?.url ? (
                          <Box
                            component="img"
                            src={service.image.url}
                            alt={service.name}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                        ) : (
                          <ServiceIcon sx={{ fontSize: 40, color: 'action.disabled' }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {service.features.slice(0, 3).map((feature, i) => (
                            <Chip key={i} label={feature} size="small" />
                          ))}
                          {service.features.length > 3 && (
                            <Chip label={`+${service.features.length - 3}`} size="small" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {formatCurrency(service.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenDialog(service)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDelete(service._id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(service, true)}
                            >
                              <VisibilityIcon />
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
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Service Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', color: 'white' }}>
          {viewMode ? 'Service Details' : editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {viewMode ? (
            <Box>
              <Typography variant="h4" gutterBottom>{formData.name}</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label={formatCurrency(formData.price)} icon={<PriceIcon />} />
              </Box>
              
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {formData.description}
              </Typography>

              <Typography variant="h6" gutterBottom>Features</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.features.map((feature, i) => (
                  <Chip key={i} label={feature} color="primary" />
                ))}
              </Box>

              {formData.image?.url && (
                <>
                  <Typography variant="h6" gutterBottom>Service Image</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={formData.image.url} 
                      alt="Service" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px',
                        borderRadius: '8px'
                      }} 
                    />
                  </Box>
                </>
              )}
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  margin="dense"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  margin="dense"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price (INR)"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  margin="dense"
                  required
                  InputProps={{
                    startAdornment: '₹'
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Image</Typography>
                <Box sx={{ mb: 2 }}>
                  {imagePreview ? (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px',
                          borderRadius: '8px'
                        }} 
                      />
                      <IconButton
                        color="error"
                        onClick={handleRemoveImage}
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        <DeleteImageIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      sx={{ mr: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  )}
                </Box>
                {editingService?.image?.url && !imagePreview && !removeImage && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={removeImage}
                        onChange={(e) => setRemoveImage(e.target.checked)}
                      />
                    }
                    label="Remove current image"
                  />
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Features</Typography>
                {formData.features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      margin="dense"
                    />
                    <Button
                      color="error"
                      onClick={() => removeFeature(index)}
                      sx={{ minWidth: 'auto' }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                ))}
                <Button 
                  onClick={addFeature}
                  startIcon={<AddIcon />}
                  sx={{ mt: 1 }}
                >
                  Add Feature
                </Button>
              </Grid>
              
              {uploadProgress > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress variant="determinate" value={uploadProgress} />
                    <Typography>Uploading: {uploadProgress}%</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>
            {viewMode ? 'Close' : 'Cancel'}
          </Button>
          {!viewMode && (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #FF7043 30%, #FF5722 90%)',
                '&:hover': { background: 'linear-gradient(45deg, #FF7043 60%, #FF5722 100%)' }
              }}
              disabled={!formData.name || !formData.description || formData.price === '' || uploadProgress > 0}
            >
              {editingService ? 'Update' : 'Create'}
            </Button>
          )}
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

export default ServicesAdminPanel;