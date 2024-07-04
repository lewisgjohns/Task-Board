// Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks"));
// let nextId = JSON.parse(localStorage.getItem("nextId"));

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
    
function generateTaskId() {
    let id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = `
    <div id="task-${task.id}" class="card draggable mb-3" draggable="true">
        <div class="card-body">
            <h5 class="card-title">${task.name}</h5>
            <p class="card-text">${task.description}</p>
            <button type="button" class="btn btn-danger btn-sm delete-btn" data-task-id="${task.id}">Delete</button>
        </div>
    </div>`;
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
    
    taskList.forEach(task => {
        let card = createTaskCard(task);
        if (task.status === "todo") {
            $("#todo-cards").append(card);
        } else if (task.status === "in-progress") {
            $("#in-progress-cards").append(card);
        } else if (task.status === "done") {
            $("#done-cards").append(card);
        }
    });

    // Make cards draggable
  $(".draggable").draggable({
    revert: true,
    revertDuration: 0,
    containment: ".row",
    start: function(event, ui) {
        $(this).addClass("dragging");
        $(this).css("z-index", 1000); // Set a high z-index when dragging starts
    },
    stop: function(event, ui) {
        $(this).removeClass("dragging");
    }
});

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    
    let taskName = $("#taskName").val().trim();
    let taskDescription = $("#taskDescription").val().trim();
    
    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }
    
    let newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        status: "todo" // Initial status
    };
    
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    
    $("#formModal").modal("hide");
    $("#tasks")[0].reset(); // Reset form fields
    renderTaskList();
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(event.target).data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}


// Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {
//     let taskId = ui.draggable.attr("id").split("-")[1];
//     let newStatus = $(event.target).closest(".lane").attr("id");

//     taskList.forEach(task => {
//         if (task.id == taskId) {
//             task.status = newStatus;
//         }
//     });

//     localStorage.setItem("tasks", JSON.stringify(taskList));
//     renderTaskList();
// }
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id").split("-")[1];
    let newStatus = $(event.target).closest(".lane").attr("id");

    // Adjusting the code to handle the drop correctly
    if (newStatus === undefined) {
        newStatus = $(event.target).closest(".lane")[0].id; // Fallback for direct lane reference
    }

    taskList.forEach(task => {
        if (task.id == taskId) {
            task.status = newStatus;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

$(document).ready(function() {
    renderTaskList();
 
    $("#tasks").submit(handleAddTask);
 
    $(".delete-btn").click(handleDeleteTask);
 
    $(".lane").droppable({
        drop: handleDrop
    });
 });

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker


// BACKUP
// $(document).ready(function() {
//     // Function to generate a unique task ID
//     function generateTaskId() {
//       return '_' + Math.random().toString(36).substr(2, 9);
//     }
  
//     // Function to create a task card
//     function createTaskCard(task) {
//       const card = `
//         <div id="${task.id}" class="card task-card mb-3" draggable="true">
//           <div class="card-body">
//             <h5 class="card-title">${task.name}</h5>
//             <p class="card-text">${task.description}</p>
//             <button type="button" class="btn btn-danger btn-sm delete-task">Delete</button>
//           </div>
//         </div>
//       `;
//       return card;
//     }
  
//     // Function to render the task list and make cards draggable
//     function renderTaskList(tasks) {
//       tasks.forEach(task => {
//         const card = createTaskCard(task);
//         $(`#${task.status}-cards`).append(card);
//       });
  
//       // Make task cards draggable
//       $('.task-card').each(function() {
//         $(this).on('dragstart', function(event) {
//           event.originalEvent.dataTransfer.setData('text/plain', event.target.id);
//         });
//       });
//     }
  
//     // Sample initial task data
//     let tasks = [
//       { id: generateTaskId(), name: 'Task 1', description: 'Description of Task 1', status: 'todo' },
//       { id: generateTaskId(), name: 'Task 2', description: 'Description of Task 2', status: 'in-progress' },
//       { id: generateTaskId(), name: 'Task 3', description: 'Description of Task 3', status: 'done' }
//     ];
  
//     // Function to handle adding a new task
//     function addNewTask(taskName, taskDescription) {
//       const newTask = {
//         id: generateTaskId(),
//         name: taskName,
//         description: taskDescription,
//         status: 'todo' // New tasks start in the 'To Do' lane
//       };
//       tasks.push(newTask);
  
//       // Render the new task card
//       const card = createTaskCard(newTask);
//       $('#todo-cards').append(card);
  
//       // Make the new task card draggable
//       $(`#${newTask.id}`).on('dragstart', function(event) {
//         event.originalEvent.dataTransfer.setData('text/plain', event.target.id);
//       });
//     }
  
//     // Function to handle deleting a task
//     function deleteTask(taskId) {
//       tasks = tasks.filter(task => task.id !== taskId);
//       $(`#${taskId}`).remove();
//     }
  
//     // Function to handle dropping a task into a new status lane
//     function handleDrop(event, status) {
//       event.preventDefault();
//       const taskId = event.dataTransfer.getData('text/plain');
//       const task = tasks.find(task => task.id === taskId);
      
//       if (task) {
//         // Change the task's status
//         task.status = status;
//         $(`#${taskId}`).appendTo(`#${status}-cards`);
//       }
//     }
  
//     // Initialize event listeners for the form submission
//     $('#tasks').submit(function(event) {
//       event.preventDefault();
//       const taskName = $('#taskName').val();
//       const taskDescription = $('#taskDescription').val();
//       addNewTask(taskName, taskDescription);
//       $('#formModal').modal('hide');
//       $(this).trigger('reset');
//     });
  
//     // Initialize event listener for deleting a task
//     $(document).on('click', '.delete-task', function() {
//       const taskId = $(this).closest('.task-card').attr('id');
//       deleteTask(taskId);
//     });
  
//     // Make lanes droppable
//     $('.lane').each(function() {
//       const status = $(this).attr('id');
//       $(this).on('dragover', function(event) {
//         event.preventDefault();
//       });
//       $(this).on('drop', function(event) {
//         handleDrop(event, status);
//       });
//     });
  
//     // Initialize date picker for due date field
//     $('#dueDate').datepicker();
  
//     // Initial rendering of the task list
//     renderTaskList(tasks);
//   });