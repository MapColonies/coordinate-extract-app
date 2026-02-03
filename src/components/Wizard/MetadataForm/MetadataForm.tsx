import React, { useState, useEffect } from 'react';
import { Box } from '@map-colonies/react-components';
import { WizardStepProps } from '../Wizard.types';

import './MetadataForm.css';

export const MetadataForm: React.FC<WizardStepProps> = ({ selectedItem }) => {
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
    console.log('Form submitted:', formData);
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
    </Box>
  );
};
