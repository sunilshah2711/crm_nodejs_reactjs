export function initTasks() {
  const currentDate = new Date();

  // all task list

  const tasks = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Idea",
      id: "just1",
      progress: 45,
      type: "task",
      displayOrder: 1,
      project: "test",
      styles: { progressColor: "#0052cc99", progressSelectedColor: "#0052CC" },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: 2,
      progress: 25,
      type: "task",
      displayOrder: 2,
      dependencies: "just1",
      styles: { progressColor: "#0052cc99", progressSelectedColor: "#0052CC" },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: 3,
      progress: 10,
      type: "task",
      displayOrder: 3,
      styles: { progressColor: "#0052cc99", progressSelectedColor: "#0052CC" },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: "Developing",
      id: 4,
      progress: 60,
      // dependencies: ["Task 2"],
      type: "task",
      displayOrder: 4,
      styles: { progressColor: "#0052cc99", progressSelectedColor: "#0052CC" },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: 5,
      type: "task",
      progress: 70,
      displayOrder: 5,
      styles: { progressColor: "#0052cc99", progressSelectedColor: "#0052CC" },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: 6,
      progress: currentDate.getMonth(),
      type: "milestone",
      displayOrder: 6,
      styles: { progressColor: "#0052cc99", progressSelectedColor: "#0052CC" },
    },
  ];
  return tasks;
}

// Frontend View

export function getStartEndDateForProject(tasks, projectId) {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
