import React, { useState, useEffect } from "react";
import axios from "axios";
import Thead from "./Thead";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editBookId, setEditBookId] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books (GET request)
  async function fetchBooks() {
    try {
      const response = await axios.get("http://localhost:5003/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }
  // edit funtion  to show old value for book and covert setIsEdit(true) to true and change to uptdate function
  function editBook(book) {
    setIsEdit(true);
    setEditBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
  }

  // Handle function  for both add and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) {
      alert("Both title and author are required.");
      return;
    }
    if (isEdit) {
      try {
        const response = await axios.put(
          `http://localhost:5003/books/${editBookId}`,
          {
            new_title: title,
            new_author: author
          }
        );

        setIsEdit(false);
        setEditBookId("");
      } catch (error) {
        console.error("Error updating book:", error);
        alert(error.response?.data?.error || "Error updating book");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:5003/books", {
          title,
          author
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error creating book:", error);
        alert(error.response?.data?.error || "Error creating book");
      }
    }
    setTitle("");
    setAuthor("");
    fetchBooks();
  };
  // Delete a book (DELETE request)
  async function deleteBook(id) {
    try {
      const response = await axios.delete(`http://localhost:5003/books/${id}`);
      console.log(response.data);
      fetchBooks(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting book:", error);
      alert(error.response?.data?.error || "Error deleting book");
    }
  }

  return (
    <div className="container">
      <h2>{isEdit ? "Update Book" : "Add a New Book"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="submit">{isEdit ? "Update Book" : "Add Book"}</button>
        {isEdit && (
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setAuthor("");
              setIsEdit(false);
              setEditBookId("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <h1>Book List</h1>
      <div className="ul-container">
        <Thead />
        {books.map((book, index) => (
          <ul key={index}>
            <li>{index + 1}-</li>
            <li>{book.title}</li>
            <li>{book.author}</li>

            <div className="btn-container">
              <button onClick={() => editBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book._id)}>Delete</button>
            </div>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default BookList;
