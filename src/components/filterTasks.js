
import dayjs from "dayjs";

export const filterTasks = ({
  tasks,
  statusFilter,
  priorityFilter,
  type,
  filterByExactStartDate,
  filterByExactEndDate,
}) => {
  return tasks.filter((task) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const isStatusMatch =
      statusFilter === "All" || task.status === statusFilter;

    const isPriorityMatch =
      priorityFilter === "All" || task.priority === priorityFilter;

    // const isTypeMatch = type ? task.type === type : true;
    let isTypeMatch = true;
    if (type) {
      if (type === "Created") {
        isTypeMatch = task.assignor === storedUser.email;
      }else{
        isTypeMatch = type ? task.type === type : true;
      }
    }

    const isStartDateMatch = filterByExactStartDate
      ? dayjs(task.startDate).format("YYYY-MM-DD") === filterByExactStartDate
      : true;

    const isEndDateMatch = filterByExactEndDate
      ? dayjs(task.endDate).format("YYYY-MM-DD") === filterByExactEndDate
      : true;

    return (
      isStatusMatch &&
      isPriorityMatch &&
      isTypeMatch &&
      isStartDateMatch &&
      isEndDateMatch
    );
  });
};
