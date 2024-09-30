import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Import storage for Firebase Storage
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions

interface AddHotelFormProps {
  onAddHotel: (newHotel: any) => void;
}

const AddHotelForm: React.FC<AddHotelFormProps> = ({ onAddHotel }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the image file
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // State for upload progress

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }

    try {
      // Upload the image to Firebase Storage
      setUploading(true);
      const storageRef = ref(storage, `hotel_images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking (optional)
        },
        (error) => {
          setError('Failed to upload image.');
          setUploading(false);
        },
        async () => {
          // On success, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Add hotel details along with the image URL to Firestore
          const newHotel = {
            name,
            city,
            address,
            description,
            managerId: '',      // Assigning default empty managerId role
            imageUrl: downloadURL, // Save image URL to Firestore
          };

          const docRef = await addDoc(collection(db, 'hotels'), newHotel);

          // Trigger callback to update the list
          onAddHotel({ id: docRef.id, ...newHotel });

          setName('');
          setCity('');
          setAddress('');
          setDescription('');
          setImageFile(null);
          setSuccess('Hotel added successfully!');
          setUploading(false);
        }
      );
    } catch (error: any) {
      setError('Failed to add hotel. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Add New Hotel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hotel Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          required
          style={styles.input}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          style={styles.textarea}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Hotel'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    margin: '1rem 0',
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
    height: '100px',
    borderRadius: '4px',
    border: '1px solid #ccc',
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
};

export default AddHotelForm;
