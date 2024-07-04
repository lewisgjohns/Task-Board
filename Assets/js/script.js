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
    let cardClasses = "card draggable mb-3";
    let dueDate = dayjs(task.dueDate);
    let today = dayjs();

    // Check if the task is due soon or overdue
    if (dueDate.isValid()) {
        if (dueDate.isBefore(today, 'day')) {
            cardClasses += " overdue";
        } else if (dueDate.diff(today, 'day') <= 3) {
            cardClasses += " due-soon";
        }
    }

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
        },
        stop: function(event, ui) {
            $(this).removeClass("dragging");
        }
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    
    let taskName = $("#taskName").val().trim();
    let taskDescription = $("#taskDescription").val().trim();
    let taskDueDate = $("#taskDueDate").val().trim(); 
    
    if (taskName === "") {
        alert("Please enter a task name.");
        return;
    }
    
    let newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
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

function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id").split("-")[1];
    let newStatus = $(event.target).closest(".lane").attr("id");

    // Update task status based on lane ID
    taskList.forEach(task => {
        if (task.id == taskId) {
            if (newStatus === "to-do") { 
                task.status = "todo"; 
            } else {
                task.status = newStatus;
            }
        }
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}


$(document).ready(function() {
    renderTaskList();
 
    $("#tasks").submit(handleAddTask);
 
    $("#todo-cards, #in-progress-cards, #done-cards").on("click", ".delete-btn", function(event) {
        handleDeleteTask(event);
    });
 
    $(".lane").droppable({
        drop: handleDrop
    });
    $("#taskDueDate").datepicker({
        dateFormat: "yy-mm-dd", // Format the date as YYYY-MM-DD
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        minDate: null, // Restrict selection to future dates only
      });
});

