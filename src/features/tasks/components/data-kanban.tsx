
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Task, TasksStatus } from "../types";
import { useCallback, useEffect, useState } from "react";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

const boards: TasksStatus[] = [
    TasksStatus.BACKLOG,
    TasksStatus.TODO,
    TasksStatus.IN_PROGRESS,
    TasksStatus.IN_REVIEW,
    TasksStatus.DONE,
];

type TasksState = {
    [key in TasksStatus]: Task[]; 
};

interface DataKanbanProps {
    data: Task[];
    onChange: (tasks: {  $id: string; status: TasksStatus; position: number; }[]) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {

    const [ tasks, setTasks ] = useState<TasksState>(() => {
        const initialTasks: TasksState = {
            [TasksStatus.BACKLOG]: [],
            [TasksStatus.TODO]: [],
            [TasksStatus.IN_PROGRESS]: [],
            [TasksStatus.IN_REVIEW]: [],
            [TasksStatus.DONE]: [],            
        };

        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TasksStatus].sort((a, b) => a.position - b.position );
        });

        return initialTasks
    });

    // to remove task after delete
    useEffect(() => {
        const newTasks: TasksState = {
            [TasksStatus.BACKLOG]: [],
            [TasksStatus.TODO]: [],
            [TasksStatus.IN_PROGRESS]: [],
            [TasksStatus.IN_REVIEW]: [],
            [TasksStatus.DONE]: [],            
        };

        data.forEach((task) => {
            newTasks[task.status].push(task);
        });

        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TasksStatus].sort((a, b) => a.position - b.position );
        }); 
        
        setTasks(newTasks);
    }, [data])

    const onDragEnd = useCallback((result: DropResult) => {
        if(!result.destination) return;

        const { source, destination } = result;
        const sourceStatus = source.droppableId as TasksStatus;
        const destStatus = destination.droppableId as TasksStatus;

        let updatesPayload : { $id: string; status: TasksStatus; position: number; }[] = [];

        setTasks((prevTasks) => {
            const newTasks = {...prevTasks};

            // safely remove the task from the source columns
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);

            // if there is no moved task (shouldn't happen, but just in case), return the previous state
            if(!movedTask) {
                console.error("No task found at the source index");
                return prevTasks;
            }

            // Create a new task object with potentially updated status
            const updatedMovedTask = sourceStatus !== destStatus
                ? { ...movedTask, status: destStatus}
                : movedTask;

            // updated the source column
            newTasks[sourceStatus] = sourceColumn;

            // Add the task to the new destination column
            const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index, 0, updatedMovedTask);
            newTasks[destStatus] = destColumn;

            // Prepare minima update payloads
            updatesPayload = [];

            // Prepare the minimal update payloads
            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000)
            });
            
            // updatd positions for affected tasks in destination column
            newTasks[destStatus].forEach((task, index) => {
                const newPosition = Math.min((index +1) * 1000, 1_000_000);
                if(task.position !== newPosition) {
                    updatesPayload.push({
                        $id: task.$id,
                        status: destStatus,
                        position: newPosition,
                    });
                }
            });

            // if the task moved between column, update positions in the source column
            if(sourceStatus !== destStatus) {
                newTasks[sourceStatus].forEach((task, index) => {
                    if(task) {
                        const newPosition = Math.min((index +1) * 10000, 1_000_000);
                        if(task.position !== newPosition){
                            updatesPayload.push({
                                $id: task.$id,
                                status: sourceStatus,
                                position: newPosition,
                            });
                        }
                    }
                });
            }

            return newTasks;

        });

        onChange(updatesPayload);

    }, [onChange]);

   return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto">
            {boards.map((board) => {
                return (
                    <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                        <KanbanColumnHeader 
                            board={board}
                            taskCount = {tasks[board].length}
                        />
                        <Droppable droppableId={board}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-[200px] py-1.5"
                                    >
                                        {tasks[board].map((task, index) => (
                                            <Draggable
                                                key={task.$id}
                                                draggableId={task.$id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                       {...provided.draggableProps}
                                                       {...provided.dragHandleProps} 
                                                    >   
                                                        <KanbanCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                )
            })}
        </div>
        
    </DragDropContext>

   ) 
}