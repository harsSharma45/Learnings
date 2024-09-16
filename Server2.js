// Task Management System

const express = require("express");
const app = express();


const tasks = [{
    title: "Complete Task",
    isCompleted: false
}];



// Middleware to parse json to body

app.use(express.json());

// get request : Route to get the task summary 

app.get("/", (req, res) => {
     const totalTasks= tasks.length;
     let cnt = 0;

     for(const it of tasks){
        if(it.isCompleted){
            cnt++;
        }
     }

     const uncompletedCount = totalTasks - cnt;

     res.status(200).json({
        totalTasks,
        cnt,
        uncompletedCount
     });
});

// post request : Route to add a new task

app.post("/", (req,res) => {
    
    const {title,isCompleted} = req.body;

    if(!title || typeof isCompleted === 'undefined'){
        return res.status(400).json({ msg : "Invalid Input"})
    }
    else{
        tasks.push({title,isCompleted});
    }
        res.status(201).json({
            msg : "Task Added"
        });
    


})

// put request : Route to mark all task as completed

app.put("/", (req,res) => {
    if (!req.headers['content-length']) {
        return res.status(411).json({ message: "411 Length Required. " });
    }

    for (const i of tasks){
        i.isCompleted = true;
    }

    res.status(200).json({
        msg : "All tasks marked as completed"
    });

})

// delete request :Route to delete all uncompleted task

app.delete("/", (req,res) => {
    
    if (!req.headers['content-length']) {
        return res.status(411).json({ message: "411 Length Required. Content-Length header is missing." });
    }
    const completedTasks = tasks.filter(task => task.isCompleted);
    tasks.length = 0; 
    tasks.push(...completedTasks); 

    res.status(200).json({
        message: "Uncompleted tasks removed successfully."
    });
})

// Route to handle undefined routes (404 Not Found)

app.use((req, res) => {
    res.status(404).json({
        message: "Resource not found."
    });
});


app.listen(4000, function () {
    console.log("Server is running on port 4000!!");
});




// use the fetch API to send a POST request from the browser’s console.

// fetch('http://localhost:4000/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     title: 'New Task',
//     isCompleted: false
//   }),
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch((error) => console.error('Error:', error));

