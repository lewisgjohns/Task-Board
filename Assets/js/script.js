let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


  //function that generates task ID  
function generateTaskId() {
    let id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// function that creates a task card
function createTaskCard(task) {
    let cardClasses = "card draggable mb-3";
    let dueDate = dayjs(task.dueDate);
    let today = dayjs();

    // if statement checks if the task is due soon or overdue
    if (dueDate.isValid()) {
        if (dueDate.isBefore(today, 'day')) {
            cardClasses += " overdue";
        } else if (dueDate.diff(today, 'day') <= 3) {
            cardClasses += " due-soon";
        }
    }

    // generates an HTML card element
    let card = `
    <div id="task-${task.id}" class="${cardClasses}" draggable="true">
        <div class="card-body">
            <h5 class="card-title">${task.name}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><strong>Due Date:</strong> ${task.dueDate}</p>
            <button type="button" class="btn btn-danger btn-sm delete-btn" data-task-id="${task.id}">Delete</button>
        </div>
    </div>`;
    return card;
}

// function that renders the task list
function renderTaskList() {
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
    

    //generates task cards for each task in 'taskList' based on their status, and appends them to different sections
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

    // makes the cards draggable
    $(".draggable").draggable({
        revert: true,
        revertDuration: 0,
        containment: ".row",
        start: function(event, ui) {
            $(this).addClass("dragging");
        },
        stop: function(event, ui) {
            $(this).removeClass("dragging");
        }
    });
}

// function that handles adding a new task
function handleAddTask(event) {
    event.preventDefault();
    
    let taskName = $("#taskName").val().trim();
    let taskDescription = $("#taskDescription").val().trim();
    let taskDueDate = $("#taskDueDate").val().trim(); 
    
    //if the task name is equal to nothing then the user is prompted with the alert
    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }
    
    // object that stores the task information
    let newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        status: "todo" // Initial status
    };
    
    //pushes the new task to the task list and stores it in local storage
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    
    $("#formModal").modal("hide");
    $("#tasks")[0].reset(); 
    renderTaskList();
}


// function that handles deleting a task
function handleDeleteTask(event) {
    let taskId = $(event.target).data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}


// function that handles dropping a task into a different lane

function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id").split("-")[1];
    let newStatus = $(event.target).closest(".lane").attr("id");

    // updates the status of the task
    taskList.forEach(task => {
        if (task.id == taskId) {
            if (newStatus === "to-do") { 
                task.status = "todo"; 
            } else {
                task.status = newStatus;
            }
        }
    });
   // saves the updated task list to local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// initializes the page
$(document).ready(function() {
    renderTaskList();
    // event listener for the form submission
    $("#tasks").submit(handleAddTask);
    // event listener for the delete button
    $("#todo-cards, #in-progress-cards, #done-cards").on("click", ".delete-btn", function(event) {
        handleDeleteTask(event);
    });
   // event listener to drop a task into a lane
    $(".lane").droppable({
        drop: handleDrop
    });
    // datepicker for the due date input
    $("#taskDueDate").datepicker({
        dateFormat: "yy-mm-dd", 
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        minDate: null, 
      });
});

