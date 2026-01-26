import React, { useState, useEffect } from 'react';
import { Box } from '@map-colonies/react-components';
import { WizardStepProps, CatalogTreeNode } from '../Wizard.types';
import { GeoJsonMapComponent } from '../../Common/GeojsonMap/GeojsonMap';

import './MetadataFormStep.css';

export const MetadataFormStep: React.FC<WizardStepProps> = ({ onPrevious, data }) => {
  const selectedItem = data as CatalogTreeNode;
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    created: '',
    quality: '',
    description: ''
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem.title || '',
        type: selectedItem.metadata?.type || '',
        created: selectedItem.metadata?.created || '',
        quality: selectedItem.metadata?.quality || '',
        description: String(selectedItem.subtitle) || ''
      });
    }
  }, [selectedItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with actual backend API for saving metadata
    // For now, just log the data
    console.log('Form submitted:', formData);

    // In production, replace with proper notification system
    alert('Metadata saved successfully!');
  };

  if (!selectedItem) {
    return (
      <Box className="metadata-form-step">
        <Box className="no-selection">
          No item selected. Please go back and select an item.
        </Box>
      </Box>
    );
  }

  return (
    <Box className="metadata-form-step">
      <GeoJsonMapComponent
        geometry={selectedItem.metadata?.footprint}
        style={{ width: '50%', height: '100%' }}
      />
      <Box className="form-container">
        <Box className="form-header">
          <h2>Edit Metadata</h2>
          <p className="selected-item-info">Editing: {selectedItem.title}</p>
        </Box>

        <form onSubmit={handleSubmit} className="metadata-form">
          <Box className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control"
            />
          </Box>

          <Box className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select type...</option>
              <option value="building">Building</option>
              <option value="terrain">Terrain</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="vegetation">Vegetation</option>
              <option value="other">Other</option>
            </select>
          </Box>

          <Box className="form-row">
            <Box className="form-group">
              <label htmlFor="created">Created Date</label>
              <input
                type="date"
                id="created"
                name="created"
                value={formData.created}
                onChange={handleChange}
                className="form-control"
              />
            </Box>

            <Box className="form-group">
              <label htmlFor="quality">Quality</label>
              <select
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select quality...</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </Box>
          </Box>

          <Box className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="form-control"
            />
          </Box>
        </form>
      </Box>
      <Box className="form-actions">
        <button
          type="button"
          onClick={onPrevious}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save Metadata
        </button>
      </Box>
    </Box>
  );
};
