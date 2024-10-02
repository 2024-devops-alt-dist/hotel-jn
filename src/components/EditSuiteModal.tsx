import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // Firestore and Firebase Storage imports
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface EditSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: any; // The suite data to be updated
  onUpdate: (updatedSuite: any) => void; // Callback to update the suite in the list
}

const UpdateSuiteModal: React.FC<EditSuiteModalProps> = ({ isOpen, onClose, suite, onUpdate }) => {
    // console.log(suite)
  const [title, setTitle] = useState(suite.title);
  const [main_image, setMainImage] = useState<File | null>(null);
  const [description, setDescription] = useState(suite.description);
  const [price, setPrice] = useState(suite.price);
  const [images, setImages] = useState<File[]>([]); // Additional images
  const [existingImages, setExistingImages] = useState<string[]>(suite.images || []); // Existing images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form fields when the suite prop changes
    if (suite) {
      setTitle(suite.title);
      setDescription(suite.description);
      setPrice(suite.price);
      setExistingImages(suite.images || []);
      setMainImage(suite.main_image || null);
      setImages([]);
    }
  }, [suite]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload the main image if a new one is selected
      let mainImageUrl = suite.main_image;
      if (main_image) {
        const storageRef = ref(storage, `suites/${main_image.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, main_image);
        mainImageUrl = await getDownloadURL(uploadTask.ref);
      }

      // Upload additional images and get URLs
      const newImageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `suites/${image.name}`);
          const uploadTask = await uploadBytesResumable(storageRef, image);
          return await getDownloadURL(uploadTask.ref);
        })
      );

      // Combine existing and new images
      const updatedImages = [...existingImages, ...newImageUrls];

      // Update the suite in Firestore
      const suiteRef = doc(db, 'suites', suite.id);
      await updateDoc(suiteRef, {
        title,
        main_image: mainImageUrl,
        description,
        price,
        images: updatedImages,
      });

      // Trigger the update callback
      onUpdate({
        ...suite,
        title,
        main_image: mainImageUrl,
        description,
        price,
        images: updatedImages,
      });

      setLoading(false);
      onClose(); // Close the modal after updating
    } catch (error: any) {
      console.error('Error updating suite:', error);
      setError('Failed to update suite. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modal}>
        <h2>Update Suite</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Suite Title"
            required
            style={styles.input}
          />
          <input
            type="file"
            onChange={(e) => setMainImage(e.target.files?.[0] || null)}
            style={styles.input}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Suite Description"
            required
            style={styles.textarea}
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            required
            style={styles.input}
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            style={styles.input}
          />
          <div style={styles.existingImagesContainer}>
            <p>Existing Images:</p>
            {existingImages.map((image, index) => (
              <img key={index} src={image} alt={`Existing Suite Image ${index}`} style={styles.image} />
            ))}
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Updating...' : 'Update Suite'}
          </button>
        </form>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  modalBackdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '500px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical' as const,
    minHeight: '100px',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    margin: '4px',
  },
  existingImagesContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '1rem',
  },
};

export default UpdateSuiteModal;
