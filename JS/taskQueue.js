const taskA = () => {
	return new Promise(resolve => {
		console.log("🕐 Task A started (3000ms)");
		setTimeout(() => {
			console.log("✅ Task A done");
			resolve();
		}, 3000);
	});
};

const taskB = () => {
	console.log("⚡️ Task B started (sync)");
	console.log("✅  Task B done");
};

const taskC = () => {
	return new Promise(resolve => {
		console.log("🕐 Task C started (2000ms)");
		setTimeout(() => {
			console.log("✅ Task C done");
			resolve();
		}, 2000);
	});
};

const taskD = () => {
	return new Promise(resolve => {
		console.log("🕐 Task D started (1000ms)");
		setTimeout(() => {
			console.log("✅ Task D done");
			resolve();
		}, 1000);
	});
};

// You are given a list of tasks, where each task is a function.
// These functions may be sync and async:
// Your goal is to implement a TaskQueue class that:
// Accepts a concurrency limit N
// Runs up to N tasks at the same time
// Supports adding tasks at any time via .push(task or task[])
// Executes each task by calling it
// Waits for async tasks to finish (if they return a Promise)

class TaskQueue {

	constructor(queueLength, tasks) {
		this.queueLength = queueLength
		if (queueLength >= tasks.length) {
			this.queueLength = tasks.length

		}
		this.tasks = tasks
		this.pickedTasks = []
		this.response = []
	}


	runTasks() {
		return new Promise((resolve, reject) => {
			const concurrency = this.queueLength;
			this.response = [];

			let active = 0;

			const startNext = () => {
				// if nothing active and no tasks left -> done
				if (active === 0 && this.tasks.length === 0) {
					return resolve(this.response);
				}

				while (active < concurrency && this.tasks.length > 0) {
					const task = this.tasks.shift();
					if (!task) break;

					active++;
					console.log(" starting a task, active =", active);

					// normalize sync/async
					Promise.resolve()
						.then(() => task())
						.then((res) => {
							console.log("task resolved, active =", active - 1);
							this.response.push(res);
						})
						.catch(err => {
							reject(err);
						})
						.finally(() => {
							active--;
							startNext()
						});
				}
			};
			startNext();
		});
	}
}









const TaskQueueInstance = new TaskQueue(4, [taskA, taskB, taskC, taskD])

TaskQueueInstance.runTasks().then((resp) => console.log(resp))




