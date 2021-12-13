// Checking if the user is sign in or not. If so, retrieve the username to display it on the dashboard

auth.onAuthStateChanged(user => {
    if(user){
        db.collection('users').doc(user.uid).get()
        .then(snapshot=>{
            document.getElementById("greeting").innerHTML = `${snapshot.data().Name}'s to-do list`;
        })
    }
})


const form  = document.querySelector(".add-task-form");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks");

// Event Listener for adding new tasks
// Retrieve the data from the input field push it on to the firestore

form.addEventListener('submit',e =>{
    e.preventDefault();
    const task = input.value;
    form.reset();
    const id = Date.now()

    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).collection("tasks").doc('_' + id).set({
                id: '_' + id,
                task
            }).then(() => {
                console.log('Task added');
            }).catch(err => {
                console.log(err.message);
            })
        }
        else {
            console.log("User is not logged in!")
        }
    })

})



// Function to create a task container with values.
// Please check the attached design sketch in the pdf to have a better view of this function.
function createTask(individualDoc){

	// Create a 'task' div which will house two other div - "task-content" and "task-actions". Note. el stands fro element
    const task_el = document.createElement('div');
	task_el.classList.add('task');
	task_el.setAttribute('data-id', individualDoc.id);


	/// Creates a 'task-content' which will house our 'text input' field
	const task_content_el = document.createElement('div');
	task_content_el.classList.add('task-content');
	task_el.appendChild(task_content_el);


	//// Creates a "text input" field
	const task_input_el = document.createElement('input');
	task_input_el.classList.add('text');
	task_input_el.type = 'text';
	task_input_el.value = individualDoc.data().task;
	task_input_el.setAttribute('readonly', 'readonly');
	task_content_el.appendChild(task_input_el);


	/// Creates a "task-action" div which will house four buttons - "Edit","Delete","Share", "Notify"
	const task_actions_el = document.createElement('div');
	task_actions_el.classList.add('actions');


	//// Edit Button
	const task_edit_el = document.createElement('button');
	task_edit_el.classList.add('edit');
	task_edit_el.innerText = 'Edit';

	//// Delete Button
	const task_delete_el = document.createElement('button');
	task_delete_el.classList.add('delete');
	task_delete_el.innerText = 'Delete';
	
	//// Share Button
	const task_share_el = document.createElement('button');
	task_share_el.classList.add('share');
	task_share_el.innerText = 'Share';


	//// Notify Button
	const task_notify_el = document.createElement('button');
	task_notify_el.classList.add('notify');
	task_notify_el.innerText = 'Notify';

	//// Append the Buttons to the 'task-action'
	task_actions_el.appendChild(task_edit_el);
	task_actions_el.appendChild(task_delete_el);
	task_actions_el.appendChild(task_share_el);
	task_actions_el.appendChild(task_notify_el);

	// Then append the 'task-actions' to the "task"
	task_el.appendChild(task_actions_el);

	// Then append the "task" to the task list
	list_el.appendChild(task_el);



	// Event listener for Edit button
	task_edit_el.addEventListener('click', (e) => {
		let id = e.target.parentElement.parentElement.getAttribute('data-id');
		if (task_edit_el.innerText.toLowerCase() == "edit") {
			task_edit_el.innerText = "Save";
			task_input_el.removeAttribute("readonly");
			task_input_el.focus();
		} else {
			task_edit_el.innerText = "Edit";
			task_input_el.setAttribute("readonly", "readonly");
			auth.onAuthStateChanged(user => {
				if (user) {
					db.collection('users').doc(user.uid).collection("tasks").doc(id).update({task:task_input_el.value});
				}
			})
		}
	});


	// Event Listerner for Delete button
	task_delete_el.addEventListener('click', (e) => {
		let id = e.target.parentElement.parentElement.getAttribute('data-id');
		auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('users').doc(user.uid).collection("tasks").doc(id).delete();
            }
        })
	}
	);
} // End of the createTask() function



// Realtime event listener for populating tasks to the webpage
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('users').doc(user.uid).collection("tasks").onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == "added") {
					console.log("hello")
                    createTask(change.doc); // This is creating/populating/rendering tasks to the webpage
                }
                else if (change.type == 'removed') {
                    let li = list_el.querySelector('[data-id=' + change.doc.id + ']');
                   list_el.removeChild(li);
                } 
            })
        })
    }
})