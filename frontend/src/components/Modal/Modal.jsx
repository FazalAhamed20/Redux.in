import React from 'react';
import Modal from 'react-modal';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        },
        content: {
            height:'200px',
          width: '300px',
          margin: 'auto',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          backgroundColor: '#fff',
        }
      }}
    >
      <h2>Confirmation</h2>
      <p>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onConfirm} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Confirm</button>
        <button onClick={onClose} style={{ padding: '8px 16px', background: '#ccc', color: '#333', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Cancel</button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
