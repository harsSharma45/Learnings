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
    res.json({
        totalFiles,
        compiledCount,
        uncompiledCount
    });
});

// Middleware to parse JSON request body
app.use(express.json());

// Route to add a new file with compilation status
app.post("/", function(req, res) {
    const fileName = req.body.fileName;
    const isCompiled = req.body.isCompiled;

    // Add new file with its compilation status
    users[0].files.push({
        fileName: fileName,
        isCompiled: isCompiled
    });

    res.json({
        message: "File added successfully!"
    });
});

// Route to mark all files as compiled
app.put("/", function(req, res) {
    for (let i = 0; i < users[0].files.length; i++) {
        users[0].files[i].isCompiled = true;
    }

    res.json({
        message: "All files marked as compiled."
    });
});

// Route to delete all uncompiled files
app.delete("/", function(req, res) {
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

    res.json({
        message: "Uncompiled files removed successfully."
    });
});

// Start the server on port 3000
app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
