import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9gYwnF0ajFnXAjfJGsxb59dI2vXyVGUQ",
  authDomain: "bookshop-f6f4d.firebaseapp.com",
  projectId: "bookshop-f6f4d",
  storageBucket: "bookshop-f6f4d.firebasestorage.app",
  messagingSenderId: "258156938019",
  appId: "1:258156938019:web:c3cc8efa1c0d2082884296",
  measurementId: "G-MQ6953Q2RH",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const users = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "reysokcheat66@gmail.com",
    role: "admin",
  },
  {
    id: "seller-1",
    name: "Seller One",
    email: "seller1@bookshop.com",
    role: "seller",
  },
  {
    id: "buyer-1",
    name: "Buyer One",
    email: "buyer1@bookshop.com",
    role: "buyer",
  },
];

const categories = [
  {
    id: "programming",
    name: "Programming",
    description: "Programming books for developers",
  },
  { id: "design", name: "Design", description: "Design and UX books" },
  {
    id: "business",
    name: "Business",
    description: "Business and entrepreneurship books",
  },
  {
    id: "fiction",
    name: "Fiction",
    description: "Popular fiction and stories",
  },
];

const adjectives = [
  "The Silent",
  "The Hidden",
  "The Golden",
  "The Secret",
  "The Lonely",
  "The Lost",
  "The Endless",
  "The Forgotten",
  "The Burning",
  "The Midnight",
];

const subjects = [
  "Garden",
  "Promise",
  "Mirror",
  "River",
  "Empire",
  "Shadow",
  "Voyage",
  "Memory",
  "Song",
  "City",
  "Path",
  "Legacy",
  "Dream",
  "Sky",
  "Light",
  "Storm",
  "Heart",
  "Bridge",
  "Forest",
  "Truth",
];

const authors = [
  "Ava Collins",
  "M. Johnson",
  "Noah Bennett",
  "Grace Kim",
  "Elliot Parker",
  "Lina Foster",
  "Kai Morgan",
  "Sofia Reed",
  "Luca Hayes",
  "Maya Brooks",
  "Jules Carter",
  "Nina Taylor",
  "Owen Price",
  "Zara White",
  "Ethan Brooks",
  "Mia Lewis",
  "Adrian Cole",
  "Ruby Green",
  "Leo Foster",
  "Maya Chen",
];

const categoryMap = {
  Garden: "fiction",
  Promise: "fiction",
  Mirror: "fiction",
  River: "fiction",
  Empire: "fiction",
  Shadow: "fiction",
  Voyage: "fiction",
  Memory: "fiction",
  Song: "fiction",
  City: "fiction",
  Path: "fiction",
  Legacy: "business",
  Dream: "design",
  Sky: "business",
  Light: "design",
  Storm: "fiction",
  Heart: "fiction",
  Bridge: "business",
  Forest: "fiction",
  Truth: "business",
};

const books = Array.from({ length: 100 }, (_, index) => {
  const adjective = adjectives[index % adjectives.length];
  const subject = subjects[index % subjects.length];
  const title = `${adjective} ${subject}`;
  const bookId = `book-${index + 1}`;

  return {
    id: bookId,
    title,
    author: authors[index % authors.length],
    price: Number((12.99 + (index % 12) * 1.75).toFixed(2)),
    stock: 10 + (index % 8) * 5,
    categoryId: categoryMap[subject],
    sellerId: "seller-1",
    description: `A compelling ${subject.toLowerCase()} story with thoughtful themes and unforgettable characters.`,
    imageUrl: `https://via.placeholder.com/300x400/1E293B/FFFFFF?text=${encodeURIComponent(title)}`,
  };
});

const cartItems = [
  {
    id: "cart-1",
    bookId: "clean-code",
    userId: "buyer-1",
    quantity: 2,
    title: "Clean Code",
    price: 24.99,
  },
];

const orders = [
  {
    id: "order-1",
    buyerId: "buyer-1",
    buyerName: "Buyer One",
    buyerPhone: "1234567890",
    buyerAddress: "123 Book Street, City",
    status: "Pending",
    paymentMethod: "COD",
    paymentStatus: "Pending",
  },
];

const payments = [
  {
    id: "payment-1",
    orderId: "order-1",
    buyerId: "buyer-1",
    paymentMethod: "COD",
    paymentStatus: "Pending",
  },
];

const reviews = [
  {
    id: "review-1",
    bookId: "clean-code",
    userId: "buyer-1",
    rating: 5,
    comment: "This book is a must-read for every developer.",
  },
];

const wishlistItems = [
  {
    id: "wishlist-1",
    userId: "buyer-1",
    bookId: "atomic-habits",
    title: "Atomic Habits",
    price: 18.99,
  },
];

const notifications = [
  {
    id: "notification-1",
    userId: "buyer-1",
    title: "Welcome to BookShop",
    message: "Your account is ready. Start browsing great books.",
    read: false,
  },
];

const coupons = [
  {
    id: "coupon-10off",
    code: "SAVE10",
    discountPercent: 10,
    active: true,
  },
];

async function seed() {
  try {
    console.log("Seeding Firestore collections...");

    for (const user of users) {
      await setDoc(doc(db, "users", user.id), {
        uid: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded user: ${user.id}`);
    }

    for (const category of categories) {
      await setDoc(doc(db, "categories", category.id), {
        name: category.name,
        description: category.description,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded category: ${category.id}`);
    }

    for (const book of books) {
      await setDoc(doc(db, "books", book.id), {
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock,
        categoryId: book.categoryId,
        sellerId: book.sellerId,
        description: book.description,
        imageUrl: book.imageUrl,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded book: ${book.id}`);
    }

    for (const cartItem of cartItems) {
      await setDoc(doc(db, "cart", cartItem.id), {
        bookId: cartItem.bookId,
        userId: cartItem.userId,
        quantity: cartItem.quantity,
        title: cartItem.title,
        price: cartItem.price,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded cart item: ${cartItem.id}`);
    }

    for (const order of orders) {
      await setDoc(doc(db, "orders", order.id), {
        buyerId: order.buyerId,
        buyerName: order.buyerName,
        buyerPhone: order.buyerPhone,
        buyerAddress: order.buyerAddress,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded order: ${order.id}`);
    }

    for (const payment of payments) {
      await setDoc(doc(db, "payments", payment.id), {
        orderId: payment.orderId,
        buyerId: payment.buyerId,
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentStatus,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded payment: ${payment.id}`);
    }

    for (const review of reviews) {
      await setDoc(doc(db, "reviews", review.id), {
        bookId: review.bookId,
        userId: review.userId,
        rating: review.rating,
        comment: review.comment,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded review: ${review.id}`);
    }

    for (const wishlistItem of wishlistItems) {
      await setDoc(doc(db, "wishlist", wishlistItem.id), {
        userId: wishlistItem.userId,
        bookId: wishlistItem.bookId,
        title: wishlistItem.title,
        price: wishlistItem.price,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded wishlist item: ${wishlistItem.id}`);
    }

    for (const notification of notifications) {
      await setDoc(doc(db, "notifications", notification.id), {
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded notification: ${notification.id}`);
    }

    for (const coupon of coupons) {
      await setDoc(doc(db, "coupons", coupon.id), {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        active: coupon.active,
        createdAt: serverTimestamp(),
      });
      console.log(`Seeded coupon: ${coupon.id}`);
    }

    console.log("Firestore seeding complete.");
  } catch (error) {
    console.error("Firestore seeding failed:", error);
    process.exit(1);
  }
}

seed();
