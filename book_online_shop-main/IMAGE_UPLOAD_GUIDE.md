# Image Upload Guide for Book Store

## Overview

Your book store now supports image storage with Firebase Storage. Images are displayed on:

- **Books listing page** - thumbnail view of books
- **Book detail page** - larger image view

## Current Setup

### Placeholder Images

Currently, all books use placeholder images from `placeholder.com`. These are temporary and show the book title as text.

### Image URL Storage

Image URLs are stored in the `imageUrl` field of each book document in Firestore.

## How to Upload Real Book Images

### Method 1: Using the Admin Panel (Recommended for Future)

Create an admin panel where sellers can upload book images directly.

### Method 2: Manual Firebase Storage Upload

1. Go to your Firebase Console: https://console.firebase.google.com
2. Select your project: **bookshop-f6f4d**
3. Go to **Storage** section
4. Create a folder structure: `books/{bookId}/`
5. Upload your book cover images
6. Copy the file URL and update the Firestore document

### Method 3: Programmatic Upload (Using the Image Utility)

The `src/lib/images.ts` file provides these functions:

```typescript
// Upload an image
const imageUrl = await uploadBookImage(file, bookId);

// Delete an image
await deleteBookImage(imageUrl);

// Get placeholder image
const placeholder = getPlaceholderImage("Book Title");
```

### Example: Admin page for uploading images

```typescript
import { uploadBookImage } from "@/lib/images";

const handleImageUpload = async (file: File, bookId: string) => {
  try {
    const url = await uploadBookImage(file, bookId);
    // Update the book with new imageUrl
    await updateBook(bookId, { imageUrl: url });
    toast.success("Image uploaded successfully");
  } catch (error) {
    toast.error("Failed to upload image");
  }
};
```

## Image Specifications

- **Format**: JPG, PNG, WebP
- **Size**: 300x400px (recommended for thumbnails)
- **Max file size**: 5MB
- **Aspect ratio**: 3:4 (typical book cover ratio)

## Firebase Storage Rules

Make sure your Firestore rules allow uploads. Update your rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /books/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Updating Book Images

### Using Firestore Console

1. Go to Firestore Database
2. Find the book document
3. Edit the `imageUrl` field
4. Paste the new image URL from Firebase Storage

### Using Code

```typescript
import { updateBook } from "@/lib/books";

await updateBook("book-id", {
  imageUrl: "https://your-firebase-storage-url",
});
```

## Current Placeholder URLs

Books currently use these placeholder URLs:

- Clean Code: `https://via.placeholder.com/300x400?text=Clean+Code`
- Atomic Habits: `https://via.placeholder.com/300x400?text=Atomic+Habits`
- The Pragmatic Programmer: `https://via.placeholder.com/300x400?text=Pragmatic+Programmer`
- Designing Design: `https://via.placeholder.com/300x400?text=Designing+Design`
- Fictional Future: `https://via.placeholder.com/300x400?text=Fictional+Future`

## Next Steps

1. Replace placeholder URLs with actual book cover images
2. Create an admin panel for image uploads
3. Implement image validation and optimization
4. Add image cropping/resizing functionality

## Troubleshooting

### Images not loading?

- Check Firebase Storage permissions
- Verify the image URL is correct
- Use the fallback placeholder by checking browser console

### Upload fails?

- Check Firebase Storage quota
- Ensure user is authenticated
- Verify file size is under 5MB

### Need to use public domain images?

Recommended sources:

- Open Library API: https://openlibrary.org/api/
- Unsplash: https://unsplash.com/
- Pexels: https://www.pexels.com/
- Pixabay: https://pixabay.com/
