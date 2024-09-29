

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId  # To work with ObjectId

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
app.config["MONGO_URI"] = "mongodb+srv://josephkhella2014:CQQ0CHu1dZc47XhM@cluster0.yztdm.mongodb.net/myDatabase?retryWrites=true&w=majority"
mongo = PyMongo(app)

# Test MongoDB connection
mongo.db.command("ping")  
print("Connected to MongoDB Atlas!")

# GET request to get all books
@app.route("/books", methods=["GET"])
def get_books():
    books = list(mongo.db.books.find({}))
    # loop in books and covent id to string
    for book in books:
        book["_id"] = str(book["_id"])  # Convert ObjectId to string
    return jsonify(books), 200

# POST request to create a new book
@app.route("/books", methods=["POST"])
def create_post():
    data = request.json
    title = data.get('title')
    author = data.get('author')

    if not title or not author:
        return jsonify({"error": "Title and author are required"}), 400

    mongo.db.books.insert_one({"title": title, "author": author})
    return jsonify({"message": "Post is successfully created!"}), 201

# PUT request to update a book by id
@app.route("/books/<book_id>", methods=["PUT"])
#function uptodate with book id parameter
def update_book(book_id):
    data = request.json
    new_title = data.get('new_title')
    new_author = data.get('new_author')

    if not new_title or not new_author:
        return jsonify({"error": "New title and author are required to update the book."}), 400

    try:
        result = mongo.db.books.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": {"title": new_title, "author": new_author}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "No matching book found to update."}), 404

        return jsonify({"message": "Book updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# DELETE request to remove a book by id
@app.route("/books/<book_id>", methods=["DELETE"])
def delete_book(book_id):
    try:
        result = mongo.db.books.delete_one({"_id": ObjectId(book_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "No matching book found to delete."}), 404

        return jsonify({"message": "Book deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5003)
