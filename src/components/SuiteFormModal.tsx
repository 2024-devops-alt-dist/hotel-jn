import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Firestore and Firebase Storage imports
import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface SuiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string | undefined; // Accept currentUser as a prop
  hotelName: string | undefined; // Accept currentUser as a prop
}

const SuiteFormModal: React.FC<SuiteFormModalProps> = ({ isOpen, onClose, hotelId, hotelName }) => {
    
    const [title, setTitle] = useState('');
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setImages(Array.from(e.target.files));
      }
    };
  
    const uploadFile = async (file: File) => {
      const storageRef = ref(storage, `suites/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);
      setUploading(true);
  
      try {
        let mainImageUrl = '';
        const additionalImagesUrls: string[] = [];
  
        if (mainImage) {
          mainImageUrl = await uploadFile(mainImage);
        }
  
        for (const image of images) {
          const imageUrl = await uploadFile(image);
          additionalImagesUrls.push(imageUrl);
        }
  
        // Store suite info in Firestore
        const suiteDocRef = await addDoc(collection(db, 'suites'), {
          title,
          main_image: mainImageUrl,
          description,
          price,
          images: additionalImagesUrls,
          hotelId: hotelId,
          hotelName: hotelName,
        });

        // Update the hotel to include the suite (assuming the hotel has a 'suites' array)
        if (hotelId) {
            const hotelRef = doc(db, 'hotels', hotelId);
            await updateDoc(hotelRef, {
                suites: arrayUnion(suiteDocRef.id), // You can push the suite ID into a suite array or reference it
            });
        }
  
        setSuccess('Suite added successfully!');
        setTitle('');
        setMainImage(null);
        setDescription('');
        setPrice('');
        setImages([]);
      } catch (error) {
        setError('Failed to add suite. Please try again.');
      } finally {
        setUploading(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div style={styles.modalBackdrop}>
        <div style={styles.modal}>
          <h2>Add a Suite</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
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
              onChange={(e) => handleFileChange(e, setMainImage)}
              required
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
              onChange={handleMultipleFileChange}
              style={styles.input}
            />
            <button type="submit" disabled={uploading} style={styles.button}>
              {uploading ? 'Uploading...' : 'Add Suite'}
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
    },
    modal: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      width: '500px',
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
      height: '100px',
    },
    button: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    closeButton: {
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#ff4d4d',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };
  
  export default SuiteFormModal;

