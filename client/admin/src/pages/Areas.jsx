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
    const formData = new FormData();
    
    // Append basic fields
    formData.append('name', areaData.name);
    formData.append('description', areaData.description);
    
    // Format highlights properly
    const highlights = {
      totalPopulation: Number(areaData.highlights.totalPopulation) || 0,
      averagePricePerSqft: Number(areaData.highlights.averagePricePerSqft) || 0,
      majorAttractions: Array.isArray(areaData.highlights.majorAttractions) 
        ? areaData.highlights.majorAttractions.filter(a => a && a.trim() !== '')
        : [],
      hasMetroConnectivity: Boolean(areaData.highlights.hasMetroConnectivity)
    };
    formData.append('highlights', JSON.stringify(highlights));
    
    // Format subAreas properly
    const subAreas = Array.isArray(areaData.subAreas) 
      ? areaData.subAreas.map(subArea => ({
          name: subArea.name || '',
          description: subArea.description || '',
          images: Array.isArray(subArea.images) ? subArea.images : [],
          highlights: {
            roads: subArea.highlights?.roads || '',
            metroAccess: subArea.highlights?.metroAccess || '',
            safetyRating: Number(subArea.highlights?.safetyRating) || 5,
            greenZones: Boolean(subArea.highlights?.greenZones)
          }
        }))
      : [];
    formData.append('subAreas', JSON.stringify(subAreas));

    // Handle images - separate new files from existing references
    areaData.images.forEach((img, index) => {
      if (img instanceof File) {
        formData.append('images', img, `image-${index}`);
      }
    });

    // Add debug output to see what's being sent
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axiosInstance.post('/areas/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const newArea = response.data;
    setAreas(prev => [...prev, newArea]);
    setFilteredAreas(prev => [...prev, newArea]);
    showSnackbar('Area created successfully!', 'success');
    return newArea;
  } catch (error) {
    console.error('Error creating area:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    let errorMessage = 'Error creating area';
    if (error.response?.data?.error) {
      errorMessage += `: ${error.response.data.error}`;
    } else if (error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`;
    } else {
      errorMessage += `: ${error.message}`;
    }
    
    showSnackbar(errorMessage, 'error');
    throw error; // Re-throw the error for handling in the calling function
  }
};

 const updateArea = async (id, areaData) => {
  try {
    const formData = new FormData();
    
    // Append basic fields
    formData.append('name', areaData.name);
    formData.append('description', areaData.description);
    
    // Properly format highlights object
    const highlights = {
      totalPopulation: Number(areaData.highlights.totalPopulation) || 0,
      averagePricePerSqft: Number(areaData.highlights.averagePricePerSqft) || 0,
      majorAttractions: Array.isArray(areaData.highlights.majorAttractions) 
        ? areaData.highlights.majorAttractions.filter(a => a && a.trim() !== '')
        : [],
      hasMetroConnectivity: Boolean(areaData.highlights.hasMetroConnectivity)
    };
    formData.append('highlights', JSON.stringify(highlights));
    
    // Properly format subAreas array
    const subAreas = Array.isArray(areaData.subAreas) 
      ? areaData.subAreas.map(subArea => ({
          name: subArea.name || '',
          description: subArea.description || '',
          images: Array.isArray(subArea.images) ? subArea.images : [],
          highlights: {
            roads: subArea.highlights?.roads || '',
            metroAccess: subArea.highlights?.metroAccess || '',
            safetyRating: Number(subArea.highlights?.safetyRating) || 5,
            greenZones: Boolean(subArea.highlights?.greenZones)
          }
        }))
      : [];
    formData.append('subAreas', JSON.stringify(subAreas));

    // Handle images - separate new files from existing references
    const newImages = [];
    const existingImages = [];
    
    areaData.images.forEach(img => {
      if (img instanceof File) {
        newImages.push(img);
      } else if (img && (img.url || img.public_id)) {
        existingImages.push({
          url: img.url,
          public_id: img.public_id
        });
      }
    });

    // Append new images
    newImages.forEach(img => {
      formData.append('images', img);
    });

    // Append existing images
    if (existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    const response = await axiosInstance.put(`/areas/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const updatedArea = response.data;
    setAreas(prev => prev.map(a => a._id === id ? updatedArea : a));
    setFilteredAreas(prev => prev.map(a => a._id === id ? updatedArea : a));
    showSnackbar('Area updated successfully!', 'success');
    return true;
  } catch (error) {
    console.error('Update area error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    let errorMessage = 'Error updating area';
    if (error.response?.data?.error) {
      errorMessage += `: ${error.response.data.error}`;
    } else if (error.response?.data?.message) {
      errorMessage += `: ${error.response.data.message}`;
    } else {
      errorMessage += `: ${error.message}`;
    }
    
    showSnackbar(errorMessage, 'error');
    return false;
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

  const deleteAreaImage = async (areaId, publicId) => {
     if (publicId.includes('/')) {
      publicId = publicId.split('/').pop();
    }
    try {
      await axiosInstance.delete(`/areas/${areaId}/images/${publicId}`);
      const updatedAreas = areas.map(area => {
        if (area._id === areaId) {
          return {
            ...area,
            images: area.images.filter(img => img.public_id !== publicId)
          };
        }
        return area;
      });
      setAreas(updatedAreas);
      setFilteredAreas(updatedAreas);
      
      // If we're editing this area, update the form data
      if (editingArea && editingArea._id === areaId) {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => img.public_id !== publicId)
        }));
      }
      
      showSnackbar('Image deleted successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'deleting image');
    }
  };

  const deleteSubAreaImage = async (areaId, subAreaIndex, publicId) => {
    try {
      await axiosInstance.delete(`/areas/${areaId}/subareas/${subAreaIndex}/images/${publicId}`);
      const updatedAreas = areas.map(area => {
        if (area._id === areaId) {
          const updatedSubAreas = area.subAreas.map((subArea, idx) => {
            if (idx === parseInt(subAreaIndex)) {
              return {
                ...subArea,
                images: subArea.images.filter(img => img.public_id !== publicId)
              };
            }
            return subArea;
          });
          return {
            ...area,
            subAreas: updatedSubAreas
          };
        }
        return area;
      });
      setAreas(updatedAreas);
      setFilteredAreas(updatedAreas);
      
      // If we're editing this area, update the form data
      if (editingArea && editingArea._id === areaId) {
        setFormData(prev => {
          const updatedSubAreas = [...prev.subAreas];
          updatedSubAreas[subAreaIndex] = {
            ...updatedSubAreas[subAreaIndex],
            images: updatedSubAreas[subAreaIndex].images.filter(img => img.public_id !== publicId)
          };
          return {
            ...prev,
            subAreas: updatedSubAreas
          };
        });
      }
      
      showSnackbar('Sub-area image deleted successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'deleting sub-area image');
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
        name: area.name || '',
        description: area.description || '',
        images: area.images || [],
        highlights: {
          totalPopulation: area.highlights?.totalPopulation || 0,
          averagePricePerSqft: area.highlights?.averagePricePerSqft || 0,
          majorAttractions: area.highlights?.majorAttractions || [],
          hasMetroConnectivity: area.highlights?.hasMetroConnectivity || false
        },
        subAreas: area.subAreas || []
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
    highlights: {
      ...formData.highlights,
      totalPopulation: Number(formData.highlights.totalPopulation) || 0,
      averagePricePerSqft: Number(formData.highlights.averagePricePerSqft) || 0,
      majorAttractions: Array.isArray(formData.highlights.majorAttractions) 
        ? formData.highlights.majorAttractions.filter(a => a && a.trim() !== '')
        : [],
      hasMetroConnectivity: Boolean(formData.highlights.hasMetroConnectivity)
    },
    subAreas: Array.isArray(formData.subAreas) ? formData.subAreas : []
  };

  try {
    if (editingArea) {
      await updateArea(editingArea._id, areaData);
    } else {
      await createArea(areaData);
    }
    handleCloseDialog();
  } catch (error) {
    console.error('Error submitting area:', error);
    // Error is already shown by createArea/updateArea
  }
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
      filtered = filtered.filter(a => a.highlights?.hasMetroConnectivity === (newFilters.hasMetro === 'yes'));
    }
    if (newFilters.minSafetyRating) {
      filtered = filtered.filter(a => 
        a.subAreas?.some(sa => sa.highlights?.safetyRating >= parseInt(newFilters.minSafetyRating))
      );
    }
    
    setFilteredAreas(filtered);
    setPage(0);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    const removedImage = newImages.splice(index, 1)[0];
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    
    // If this was a previously uploaded image (has public_id), delete it from server
    if (removedImage?.public_id && editingArea) {
      deleteAreaImage(editingArea._id, removedImage.public_id);
    }
  };

  const handleSubAreaImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSubAreaFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveSubAreaImage = (index) => {
    const newImages = [...subAreaFormData.images];
    const removedImage = newImages.splice(index, 1)[0];
    setSubAreaFormData(prev => ({
      ...prev,
      images: newImages
    }));
    
    // If this was a previously uploaded image (has public_id), delete it from server
    if (removedImage?.public_id && editingArea && currentSubArea) {
      const subAreaIndex = formData.subAreas.findIndex(sa => sa === currentSubArea);
      if (subAreaIndex !== -1) {
        deleteSubAreaImage(editingArea._id, subAreaIndex, removedImage.public_id);
      }
    }
  };

  const handleSubAreaSubmit = () => {
    try {
      if (currentSubArea) {
        // Editing existing sub-area
        const updatedSubAreas = formData.subAreas.map(sa => 
          sa === currentSubArea ? subAreaFormData : sa
        );
        setFormData(prev => ({
          ...prev,
          subAreas: updatedSubAreas
        }));
      } else {
        // Adding new sub-area
        setFormData(prev => ({
          ...prev,
          subAreas: [...prev.subAreas, subAreaFormData]
        }));
      }
      setSubAreaDialogOpen(false);
    } catch (error) {
      console.error('Error submitting sub-area:', error);
    }
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

  // const getImageUrl = (img) => {
  //   if (typeof img === 'string') return img;
  //   if (img.url) return img.url;
  //   if (img instanceof File) return URL.createObjectURL(img);
  //   return '';
  // };
//   const getImageUrl = (img) => {
//   if (!img) return img;
//   if (typeof img === 'string') return img;
//   if (img.url) return img.url;
//   if (img instanceof File) return URL.createObjectURL(img);
//   console.log(img.url);
//   if (img.public_id) {
//     // Handle Cloudinary or similar hosted images
//     return `https://res.cloudinary.com/dovkxkufe/image/upload/${img.public_id}`;
//   }
//   return '';
// };
const getImageUrl = (img) => {
  if (!img) return ''; // Return empty string instead of img
  if (typeof img === 'string') return img;
  if (img.url) return img.url;
  if (img instanceof File) return URL.createObjectURL(img);
  if (img.public_id) {
    // Handle Cloudinary or similar hosted images
    return `https://res.cloudinary.com/dovkxkufe/image/upload/${img.public_id}`;
  }
  return '';
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
                    {formatNumber(areas.reduce((sum, area) => sum + (area.highlights?.totalPopulation || 0), 0))}
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
                    ₹{formatNumber(Math.round(areas.reduce((sum, area) => sum + (area.highlights?.averagePricePerSqft || 0), 0) / (areas.length || 1)))}
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
                    {areas.filter(a => a.highlights?.hasMetroConnectivity).length}
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
                <TableCell><strong>Image</strong></TableCell>
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
                          {area.description?.substring(0, 50) || ''}...
                        </Typography>
                      </Box>
                    </TableCell>
                     <TableCell>
                      {area.images?.length > 0 ? (
                        <img 
                          src={getImageUrl(area.images[0])} 
                          alt={area.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ) : (
                        <Avatar sx={{ bgcolor: 'grey.300' }}>
                          <CityIcon />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {formatNumber(area.highlights?.totalPopulation || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        ₹{formatNumber(area.highlights?.averagePricePerSqft || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(area.highlights?.majorAttractions || []).slice(0, 2).map((att, i) => (
                          <Chip key={i} label={att} size="small" />
                        ))}
                        {(area.highlights?.majorAttractions || []).length > 2 && (
                          <Chip label={`+${(area.highlights?.majorAttractions || []).length - 2}`} size="small" />
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
                        label={area.highlights?.hasMetroConnectivity ? 'Yes' : 'No'} 
                        color={area.highlights?.hasMetroConnectivity ? 'success' : 'default'}
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
                        <img 
                          src={getImageUrl(img)} 
                          alt={`Area ${index}`} 
                          loading="lazy"
                        />
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
                              <span>{subArea.description?.substring(0, 30) || ''}{subArea.description?.length > 30 ? '...' : ''}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {subArea.images?.length > 0 ? (
                              <img 
                                src={getImageUrl(subArea.images[0])} 
                                alt={`Sub-area ${index}`} 
                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">No image</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {subArea.highlights?.safetyRating || 0}/10
                              <StarIcon color="warning" sx={{ ml: 0.5, fontSize: '1rem' }} />
                            </Box>
                          </TableCell>
                          <TableCell>
                            {subArea.highlights?.greenZones ? (
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
                        <img 
                          src={getImageUrl(img)} 
                          alt={`Preview ${index}`} 
                          loading="lazy"
                        />
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
                    highlights: {...formData.highlights, totalPopulation: parseInt(e.target.value) || 0}
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
                    highlights: {...formData.highlights, averagePricePerSqft: parseInt(e.target.value) || 0}
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
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={commonAttractions}
                  value={formData.highlights.majorAttractions || []}
                  onChange={(event, newValue) => {
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
                            <TableCell>Image</TableCell>
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
                                  <span>{subArea.description?.substring(0, 30) || ''}{subArea.description?.length > 30 ? '...' : ''}</span>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                {subArea.images?.length > 0 ? (
                                  <img 
                                    src={getImageUrl(subArea.images[0])} 
                                    alt={`Sub-area ${index}`} 
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                  />
                                ) : (
                                  <Typography variant="body2" color="text.secondary">No image</Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {subArea.highlights?.safetyRating || 0}/10
                                  <StarIcon color="warning" sx={{ ml: 0.5, fontSize: '1rem' }} />
                                </Box>
                              </TableCell>
                              <TableCell>
                                {subArea.highlights?.greenZones ? (
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
                                    setSubAreaFormData({
                                      name: subArea.name || '',
                                      description: subArea.description || '',
                                      images: subArea.images || [],
                                      highlights: {
                                        roads: subArea.highlights?.roads || '',
                                        metroAccess: subArea.highlights?.metroAccess || '',
                                        safetyRating: subArea.highlights?.safetyRating || 5,
                                        greenZones: subArea.highlights?.greenZones || false
                                      }
                                    });
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
                onChange={handleSubAreaImageUpload}
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
                      <img 
                        src={getImageUrl(img)} 
                        alt={`Sub-area preview ${index}`} 
                        loading="lazy"
                      />
                      <ImageListItemBar
                        actionIcon={
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveSubAreaImage(index)}
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