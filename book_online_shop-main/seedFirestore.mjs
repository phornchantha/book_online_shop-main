import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

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

async function clearCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, collectionName, docSnap.id)),
  );
  await Promise.all(deletePromises);
}

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
    id: "fiction",
    name: "Fiction",
    description: "Imaginative stories and contemporary novels.",
  },
  {
    id: "history",
    name: "History",
    description: "Narratives about the past and world events.",
  },
  {
    id: "sci-fi",
    name: "Sci-Fi",
    description: "Science fiction, space adventures, and future worlds.",
  },
  {
    id: "classics",
    name: "Classics",
    description: "Timeless literature from past generations.",
  },
  {
    id: "self-help",
    name: "Self-Help",
    description: "Books for personal growth and productivity.",
  },
  {
    id: "dystopia",
    name: "Dystopia",
    description: "Dark, speculative worlds and cautionary tales.",
  },
  {
    id: "memoir",
    name: "Memoir",
    description: "Personal stories and life-changing journeys.",
  },
  {
    id: "mystery",
    name: "Mystery",
    description: "Detective stories, thrillers, and suspense.",
  },
  {
    id: "romance",
    name: "Romance",
    description: "Love stories and emotional journeys.",
  },
  {
    id: "business",
    name: "Business",
    description: "Leadership, strategy, and entrepreneurship.",
  },
];

const categoryBooks = {
  fiction: [
    { title: "The Night Circus", author: "Erin Morgenstern" },
    { title: "The Goldfinch", author: "Donna Tartt" },
    { title: "The Shadow of the Wind", author: "Carlos Ruiz Zafón" },
    { title: "The Kite Runner", author: "Khaled Hosseini" },
    { title: "The Book Thief", author: "Markus Zusak" },
    { title: "Life of Pi", author: "Yann Martel" },
    { title: "A Little Life", author: "Hanya Yanagihara" },
    { title: "The Nightingale", author: "Kristin Hannah" },
    { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman" },
    { title: "The Secret History", author: "Donna Tartt" },
  ],
  history: [
    { title: "Sapiens", author: "Yuval Noah Harari" },
    { title: "The Silk Roads", author: "Peter Frankopan" },
    { title: "The Wright Brothers", author: "David McCullough" },
    { title: "Team of Rivals", author: "Doris Kearns Goodwin" },
    { title: "The Splendid and the Vile", author: "Erik Larson" },
    { title: "Guns, Germs, and Steel", author: "Jared Diamond" },
    { title: "1776", author: "David McCullough" },
    { title: "The Devil in the White City", author: "Erik Larson" },
    { title: "A People's History of the United States", author: "Howard Zinn" },
    { title: "Alexander Hamilton", author: "Ron Chernow" },
  ],
  "sci-fi": [
    { title: "Dune", author: "Frank Herbert" },
    { title: "Neuromancer", author: "William Gibson" },
    { title: "Foundation", author: "Isaac Asimov" },
    { title: "Ender's Game", author: "Orson Scott Card" },
    { title: "The Martian", author: "Andy Weir" },
    { title: "Ready Player One", author: "Ernest Cline" },
    { title: "Snow Crash", author: "Neal Stephenson" },
    { title: "Brave New World", author: "Aldous Huxley" },
    { title: "The Three-Body Problem", author: "Cixin Liu" },
    { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin" },
  ],
  classics: [
    { title: "Pride and Prejudice", author: "Jane Austen" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
    { title: "Jane Eyre", author: "Charlotte Brontë" },
    { title: "Moby-Dick", author: "Herman Melville" },
    { title: "Wuthering Heights", author: "Emily Brontë" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
    { title: "Anna Karenina", author: "Leo Tolstoy" },
    { title: "The Odyssey", author: "Homer" },
  ],
  "self-help": [
    { title: "Atomic Habits", author: "James Clear" },
    { title: "The Power of Habit", author: "Charles Duhigg" },
    {
      title: "How to Win Friends and Influence People",
      author: "Dale Carnegie",
    },
    { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson" },
    { title: "You Are a Badass", author: "Jen Sincero" },
    {
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen R. Covey",
    },
    { title: "Mindset", author: "Carol S. Dweck" },
    { title: "Grit", author: "Angela Duckworth" },
    { title: "Start with Why", author: "Simon Sinek" },
    { title: "Drive", author: "Daniel H. Pink" },
  ],
  dystopia: [
    { title: "The Handmaid's Tale", author: "Margaret Atwood" },
    { title: "Fahrenheit 451", author: "Ray Bradbury" },
    { title: "The Road", author: "Cormac McCarthy" },
    { title: "The Giver", author: "Lois Lowry" },
    { title: "Station Eleven", author: "Emily St. John Mandel" },
    { title: "The Maze Runner", author: "James Dashner" },
    { title: "Never Let Me Go", author: "Kazuo Ishiguro" },
    { title: "Divergent", author: "Veronica Roth" },
    { title: "The Hunger Games", author: "Suzanne Collins" },
    { title: "The Children of Men", author: "P.D. James" },
  ],
  memoir: [
    { title: "Educated", author: "Tara Westover" },
    { title: "Becoming", author: "Michelle Obama" },
    { title: "The Glass Castle", author: "Jeannette Walls" },
    { title: "When Breath Becomes Air", author: "Paul Kalanithi" },
    { title: "Born a Crime", author: "Trevor Noah" },
    { title: "Wild", author: "Cheryl Strayed" },
    { title: "The Diary of a Young Girl", author: "Anne Frank" },
    { title: "I Know Why the Caged Bird Sings", author: "Maya Angelou" },
    { title: "Into the Wild", author: "Jon Krakauer" },
    { title: "Hillbilly Elegy", author: "J.D. Vance" },
  ],
  mystery: [
    { title: "Gone Girl", author: "Gillian Flynn" },
    { title: "The Girl on the Train", author: "Paula Hawkins" },
    { title: "The Da Vinci Code", author: "Dan Brown" },
    { title: "In the Woods", author: "Tana French" },
    { title: "The Silent Patient", author: "Alex Michaelides" },
    { title: "The Woman in the Window", author: "A.J. Finn" },
    { title: "Sharp Objects", author: "Gillian Flynn" },
    { title: "The Cuckoo's Calling", author: "Robert Galbraith" },
    { title: "Big Little Lies", author: "Liane Moriarty" },
    { title: "Mystic River", author: "Dennis Lehane" },
  ],
  romance: [
    { title: "The Notebook", author: "Nicholas Sparks" },
    { title: "Me Before You", author: "Jojo Moyes" },
    { title: "Outlander", author: "Diana Gabaldon" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
    { title: "The Time Traveler's Wife", author: "Audrey Niffenegger" },
    { title: "The Rosie Project", author: "Graeme Simsion" },
    { title: "One Day", author: "David Nicholls" },
    { title: "Beach Read", author: "Emily Henry" },
    { title: "The Hating Game", author: "Sally Thorne" },
    { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman" },
  ],
  business: [
    { title: "Zero to One", author: "Peter Thiel" },
    { title: "The Lean Startup", author: "Eric Ries" },
    { title: "Good to Great", author: "Jim Collins" },
    { title: "Start with Why", author: "Simon Sinek" },
    { title: "The 4-Hour Workweek", author: "Tim Ferriss" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
    { title: "The Hard Thing About Hard Things", author: "Ben Horowitz" },
    { title: "Drive", author: "Daniel H. Pink" },
    { title: "The Innovator's Dilemma", author: "Clayton M. Christensen" },
    { title: "Influence", author: "Robert B. Cialdini" },
  ],
};

const books = Object.entries(categoryBooks).flatMap(([categoryId, items]) =>
  items.map((item, index) => ({
    id: `${categoryId}-${index + 1}`,
    title: item.title,
    author: item.author,
    price: Number((12.99 + ((index + 1) % 10) * 1.75).toFixed(2)),
    stock: 20 + ((index + 1) % 5) * 10,
    categoryId,
    sellerId: "seller-1",
    description: `A compelling ${categoryId} title that offers readers insightful storytelling and memorable characters.`,
    imageUrl: `https://covers.openlibrary.org/b/title/${encodeURIComponent(item.title)}-M.jpg`,
  })),
);

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
    console.log("Clearing Firestore collections...");
    await Promise.all([
      clearCollection("users"),
      clearCollection("categories"),
      clearCollection("books"),
      clearCollection("cart"),
      clearCollection("orders"),
      clearCollection("payments"),
      clearCollection("reviews"),
      clearCollection("wishlist"),
      clearCollection("notifications"),
      clearCollection("coupons"),
    ]);

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
