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
  DialogContentText,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as BlogIcon,
  Person as AuthorIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import { format, parseISO } from 'date-fns';

const BlogsAdminPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    author: '',
    dateRange: ''
  });
  const [imageUploads, setImageUploads] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    publishedAt: new Date().toISOString(),
    images: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/blogs/');
      setBlogs(response.data);
      setFilteredBlogs(response.data);
    } catch (error) {
      handleApiError(error, 'fetching blogs');
    }
    setLoading(false);
  };

  const createBlog = async (blogData) => {
    try {
      const response = await axiosInstance.post('/blogs/', blogData);
      const newBlog = response.data;
      setBlogs(prev => [...prev, newBlog]);
      setFilteredBlogs(prev => [...prev, newBlog]);
      showSnackbar('Blog created successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'creating blog');
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      const response = await axiosInstance.put(`/blogs/${id}`, blogData);
      const updatedBlog = response.data;
      setBlogs(prev => prev.map(b => b._id === id ? updatedBlog : b));
      setFilteredBlogs(prev => prev.map(b => b._id === id ? updatedBlog : b));
      showSnackbar('Blog updated successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'updating blog');
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
      setFilteredBlogs(prev => prev.filter(b => b._id !== id));
      showSnackbar('Blog deleted successfully!', 'success');
    } catch (error) {
      handleApiError(error, 'deleting blog');
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

  const handleOpenDialog = (blog = null, viewOnly = false) => {
    setViewMode(viewOnly);
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        ...blog,
        publishedAt: blog.publishedAt || new Date().toISOString()
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        author: '',
        publishedAt: new Date().toISOString(),
        images: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
    setViewMode(false);
  };

  const handleSubmit = async () => {
    const blogData = {
      ...formData,
      publishedAt: formData.publishedAt || new Date().toISOString()
    };

    if (editingBlog) {
      await updateBlog(editingBlog._id, blogData);
    } else {
      await createBlog(blogData);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    let filtered = blogs;
    if (newFilters.author) {
      filtered = filtered.filter(b => 
        b.author.toLowerCase().includes(newFilters.author.toLowerCase())
      );
    }
    if (newFilters.dateRange) {
      const today = new Date();
      let startDate = new Date();
      
      if (newFilters.dateRange === 'week') {
        startDate.setDate(today.getDate() - 7);
      } else if (newFilters.dateRange === 'month') {
        startDate.setMonth(today.getMonth() - 1);
      } else if (newFilters.dateRange === 'year') {
        startDate.setFullYear(today.getFullYear() - 1);
      }
      
      filtered = filtered.filter(b => {
        const blogDate = new Date(b.publishedAt);
        return blogDate >= startDate;
      });
    }
    
    setFilteredBlogs(filtered);
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

  const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Fallback if date is missing
  try {
    return format(parseISO(dateString), "MMM dd, yyyy");
  } catch (err) {
    console.error("Date formatting error:", err);
    return "Invalid date";
  }
};

  return (
    <Box sx={{ p: 0, width: '100vw', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#3f51b5' }}>
              <BlogIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Blogs Management
              </Typography>
              <Typography variant="subtitle1">
                Manage blog posts and articles
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
                  <Typography variant="h4">{blogs.length}</Typography>
                  <Typography variant="body2">Total Blogs</Typography>
                </Box>
                <BlogIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {[...new Set(blogs.map(b => b.author))].length}
                  </Typography>
                  <Typography variant="body2">Unique Authors</Typography>
                </Box>
                <AuthorIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {blogs.filter(b => new Date(b.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                  </Typography>
                  <Typography variant="body2">Last 30 Days</Typography>
                </Box>
                <CalendarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {formatDate(blogs.reduce((latest, blog) => 
                      new Date(blog.createdAt) > new Date(latest.publishedAt) ? blog : latest
                    , {publishedAt: 0}).createdAt)}
                  </Typography>
                  <Typography variant="body2">Most Recent</Typography>
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
            <TextField
              fullWidth
              size="small"
              label="Author"
              value={filters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              sx={{ minWidth: 200 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={filters.dateRange}
                label="Date Range"
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <MenuItem value="">All Time</MenuItem>
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Blogs Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Author</strong></TableCell>
                <TableCell><strong>Published Date</strong></TableCell>
                <TableCell><strong>Content Preview</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBlogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((blog) => (
                  <TableRow key={blog._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={blog.author} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {formatDate(blog.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {blog.content.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(blog)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(blog._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(blog, true)}
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
          count={filteredBlogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Blog Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)', color: 'white' }}>
          {viewMode ? 'Blog Details' : editingBlog ? 'Edit Blog' : 'Add New Blog'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {viewMode ? (
            <Box>
              <Typography variant="h4" gutterBottom>{formData.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label={formData.author} icon={<AuthorIcon />} />
                <Chip label={formatDate(formData.createdAt)} icon={<CalendarIcon />} />
              </Box>
              
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {formData.content}
              </Typography>

              {formData.images.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Images</Typography>
                  <ImageList cols={3} rowHeight={164}>
                    {formData.images.map((img, index) => (
                      <ImageListItem key={index}>
                        <img src={img} alt={`Blog ${index}`} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </>
              )}
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Images</Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="blog-images-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
                <label htmlFor="blog-images-upload">
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
                  label="Blog Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Publish Date & Time"
                  value={formData.publishedAt ? formData.publishedAt.substring(0, 16) : ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    publishedAt: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString()
                  })}
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  margin="dense"
                  required
                />
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
              disabled={!formData.title || !formData.content || !formData.author}
            >
              {editingBlog ? 'Update' : 'Create'}
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

export default BlogsAdminPanel;
