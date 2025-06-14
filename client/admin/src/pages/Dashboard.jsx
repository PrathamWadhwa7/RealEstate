import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Avatar,
  Container
} from '@mui/material';
import {
  Article as BlogIcon,
  Home as PropertyIcon,
  Map as AreaIcon,
  Contacts as LeadIcon
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    properties: 0,
    blogs: 0,
    areas: 0,
    leads: 0,
    services: 0.
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [props, blogs, areas, leads, services] = await Promise.all([
          axiosInstance.get('/properties'),
          axiosInstance.get('/blogs'),
          axiosInstance.get('/areas'),
          axiosInstance.get('/leads'),
          axiosInstance.get('/services')
        ]);

        setStats({
          properties: props.data.length,
          blogs: blogs.data.length,
          areas: areas.data.length,
          leads: leads.data.length,
          services: services.data.length
        });
      } catch (error) {
        console.error('Dashboard error:', error);
      }
    };
    fetchData();
  }, []);

  return (
     <Box sx={{
        width: '100vw',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
        p: 0,
        m: 0,
        overflowX: 'hidden'
      }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 8, maxWidth: '800px' }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '2rem', md: '3rem' }
        }}>
          Welcome to Your SKB Dashboard
        </Typography>
        <Typography variant="h5" sx={{ 
          opacity: 0.8,
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}>
          Where market insights meet operational excellence
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Properties Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(63, 81, 181, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  width: 60,
                  height: 60,
                  mb: 2,
                  mx: 'auto'
                }}>
                  <PropertyIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.properties}
                </Typography>
                <Typography variant="h6">Properties</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Blogs Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(103, 58, 183, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  width: 60,
                  height: 60,
                  mb: 2,
                  mx: 'auto'
                }}>
                  <BlogIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.blogs}
                </Typography>
                <Typography variant="h6">Blog Posts</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Areas Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(0, 150, 136, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  width: 60,
                  height: 60,
                  mb: 2,
                  mx: 'auto'
                }}>
                  <AreaIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.areas}
                </Typography>
                <Typography variant="h6">Areas</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* services Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(63, 81, 181, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  width: 60,
                  height: 60,
                  mb: 2,
                  mx: 'auto'
                }}>
                  <PropertyIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.services}
                </Typography>
                <Typography variant="h6">services</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Leads Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(255, 152, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  width: 60,
                  height: 60,
                  mb: 2,
                  mx: 'auto'
                }}>
                  <LeadIcon fontSize="large" />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.leads}
                </Typography>
                <Typography variant="h6">Leads</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;