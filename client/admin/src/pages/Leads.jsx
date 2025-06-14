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
  Divider,
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
  Typography,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  TextField 
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ContactMail as ContactIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Message as MessageIcon,
  LocationOn as LocationIcon,
  Apartment as ApartmentIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

const LeadsAdminPanel = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '' });
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    property: '',
    Area: '',
    source: 'Website'
  });
  const [properties, setProperties] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    fetchLeads();
    fetchProperties();
    fetchAreas();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/leads/', {
        params: {
          populate: 'property,Area'
        }
      });
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      handleApiError(error, 'fetching leads');
    }
    setLoading(false);
  };

  const fetchProperties = async () => {
    try {
      const response = await axiosInstance.get('/properties/');
      setProperties(response.data);
    } catch (error) {
      handleApiError(error, 'fetching properties');
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axiosInstance.get('/areas/');
      setAreas(response.data);
    } catch (error) {
      handleApiError(error, 'fetching areas');
    }
  };

  const deleteLead = async (id) => {
    try {
      await axiosInstance.delete(`/leads/${id}`);
      setLeads(prev => prev.filter(lead => lead._id !== id));
      setFilteredLeads(prev => prev.filter(lead => lead._id !== id));
      showSnackbar('Lead deleted successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'deleting lead');
    }
  };

  const createLead = async () => {
    try {
      const response = await axiosInstance.post('/leads', newLead);
      setLeads(prev => [...prev, response.data]);
      setFilteredLeads(prev => [...prev, response.data]);
      showSnackbar('Lead created successfully!', 'success');
      setAddDialogOpen(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        message: '',
        property: '',
        Area: '',
        source: 'Website'
      });
    } catch (error) {
      handleApiError(error, 'creating lead');
    }
  };

  const handleApiError = (error, action) => {
    console.error(`Error ${action}:`, error);
    const message = error.response?.status === 401 
      ? 'Session expired. Please login again.' 
      : `Error ${action}: ${error.response?.data?.message || error.message}`;
    showSnackbar(message, 'error');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setViewDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
    }
  };

  const handleFilterChange = (value) => {
    setFilters({ search: value });
    
    const filtered = leads.filter(lead => {
      const searchMatch = !value ||
        (lead.name && lead.name.toLowerCase().includes(value.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(value.toLowerCase())) ||
        (lead.phone && lead.phone.includes(value)) ||
        (lead.message && lead.message.toLowerCase().includes(value.toLowerCase())) ||
        (lead.property?.title && lead.property.title.toLowerCase().includes(value.toLowerCase())) ||
        (lead.Area?.name && lead.Area.name.toLowerCase().includes(value.toLowerCase()));
      return searchMatch;
    });
    
    setFilteredLeads(filtered);
    setPage(0);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const renderProperty = (obj, property) => {
    if (!obj || obj[property] === undefined || obj[property] === null) return 'N/A';
    if (typeof obj[property] === 'object') {
      if (obj[property] instanceof Date) return formatDate(obj[property]);
      if (property === 'property') return obj[property]?.title || 'N/A';
      if (property === 'Area') return obj[property]?.name || 'N/A';
      return obj[property].name || obj[property]._id || JSON.stringify(obj[property]);
    }
    return obj[property];
  };

  const handleNewLeadChange = (e) => {
    const { name, value } = e.target;
    setNewLead(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 0, width: '100vw', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#4caf50' }}>
              <ContactIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Leads Management
              </Typography>
              <Typography variant="subtitle1">
                View and manage property inquiries
              </Typography>
            </Box>
          </Box>
          <Fab color="secondary" onClick={() => setAddDialogOpen(true)}>
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
                  <Typography variant="h4">{leads.length}</Typography>
                  <Typography variant="body2">Total Leads</Typography>
                </Box>
                <ContactIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {new Set(leads.map(lead => lead.property?.title || 'No Property')).size}
                  </Typography>
                  <Typography variant="body2">Properties</Typography>
                </Box>
                <HomeIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ef6c00 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    {new Set(leads.map(lead => lead.Area?.name || 'No Area')).size}
                  </Typography>
                  <Typography variant="body2">Areas</Typography>
                </Box>
                <LocationIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">
                    {new Set(leads.map(lead => lead.email)).size}
                  </Typography>
                  <Typography variant="body2">Unique Emails</Typography>
                </Box>
                <EmailIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by name, email, phone, property or Area"
              value={filters.search}
              onChange={(e) => handleFilterChange(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Leads Table */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Contact</strong></TableCell>
                <TableCell><strong>Property</strong></TableCell>
                <TableCell><strong>Area</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.length > 0 ? (
                filteredLeads
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lead) => (
                    <TableRow key={lead._id} hover>
                      <TableCell>
                        <Typography fontWeight="bold">{renderProperty(lead, 'name')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{renderProperty(lead, 'email')}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{renderProperty(lead, 'phone')}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={lead.property?.description || 'No description available'}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ApartmentIcon fontSize="small" color="primary" />
                            {renderProperty(lead, 'property')}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={lead.Area?.description || 'No description available'}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon fontSize="small" color="primary" />
                            {renderProperty(lead, 'Area')}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={renderProperty(lead, 'message')}>
                          <IconButton size="small">
                            <MessageIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography>{formatDate(lead.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewLead(lead)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(lead._id)}
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No leads found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLeads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* View Lead Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 2000 }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Lead Details
          <IconButton onClick={() => setViewDialogOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedLead && (
            <Grid container spacing={2}>
              {/* Name */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {renderProperty(selectedLead, 'name')}
                </Typography>
                <Divider />
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2"><b>Contact Information</b></Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    {renderProperty(selectedLead, 'email')}
                  </Typography>
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    {renderProperty(selectedLead, 'phone')}
                  </Typography>
                </Box>
              </Grid>
              {/* Date */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2"><b>Date Received</b></Typography>
                <Typography sx={{ mt: 1 }}>{formatDate(selectedLead.createdAt)}</Typography>
              </Grid>
              {/* {Message} */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2"><b>Message</b></Typography>
                <Typography sx={{ mt: 1 }}>{selectedLead.message}</Typography>
              </Grid>

              {/* Property Info */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">Property Interest</Typography>
                <Paper elevation={0} sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ApartmentIcon color="primary" sx={{ mr: 1 }} />
                    {selectedLead.property?.title || 'N/A'}
                  </Typography>
                  <Typography variant="body2"><strong>Category:</strong> {selectedLead.property?.category || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {selectedLead.property?.type || 'N/A'}</Typography>
                  <Typography variant="body2">
                    <strong>Price:</strong> {selectedLead.property?.price?.amount
                      ? `${selectedLead.property.price.amount} ${selectedLead.property.price.currency || 'INR'}`
                      : 'N/A'}
                  </Typography>
                  {selectedLead.property?.highlights && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold">Highlights:</Typography>
                      <Typography variant="body2">• Bedrooms: {selectedLead.property.highlights.bedrooms || 'N/A'}</Typography>
                      <Typography variant="body2">• Bathrooms: {selectedLead.property.highlights.bathrooms || 'N/A'}</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Area Info */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">Area Info</Typography>
                <Paper elevation={0} sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Area Name:</strong> {selectedLead.Area?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Description:</strong> {selectedLead.Area?.description || 'N/A'}
                  </Typography>
                  
                  {selectedLead.Area?.subAreas?.length > 0 && (
                    <>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1, mb: 1 }}>
                        Sub Areas:
                      </Typography>
                      <Box sx={{ maxHeight: 200, overflow: 'auto', p: 1, backgroundColor: 'white', borderRadius: 1 }}>
                        {selectedLead.Area.subAreas.map((subArea, index) => (
                          <Box key={subArea._id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
                            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                              {subArea.name}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {subArea.description}
                            </Typography>
                            
                            {subArea.highlights && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" fontWeight="bold">Highlights:</Typography>
                                <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                                  {subArea.highlights.roads && (
                                    <li>
                                      <Typography variant="caption">
                                        <strong>Roads:</strong> {subArea.highlights.roads}
                                      </Typography>
                                    </li>
                                  )}
                                  {subArea.highlights.metroAccess && (
                                    <li>
                                      <Typography variant="caption">
                                        <strong>Metro Access:</strong> {subArea.highlights.metroAccess}
                                      </Typography>
                                    </li>
                                  )}
                                  {subArea.highlights.safetyRating && (
                                    <li>
                                      <Typography variant="caption">
                                        <strong>Safety Rating:</strong> {subArea.highlights.safetyRating}/10
                                      </Typography>
                                    </li>
                                  )}
                                  <li>
                                    <Typography variant="caption">
                                      <strong>Green Zones:</strong> {subArea.highlights.greenZones ? 'Yes' : 'No'}
                                    </Typography>
                                  </li>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Lead Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Add New Lead
          <IconButton onClick={() => setAddDialogOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newLead.name}
                onChange={handleNewLeadChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newLead.email}
                onChange={handleNewLeadChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={newLead.phone}
                onChange={handleNewLeadChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={newLead.message}
                onChange={handleNewLeadChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Property</InputLabel>
                <Select
                  name="property"
                  value={newLead.property}
                  onChange={handleNewLeadChange}
                  label="Property"
                >
                  <MenuItem value=""></MenuItem>
                  {properties.map(property => (
                    <MenuItem key={property._id} value={property._id}>
                      {property.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Area</InputLabel>
                <Select
                  name="Area"
                  value={newLead.Area}
                  onChange={handleNewLeadChange}
                  label="Area"
                >
                  <MenuItem value=""></MenuItem>
                  {areas.map(area => (
                    <MenuItem key={area._id} value={area._id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Source</InputLabel>
                <Select
                  name="source"
                  value={newLead.source}
                  onChange={handleNewLeadChange}
                  label="Source"
                >
                  <MenuItem value="Website">Website</MenuItem>
                  <MenuItem value="Phone Call">Phone Call</MenuItem>
                  <MenuItem value="Walk-in">Walk-in</MenuItem>
                  <MenuItem value="Referral">Referral</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={createLead} 
            variant="contained" 
            color="primary"
            disabled={!newLead.name || !newLead.email || !newLead.phone}
          >
            Create Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadsAdminPanel;