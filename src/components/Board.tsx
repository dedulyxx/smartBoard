import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import { Board as BoardType, Task } from '../types';
import { Plus } from 'lucide-react';
import { fetchBoardData, updateTaskState } from '../api';
import { useAuth } from '../context/AuthContext';
import TaskModal from './TaskModal';

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const { auth } = useAuth();

  useEffect(() => {
    const loadBoardData = async () => {
      try {
        setLoading(true);
        const data = await fetchBoardData();
        setBoard(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить данные доски');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBoardData();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (!board) return;

    // Create a new board state
    const startColumn = board.columns[source.droppableId];
    const finishColumn = board.columns[destination.droppableId];

    // Moving within the same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoard(newBoard);
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    const newBoard = {
      ...board,
      tasks: {
        ...board.tasks,
        [draggableId]: {
          ...board.tasks[draggableId],
          state: finishColumn.id
        }
      },
      columns: {
        ...board.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    };

    setBoard(newBoard);

    // Update the task state in the backend
    try {
      await updateTaskState(draggableId, finishColumn.id);
    } catch (err) {
      console.error('Не удалось обновить статус задачи:', err);
      // Revert the state if the API call fails
      setBoard(board);
    }
  };

  const handleTaskCreated = (task: Task) => {
    if (!board) return;

    const newBoard = {
      ...board,
      tasks: {
        ...board.tasks,
        [task.id]: task
      },
      columns: {
        ...board.columns,
        [task.state]: {
          ...board.columns[task.state],
          taskIds: [...board.columns[task.state].taskIds, task.id]
        }
      }
    };

    setBoard(newBoard);
    setIsTaskModalOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (error || !board) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error || 'Что-то пошло не так'}</div>
      </div>
    );
  }

  return (
    <div className="pt-16 pl-20">
      <div className="p-4 bg-white border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Доска задач</h1>
          {auth.isAdmin && (
            <div className="flex space-x-2">
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                onClick={() => setIsTaskModalOpen(true)}
              >
                <Plus size={16} className="mr-1" />
                ДОБАВИТЬ ЗАДАЧУ
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {board.columnOrder.map((columnId, index) => {
              const column = board.columns[columnId];
              const tasks = column.taskIds.map(taskId => board.tasks[taskId]);

              return (
                <TaskColumn 
                  key={column.id} 
                  column={column} 
                  tasks={tasks} 
                  index={index} 
                  onAddTask={() => auth.isAdmin && setIsTaskModalOpen(true)}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {isTaskModalOpen && (
        <TaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          columns={board.columnOrder.map(id => ({ id, title: board.columns[id].title }))}
        />
      )}
    </div>
  );
};

export default Board;