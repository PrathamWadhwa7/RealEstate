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
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    meta: { keywords: [] },
    image: null
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
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('author', blogData.author);
      formData.append('meta', JSON.stringify(blogData.meta));
      if (blogData.imageFile) {
        formData.append('image', blogData.imageFile);
      }

      const response = await axiosInstance.post('/blogs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('author', blogData.author);
      formData.append('meta', JSON.stringify(blogData.meta));
      if (blogData.imageFile) {
        formData.append('image', blogData.imageFile);
      }
      // Add flag to remove image if no new image is selected and existing image is removed
      formData.append('removeImage', blogData.removeImage);

      const response = await axiosInstance.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
      showSnackbar(`Error ${action}: ${error.response?.data?.error || error.message}`, 'error');
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
    setImageFile(null);
    
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        meta: blog.meta || { keywords: [] },
        image: blog.image
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        author: '',
        meta: { keywords: [] },
        image: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
    setViewMode(false);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImageFile(null);
  };

  const handleSubmit = async () => {
    const blogData = {
      ...formData,
      imageFile,
      removeImage: !imageFile && !formData.image // Remove image only if no new image is selected and existing image is cleared
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
        const blogDate = new Date(b.createdAt);
        return blogDate >= startDate;
      });
    }
    
    setFilteredBlogs(filtered);
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
                    {blogs.filter(b => new Date(b.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
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
                      new Date(blog.createdAt) > new Date(latest.createdAt) ? blog : latest
                    , {createdAt: 0}).createdAt)}
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
                <Chip label={formatDate(editingBlog?.createdAt)} icon={<CalendarIcon />} />
              </Box>
              
              {formData.image?.url && (
                <Box sx={{ mb: 3 }}>
                  <img 
                    src={formData.image.url} 
                    alt="Blog cover" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '400px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} 
                  />
                </Box>
              )}

              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {formData.content}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Featured Image</Typography>
                
                {formData.image?.url && (
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={formData.image.url} 
                      alt="Current blog cover" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} 
                    />
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveImage}
                      sx={{ mt: 1 }}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
                
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="blog-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="blog-image-upload">
                  <Button 
                    variant="contained" 
                    component="span" 
                    startIcon={<AddIcon />} 
                    sx={{ mt: 1 }}
                  >
                    {formData.image?.url ? 'Change Image' : 'Upload Image'}
                  </Button>
                </label>
                
                {imageFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">New Image Preview:</Typography>
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        marginTop: '8px' 
                      }} 
                    />
                  </Box>
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