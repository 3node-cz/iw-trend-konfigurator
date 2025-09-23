import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider
} from '@mui/material';

export const ApiTestForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('wood');
  const [metafieldData, setMetafieldData] = useState(JSON.stringify({
    customer_id: "9666187493717",
    namespace: "custom",
    key: "saved_configurations",
    value: JSON.stringify({
      version: "1.0",
      savedConfigurations: [
        {
          id: "config_" + Date.now(),
          name: "Test Configuration",
          createdAt: new Date().toISOString(),
          orderInfo: {
            orderName: "Test Order",
            company: "Test Company",
            cuttingCenter: "Center A"
          }
        }
      ],
      lastUpdated: new Date().toISOString()
    }),
    type: "multi_line_text_field"
  }, null, 2));

  const [searchResponse, setSearchResponse] = useState<any>(null);
  const [metafieldResponse, setMetafieldResponse] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [metafieldLoading, setMetafieldLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [metafieldError, setMetafieldError] = useState<string | null>(null);

  const handleSearchMaterials = async () => {
    setSearchLoading(true);
    setSearchError(null);
    setSearchResponse(null);

    try {
      const url = `/apps/konfigurator/api/search-materials?query=${encodeURIComponent(searchQuery)}&limit=10`;
      console.log('🔍 Searching materials:', url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Search response status:', res.status);

      let data;
      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = {
          text: await res.text(),
          status: res.status,
          statusText: res.statusText
        };
      }

      setSearchResponse({
        status: res.status,
        ok: res.ok,
        data
      });

    } catch (err) {
      console.error('🔍 Search failed:', err);
      setSearchError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdateMetafield = async () => {
    setMetafieldLoading(true);
    setMetafieldError(null);
    setMetafieldResponse(null);

    try {
      console.log('💾 Updating metafield');

      const res = await fetch('/apps/konfigurator/api/update-metafield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: metafieldData
      });

      console.log('💾 Metafield response status:', res.status);

      let data;
      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = {
          text: await res.text(),
          status: res.status,
          statusText: res.statusText
        };
      }

      setMetafieldResponse({
        status: res.status,
        ok: res.ok,
        data
      });

    } catch (err) {
      console.error('💾 Metafield update failed:', err);
      setMetafieldError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setMetafieldLoading(false);
    }
  };

  const renderResponse = (response: any, error: string | null) => (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {response && (
        <Box sx={{ mt: 2 }}>
          <Alert
            severity={response.ok ? 'success' : 'warning'}
            sx={{ mb: 2 }}
          >
            Status: {response.status} {response.ok ? '✅' : '❌'}
          </Alert>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              fontSize: '11px',
              margin: 0,
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </Paper>
        </Box>
      )}
    </>
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        🧪 API Testing Dashboard
      </Typography>

      {/* Material Search Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          🔍 Search Materials
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Search Query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            helperText="Enter keywords to search for materials (e.g., 'wood', 'metal', 'plastic')"
          />
          <Button
            variant="contained"
            onClick={handleSearchMaterials}
            disabled={searchLoading}
            sx={{ alignSelf: 'flex-start' }}
          >
            {searchLoading ? 'Searching...' : 'Search Materials'}
          </Button>
        </Box>
        {renderResponse(searchResponse, searchError)}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Update Metafield Section */}
      <Box>
        <Typography variant="h6" gutterBottom color="primary">
          💾 Update Customer Metafield
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Metafield Data (JSON)"
            value={metafieldData}
            onChange={(e) => setMetafieldData(e.target.value)}
            multiline
            rows={8}
            fullWidth
            helperText="JSON payload for updating customer metafield"
          />
          <Button
            variant="contained"
            onClick={handleUpdateMetafield}
            disabled={metafieldLoading}
            sx={{ alignSelf: 'flex-start' }}
          >
            {metafieldLoading ? 'Updating...' : 'Update Metafield'}
          </Button>
        </Box>
        {renderResponse(metafieldResponse, metafieldError)}
      </Box>
    </Paper>
  );
};