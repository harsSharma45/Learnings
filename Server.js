const express = require("express");
const app = express();

// Sample data: list of users with their associated files
const users = [{
    name: "John",
    files: [{
        fileName: "main.cpp",
        isCompiled: false  // Compilation status of the file
    }]
}];

// Middleware to parse JSON request body
app.use(express.json());

// Route to get the file compilation status
app.get("/", function(req, res) {
    const userFiles = users[0].files;
    const totalFiles = userFiles.length;
    let compiledCount = 0;

    // Count the number of compiled files
    for (let i = 0; i < userFiles.length; i++) {
        if (userFiles[i].isCompiled) {
            compiledCount++;
        }
    }

    const uncompiledCount = totalFiles - compiledCount;

    // Send the file compilation data as a response
    res.status(200).json({
        totalFiles,
        compiledCount,
        uncompiledCount
    });
});

// Route to add a new file with compilation status
app.post("/", function(req, res) {
    const { fileName, isCompiled } = req.body;

    // Validate request body
    if (!fileName || typeof isCompiled === 'undefined') {
        return res.status(400).json({ message: "Invalid input. File name and compilation status are required." });
    }

    // Add new file with its compilation status
    users[0].files.push({
        fileName: fileName,
        isCompiled: isCompiled
    });

    res.status(201).json({
        message: "File added successfully!"
    });
});

// Route to mark all files as compiled
app.put("/", function(req, res) {
    if (!req.headers['content-length']) {
        return res.status(411).json({ message: "411 Length Required. Content-Length header is missing." });
    }

    for (let i = 0; i < users[0].files.length; i++) {
        users[0].files[i].isCompiled = true;
    }

    res.status(200).json({
        message: "All files marked as compiled."
    });
});

// Route to delete all uncompiled files
app.delete("/", function(req, res) {
    if (!req.headers['content-length']) {
        return res.status(411).json({ message: "411 Length Required. Content-Length header is missing." });
    }

    const compiledFiles = [];

    // Filter only compiled files
    for (let i = 0; i < users[0].files.length; i++) {
        if (users[0].files[i].isCompiled) {
            compiledFiles.push({
                fileName: users[0].files[i].fileName,
                isCompiled: true
            });
        }
    }

    // Update user's files
    users[0].files = compiledFiles;

    res.status(200).json({
        message: "Uncompiled files removed successfully."
    });
});

// Route to handle undefined routes (404 Not Found)
app.use((req, res) => {
    res.status(404).json({
        message: "Resource not found."
    });
});

// Start the server on port 3000
app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
