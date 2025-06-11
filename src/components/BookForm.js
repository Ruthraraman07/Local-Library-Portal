    // BookForm.js
    import React, { useEffect, useState } from "react";
    import { Button, FormGroup, InputGroup, Card, ControlGroup, NumericInput } from "@blueprintjs/core";
    import axios from "axios";

    const BookForm = ({ editingBook, setEditingBook }) => {
      const [form, setForm] = useState({
        title: "",
        author: "",
        genre: "",
        genreCode: "", // New field
        readerLevel: "", // New field
        yearPublished: "",
        rating: 1, // New field - default to 1
      });
      const [cover, setCover] = useState(null);

      useEffect(() => {
        if (editingBook) {
          const { title, author, genre, genreCode, readerLevel, yearPublished, rating } = editingBook;
          setForm({ title, author, genre, genreCode, readerLevel, yearPublished, rating });
          setCover(null);
        }
      }, [editingBook]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        if (cover) formData.append("cover", cover);

        try {
          if (editingBook) {
            await axios.patch(`/api/books/${editingBook._id}`, formData);
          } else {
            await axios.post("/api/books", formData);
          }
          setForm({ title: "", author: "", genre: "", genreCode: "", readerLevel: "", yearPublished: "", rating: 1 });
          setCover(null);
          setEditingBook(null);
        } catch (e) {
          alert("Submission failed");
        }
      };

      // Cancel the edit process and reset the form
      const handleCancel = () => {
        setForm({ title: "", author: "", genre: "", genreCode: "", readerLevel: "", yearPublished: "", rating: 1 });
        setCover(null);
        setEditingBook(null);
      };

      return (
        <Card elevation={2} className="book-form-card">
          <form onSubmit={handleSubmit} className="book-form">
            <FormGroup label="Title">
              <InputGroup
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup label="Author">
              <InputGroup
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup label="Genre">
              <InputGroup
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />
            </FormGroup>

            <FormGroup label="Genre Code">
              <InputGroup
                value={form.genreCode}
                onChange={(e) => setForm({ ...form, genreCode: e.target.value })}
              />
            </FormGroup>

            <FormGroup label="Reader Level">
              <InputGroup
                value={form.readerLevel}
                onChange={(e) => setForm({ ...form, readerLevel: e.target.value })}
              />
            </FormGroup>

            <FormGroup label="Year Published">
              <InputGroup
                type="number"
                value={form.yearPublished}
                onChange={(e) =>
                  setForm({ ...form, yearPublished: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup label="Rating">
              <NumericInput
                min={1}
                max={5}
                value={form.rating}
                onValueChange={(value) => setForm({ ...form, rating: value })}
                clampValueOnBlur={true}
              />
            </FormGroup>

            <FormGroup label="Book Cover">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files[0])}
              />
            </FormGroup>

            <Button type="submit" intent="primary">
              {editingBook ? "Update Book" : "Add Book"}
            </Button>
            {editingBook && (
              <Button
                style={{ marginLeft: "20px" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </form>
        </Card>
      );
    };

    export default BookForm;
