import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'; // For managing images in Firebase Storage

interface EditHotelFormProps {
  hotel: any;
  onEditHotel: (updatedHotel: any) => void;
}

const EditHotelForm: React.FC<EditHotelFormProps> = ({ hotel, onEditHotel }) => {
  const [name, setName] = useState(hotel.name);
  const [city, setCity] = useState(hotel.city);
  const [address, setAddress] = useState(hotel.address);
  const [description, setDescription] = useState(hotel.description);
  const [imageFile, setImageFile] = useState<File | null>(null); // New image file
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // State for image upload
  const [removingImage, setRemovingImage] = useState(false); // State for removing image


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      let imageUrl = hotel.imageUrl; // Existing image URL

      // If a new image file is selected, upload the new image
      if (imageFile) {
        // Delete the old image from Firebase Storage (optional but recommended)
        if (imageUrl) {
          const oldImageRef = ref(storage, imageUrl);
          await deleteObject(oldImageRef);
        }

        // Upload the new image to Firebase Storage
        const storageRef = ref(storage, `hotel_images/${imageFile.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref); // Get the new image URL
      }

      // Update hotel data in Firestore
      const updatedHotel = {
        name,
        city,
        address,
        description,
        imageUrl, // Update the image URL
      };

      const hotelRef = doc(db, 'hotels', hotel.id);
      await updateDoc(hotelRef, updatedHotel);

      // Trigger callback to update the list in the parent component
      onEditHotel({ id: hotel.id, ...updatedHotel });

      setSuccess('Hotel updated successfully!');
      setUploading(false);
    } catch (error: any) {
      setError('Failed to update hotel. Please try again.');
      setUploading(false);
    }

    
  };
   // Function to handle image removal
   const handleRemoveImage = async () => {
    setRemovingImage(true);
    setError(null);
    setSuccess(null);

    try {
      // Delete the image from Firebase Storage
      if (hotel.imageUrl) {
        const imageRef = ref(storage, hotel.imageUrl);
        await deleteObject(imageRef);
      }

      // Update the hotel in Firestore to remove the image URL
      const hotelRef = doc(db, 'hotels', hotel.id);
      await updateDoc(hotelRef, { imageUrl: null });

      // Update the local hotel data (remove the image URL)
      onEditHotel({ ...hotel, imageUrl: null });

      setSuccess('Image removed successfully!');
      setRemovingImage(false);
    } catch (error: any) {
      setError('Failed to remove image. Please try again.');
      setRemovingImage(false);
    }
  };

  return (
    <div>
      <h2>Edit Hotel</h2>
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
        {hotel.imageUrl && (
          <>
            <p>Current Image:</p>
            <img src={hotel.imageUrl} alt={hotel.name} style={styles.image} />
            <button
              type="button"
              onClick={handleRemoveImage}
              style={styles.removeButton}
              disabled={removingImage}
            >
              {removingImage ? 'Removing Image...' : 'Remove Image'}
            </button>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? 'Updating...' : 'Update Hotel'}
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
  image: {
    width: '100%',
    maxWidth: '300px',
    borderRadius: '8px',
    margin: '1rem 0',
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
  removeButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
};

export default EditHotelForm;
