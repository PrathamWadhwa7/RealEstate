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
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
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
  Tooltip,
  Autocomplete,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationCity as CityIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

// Common attractions for suggestions
const commonAttractions = [
  'Shopping Mall',
  'Park',
  'Museum',
  'Theater',
  'Restaurant Area',
  'Historic Site',
  'Sports Complex',
  'Lake',
  'Convention Center',
  'Zoo'
];

const AreasAdminPanel = () => {
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    hasMetro: '',
    minSafetyRating: ''
  });
  const [subAreaDialogOpen, setSubAreaDialogOpen] = useState(false);
  const [currentSubArea, setCurrentSubArea] = useState(null);
  const [imageUploads, setImageUploads] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [],
    highlights: {
      totalPopulation: 0,
      averagePricePerSqft: 0,
      majorAttractions: [],
      hasMetroConnectivity: false
    },
    subAreas: []
  });

  const [subAreaFormData, setSubAreaFormData] = useState({
    name: '',
    description: '',
    images: [],
    highlights: {
      roads: '',
      metroAccess: '',
      safetyRating: 5,
      greenZones: false
    }
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/areas/');
      setAreas(response.data);
      setFilteredAreas(response.data);
    } catch (error) {
      handleApiError(error, 'fetching areas');
    }
    setLoading(false);
  };

  const createArea = async (areaData) => {
    try {
      const response = await axiosInstance.post('/areas/', areaData);
      const newArea = response.data;
      setAreas(prev => [...prev, newArea]);
      setFilteredAreas(prev => [...prev, newArea]);
      showSnackbar('Area created successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'creating area');
    }
  };

  const updateArea = async (id, areaData) => {
    try {
      const response = await axiosInstance.put(`/areas/${id}`, areaData);
      const updatedArea = response.data;
      setAreas(prev => prev.map(a => a._id === id ? updatedArea : a));
      setFilteredAreas(prev => prev.map(a => a._id === id ? updatedArea : a));
      showSnackbar('Area updated successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'updating area');
    }
  };

  const deleteArea = async (id) => {
    try {
      await axiosInstance.delete(`/areas/${id}`);
      setAreas(prev => prev.filter(a => a._id !== id));
      setFilteredAreas(prev => prev.filter(a => a._id !== id));
      showSnackbar('Area deleted successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'deleting area');
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

  const handleOpenDialog = (area = null, viewOnly = false) => {
    setViewMode(viewOnly);
    if (area) {
      setEditingArea(area);
      setFormData({
        ...JSON.parse(JSON.stringify(area)),
        highlights: {
          ...area.highlights,
          majorAttractions: area.highlights.majorAttractions || []
        }
      });
    } else {
      setEditingArea(null);
      setFormData({
        name: '',
        description: '',
        images: [],
        highlights: {
          totalPopulation: 0,
          averagePricePerSqft: 0,
          majorAttractions: [],
          hasMetroConnectivity: false
        },
        subAreas: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingArea(null);
    setViewMode(false);
  };

  const handleSubmit = async () => {
    const areaData = {
      ...formData,
      subAreas: formData.subAreas || [],
      highlights: {
        ...formData.highlights,
        majorAttractions: formData.highlights.majorAttractions || []
      }
    };

    if (editingArea) {
      await updateArea(editingArea._id, areaData);
    } else {
      await createArea(areaData);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this area?')) {
      await deleteArea(id);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    let filtered = areas;
    if (newFilters.hasMetro !== '') {
      filtered = filtered.filter(a => a.highlights.hasMetroConnectivity === (newFilters.hasMetro === 'yes'));
    }
    if (newFilters.minSafetyRating) {
      filtered = filtered.filter(a => 
        a.subAreas.some(sa => sa.highlights.safetyRating >= parseInt(newFilters.minSafetyRating))
      );
    }
    
    setFilteredAreas(filtered);
    setPage(0);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubAreaSubmit = () => {
    if (currentSubArea) {
      const updatedSubAreas = formData.subAreas.map(sa => 
        sa === currentSubArea ? subAreaFormData : sa
      );
      setFormData({
        ...formData,
        subAreas: updatedSubAreas
      });
    } else {
      setFormData({
        ...formData,
        subAreas: [...formData.subAreas, subAreaFormData]
      });
    }
    setSubAreaDialogOpen(false);
  };

  const handleDeleteSubArea = (index) => {
    if (window.confirm('Are you sure you want to delete this sub-area?')) {
      const updatedSubAreas = formData.subAreas.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        subAreas: updatedSubAreas
      });
      showSnackbar('Sub-area deleted successfully!', 'success');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Box sx={{ p: 0, width: '100vw', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#3f51b5' }}>
              <CityIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Areas Management
              </Typography>
              <Typography variant="subtitle1">
                Manage metropolitan regions and sub-areas
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
          <Card sx={{ background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{areas.length}</Typography>
                  <Typography variant="body2">Total Areas</Typography>
                </Box>
                <CityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #673ab7 0%, #512da8 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    {formatNumber(areas.reduce((sum, area) => sum + area.highlights.totalPopulation, 0))}
                  </Typography>
                  <Typography variant="body2">Total Population</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #009688 0%, #00796b 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    ₹{formatNumber(Math.round(areas.reduce((sum, area) => sum + area.highlights.averagePricePerSqft, 0) / (areas.length || 1)))}
                  </Typography>
                  <Typography variant="body2">Avg Price/sqft</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {areas.filter(a => a.highlights.hasMetroConnectivity).length}
                  </Typography>
                  <Typography variant="body2">With Metro</Typography>
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Metro Connectivity</InputLabel>
              <Select
                value={filters.hasMetro}
                label="Metro Connectivity"
                onChange={(e) => handleFilterChange('hasMetro', e.target.value)}
              >
                <MenuItem value="">All Areas</MenuItem>
                <MenuItem value="yes">With Metro</MenuItem>
                <MenuItem value="no">Without Metro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Min Safety Rating"
              value={filters.minSafetyRating}
              onChange={(e) => handleFilterChange('minSafetyRating', e.target.value)}
              inputProps={{ min: 1, max: 10 }}
              sx={{
                minWidth: 200,
                '& .MuiInputBase-input': {
                  paddingRight: '14px !important',
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Areas Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell><strong>Area</strong></TableCell>
                <TableCell><strong>Population</strong></TableCell>
                <TableCell><strong>Avg Price/sqft</strong></TableCell>
                <TableCell><strong>Attractions</strong></TableCell>
                <TableCell><strong>Sub-Areas</strong></TableCell>
                <TableCell><strong>Metro</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAreas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((area) => (
                  <TableRow key={area._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {area.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {area.description.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {formatNumber(area.highlights.totalPopulation)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        ₹{formatNumber(area.highlights.averagePricePerSqft)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(area.highlights.majorAttractions || []).slice(0, 2).map((att, i) => (
                          <Chip key={i} label={att} size="small" />
                        ))}
                        {(area.highlights.majorAttractions || []).length > 2 && (
                          <Chip label={`+${(area.highlights.majorAttractions || []).length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {area.subAreas?.length || 0} sub-areas
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={area.highlights.hasMetroConnectivity ? 'Yes' : 'No'} 
                        color={area.highlights.hasMetroConnectivity ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(area)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(area._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(area, true)}
                          >
                            <VisibilityIcon />
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
          count={filteredAreas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Main Area Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)', color: 'white' }}>
          {viewMode ? 'Area Details' : editingArea ? 'Edit Area' : 'Add New Area'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {viewMode ? (
            <Box>
              <Typography variant="h5" gutterBottom>{formData.name}</Typography>
              <Typography variant="body1" paragraph>{formData.description}</Typography>
              
              <Typography variant="h6" gutterBottom>Highlights</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Population:</strong> {formatNumber(formData.highlights.totalPopulation)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Avg Price/sqft:</strong> ₹{formatNumber(formData.highlights.averagePricePerSqft)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Metro Connectivity:</strong> {formData.highlights.hasMetroConnectivity ? 'Yes' : 'No'}</Typography>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Major Attractions</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(formData.highlights.majorAttractions || []).length > 0 ? (
                    (formData.highlights.majorAttractions || []).map((attraction, index) => (
                      <Chip key={index} label={attraction} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No major attractions listed
                    </Typography>
                  )}
                </Box>
              </Grid>

              {formData.images.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Images</Typography>
                  <ImageList cols={3} rowHeight={164}>
                    {formData.images.map((img, index) => (
                      <ImageListItem key={index}>
                        <img src={img} alt={`Area ${index}`} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Sub-Areas</Typography>
              {formData.subAreas?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Safety</TableCell>
                        <TableCell>Green Zones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.subAreas.map((subArea, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{subArea.name}</TableCell>
                          <TableCell>
                            <Tooltip title={subArea.description}>
                              <span>{subArea.description.substring(0, 30)}{subArea.description.length > 30 ? '...' : ''}</span>
                            </Tooltip>
                          </TableCell>
                           <TableCell>
              {subArea.images?.length > 0 ? (
                <img 
                  src={subArea.images[0]} 
                  alt={`Sub-area ${index}`} 
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">No image</Typography>
              )}
            </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {subArea.highlights.safetyRating}/10
                              <StarIcon color="warning" sx={{ ml: 0.5, fontSize: '1rem' }} />
                            </Box>
                          </TableCell>
                          <TableCell>
                            {subArea.highlights.greenZones ? (
                              <Chip label="Yes" color="success" size="small" />
                            ) : (
                              <Chip label="No" color="default" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No sub-areas</Typography>
              )}
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Images</Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="area-images-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
                <label htmlFor="area-images-upload">
                  <Button variant="contained" component="span" startIcon={<AddIcon />}>
                    Upload Images
                  </Button>
                </label>
                
                {formData.images.length > 0 && (
                  <ImageList cols={3} rowHeight={164} sx={{ mt: 2 }}>
                    {formData.images.map((img, index) => (
                      <ImageListItem key={index}>
                        <img src={img} alt={`Preview ${index}`} />
                        <ImageListItemBar
                          actionIcon={
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Area Name"
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
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Population"
                  value={formData.highlights.totalPopulation}
                  onChange={(e) => setFormData({
                    ...formData, 
                    highlights: {...formData.highlights, totalPopulation: parseInt(e.target.value)}
                  })}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Average Price/sqft (₹)"
                  value={formData.highlights.averagePricePerSqft}
                  onChange={(e) => setFormData({
                    ...formData, 
                    highlights: {...formData.highlights, averagePricePerSqft: parseInt(e.target.value)}
                  })}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.highlights.hasMetroConnectivity}
                      onChange={(e) => setFormData({
                        ...formData,
                        highlights: {...formData.highlights, hasMetroConnectivity: e.target.checked}
                      })}
                    />
                  }
                  label="Has Metro Connectivity"
                />
              </Grid>
              <Grid item xs={12} sx={{width: 200}}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={commonAttractions}
                  value={formData.highlights.majorAttractions || []}
                  onChange={(event, newValue) => {
                    // Filter out empty strings
                    const filteredValue = newValue.filter(item => item.trim() !== '');
                    setFormData({
                      ...formData, 
                      highlights: {
                        ...formData.highlights, 
                        majorAttractions: filteredValue
                      }
                    });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip 
                        key={index} 
                        variant="outlined" 
                        label={option} 
                        {...getTagProps({ index })} 
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Major Attractions"
                      placeholder="Add attractions"
                      margin="dense"
                    />
                  )}
                />
              </Grid>
              
              {/* Sub-Area Management Section */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">Sub-Areas</Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setCurrentSubArea(null);
                      setSubAreaFormData({
                        name: '',
                        description: '',
                        images: [],
                        highlights: {
                          roads: '',
                          metroAccess: '',
                          safetyRating: 5,
                          greenZones: false
                        }
                      });
                      setSubAreaDialogOpen(true);
                    }}
                  >
                    Add Sub-Area
                  </Button>
                </Box>
                <Divider />
                
                <Box sx={{ mt: 2 }}>
                  {formData.subAreas?.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Safety</TableCell>
                            <TableCell>Green Zones</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.subAreas.map((subArea, index) => (
                            <TableRow key={index} hover>
                              <TableCell>{subArea.name}</TableCell>
                              <TableCell>
                                <Tooltip title={subArea.description}>
                                  <span>{subArea.description.substring(0, 30)}{subArea.description.length > 30 ? '...' : ''}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {subArea.highlights.safetyRating}/10
                                  <StarIcon color="warning" sx={{ ml: 0.5, fontSize: '1rem' }} />
                                </Box>
                              </TableCell>
                              <TableCell>
                                {subArea.highlights.greenZones ? (
                                  <Chip label="Yes" color="success" size="small" />
                                ) : (
                                  <Chip label="No" color="default" size="small" />
                                )}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setCurrentSubArea(subArea);
                                    setSubAreaFormData(JSON.parse(JSON.stringify(subArea)));
                                    setSubAreaDialogOpen(true);
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteSubArea(index)}
                                  sx={{ ml: 1 }}
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      No sub-areas added yet
                    </Typography>
                  )}
                </Box>
              </Grid>
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
              disabled={!formData.name || !formData.description}
            >
              {editingArea ? 'Update' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Sub-Area Dialog */}
      <Dialog open={subAreaDialogOpen} onClose={() => setSubAreaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentSubArea ? 'Edit Sub-Area' : 'Add New Sub-Area'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Images</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="subarea-images-upload"
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const newImages = files.map(file => URL.createObjectURL(file));
                  setSubAreaFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages]
                  }));
                }}
              />
              <label htmlFor="subarea-images-upload">
                <Button variant="contained" component="span" startIcon={<AddIcon />}>
                  Upload Images
                </Button>
              </label>
              
              {subAreaFormData.images?.length > 0 && (
                <ImageList cols={3} rowHeight={164} sx={{ mt: 2 }}>
                  {subAreaFormData.images.map((img, index) => (
                    <ImageListItem key={index}>
                      <img src={img} alt={`Sub-area preview ${index}`} />
                      <ImageListItemBar
                        actionIcon={
                          <IconButton
                            color="error"
                            onClick={() => {
                              const newImages = [...subAreaFormData.images];
                              newImages.splice(index, 1);
                              setSubAreaFormData(prev => ({
                                ...prev,
                                images: newImages
                              }));
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sub-Area Name"
                value={subAreaFormData.name}
                onChange={(e) => setSubAreaFormData({
                  ...subAreaFormData,
                  name: e.target.value
                })}
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
                value={subAreaFormData.description}
                onChange={(e) => setSubAreaFormData({
                  ...subAreaFormData,
                  description: e.target.value
                })}
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Road Infrastructure"
                value={subAreaFormData.highlights.roads}
                onChange={(e) => setSubAreaFormData({
                  ...subAreaFormData,
                  highlights: {
                    ...subAreaFormData.highlights,
                    roads: e.target.value
                  }
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Metro Access"
                value={subAreaFormData.highlights.metroAccess}
                onChange={(e) => setSubAreaFormData({
                  ...subAreaFormData,
                  highlights: {
                    ...subAreaFormData.highlights,
                    metroAccess: e.target.value
                  }
                })}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Safety Rating (1-10)"
                value={subAreaFormData.highlights.safetyRating}
                onChange={(e) => {
                  const rating = parseInt(e.target.value);
                  setSubAreaFormData({
                    ...subAreaFormData,
                    highlights: {
                      ...subAreaFormData.highlights,
                      safetyRating: isNaN(rating) ? 1 : Math.min(10, Math.max(1, rating))
                    }
                  });
                }}
                inputProps={{ min: 1, max: 10 }}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={subAreaFormData.highlights.greenZones}
                    onChange={(e) => setSubAreaFormData({
                      ...subAreaFormData,
                      highlights: {
                        ...subAreaFormData.highlights,
                        greenZones: e.target.checked
                      }
                    })}
                  />
                }
                label="Has Green Zones"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubAreaDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubAreaSubmit}
            variant="contained"
            color="primary"
            disabled={!subAreaFormData.name || !subAreaFormData.description}
          >
            {currentSubArea ? 'Update' : 'Add'}
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

export default AreasAdminPanel;